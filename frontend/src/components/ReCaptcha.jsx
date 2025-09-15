import React, { useEffect, useState } from 'react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

// ReCAPTCHA Provider Component
export const ReCaptchaProvider = ({ children }) => {
  const reCaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

  if (!reCaptchaKey) {
    console.warn('reCAPTCHA site key not found in environment variables')
    return children
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  )
}

// Hook for using reCAPTCHA in forms
export const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isLoading, setIsLoading] = useState(false)

  const executeReCaptcha = async (action) => {
    if (!executeRecaptcha) {
      console.warn('reCAPTCHA not available')
      return null
    }

    setIsLoading(true)
    try {
      const token = await executeRecaptcha(action)
      return token
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    executeReCaptcha,
    isLoading,
    isAvailable: !!executeRecaptcha,
  }
}

// Component for forms that need reCAPTCHA protection
export const ReCaptchaForm = ({ 
  children, 
  onSubmit, 
  action = 'submit',
  className = '',
  ...props 
}) => {
  const { executeReCaptcha, isLoading } = useReCaptcha()

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!executeReCaptcha) {
      console.warn('reCAPTCHA not available, submitting without verification')
      if (onSubmit) {
        onSubmit(event, null)
      }
      return
    }

    try {
      const token = await executeReCaptcha(action)
      if (onSubmit) {
        onSubmit(event, token)
      }
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error)
      if (onSubmit) {
        onSubmit(event, null)
      }
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={className}
      {...props}
    >
      {children}
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className="text-sm text-gray-500">
            Verifying security...
          </div>
        </div>
      )}
    </form>
  )
}

// Higher-order component for protecting components with reCAPTCHA
export const withReCaptcha = (WrappedComponent, action = 'interaction') => {
  return function ReCaptchaProtectedComponent(props) {
    const { executeReCaptcha, isLoading } = useReCaptcha()

    const executeWithReCaptcha = async (callback) => {
      if (!executeReCaptcha) {
        console.warn('reCAPTCHA not available')
        if (callback) callback(null)
        return
      }

      try {
        const token = await executeReCaptcha(action)
        if (callback) callback(token)
      } catch (error) {
        console.error('reCAPTCHA verification failed:', error)
        if (callback) callback(null)
      }
    }

    return (
      <WrappedComponent
        {...props}
        executeReCaptcha={executeWithReCaptcha}
        reCaptchaLoading={isLoading}
      />
    )
  }
}

// Utility function to verify reCAPTCHA token on the backend
export const verifyReCaptchaToken = async (token, action, expectedScore = 0.5) => {
  try {
    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, action }),
    })

    const result = await response.json()
    
    if (!result.success) {
      throw new Error('reCAPTCHA verification failed')
    }

    if (result.score < expectedScore) {
      throw new Error('reCAPTCHA score too low')
    }

    return {
      success: true,
      score: result.score,
      action: result.action,
    }
  } catch (error) {
    console.error('reCAPTCHA token verification failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Component for displaying reCAPTCHA badge
export const ReCaptchaBadge = ({ className = '' }) => {
  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      This site is protected by reCAPTCHA and the Google{' '}
      <a 
        href="https://policies.google.com/privacy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Privacy Policy
      </a>
      {' '}and{' '}
      <a 
        href="https://policies.google.com/terms" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Terms of Service
      </a>
      {' '}apply.
    </div>
  )
}

// Custom hook for login form protection
export const useLoginReCaptcha = () => {
  const { executeReCaptcha } = useReCaptcha()

  const executeLoginReCaptcha = async () => {
    if (!executeReCaptcha) return null
    return await executeReCaptcha('login')
  }

  return executeLoginReCaptcha
}

// Custom hook for registration form protection
export const useRegisterReCaptcha = () => {
  const { executeReCaptcha } = useReCaptcha()

  const executeRegisterReCaptcha = async () => {
    if (!executeReCaptcha) return null
    return await executeReCaptcha('register')
  }

  return executeRegisterReCaptcha
}

// Custom hook for contact form protection
export const useContactReCaptcha = () => {
  const { executeReCaptcha } = useReCaptcha()

  const executeContactReCaptcha = async () => {
    if (!executeReCaptcha) return null
    return await executeReCaptcha('contact')
  }

  return executeContactReCaptcha
}

// Custom hook for checkout protection
export const useCheckoutReCaptcha = () => {
  const { executeReCaptcha } = useReCaptcha()

  const executeCheckoutReCaptcha = async () => {
    if (!executeReCaptcha) return null
    return await executeReCaptcha('checkout')
  }

  return executeCheckoutReCaptcha
}

export default ReCaptchaForm


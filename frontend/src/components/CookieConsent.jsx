import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { X, Cookie, Shield, BarChart3 } from 'lucide-react'
import { Button } from './ui/button'
import analyticsService from '../services/analytics'

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = Cookies.get('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    } else {
      // Load saved preferences and initialize analytics if consented
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
      
      if (savedPreferences.analytics) {
        analyticsService.init()
      }
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    
    savePreferences(allAccepted)
    analyticsService.init()
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    savePreferences(preferences)
    
    if (preferences.analytics) {
      analyticsService.init()
    }
    
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    
    savePreferences(onlyNecessary)
    setIsVisible(false)
  }

  const savePreferences = (prefs) => {
    // Save for 1 year
    Cookies.set('cookie-consent', JSON.stringify(prefs), { 
      expires: 365,
      secure: true,
      sameSite: 'strict'
    })
    
    // Track consent choice
    if (prefs.analytics) {
      analyticsService.trackEvent('cookie_consent', 'Privacy', 'accepted')
    }
  }

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return // Cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Cookie className="h-6 w-6 text-dumbdee-golden" />
            <h2 className="text-xl font-semibold text-dumbdee-navy">
              Cookie Preferences
            </h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            We use cookies to enhance your browsing experience, serve personalized content, 
            and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>

          {!showDetails ? (
            <div className="space-y-4">
              <button
                onClick={() => setShowDetails(true)}
                className="text-dumbdee-golden hover:text-dumbdee-golden-dark font-medium"
              >
                Customize Settings
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Necessary Cookies</h3>
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="rounded border-gray-300"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Essential for the website to function properly. These cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handlePreferenceChange('analytics')}
                      className="rounded border-gray-300 text-dumbdee-golden focus:ring-dumbdee-golden"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Cookie className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Marketing Cookies</h3>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handlePreferenceChange('marketing')}
                      className="rounded border-gray-300 text-dumbdee-golden focus:ring-dumbdee-golden"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Used to track visitors across websites to display relevant and engaging advertisements.
                  </p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Functional Cookies</h3>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => handlePreferenceChange('functional')}
                      className="rounded border-gray-300 text-dumbdee-golden focus:ring-dumbdee-golden"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Enable enhanced functionality and personalization, such as remembering your preferences.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleRejectAll}
            className="flex-1"
          >
            Reject All
          </Button>
          
          {showDetails && (
            <Button
              variant="outline"
              onClick={handleAcceptSelected}
              className="flex-1"
            >
              Save Preferences
            </Button>
          )}
          
          <Button
            onClick={handleAcceptAll}
            className="flex-1"
          >
            Accept All
          </Button>
        </div>

        {/* Privacy Policy Link */}
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-500 text-center">
            For more information, please read our{' '}
            <a 
              href="/privacy-policy" 
              className="text-dumbdee-golden hover:text-dumbdee-golden-dark underline"
            >
              Privacy Policy
            </a>
            {' '}and{' '}
            <a 
              href="/cookie-policy" 
              className="text-dumbdee-golden hover:text-dumbdee-golden-dark underline"
            >
              Cookie Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent


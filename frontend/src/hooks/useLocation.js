import { useState, useEffect } from 'react'
import locationService from '../services/locationService'

// Custom hook for location services
export const useLocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [features, setFeatures] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadLocation = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const locationData = await locationService.getCurrentLocation()
        
        if (mounted) {
          setLocation(locationData)
          setFeatures(locationService.getLocationFeatures(locationData))
        }
      } catch (err) {
        if (mounted) {
          setError(err.message)
          console.error('Location error:', err)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadLocation()

    // Listen for location changes
    const unsubscribe = locationService.addLocationListener((newLocation) => {
      if (mounted) {
        setLocation(newLocation)
        setFeatures(locationService.getLocationFeatures(newLocation))
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const updateLocation = async (coordinates) => {
    try {
      setLoading(true)
      setError(null)
      
      const newLocation = await locationService.updateLocation(coordinates)
      setLocation(newLocation)
      setFeatures(locationService.getLocationFeatures(newLocation))
    } catch (err) {
      setError(err.message)
      console.error('Update location error:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearLocation = () => {
    locationService.clearCache()
    setLocation(null)
    setFeatures(null)
  }

  return {
    location,
    features,
    loading,
    error,
    updateLocation,
    clearLocation,
    // Helper methods
    isCountry: (countryCode) => location?.countryCode === countryCode,
    getCurrency: () => location?.currency || 'USD',
    getLanguage: () => location?.language || 'en-US',
    getTimezone: () => location?.timezone || 'UTC',
    isGDPRRequired: () => features?.gdprRequired || false
  }
}

// Hook for specific location features
export const useLocationFeatures = () => {
  const { features, loading, error } = useLocation()

  return {
    paymentMethods: features?.paymentMethods || ['paypal'],
    shippingOptions: features?.shippingOptions || {},
    currency: features?.currency || 'USD',
    taxRate: features?.taxRate || 0.08,
    promotions: features?.promotions || [],
    supportHours: features?.supportHours || '24/7',
    loading,
    error
  }
}

// Hook for currency formatting
export const useCurrency = () => {
  const { location } = useLocation()
  
  const formatPrice = (amount, currency = null) => {
    const currencyCode = currency || location?.currency || 'USD'
    const locale = location?.language || 'en-US'
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
      }).format(amount)
    } catch (error) {
      // Fallback formatting
      const symbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥' }
      const symbol = symbols[currencyCode] || '$'
      return `${symbol}${amount.toFixed(2)}`
    }
  }

  const convertPrice = (amount, fromCurrency, toCurrency = null) => {
    const targetCurrency = toCurrency || location?.currency || 'USD'
    
    // Simple conversion rates (in production, use real-time rates)
    const rates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      INR: 83.12,
      JPY: 149.50,
      CAD: 1.36,
      AUD: 1.53
    }
    
    const fromRate = rates[fromCurrency] || 1
    const toRate = rates[targetCurrency] || 1
    
    return (amount / fromRate) * toRate
  }

  return {
    formatPrice,
    convertPrice,
    currency: location?.currency || 'USD',
    symbol: location?.currency === 'INR' ? '₹' : location?.currency === 'EUR' ? '€' : location?.currency === 'GBP' ? '£' : '$'
  }
}

export default useLocation


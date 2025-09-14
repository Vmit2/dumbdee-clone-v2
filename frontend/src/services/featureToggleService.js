import locationService from './locationService'

// Feature Toggle Service for managing feature flags
class FeatureToggleService {
  constructor() {
    this.features = new Map()
    this.listeners = new Set()
    this.initialized = false
    this.initializeFeatures()
  }

  // Initialize default features
  initializeFeatures() {
    // Default feature flags
    const defaultFeatures = {
      // Core features
      'new_checkout_flow': { enabled: true, rollout: 100 },
      'enhanced_search': { enabled: true, rollout: 100 },
      'wishlist_feature': { enabled: true, rollout: 100 },
      'product_reviews': { enabled: true, rollout: 100 },
      'live_chat': { enabled: true, rollout: 100 },
      
      // Payment features
      'paypal_payments': { enabled: true, rollout: 100 },
      'razorpay_payments': { enabled: true, rollout: 100 },
      'apple_pay': { enabled: false, rollout: 0 },
      'google_pay': { enabled: false, rollout: 0 },
      'crypto_payments': { enabled: false, rollout: 0 },
      
      // Seller features
      'seller_dashboard': { enabled: true, rollout: 100 },
      'seller_analytics': { enabled: true, rollout: 100 },
      'bulk_upload': { enabled: true, rollout: 100 },
      'seller_promotions': { enabled: false, rollout: 0 },
      
      // Location-based features
      'location_based_pricing': { enabled: true, rollout: 100 },
      'local_delivery': { enabled: false, rollout: 0 },
      'regional_products': { enabled: true, rollout: 100 },
      'currency_conversion': { enabled: true, rollout: 100 },
      
      // Experimental features
      'ai_recommendations': { enabled: false, rollout: 10 },
      'virtual_try_on': { enabled: false, rollout: 5 },
      'social_shopping': { enabled: false, rollout: 0 },
      'subscription_model': { enabled: false, rollout: 0 },
      
      // Performance features
      'lazy_loading': { enabled: true, rollout: 100 },
      'image_optimization': { enabled: true, rollout: 100 },
      'cdn_delivery': { enabled: true, rollout: 100 },
      'service_worker': { enabled: false, rollout: 0 },
      
      // Marketing features
      'personalized_banners': { enabled: true, rollout: 100 },
      'email_marketing': { enabled: true, rollout: 100 },
      'push_notifications': { enabled: false, rollout: 0 },
      'loyalty_program': { enabled: false, rollout: 0 },
      
      // Compliance features
      'gdpr_compliance': { enabled: true, rollout: 100 },
      'cookie_consent': { enabled: true, rollout: 100 },
      'accessibility_mode': { enabled: true, rollout: 100 },
      'data_export': { enabled: true, rollout: 100 }
    }

    // Set default features
    Object.entries(defaultFeatures).forEach(([key, config]) => {
      this.features.set(key, config)
    })

    this.initialized = true
  }

  // Check if a feature is enabled
  isEnabled(featureName, context = {}) {
    if (!this.initialized) {
      this.initializeFeatures()
    }

    const feature = this.features.get(featureName)
    if (!feature) {
      console.warn(`Feature '${featureName}' not found`)
      return false
    }

    // Check if feature is globally disabled
    if (!feature.enabled) {
      return false
    }

    // Check rollout percentage
    if (feature.rollout < 100) {
      const userId = context.userId || this.getUserId()
      const hash = this.hashString(userId + featureName)
      const percentage = hash % 100
      if (percentage >= feature.rollout) {
        return false
      }
    }

    // Check location-based rules
    if (feature.locationRules) {
      const location = context.location || locationService.currentLocation
      if (location && !this.checkLocationRules(feature.locationRules, location)) {
        return false
      }
    }

    // Check user segment rules
    if (feature.userSegments) {
      const userSegment = context.userSegment || this.getUserSegment(context)
      if (!feature.userSegments.includes(userSegment)) {
        return false
      }
    }

    // Check time-based rules
    if (feature.timeRules) {
      if (!this.checkTimeRules(feature.timeRules)) {
        return false
      }
    }

    return true
  }

  // Get feature configuration
  getFeatureConfig(featureName, context = {}) {
    const feature = this.features.get(featureName)
    if (!feature) {
      return null
    }

    return {
      enabled: this.isEnabled(featureName, context),
      config: feature.config || {},
      metadata: feature.metadata || {}
    }
  }

  // Set feature flag
  setFeature(featureName, config) {
    this.features.set(featureName, config)
    this.notifyListeners(featureName, config)
  }

  // Enable feature
  enableFeature(featureName, rollout = 100) {
    const feature = this.features.get(featureName) || {}
    this.setFeature(featureName, { ...feature, enabled: true, rollout })
  }

  // Disable feature
  disableFeature(featureName) {
    const feature = this.features.get(featureName) || {}
    this.setFeature(featureName, { ...feature, enabled: false })
  }

  // Update location-based features
  async updateLocationFeatures() {
    try {
      const location = await locationService.getCurrentLocation()
      const locationFeatures = locationService.getLocationFeatures(location)

      // Update payment method features based on location
      const paymentMethods = locationFeatures.paymentMethods
      this.setFeature('paypal_payments', { 
        enabled: paymentMethods.includes('paypal'), 
        rollout: 100 
      })
      this.setFeature('razorpay_payments', { 
        enabled: paymentMethods.includes('razorpay'), 
        rollout: 100 
      })
      this.setFeature('apple_pay', { 
        enabled: paymentMethods.includes('apple_pay'), 
        rollout: 100 
      })
      this.setFeature('google_pay', { 
        enabled: paymentMethods.includes('google_pay'), 
        rollout: 100 
      })

      // Update GDPR compliance based on location
      this.setFeature('gdpr_compliance', {
        enabled: locationFeatures.gdprRequired,
        rollout: 100
      })

      // Update currency conversion feature
      this.setFeature('currency_conversion', {
        enabled: locationFeatures.currency !== 'USD',
        rollout: 100,
        config: { currency: locationFeatures.currency }
      })

      // Update local delivery feature for major cities
      const majorCities = ['New York', 'Los Angeles', 'London', 'Mumbai', 'Delhi', 'Berlin', 'Paris']
      this.setFeature('local_delivery', {
        enabled: majorCities.includes(location.city),
        rollout: 100
      })

      return true
    } catch (error) {
      console.error('Error updating location features:', error)
      return false
    }
  }

  // Check location rules
  checkLocationRules(rules, location) {
    if (rules.countries && !rules.countries.includes(location.countryCode)) {
      return false
    }
    if (rules.excludeCountries && rules.excludeCountries.includes(location.countryCode)) {
      return false
    }
    if (rules.cities && !rules.cities.includes(location.city)) {
      return false
    }
    if (rules.timezones && !rules.timezones.includes(location.timezone)) {
      return false
    }
    return true
  }

  // Check time-based rules
  checkTimeRules(rules) {
    const now = new Date()
    
    if (rules.startDate && now < new Date(rules.startDate)) {
      return false
    }
    if (rules.endDate && now > new Date(rules.endDate)) {
      return false
    }
    if (rules.daysOfWeek && !rules.daysOfWeek.includes(now.getDay())) {
      return false
    }
    if (rules.hours) {
      const hour = now.getHours()
      if (hour < rules.hours.start || hour > rules.hours.end) {
        return false
      }
    }
    
    return true
  }

  // Get user segment
  getUserSegment(context) {
    // Simple user segmentation logic
    if (context.isReturningUser) return 'returning'
    if (context.orderCount > 5) return 'loyal'
    if (context.totalSpent > 500) return 'vip'
    return 'new'
  }

  // Get user ID for consistent rollout
  getUserId() {
    let userId = localStorage.getItem('userId')
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('userId', userId)
    }
    return userId
  }

  // Hash string for consistent percentage calculation
  hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Get all enabled features
  getEnabledFeatures(context = {}) {
    const enabled = {}
    this.features.forEach((config, name) => {
      enabled[name] = this.isEnabled(name, context)
    })
    return enabled
  }

  // Get feature analytics
  getFeatureAnalytics() {
    const analytics = {}
    this.features.forEach((config, name) => {
      analytics[name] = {
        enabled: config.enabled,
        rollout: config.rollout,
        hasLocationRules: !!config.locationRules,
        hasTimeRules: !!config.timeRules,
        hasUserSegments: !!config.userSegments
      }
    })
    return analytics
  }

  // Add feature change listener
  addFeatureListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify listeners of feature changes
  notifyListeners(featureName, config) {
    this.listeners.forEach(callback => {
      try {
        callback(featureName, config)
      } catch (error) {
        console.error('Error in feature listener:', error)
      }
    })
  }

  // Load features from remote config (for production)
  async loadRemoteConfig(apiUrl) {
    try {
      const response = await fetch(apiUrl)
      const remoteFeatures = await response.json()
      
      Object.entries(remoteFeatures).forEach(([name, config]) => {
        this.setFeature(name, config)
      })
      
      return true
    } catch (error) {
      console.error('Error loading remote config:', error)
      return false
    }
  }

  // Export features for debugging
  exportFeatures() {
    const features = {}
    this.features.forEach((config, name) => {
      features[name] = config
    })
    return features
  }

  // Import features for testing
  importFeatures(features) {
    Object.entries(features).forEach(([name, config]) => {
      this.setFeature(name, config)
    })
  }
}

// Create singleton instance
const featureToggleService = new FeatureToggleService()

// Initialize location-based features when location is available
locationService.addLocationListener(() => {
  featureToggleService.updateLocationFeatures()
})

export default featureToggleService


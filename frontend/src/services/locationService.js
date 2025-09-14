// Location Service for handling geolocation and location-based features
class LocationService {
  constructor() {
    this.currentLocation = null
    this.locationCache = new Map()
    this.listeners = new Set()
  }

  // Get current user location
  async getCurrentLocation() {
    if (this.currentLocation) {
      return this.currentLocation
    }

    try {
      // Try to get from localStorage first
      const cached = localStorage.getItem('userLocation')
      if (cached) {
        this.currentLocation = JSON.parse(cached)
        return this.currentLocation
      }

      // Get from browser geolocation
      const position = await this.getBrowserLocation()
      const locationData = await this.getLocationDetails(position.coords)
      
      this.currentLocation = locationData
      localStorage.setItem('userLocation', JSON.stringify(locationData))
      this.notifyListeners(locationData)
      
      return locationData
    } catch (error) {
      console.error('Error getting location:', error)
      // Fallback to IP-based location
      return this.getIPLocation()
    }
  }

  // Get location from browser geolocation API
  getBrowserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Get location details from coordinates
  async getLocationDetails(coords) {
    const { latitude, longitude } = coords
    const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`
    
    if (this.locationCache.has(cacheKey)) {
      return this.locationCache.get(cacheKey)
    }

    try {
      // Using a free geocoding service (in production, use a proper service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      const data = await response.json()
      
      const locationData = {
        latitude,
        longitude,
        country: data.countryName || 'Unknown',
        countryCode: data.countryCode || 'US',
        city: data.city || data.locality || 'Unknown',
        state: data.principalSubdivision || 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currency: this.getCurrencyByCountry(data.countryCode),
        language: navigator.language || 'en-US',
        timestamp: Date.now()
      }

      this.locationCache.set(cacheKey, locationData)
      return locationData
    } catch (error) {
      console.error('Error getting location details:', error)
      return this.getDefaultLocation()
    }
  }

  // Fallback to IP-based location
  async getIPLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        state: data.region,
        timezone: data.timezone,
        currency: data.currency,
        language: navigator.language || 'en-US',
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error getting IP location:', error)
      return this.getDefaultLocation()
    }
  }

  // Get default location (fallback)
  getDefaultLocation() {
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      country: 'United States',
      countryCode: 'US',
      city: 'New York',
      state: 'New York',
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en-US',
      timestamp: Date.now()
    }
  }

  // Get currency by country code
  getCurrencyByCountry(countryCode) {
    const currencyMap = {
      'US': 'USD',
      'IN': 'INR',
      'GB': 'GBP',
      'CA': 'CAD',
      'AU': 'AUD',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'JP': 'JPY',
      'CN': 'CNY',
      'BR': 'BRL',
      'MX': 'MXN'
    }
    return currencyMap[countryCode] || 'USD'
  }

  // Get location-based features
  getLocationFeatures(location = this.currentLocation) {
    if (!location) return this.getDefaultFeatures()

    const features = {
      // Payment methods based on location
      paymentMethods: this.getPaymentMethods(location.countryCode),
      
      // Shipping options
      shippingOptions: this.getShippingOptions(location.countryCode),
      
      // Currency and pricing
      currency: location.currency,
      
      // Language preferences
      language: location.language,
      
      // Tax calculation
      taxRate: this.getTaxRate(location.countryCode, location.state),
      
      // Available products (some products may be region-restricted)
      availableCategories: this.getAvailableCategories(location.countryCode),
      
      // Local promotions
      promotions: this.getLocalPromotions(location.countryCode),
      
      // Customer support
      supportHours: this.getSupportHours(location.timezone),
      
      // Legal compliance
      gdprRequired: this.isGDPRRequired(location.countryCode),
      
      // Local holidays and events
      localEvents: this.getLocalEvents(location.countryCode)
    }

    return features
  }

  // Get payment methods by country
  getPaymentMethods(countryCode) {
    const methods = {
      'US': ['paypal', 'stripe', 'apple_pay', 'google_pay'],
      'IN': ['razorpay', 'paytm', 'upi', 'paypal'],
      'GB': ['paypal', 'stripe', 'apple_pay'],
      'DE': ['paypal', 'stripe', 'sofort'],
      'FR': ['paypal', 'stripe', 'bancontact'],
      'default': ['paypal', 'stripe']
    }
    return methods[countryCode] || methods.default
  }

  // Get shipping options by country
  getShippingOptions(countryCode) {
    const domestic = ['US', 'IN', 'GB', 'DE', 'FR', 'CA', 'AU']
    const isDomestic = domestic.includes(countryCode)
    
    return {
      standard: { available: true, days: isDomestic ? '3-5' : '7-14', cost: isDomestic ? 9.99 : 19.99 },
      express: { available: isDomestic, days: isDomestic ? '1-2' : '3-5', cost: isDomestic ? 19.99 : 39.99 },
      overnight: { available: countryCode === 'US', days: '1', cost: 39.99 }
    }
  }

  // Get tax rate by location
  getTaxRate(countryCode, state) {
    const taxRates = {
      'US': { 'CA': 0.0875, 'NY': 0.08, 'TX': 0.0625, 'default': 0.08 },
      'IN': { 'default': 0.18 }, // GST
      'GB': { 'default': 0.20 }, // VAT
      'DE': { 'default': 0.19 }, // VAT
      'FR': { 'default': 0.20 }, // VAT
      'default': { 'default': 0.08 }
    }
    
    const countryTax = taxRates[countryCode] || taxRates.default
    return countryTax[state] || countryTax.default
  }

  // Get available categories by country
  getAvailableCategories(countryCode) {
    // Some products might be restricted in certain countries
    const restrictedCountries = ['CN', 'RU', 'IR']
    const isRestricted = restrictedCountries.includes(countryCode)
    
    return {
      women: true,
      men: true,
      kids: true,
      electronics: !isRestricted,
      luxury: !isRestricted,
      international_brands: !isRestricted
    }
  }

  // Get local promotions
  getLocalPromotions(countryCode) {
    const promotions = {
      'US': [{ id: 'us_thanksgiving', name: 'Thanksgiving Sale', discount: 25 }],
      'IN': [{ id: 'in_diwali', name: 'Diwali Special', discount: 30 }],
      'GB': [{ id: 'gb_boxing', name: 'Boxing Day Sale', discount: 20 }],
      'default': [{ id: 'global_sale', name: 'Global Sale', discount: 15 }]
    }
    return promotions[countryCode] || promotions.default
  }

  // Get support hours by timezone
  getSupportHours(timezone) {
    // Simplified support hours based on timezone
    const hours = {
      'America/New_York': '9 AM - 9 PM EST',
      'America/Los_Angeles': '9 AM - 9 PM PST',
      'Europe/London': '9 AM - 6 PM GMT',
      'Asia/Kolkata': '10 AM - 7 PM IST',
      'default': '24/7 Online Support'
    }
    return hours[timezone] || hours.default
  }

  // Check if GDPR compliance is required
  isGDPRRequired(countryCode) {
    const gdprCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB']
    return gdprCountries.includes(countryCode)
  }

  // Get local events
  getLocalEvents(countryCode) {
    const events = {
      'US': ['Black Friday', 'Cyber Monday', 'Memorial Day'],
      'IN': ['Diwali', 'Holi', 'Independence Day'],
      'GB': ['Boxing Day', 'Bank Holiday'],
      'default': ['New Year', 'Valentine\'s Day', 'Christmas']
    }
    return events[countryCode] || events.default
  }

  // Get default features
  getDefaultFeatures() {
    return {
      paymentMethods: ['paypal', 'stripe'],
      shippingOptions: {
        standard: { available: true, days: '7-14', cost: 19.99 }
      },
      currency: 'USD',
      language: 'en-US',
      taxRate: 0.08,
      availableCategories: {
        women: true,
        men: true,
        kids: true,
        electronics: true,
        luxury: true,
        international_brands: true
      },
      promotions: [{ id: 'global_sale', name: 'Global Sale', discount: 15 }],
      supportHours: '24/7 Online Support',
      gdprRequired: false,
      localEvents: ['New Year', 'Valentine\'s Day', 'Christmas']
    }
  }

  // Add location change listener
  addLocationListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify all listeners of location change
  notifyListeners(location) {
    this.listeners.forEach(callback => {
      try {
        callback(location)
      } catch (error) {
        console.error('Error in location listener:', error)
      }
    })
  }

  // Clear location cache
  clearCache() {
    this.locationCache.clear()
    localStorage.removeItem('userLocation')
    this.currentLocation = null
  }

  // Update location manually
  async updateLocation(coordinates) {
    try {
      const locationData = await this.getLocationDetails(coordinates)
      this.currentLocation = locationData
      localStorage.setItem('userLocation', JSON.stringify(locationData))
      this.notifyListeners(locationData)
      return locationData
    } catch (error) {
      console.error('Error updating location:', error)
      throw error
    }
  }
}

// Create singleton instance
const locationService = new LocationService()

export default locationService


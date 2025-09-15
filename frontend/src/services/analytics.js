// Analytics service without external window.gtag dependency

class AnalyticsService {
  constructor() {
    this.isInitialized = false
    this.trackingId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID
    this.debugMode = import.meta.env.DEV
  }

  // Initialize Google Analytics
  init() {
    if (!this.trackingId) {
      console.warn('Google Analytics tracking ID not found in environment variables')
      return
    }

    if (this.isInitialized) {
      return
    }

    try {
      // Load window.gtag script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/window.gtag/js?id=${this.trackingId}`
      document.head.appendChild(script)

      // Initialize window.gtag
      window.dataLayer = window.dataLayer || []
      window.window.gtag = function() {
        window.dataLayer.push(arguments)
      }

      window.window.gtag('js', new Date())
      window.window.gtag('config', this.trackingId, {
        debug_mode: this.debugMode,
        send_page_view: false, // We'll handle page views manually
      })

      this.isInitialized = true
      
      if (this.debugMode) {
        console.log('Google Analytics initialized with ID:', this.trackingId)
      }
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error)
    }
  }

  // Track page views
  trackPageView(path, title) {
    if (!this.isInitialized) return

    try {
      window.window.gtag('config', this.trackingId, {
        page_path: path,
        page_title: title,
      })

      if (this.debugMode) {
        console.log('Page view tracked:', { path, title })
      }
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  // Track custom events
  trackEvent(action, category, label, value) {
    if (!this.isInitialized) return

    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })

      if (this.debugMode) {
        console.log('Event tracked:', { action, category, label, value })
      }
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  // E-commerce tracking
  trackPurchase(transactionId, items, value, currency = 'USD') {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
      })

      if (this.debugMode) {
        console.log('Purchase tracked:', { transactionId, items, value, currency })
      }
    } catch (error) {
      console.error('Failed to track purchase:', error)
    }
  }

  // Track add to cart
  trackAddToCart(item, currency = 'USD') {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'add_to_cart', {
        currency: currency,
        value: item.price * item.quantity,
        items: [{
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        }],
      })

      if (this.debugMode) {
        console.log('Add to cart tracked:', item)
      }
    } catch (error) {
      console.error('Failed to track add to cart:', error)
    }
  }

  // Track remove from cart
  trackRemoveFromCart(item, currency = 'USD') {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'remove_from_cart', {
        currency: currency,
        value: item.price * item.quantity,
        items: [{
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        }],
      })

      if (this.debugMode) {
        console.log('Remove from cart tracked:', item)
      }
    } catch (error) {
      console.error('Failed to track remove from cart:', error)
    }
  }

  // Track view item
  trackViewItem(item, currency = 'USD') {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'view_item', {
        currency: currency,
        value: item.price,
        items: [{
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          price: item.price,
        }],
      })

      if (this.debugMode) {
        console.log('View item tracked:', item)
      }
    } catch (error) {
      console.error('Failed to track view item:', error)
    }
  }

  // Track search
  trackSearch(searchTerm, category = null) {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        category: category,
      })

      if (this.debugMode) {
        console.log('Search tracked:', { searchTerm, category })
      }
    } catch (error) {
      console.error('Failed to track search:', error)
    }
  }

  // Track user registration
  trackSignUp(method = 'email') {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'sign_up', {
        method: method,
      })

      if (this.debugMode) {
        console.log('Sign up tracked:', { method })
      }
    } catch (error) {
      console.error('Failed to track sign up:', error)
    }
  }

  // Track user login
  trackLogin(method = 'email') {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'login', {
        method: method,
      })

      if (this.debugMode) {
        console.log('Login tracked:', { method })
      }
    } catch (error) {
      console.error('Failed to track login:', error)
    }
  }

  // Track begin checkout
  trackBeginCheckout(items, value, currency = 'USD') {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'begin_checkout', {
        currency: currency,
        value: value,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
      })

      if (this.debugMode) {
        console.log('Begin checkout tracked:', { items, value, currency })
      }
    } catch (error) {
      console.error('Failed to track begin checkout:', error)
    }
  }

  // Track payment info
  trackAddPaymentInfo(currency = 'USD', value) {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'add_payment_info', {
        currency: currency,
        value: value,
      })

      if (this.debugMode) {
        console.log('Add payment info tracked:', { currency, value })
      }
    } catch (error) {
      console.error('Failed to track add payment info:', error)
    }
  }

  // Track seller actions
  trackSellerAction(action, sellerId, productId = null) {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'seller_action', {
        event_category: 'Seller',
        event_label: action,
        seller_id: sellerId,
        product_id: productId,
      })

      if (this.debugMode) {
        console.log('Seller action tracked:', { action, sellerId, productId })
      }
    } catch (error) {
      console.error('Failed to track seller action:', error)
    }
  }

  // Track admin actions
  trackAdminAction(action, adminId, targetType, targetId) {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'admin_action', {
        event_category: 'Admin',
        event_label: action,
        admin_id: adminId,
        target_type: targetType,
        target_id: targetId,
      })

      if (this.debugMode) {
        console.log('Admin action tracked:', { action, adminId, targetType, targetId })
      }
    } catch (error) {
      console.error('Failed to track admin action:', error)
    }
  }

  // Track form submissions
  trackFormSubmission(formName, success = true) {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'form_submit', {
        event_category: 'Form',
        event_label: formName,
        success: success,
      })

      if (this.debugMode) {
        console.log('Form submission tracked:', { formName, success })
      }
    } catch (error) {
      console.error('Failed to track form submission:', error)
    }
  }

  // Track file downloads
  trackDownload(fileName, fileType) {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'file_download', {
        event_category: 'Download',
        event_label: fileName,
        file_type: fileType,
      })

      if (this.debugMode) {
        console.log('Download tracked:', { fileName, fileType })
      }
    } catch (error) {
      console.error('Failed to track download:', error)
    }
  }

  // Track social sharing
  trackShare(method, contentType, contentId) {
    if (!this.isInitialized) return

    try {
      window.gtag('event', 'share', {
        method: method,
        content_type: contentType,
        content_id: contentId,
      })

      if (this.debugMode) {
        console.log('Share tracked:', { method, contentType, contentId })
      }
    } catch (error) {
      console.error('Failed to track share:', error)
    }
  }

  // Set user properties
  setUserProperties(properties) {
    if (!this.isInitialized) return

    try {
      window.gtag('config', this.trackingId, {
        user_properties: properties,
      })

      if (this.debugMode) {
        console.log('User properties set:', properties)
      }
    } catch (error) {
      console.error('Failed to set user properties:', error)
    }
  }

  // Set user ID for cross-device tracking
  setUserId(userId) {
    if (!this.isInitialized) return

    try {
      window.gtag('config', this.trackingId, {
        user_id: userId,
      })

      if (this.debugMode) {
        console.log('User ID set:', userId)
      }
    } catch (error) {
      console.error('Failed to set user ID:', error)
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService()

export default analyticsService

// Export convenience functions
export const {
  init,
  trackPageView,
  trackEvent,
  trackPurchase,
  trackAddToCart,
  trackRemoveFromCart,
  trackViewItem,
  trackSearch,
  trackSignUp,
  trackLogin,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackSellerAction,
  trackAdminAction,
  trackFormSubmission,
  trackDownload,
  trackShare,
  setUserProperties,
  setUserId,
} = analyticsService


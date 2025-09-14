import { useState, useEffect, useCallback } from 'react'
import featureToggleService from '../services/featureToggleService'
import { useLocation } from './useLocation'

// Custom hook for feature toggles
export const useFeatureToggle = (featureName, context = {}) => {
  const { location } = useLocation()
  const [isEnabled, setIsEnabled] = useState(false)
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkFeature = useCallback(() => {
    const fullContext = {
      ...context,
      location,
      userId: localStorage.getItem('userId'),
      userSegment: context.userSegment || 'new'
    }

    const enabled = featureToggleService.isEnabled(featureName, fullContext)
    const featureConfig = featureToggleService.getFeatureConfig(featureName, fullContext)

    setIsEnabled(enabled)
    setConfig(featureConfig)
    setLoading(false)
  }, [featureName, context, location])

  useEffect(() => {
    checkFeature()

    // Listen for feature changes
    const unsubscribe = featureToggleService.addFeatureListener((changedFeature) => {
      if (changedFeature === featureName) {
        checkFeature()
      }
    })

    return unsubscribe
  }, [checkFeature, featureName])

  return {
    isEnabled,
    config: config?.config || {},
    metadata: config?.metadata || {},
    loading
  }
}

// Hook for multiple features
export const useFeatureToggles = (featureNames, context = {}) => {
  const { location } = useLocation()
  const [features, setFeatures] = useState({})
  const [loading, setLoading] = useState(true)

  const checkFeatures = useCallback(() => {
    const fullContext = {
      ...context,
      location,
      userId: localStorage.getItem('userId'),
      userSegment: context.userSegment || 'new'
    }

    const featureStates = {}
    featureNames.forEach(name => {
      const enabled = featureToggleService.isEnabled(name, fullContext)
      const config = featureToggleService.getFeatureConfig(name, fullContext)
      featureStates[name] = {
        isEnabled: enabled,
        config: config?.config || {},
        metadata: config?.metadata || {}
      }
    })

    setFeatures(featureStates)
    setLoading(false)
  }, [featureNames, context, location])

  useEffect(() => {
    checkFeatures()

    // Listen for feature changes
    const unsubscribe = featureToggleService.addFeatureListener((changedFeature) => {
      if (featureNames.includes(changedFeature)) {
        checkFeatures()
      }
    })

    return unsubscribe
  }, [checkFeatures, featureNames])

  return {
    features,
    loading,
    isEnabled: (featureName) => features[featureName]?.isEnabled || false,
    getConfig: (featureName) => features[featureName]?.config || {}
  }
}

// Hook for payment features
export const usePaymentFeatures = () => {
  const paymentFeatures = [
    'paypal_payments',
    'razorpay_payments',
    'apple_pay',
    'google_pay',
    'crypto_payments'
  ]

  const { features, loading } = useFeatureToggles(paymentFeatures)

  return {
    paypal: features.paypal_payments?.isEnabled || false,
    razorpay: features.razorpay_payments?.isEnabled || false,
    applePay: features.apple_pay?.isEnabled || false,
    googlePay: features.google_pay?.isEnabled || false,
    crypto: features.crypto_payments?.isEnabled || false,
    loading,
    availableMethods: Object.entries(features)
      .filter(([_, config]) => config.isEnabled)
      .map(([name]) => name.replace('_payments', ''))
  }
}

// Hook for seller features
export const useSellerFeatures = () => {
  const sellerFeatures = [
    'seller_dashboard',
    'seller_analytics',
    'bulk_upload',
    'seller_promotions'
  ]

  const { features, loading } = useFeatureToggles(sellerFeatures)

  return {
    dashboard: features.seller_dashboard?.isEnabled || false,
    analytics: features.seller_analytics?.isEnabled || false,
    bulkUpload: features.bulk_upload?.isEnabled || false,
    promotions: features.seller_promotions?.isEnabled || false,
    loading
  }
}

// Hook for experimental features
export const useExperimentalFeatures = () => {
  const experimentalFeatures = [
    'ai_recommendations',
    'virtual_try_on',
    'social_shopping',
    'subscription_model'
  ]

  const { features, loading } = useFeatureToggles(experimentalFeatures)

  return {
    aiRecommendations: features.ai_recommendations?.isEnabled || false,
    virtualTryOn: features.virtual_try_on?.isEnabled || false,
    socialShopping: features.social_shopping?.isEnabled || false,
    subscriptionModel: features.subscription_model?.isEnabled || false,
    loading
  }
}

// Hook for performance features
export const usePerformanceFeatures = () => {
  const performanceFeatures = [
    'lazy_loading',
    'image_optimization',
    'cdn_delivery',
    'service_worker'
  ]

  const { features, loading } = useFeatureToggles(performanceFeatures)

  return {
    lazyLoading: features.lazy_loading?.isEnabled || false,
    imageOptimization: features.image_optimization?.isEnabled || false,
    cdnDelivery: features.cdn_delivery?.isEnabled || false,
    serviceWorker: features.service_worker?.isEnabled || false,
    loading
  }
}

// Hook for compliance features
export const useComplianceFeatures = () => {
  const complianceFeatures = [
    'gdpr_compliance',
    'cookie_consent',
    'accessibility_mode',
    'data_export'
  ]

  const { features, loading } = useFeatureToggles(complianceFeatures)

  return {
    gdpr: features.gdpr_compliance?.isEnabled || false,
    cookieConsent: features.cookie_consent?.isEnabled || false,
    accessibility: features.accessibility_mode?.isEnabled || false,
    dataExport: features.data_export?.isEnabled || false,
    loading
  }
}

// Component wrapper for feature toggles
export const FeatureToggle = ({ 
  feature, 
  children, 
  fallback = null, 
  context = {} 
}) => {
  const { isEnabled, loading } = useFeatureToggle(feature, context)

  if (loading) {
    return fallback
  }

  return isEnabled ? children : fallback
}

// Component wrapper for multiple features (AND logic)
export const FeatureGate = ({ 
  features, 
  children, 
  fallback = null, 
  context = {},
  mode = 'all' // 'all' (AND) or 'any' (OR)
}) => {
  const { features: featureStates, loading } = useFeatureToggles(features, context)

  if (loading) {
    return fallback
  }

  const enabledFeatures = Object.values(featureStates).filter(f => f.isEnabled)
  const shouldRender = mode === 'all' 
    ? enabledFeatures.length === features.length
    : enabledFeatures.length > 0

  return shouldRender ? children : fallback
}

export default useFeatureToggle


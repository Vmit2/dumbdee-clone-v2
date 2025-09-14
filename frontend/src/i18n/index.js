import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// Import translation files
import enTranslations from '../locales/en/common.json'
import esTranslations from '../locales/es/common.json'
import frTranslations from '../locales/fr/common.json'
import deTranslations from '../locales/de/common.json'
import hiTranslations from '../locales/hi/common.json'
import zhTranslations from '../locales/zh/common.json'

// Language resources
const resources = {
  en: {
    common: enTranslations
  },
  es: {
    common: esTranslations
  },
  fr: {
    common: frTranslations
  },
  de: {
    common: deTranslations
  },
  hi: {
    common: hiTranslations
  },
  zh: {
    common: zhTranslations
  }
}

// Language detection options
const detectionOptions = {
  // Order of language detection methods
  order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  
  // Cache user language
  caches: ['localStorage'],
  
  // Exclude certain detection methods
  excludeCacheFor: ['cimode'],
  
  // Check for language in localStorage
  lookupLocalStorage: 'i18nextLng',
  
  // Check for language in URL path
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  
  // Convert language codes
  convertDetectedLanguage: (lng) => {
    // Convert country-specific codes to base language
    const languageMap = {
      'en-US': 'en',
      'en-GB': 'en',
      'en-CA': 'en',
      'en-AU': 'en',
      'es-ES': 'es',
      'es-MX': 'es',
      'es-AR': 'es',
      'fr-FR': 'fr',
      'fr-CA': 'fr',
      'de-DE': 'de',
      'de-AT': 'de',
      'de-CH': 'de',
      'hi-IN': 'hi',
      'zh-CN': 'zh',
      'zh-TW': 'zh',
      'zh-HK': 'zh'
    }
    
    return languageMap[lng] || lng.split('-')[0]
  }
}

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Resources
    resources,
    
    // Default language
    fallbackLng: 'en',
    
    // Default namespace
    defaultNS: 'common',
    
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection
    detection: detectionOptions,
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ',',
      format: (value, format, lng) => {
        // Custom formatting functions
        if (format === 'uppercase') return value.toUpperCase()
        if (format === 'lowercase') return value.toLowerCase()
        if (format === 'currency') {
          // Use Intl.NumberFormat for currency formatting
          const currencyMap = {
            en: 'USD',
            es: 'EUR',
            fr: 'EUR',
            de: 'EUR',
            hi: 'INR',
            zh: 'CNY'
          }
          const currency = currencyMap[lng] || 'USD'
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: currency
          }).format(value)
        }
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng).format(new Date(value))
        }
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value)
        }
        return value
      }
    },
    
    // React options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span']
    },
    
    // Backend options (for loading translations from server)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}.json'
    },
    
    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Key separator
    keySeparator: '.',
    nsSeparator: ':',
    
    // Return objects
    returnObjects: false,
    returnEmptyString: true,
    returnNull: true,
    
    // Post processing
    postProcess: false,
    
    // Save missing keys
    saveMissing: process.env.NODE_ENV === 'development',
    saveMissingTo: 'fallback',
    
    // Missing key handler
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`)
      }
    },
    
    // Parse missing key handler
    parseMissingKeyHandler: (key) => {
      return key
    }
  })

// Language change handler
i18n.on('languageChanged', (lng) => {
  // Update document language
  document.documentElement.lang = lng
  
  // Update document direction for RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr'
  
  // Store language preference
  localStorage.setItem('i18nextLng', lng)
  
  // Trigger custom event for other components
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lng } }))
})

// Helper functions
export const getCurrentLanguage = () => i18n.language
export const getSupportedLanguages = () => Object.keys(resources)
export const isRTL = () => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  return rtlLanguages.includes(i18n.language)
}

// Language info
export const languageInfo = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
}

// Set language based on location
export const setLanguageFromLocation = (location) => {
  const countryLanguageMap = {
    'US': 'en',
    'GB': 'en',
    'CA': 'en',
    'AU': 'en',
    'ES': 'es',
    'MX': 'es',
    'AR': 'es',
    'FR': 'fr',
    'DE': 'de',
    'AT': 'de',
    'CH': 'de',
    'IN': 'hi',
    'CN': 'zh',
    'TW': 'zh',
    'HK': 'zh'
  }
  
  const suggestedLanguage = countryLanguageMap[location?.countryCode]
  if (suggestedLanguage && suggestedLanguage !== i18n.language) {
    // Only change if user hasn't manually selected a language
    const userSelectedLanguage = localStorage.getItem('userSelectedLanguage')
    if (!userSelectedLanguage) {
      i18n.changeLanguage(suggestedLanguage)
    }
  }
}

// Manual language change (user selection)
export const changeLanguage = (lng) => {
  localStorage.setItem('userSelectedLanguage', 'true')
  i18n.changeLanguage(lng)
}

export default i18n


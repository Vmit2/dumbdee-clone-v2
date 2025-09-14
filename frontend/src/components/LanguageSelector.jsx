import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Globe, Check, MapPin } from 'lucide-react'
import { useLocation } from '../hooks/useLocation'
import { languageInfo, changeLanguage, getCurrentLanguage, setLanguageFromLocation } from '../i18n'

const LanguageSelector = ({ variant = 'dropdown', showFlag = true, showName = true }) => {
  const { t, i18n } = useTranslation()
  const { location } = useLocation()
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage())
  const [isOpen, setIsOpen] = useState(false)

  // Update current language when i18n language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage())
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => i18n.off('languageChanged', handleLanguageChange)
  }, [i18n])

  // Auto-suggest language based on location
  useEffect(() => {
    if (location) {
      setLanguageFromLocation(location)
    }
  }, [location])

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  const getSuggestedLanguage = () => {
    if (!location) return null
    
    const countryLanguageMap = {
      'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en',
      'ES': 'es', 'MX': 'es', 'AR': 'es',
      'FR': 'fr',
      'DE': 'de', 'AT': 'de', 'CH': 'de',
      'IN': 'hi',
      'CN': 'zh', 'TW': 'zh', 'HK': 'zh'
    }
    
    return countryLanguageMap[location.countryCode]
  }

  const suggestedLang = getSuggestedLanguage()
  const currentLangInfo = languageInfo[currentLang] || languageInfo.en

  // Compact button variant
  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Globe className="h-4 w-4 mr-1" />
            {showFlag && <span className="mr-1">{currentLangInfo.flag}</span>}
            {showName && <span className="hidden sm:inline">{currentLangInfo.nativeName}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t('language.select')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {suggestedLang && suggestedLang !== currentLang && (
            <>
              <DropdownMenuItem
                onClick={() => handleLanguageChange(suggestedLang)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-blue-500" />
                  <span>{languageInfo[suggestedLang].flag}</span>
                  <span>{languageInfo[suggestedLang].nativeName}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {t('language.auto_detect')}
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          {Object.entries(languageInfo).map(([code, info]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{info.flag}</span>
                <span>{info.nativeName}</span>
                <span className="text-sm text-gray-500">({info.name})</span>
              </div>
              {currentLang === code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Full card variant
  if (variant === 'card') {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5" />
            <h3 className="font-semibold">{t('language.select')}</h3>
          </div>
          
          {suggestedLang && suggestedLang !== currentLang && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  {t('language.auto_detect')}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLanguageChange(suggestedLang)}
                className="w-full justify-start"
              >
                <span className="mr-2">{languageInfo[suggestedLang].flag}</span>
                <span>{languageInfo[suggestedLang].nativeName}</span>
                <span className="ml-auto text-xs text-gray-500">
                  ({location?.country})
                </span>
              </Button>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="text-sm text-gray-600 mb-2">
              {t('language.current')}: {currentLangInfo.nativeName}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(languageInfo).map(([code, info]) => (
                <Button
                  key={code}
                  variant={currentLang === code ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange(code)}
                  className="justify-start h-auto p-3"
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span>{info.flag}</span>
                      <span className="font-medium">{info.nativeName}</span>
                      {currentLang === code && <Check className="h-3 w-3 ml-auto" />}
                    </div>
                    <span className="text-xs opacity-70">{info.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default dropdown variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[120px] justify-start">
          <Globe className="h-4 w-4 mr-2" />
          {showFlag && <span className="mr-2">{currentLangInfo.flag}</span>}
          {showName && <span>{currentLangInfo.nativeName}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t('language.select')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {location && (
          <div className="px-2 py-1 text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {t('location.detected_location')} {location.city}, {location.country}
          </div>
        )}
        
        {suggestedLang && suggestedLang !== currentLang && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLanguageChange(suggestedLang)}
              className="flex items-center justify-between bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-blue-500" />
                <span>{languageInfo[suggestedLang].flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{languageInfo[suggestedLang].nativeName}</span>
                  <span className="text-xs text-gray-500">{languageInfo[suggestedLang].name}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                Suggested
              </Badge>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        {Object.entries(languageInfo).map(([code, info]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{info.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{info.nativeName}</span>
                <span className="text-xs text-gray-500">{info.name}</span>
              </div>
            </div>
            {currentLang === code && <Check className="h-4 w-4 text-green-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelector


import { useState } from 'react'
import { useLocation, useCurrency } from '../hooks/useLocation'
import { useFeatureToggle } from '../hooks/useFeatureToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Globe, Truck, CreditCard, Clock, Gift, X } from 'lucide-react'

const LocationBanner = () => {
  const { location, features, loading, error, isCountry } = useLocation()
  const { formatPrice, currency } = useCurrency()
  const { isEnabled: showPersonalizedBanners } = useFeatureToggle('personalized_banners')
  const { isEnabled: showLocalDelivery } = useFeatureToggle('local_delivery')
  const { isEnabled: showGDPRCompliance } = useFeatureToggle('gdpr_compliance')
  
  const [dismissed, setDismissed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  if (loading || error || dismissed || !showPersonalizedBanners) {
    return null
  }

  if (!location) {
    return (
      <Alert className="mx-4 mt-4">
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          Enable location access for personalized shopping experience and local delivery options.
        </AlertDescription>
      </Alert>
    )
  }

  const getLocationMessage = () => {
    if (isCountry('IN')) {
      return {
        title: `Welcome to DumbDee India! 🇮🇳`,
        message: `Shopping from ${location.city}? Enjoy free delivery on orders above ₹999!`,
        highlight: 'Razorpay payments available',
        color: 'bg-orange-50 border-orange-200'
      }
    } else if (isCountry('US')) {
      return {
        title: `Welcome to DumbDee USA! 🇺🇸`,
        message: `Shopping from ${location.city}? Free shipping on orders over $75!`,
        highlight: 'PayPal & Apple Pay available',
        color: 'bg-blue-50 border-blue-200'
      }
    } else if (isCountry('GB')) {
      return {
        title: `Welcome to DumbDee UK! 🇬🇧`,
        message: `Shopping from ${location.city}? Free delivery on orders over £50!`,
        highlight: 'PayPal payments available',
        color: 'bg-green-50 border-green-200'
      }
    } else {
      return {
        title: `Welcome to DumbDee! 🌍`,
        message: `Shopping from ${location.country}? International shipping available!`,
        highlight: `Prices shown in ${currency}`,
        color: 'bg-purple-50 border-purple-200'
      }
    }
  }

  const locationInfo = getLocationMessage()

  return (
    <Card className={`mx-4 mt-4 ${locationInfo.color}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-sm">{locationInfo.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {location.city}, {location.countryCode}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">
              {locationInfo.message}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                <CreditCard className="h-3 w-3 mr-1" />
                {locationInfo.highlight}
              </Badge>
              
              {features?.supportHours && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Support: {features.supportHours}
                </Badge>
              )}
              
              {showLocalDelivery && (
                <Badge variant="outline" className="text-xs">
                  <Truck className="h-3 w-3 mr-1" />
                  Local delivery available
                </Badge>
              )}
              
              {features?.promotions?.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Gift className="h-3 w-3 mr-1" />
                  {features.promotions[0].name}
                </Badge>
              )}
            </div>

            {!showDetails && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="p-0 h-auto text-xs text-purple-600"
              >
                <Globe className="h-3 w-3 mr-1" />
                View location details
              </Button>
            )}

            {showDetails && (
              <div className="mt-3 p-3 bg-white rounded-lg border text-xs space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Location:</strong>
                    <p>{location.city}, {location.state}</p>
                    <p>{location.country}</p>
                  </div>
                  <div>
                    <strong>Currency:</strong>
                    <p>{currency}</p>
                    <strong>Timezone:</strong>
                    <p>{location.timezone}</p>
                  </div>
                </div>
                
                <div>
                  <strong>Available Payment Methods:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {features?.paymentMethods?.map(method => (
                      <Badge key={method} variant="secondary" className="text-xs">
                        {method.replace('_', ' ').toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <strong>Shipping Options:</strong>
                  <div className="space-y-1 mt-1">
                    {Object.entries(features?.shippingOptions || {}).map(([type, option]) => (
                      option.available && (
                        <div key={type} className="flex justify-between">
                          <span>{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
                          <span>{option.days} days - {formatPrice(option.cost)}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {features?.promotions?.length > 0 && (
                  <div>
                    <strong>Local Promotions:</strong>
                    <div className="space-y-1 mt-1">
                      {features.promotions.map(promo => (
                        <div key={promo.id} className="flex justify-between">
                          <span>{promo.name}:</span>
                          <span>{promo.discount}% off</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="p-0 h-auto text-xs text-purple-600"
                >
                  Hide details
                </Button>
              </div>
            )}

            {showGDPRCompliance && features?.gdprRequired && (
              <Alert className="mt-3">
                <AlertDescription className="text-xs">
                  🍪 We use cookies to enhance your experience. By continuing, you agree to our privacy policy.
                  <Button variant="link" size="sm" className="p-0 h-auto ml-2 text-xs">
                    Learn more
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LocationBanner


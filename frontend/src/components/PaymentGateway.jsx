import { useState, useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CreditCard, MapPin, CheckCircle } from 'lucide-react'

const PaymentGateway = ({ 
  amount, 
  currency = 'USD', 
  onSuccess, 
  onError, 
  orderDetails,
  userLocation = null 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Detect user location and set appropriate payment method
  useEffect(() => {
    if (userLocation?.country === 'IN' || userLocation?.country === 'India') {
      setPaymentMethod('razorpay')
    } else {
      setPaymentMethod('paypal')
    }
  }, [userLocation])

  // PayPal configuration
  const paypalOptions = {
    'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID || 'test',
    currency: currency,
    intent: 'capture'
  }

  // Razorpay payment handler
  const handleRazorpayPayment = () => {
    setLoading(true)
    setError('')

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'DumbDee',
        description: `Order #${orderDetails?.orderId || 'DDD-' + Date.now()}`,
        image: '/favicon.ico',
        order_id: orderDetails?.razorpayOrderId, // This should come from backend
        handler: function (response) {
          setLoading(false)
          setSuccess(true)
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            method: 'razorpay'
          })
        },
        prefill: {
          name: orderDetails?.customerName || '',
          email: orderDetails?.customerEmail || '',
          contact: orderDetails?.customerPhone || ''
        },
        notes: {
          address: orderDetails?.shippingAddress || ''
        },
        theme: {
          color: '#9333ea'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            setError('Payment cancelled by user')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        setLoading(false)
        setError(`Payment failed: ${response.error.description}`)
        onError(response.error)
      })
      rzp.open()
    }
    script.onerror = () => {
      setLoading(false)
      setError('Failed to load Razorpay. Please try again.')
    }
    document.body.appendChild(script)
  }

  // PayPal success handler
  const handlePayPalSuccess = (details, data) => {
    setSuccess(true)
    onSuccess({
      paymentId: details.id,
      orderId: data.orderID,
      payerInfo: details.payer,
      method: 'paypal'
    })
  }

  // PayPal error handler
  const handlePayPalError = (err) => {
    setError('PayPal payment failed. Please try again.')
    onError(err)
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600">
              Your order has been confirmed and will be processed shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        {userLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {userLocation.country}
            <Badge variant="outline" className="ml-2">
              {paymentMethod === 'razorpay' ? 'Razorpay' : 'PayPal'}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Order Total:</span>
            <span className="font-semibold">
              {paymentMethod === 'razorpay' ? '₹' : '$'}{amount}
            </span>
          </div>
          {orderDetails?.items && (
            <div className="text-xs text-gray-500">
              {orderDetails.items.length} item(s)
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPaymentMethod('paypal')}
              className="flex-1"
            >
              PayPal
            </Button>
            <Button
              variant={paymentMethod === 'razorpay' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPaymentMethod('razorpay')}
              className="flex-1"
            >
              Razorpay
            </Button>
          </div>

          {/* PayPal Payment */}
          {paymentMethod === 'paypal' && (
            <div className="space-y-3">
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal'
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: amount.toString(),
                            currency_code: currency
                          },
                          description: `DumbDee Order #${orderDetails?.orderId || 'DDD-' + Date.now()}`
                        }
                      ]
                    })
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                      handlePayPalSuccess(details, data)
                    })
                  }}
                  onError={handlePayPalError}
                  onCancel={() => {
                    setError('Payment cancelled by user')
                  }}
                />
              </PayPalScriptProvider>
            </div>
          )}

          {/* Razorpay Payment */}
          {paymentMethod === 'razorpay' && (
            <div className="space-y-3">
              <Button
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Processing...' : `Pay ₹${amount} with Razorpay`}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Secure payment powered by Razorpay
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentGateway


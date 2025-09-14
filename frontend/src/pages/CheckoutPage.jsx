import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import PaymentGateway from '@/components/PaymentGateway'
import { ShoppingBag, MapPin, User, Mail, Phone } from 'lucide-react'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment
  const [userLocation, setUserLocation] = useState(null)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  // Mock cart items (in real app, this would come from context/state)
  const [cartItems] = useState([
    {
      id: 1,
      name: "Men's Leather Jacket",
      price: 89.99,
      quantity: 1,
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: "Women's Summer Dress",
      price: 45.50,
      quantity: 2,
      image: '/api/placeholder/80/80'
    }
  ])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  // Get user location
  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In a real app, you'd use a geolocation API to get country from coordinates
            // For demo, we'll simulate location detection
            const mockLocation = {
              country: 'US', // Change to 'IN' to test Razorpay
              city: 'New York',
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
            setUserLocation(mockLocation)
            setShippingInfo(prev => ({ ...prev, country: mockLocation.country }))
          } catch (error) {
            console.error('Error getting location details:', error)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          // Default to US if location access denied
          setUserLocation({ country: 'US', city: 'Unknown' })
        }
      )
    }
  }, [])

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData)
    // In real app, send order data to backend
    setTimeout(() => {
      navigate('/order-confirmation', { 
        state: { 
          orderId: 'DDD-' + Date.now(),
          paymentData,
          orderTotal: total 
        }
      })
    }, 2000)
  }

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error)
  }

  const orderDetails = {
    orderId: 'DDD-' + Date.now(),
    customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
    customerEmail: shippingInfo.email,
    customerPhone: shippingInfo.phone,
    shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
    items: cartItems
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <div className="flex items-center space-x-4">
              <Badge variant={step >= 1 ? "default" : "secondary"}>
                1. Shipping
              </Badge>
              <Badge variant={step >= 2 ? "default" : "secondary"}>
                2. Payment
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                    {userLocation && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        Detected location: {userLocation.city}, {userLocation.country}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            required
                            value={shippingInfo.firstName}
                            onChange={handleShippingChange}
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            required
                            value={shippingInfo.lastName}
                            onChange={handleShippingChange}
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={handleShippingChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          required
                          value={shippingInfo.address}
                          onChange={handleShippingChange}
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            required
                            value={shippingInfo.city}
                            onChange={handleShippingChange}
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            required
                            value={shippingInfo.state}
                            onChange={handleShippingChange}
                            placeholder="NY"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            required
                            value={shippingInfo.zipCode}
                            onChange={handleShippingChange}
                            placeholder="10001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            required
                            value={shippingInfo.country}
                            onChange={handleShippingChange}
                            placeholder="US"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                        <p className="mt-2">
                          <Mail className="h-4 w-4 inline mr-1" />
                          {shippingInfo.email}
                        </p>
                        <p>
                          <Phone className="h-4 w-4 inline mr-1" />
                          {shippingInfo.phone}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep(1)}
                        className="mt-3"
                      >
                        Edit
                      </Button>
                    </CardContent>
                  </Card>

                  <PaymentGateway
                    amount={total}
                    currency={userLocation?.country === 'IN' ? 'INR' : 'USD'}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    orderDetails={orderDetails}
                    userLocation={userLocation}
                  />
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=${encodeURIComponent(item.name.slice(0, 2))}`
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage


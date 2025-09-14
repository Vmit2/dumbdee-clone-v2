import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Star } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'

const HomePage = () => {
  const [hotPicks, setHotPicks] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data for hot picks (in real app, this would come from API)
  const mockHotPicks = [
    {
      id: 1,
      title: "Usa Flag Design Drop Shoulder Sweater,Long Sleeve Tops",
      price: 23.00,
      image: "/api/placeholder/300/300",
      rating: 4.5,
      reviews: 12
    },
    {
      id: 2,
      title: "Women Casual Vintage High Elastic Waist Pockets Striped Pants",
      price: 34.00,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 25
    },
    {
      id: 3,
      title: "Loose And Thin Cotton And Linen Women's Drape High-waisted Pants",
      price: 34.00,
      image: "/api/placeholder/300/300",
      rating: 4.3,
      reviews: 18
    },
    {
      id: 4,
      title: "Women's Casual Cotton And Linen Loose Yoga Pants",
      price: 34.00,
      image: "/api/placeholder/300/300",
      rating: 4.6,
      reviews: 31
    },
    {
      id: 5,
      title: "Spice Girl Style High Waist Slim Jeans Bell Bottoms",
      price: 37.00,
      image: "/api/placeholder/300/300",
      rating: 4.4,
      reviews: 22
    },
    {
      id: 6,
      title: "Women's Summer Fashion Ripped Ninth Jeans",
      price: 34.00,
      image: "/api/placeholder/300/300",
      rating: 4.7,
      reviews: 19
    },
    {
      id: 7,
      title: "Cotton Linen Women's Sand Washed Linen Bloomers",
      price: 44.00,
      image: "/api/placeholder/300/300",
      rating: 4.2,
      reviews: 14
    },
    {
      id: 8,
      title: "Women's Vintage Cotton Linen Solid Color Casual Pants",
      price: 34.00,
      image: "/api/placeholder/300/300",
      rating: 4.5,
      reviews: 27
    }
  ]

  const categories = [
    {
      id: 1,
      name: "Women",
      image: "/api/placeholder/400/500",
      link: "/women"
    },
    {
      id: 2,
      name: "Men",
      image: "/api/placeholder/400/500",
      link: "/men"
    },
    {
      id: 3,
      name: "Kids",
      image: "/api/placeholder/400/500",
      link: "/kids"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHotPicks(mockHotPicks)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-200 to-blue-300 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Hero Image */}
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <img
                src="/api/placeholder/500/600"
                alt="Fashion Model"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            
            {/* Hero Content */}
            <div className="lg:w-1/2 lg:pl-12 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-4">
                LIMITED LAUNCH
              </h1>
              <h2 className="text-3xl lg:text-5xl font-bold text-orange-500 mb-2">
                DROP
              </h2>
              <h3 className="text-2xl lg:text-4xl font-bold text-gray-700 mb-6">
                10% OFF + Early Access
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Be the FIRST to shop our all-new collection.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Only 7 days to score this deal once it's gone, it's gone!
              </p>
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                Claim Your Spot Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Description */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-light text-gray-700 italic">
            "Dumdee – Trendy Women's Wear, Stylish Men's Accessories & Adorable Kids' Clothing – Fashion for the Whole Family"
          </h2>
        </div>
      </section>

      {/* Hot Picks Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Hot Picks</h2>
            <Link to="/products" className="text-purple-600 hover:text-purple-700 font-medium">
              View More →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotPicks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Shop By Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="bg-purple-600 text-white px-4 py-2 rounded font-bold text-2xl inline-block mb-4">
              DumbDee
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every thread tells your fashion story
            </p>
            <p className="text-gray-600 mt-2">
              Dumdee is your global <strong>online fashion destination</strong> for <strong>bold women's clothing</strong>, <strong>stylish men's accessories</strong>, and <strong>adorable kids' fashion</strong>.
            </p>
            <p className="text-gray-600 mt-2">
              For her, for him, for the little ones—<strong>curated with care, crafted with love</strong>.
            </p>
            <p className="text-gray-600 mt-2 font-medium">
              Feel confident, look amazing—only at Dumdee
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">About DumDee</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/about" className="hover:text-purple-600">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/faqs" className="hover:text-purple-600">FAQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/terms" className="hover:text-purple-600">Terms & Conditions</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Help</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/customer-service" className="hover:text-purple-600">Customer Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage


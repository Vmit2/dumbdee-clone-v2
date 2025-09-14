import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    // TODO: Add to wishlist API call
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <Link to={`/product/${product.id}`}>
            <div className="relative bg-gray-100 aspect-square">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg"></div>
              )}
              <img
                src={product.image}
                alt={product.title}
                className={`w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=${encodeURIComponent(product.title.slice(0, 20))}`
                  setImageLoaded(true)
                }}
              />
            </div>
          </Link>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isWishlisted 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} 
            />
          </Button>

          {/* Sale Badge */}
          {product.comparePrice && product.comparePrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              SALE
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-purple-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviews || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button 
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard


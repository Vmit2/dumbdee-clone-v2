import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const CategoryPage = ({ category }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      title: "Men's High-grade Profile Casual Retro Metal Buckle Motorcycle Leather Coat",
      price: 49.99,
      image: "/api/placeholder/300/300",
      rating: 4.5,
      reviews: 12
    },
    {
      id: 2,
      title: "Fleece-lined Thick Ethnic Style Double-pocket Double-breasted Coat",
      price: 65.99,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 25
    },
    // Add more mock products...
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [category])

  const categoryTitles = {
    men: "Men's Collection",
    women: "Women's Collection", 
    kids: "Kids' Collection"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {categoryTitles[category] || 'Products'}
      </h1>
      
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage


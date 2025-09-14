import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

const CategoryCard = ({ category }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link to={category.link}>
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0">
        <CardContent className="p-0 relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
            <img
              src={category.image}
              alt={category.name}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=${encodeURIComponent(category.name)}`
                setImageLoaded(true)
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
            
            {/* Category Name */}
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white text-2xl font-bold bg-black/50 px-4 py-2 rounded">
                {category.name}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CategoryCard


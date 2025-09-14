import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LanguageSelector from './LanguageSelector'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top notification bar */}
      <div className="bg-red-500 text-white text-center py-2 px-4 text-sm">
        🚧 We're making improvements to our website.
      </div>
      
      {/* Secondary notification */}
      <div className="bg-gray-100 text-gray-700 text-center py-2 px-4 text-sm">
        Don't worry — you can still browse and place your orders safely! ✅
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-purple-600 text-white px-3 py-2 rounded font-bold text-xl">
              DumbDee
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium">
              Shop
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-purple-600 font-medium">
                Men <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/men/jackets">Jackets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/men/watches">Watches</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/men/shoes">Shoes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/men/wallets">Wallets</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-purple-600 font-medium">
                Women <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/women/tops">Tops</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/women/pants">Pants</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/women/dresses">Dresses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/women/accessories">Accessories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-purple-600 font-medium">
                Kids <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/kids/boys">Boys</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/kids/girls">Girls</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/kids/baby">Baby</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 border-gray-300"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Link to="/seller/register" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Sell on DumbDee
            </Link>

            <LanguageSelector variant="compact" />

            <Link to="/login" className="text-gray-700 hover:text-purple-600 font-medium">
              Login
            </Link>

            <Link to="/wishlist" className="relative">
              <Heart className="h-6 w-6 text-gray-700 hover:text-purple-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-purple-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  )
}

export default Header


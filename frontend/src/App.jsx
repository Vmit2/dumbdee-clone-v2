import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { store } from './store'
import { ReCaptchaProvider } from './components/ReCaptcha'
import CookieConsent from './components/CookieConsent'
import Header from './components/Header'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import analyticsService from './services/analytics'
import './styles/colors.css'
import './i18n'
import './App.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'))
const SellerLogin = lazy(() => import('./pages/SellerLogin'))
const SellerRegister = lazy(() => import('./pages/SellerRegister'))
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'))
const ProductAdminDashboard = lazy(() => import('./pages/ProductAdminDashboard'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Analytics wrapper component
const AnalyticsWrapper = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    // Initialize Google Analytics
    analyticsService.init()
  }, [])

  useEffect(() => {
    // Track page views
    analyticsService.trackPageView(location.pathname, document.title)
  }, [location])

  return children
}

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dumbdee-golden mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ReCaptchaProvider>
            <Router>
              <AnalyticsWrapper>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                  <Header />
                  
                  <main className="flex-1">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/men" element={<CategoryPage category="men" />} />
                        <Route path="/women" element={<CategoryPage category="women" />} />
                        <Route path="/kids" element={<CategoryPage category="kids" />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        
                        {/* Auth Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        
                        {/* Seller Routes */}
                        <Route path="/seller/login" element={<SellerLogin />} />
                        <Route path="/seller/register" element={<SellerRegister />} />
                        <Route path="/seller/dashboard/*" element={<SellerDashboard />} />
                        
                        {/* Admin Routes */}
                        <Route path="/super-admin/*" element={<SuperAdminDashboard />} />
                        <Route path="/product-admin/*" element={<ProductAdminDashboard />} />
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Suspense>
                  </main>
                  
                  <Footer />
                  
                  {/* Cookie Consent */}
                  <CookieConsent />
                  
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: '#C0842B',
                        color: '#fff',
                      },
                    }}
                  />
                </div>
              </AnalyticsWrapper>
            </Router>
          </ReCaptchaProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App


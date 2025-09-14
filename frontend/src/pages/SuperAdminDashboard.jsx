import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Users, 
  Store, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Search,
  Calendar,
  Settings,
  Shield,
  AlertTriangle,
  Star,
  Target
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { PrimaryButton, SecondaryButton, TertiaryButton } from '../components/ui/Button'
import {
  fetchAllSellers,
  fetchAllUsers,
  fetchAllProducts,
  fetchAnalytics,
  fetchRevenueData,
  fetchSellerPerformance,
  fetchProductPerformance,
  verifySeller,
  approveProduct,
  openVerificationModal,
  closeVerificationModal,
  selectSellers,
  selectUsers,
  selectProducts,
  selectAnalytics,
  selectVerificationModal
} from '../store/slices/adminSlice'
import { selectIsSuperAdmin } from '../store/slices/authSlice'
import analyticsService from '../services/analytics'

const SuperAdminDashboard = () => {
  const dispatch = useDispatch()
  const isSuperAdmin = useSelector(selectIsSuperAdmin)
  const sellers = useSelector(selectSellers)
  const users = useSelector(selectUsers)
  const products = useSelector(selectProducts)
  const analytics = useSelector(selectAnalytics)
  const verificationModal = useSelector(selectVerificationModal)

  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('30d')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!isSuperAdmin) {
      // Redirect to unauthorized page
      return
    }

    // Load initial data
    dispatch(fetchAnalytics({ period: dateRange }))
    dispatch(fetchRevenueData({ period: dateRange }))
    dispatch(fetchSellerPerformance({ period: dateRange }))
    dispatch(fetchProductPerformance({ period: dateRange }))
    
    // Track admin dashboard access
    analyticsService.trackAdminAction('dashboard_access', 'super_admin', 'dashboard', 'overview')
  }, [dispatch, isSuperAdmin, dateRange])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    analyticsService.trackAdminAction('tab_change', 'super_admin', 'dashboard', tab)
    
    // Load data based on tab
    switch (tab) {
      case 'sellers':
        dispatch(fetchAllSellers({ page: 1, limit: 10, status: statusFilter, search: searchTerm }))
        break
      case 'users':
        dispatch(fetchAllUsers({ page: 1, limit: 10, search: searchTerm }))
        break
      case 'products':
        dispatch(fetchAllProducts({ page: 1, limit: 10, status: statusFilter }))
        break
    }
  }

  const handleVerifySeller = (seller) => {
    dispatch(openVerificationModal({ type: 'seller', data: seller }))
  }

  const handleApproveProduct = (product) => {
    dispatch(openVerificationModal({ type: 'product', data: product }))
  }

  const handleVerificationSubmit = async (status, notes) => {
    const { type, data } = verificationModal
    
    if (type === 'seller') {
      await dispatch(verifySeller({ sellerId: data.id, status, notes }))
      analyticsService.trackAdminAction('seller_verification', 'super_admin', 'seller', data.id)
    } else if (type === 'product') {
      await dispatch(approveProduct({ productId: data.id, status, notes }))
      analyticsService.trackAdminAction('product_approval', 'super_admin', 'product', data.id)
    }
    
    dispatch(closeVerificationModal())
  }

  // Memoized calculations
  const dashboardStats = useMemo(() => {
    if (!analytics.overview) return null

    return {
      totalRevenue: analytics.overview.totalRevenue || 0,
      totalOrders: analytics.overview.totalOrders || 0,
      totalUsers: analytics.overview.totalUsers || 0,
      totalSellers: analytics.overview.totalSellers || 0,
      totalProducts: analytics.overview.totalProducts || 0,
      pendingSellers: analytics.overview.pendingSellers || 0,
      pendingProducts: analytics.overview.pendingProducts || 0,
      revenueGrowth: analytics.overview.revenueGrowth || 0,
      orderGrowth: analytics.overview.orderGrowth || 0,
      userGrowth: analytics.overview.userGrowth || 0,
    }
  }, [analytics.overview])

  const chartColors = {
    primary: '#26275F',
    secondary: '#C0842B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-dumbdee-golden" />
              <h1 className="text-2xl font-bold text-dumbdee-navy">Super Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-dumbdee-golden focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <PrimaryButton
                leftIcon={<Download className="h-4 w-4" />}
                size="sm"
                onClick={() => analyticsService.trackAdminAction('export_data', 'super_admin', 'dashboard', activeTab)}
              >
                Export
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'sellers', label: 'Sellers', icon: Store },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-dumbdee-golden text-dumbdee-golden'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            stats={dashboardStats} 
            analytics={analytics} 
            chartColors={chartColors}
          />
        )}
        
        {activeTab === 'sellers' && (
          <SellersTab 
            sellers={sellers}
            onVerify={handleVerifySeller}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
        
        {activeTab === 'users' && (
          <UsersTab 
            users={users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
        
        {activeTab === 'products' && (
          <ProductsTab 
            products={products}
            onApprove={handleApproveProduct}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsTab 
            analytics={analytics}
            chartColors={chartColors}
            dateRange={dateRange}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </div>

      {/* Verification Modal */}
      {verificationModal.isOpen && (
        <VerificationModal
          isOpen={verificationModal.isOpen}
          type={verificationModal.type}
          data={verificationModal.data}
          onSubmit={handleVerificationSubmit}
          onClose={() => dispatch(closeVerificationModal())}
        />
      )}
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ stats, analytics, chartColors }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dumbdee-golden mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%`,
      changeType: stats.revenueGrowth >= 0 ? 'positive' : 'negative',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.orderGrowth > 0 ? '+' : ''}${stats.orderGrowth}%`,
      changeType: stats.orderGrowth >= 0 ? 'positive' : 'negative',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: `${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}%`,
      changeType: stats.userGrowth >= 0 ? 'positive' : 'negative',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Sellers',
      value: stats.totalSellers.toLocaleString(),
      change: 'Active',
      changeType: 'neutral',
      icon: Store,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Pending Sellers',
      value: stats.pendingSellers.toLocaleString(),
      change: 'Needs Review',
      changeType: 'warning',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Pending Products',
      value: stats.pendingProducts.toLocaleString(),
      change: 'Needs Approval',
      changeType: 'warning',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    stat.changeType === 'warning' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.revenue?.data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={chartColors.primary} 
                fill={chartColors.primary}
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Sellers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Sellers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.sellerPerformance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill={chartColors.secondary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// Sellers Tab Component
const SellersTab = ({ sellers, onVerify, searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dumbdee-golden focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-dumbdee-golden focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sellers Management</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <Store className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{seller.businessName}</div>
                        <div className="text-sm text-gray-500">{seller.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      seller.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                      seller.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      seller.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {seller.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seller.productCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(seller.totalRevenue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <TertiaryButton
                      size="sm"
                      leftIcon={<Eye className="h-4 w-4" />}
                      onClick={() => onVerify(seller)}
                    >
                      Review
                    </TertiaryButton>
                    
                    {seller.verificationStatus === 'pending' && (
                      <PrimaryButton
                        size="sm"
                        leftIcon={<CheckCircle className="h-4 w-4" />}
                        onClick={() => onVerify(seller)}
                      >
                        Verify
                      </PrimaryButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Users Tab Component (similar structure)
const UsersTab = ({ users, searchTerm, setSearchTerm }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Users Management</h3>
        {/* Users table implementation */}
        <p className="text-gray-600">Users management interface will be implemented here.</p>
      </div>
    </div>
  )
}

// Products Tab Component (similar structure)
const ProductsTab = ({ products, onApprove, statusFilter, setStatusFilter }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Products Management</h3>
        {/* Products table implementation */}
        <p className="text-gray-600">Products management interface will be implemented here.</p>
      </div>
    </div>
  )
}

// Analytics Tab Component
const AnalyticsTab = ({ analytics, chartColors, dateRange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
        {/* Advanced analytics charts */}
        <p className="text-gray-600">Advanced analytics dashboard will be implemented here.</p>
      </div>
    </div>
  )
}

// Settings Tab Component
const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
        {/* Platform settings */}
        <p className="text-gray-600">Platform settings and pricing formula management will be implemented here.</p>
      </div>
    </div>
  )
}

// Verification Modal Component
const VerificationModal = ({ isOpen, type, data, onSubmit, onClose }) => {
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(status, notes)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {type === 'seller' ? 'Verify Seller' : 'Approve Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-dumbdee-golden focus:border-transparent"
                required
              >
                <option value="">Select status</option>
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
                {type === 'seller' && <option value="suspended">Suspend</option>}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-dumbdee-golden focus:border-transparent"
                placeholder="Add notes about your decision..."
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <SecondaryButton
                type="button"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                className="flex-1"
              >
                Submit
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard


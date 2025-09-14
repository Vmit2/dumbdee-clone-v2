import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { adminAPI } from '../../services/api'

// Async thunks for Super Admin operations
export const fetchAllSellers = createAsyncThunk(
  'admin/fetchAllSellers',
  async ({ page = 1, limit = 10, status, search }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllSellers({ page, limit, status, search })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sellers')
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async ({ page = 1, limit = 10, search }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllUsers({ page, limit, search })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  }
)

export const fetchAllProducts = createAsyncThunk(
  'admin/fetchAllProducts',
  async ({ page = 1, limit = 10, status, category, seller }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllProducts({ page, limit, status, category, seller })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const verifySeller = createAsyncThunk(
  'admin/verifySeller',
  async ({ sellerId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.verifySeller(sellerId, { status, notes })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify seller')
    }
  }
)

export const approveProduct = createAsyncThunk(
  'admin/approveProduct',
  async ({ productId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.approveProduct(productId, { status, notes })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve product')
    }
  }
)

export const fetchAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async ({ period = '30d', metrics }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAnalytics({ period, metrics })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics')
    }
  }
)

export const fetchRevenueData = createAsyncThunk(
  'admin/fetchRevenueData',
  async ({ period = '30d', granularity = 'daily' }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getRevenueData({ period, granularity })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue data')
    }
  }
)

export const fetchSellerPerformance = createAsyncThunk(
  'admin/fetchSellerPerformance',
  async ({ period = '30d', limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getSellerPerformance({ period, limit })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller performance')
    }
  }
)

export const fetchProductPerformance = createAsyncThunk(
  'admin/fetchProductPerformance',
  async ({ period = '30d', limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getProductPerformance({ period, limit })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product performance')
    }
  }
)

export const updatePricingFormula = createAsyncThunk(
  'admin/updatePricingFormula',
  async (formulaData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updatePricingFormula(formulaData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update pricing formula')
    }
  }
)

export const fetchPricingFormula = createAsyncThunk(
  'admin/fetchPricingFormula',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getPricingFormula()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pricing formula')
    }
  }
)

export const fetchSellerDocuments = createAsyncThunk(
  'admin/fetchSellerDocuments',
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getSellerDocuments(sellerId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller documents')
    }
  }
)

const initialState = {
  // Sellers Management
  sellers: [],
  sellersLoading: false,
  sellersError: null,
  sellersPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  
  // Users Management
  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  
  // Products Management
  products: [],
  productsLoading: false,
  productsError: null,
  productsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  
  // Analytics
  analytics: {
    overview: null,
    revenue: null,
    sellerPerformance: [],
    productPerformance: [],
    loading: false,
    error: null,
  },
  
  // Pricing Formula
  pricingFormula: {
    data: null,
    loading: false,
    error: null,
  },
  
  // Seller Documents
  sellerDocuments: {},
  documentsLoading: false,
  documentsError: null,
  
  // UI State
  selectedSeller: null,
  selectedUser: null,
  selectedProduct: null,
  verificationModal: {
    isOpen: false,
    type: null, // 'seller' | 'product'
    data: null,
  },
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.sellersError = null
      state.usersError = null
      state.productsError = null
      state.analytics.error = null
      state.pricingFormula.error = null
      state.documentsError = null
    },
    setSelectedSeller: (state, action) => {
      state.selectedSeller = action.payload
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    openVerificationModal: (state, action) => {
      state.verificationModal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      }
    },
    closeVerificationModal: (state) => {
      state.verificationModal = {
        isOpen: false,
        type: null,
        data: null,
      }
    },
    updateSellerStatus: (state, action) => {
      const { sellerId, status } = action.payload
      const seller = state.sellers.find(s => s.id === sellerId)
      if (seller) {
        seller.verificationStatus = status
      }
    },
    updateProductStatus: (state, action) => {
      const { productId, status } = action.payload
      const product = state.products.find(p => p.id === productId)
      if (product) {
        product.approvalStatus = status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Sellers
      .addCase(fetchAllSellers.pending, (state) => {
        state.sellersLoading = true
        state.sellersError = null
      })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.sellersLoading = false
        state.sellers = action.payload.sellers
        state.sellersPagination = action.payload.pagination
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.sellersLoading = false
        state.sellersError = action.payload
      })
      
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true
        state.usersError = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false
        state.users = action.payload.users
        state.usersPagination = action.payload.pagination
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false
        state.usersError = action.payload
      })
      
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.productsLoading = true
        state.productsError = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productsLoading = false
        state.products = action.payload.products
        state.productsPagination = action.payload.pagination
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.productsLoading = false
        state.productsError = action.payload
      })
      
      // Verify Seller
      .addCase(verifySeller.fulfilled, (state, action) => {
        const seller = state.sellers.find(s => s.id === action.payload.seller.id)
        if (seller) {
          Object.assign(seller, action.payload.seller)
        }
      })
      
      // Approve Product
      .addCase(approveProduct.fulfilled, (state, action) => {
        const product = state.products.find(p => p.id === action.payload.product.id)
        if (product) {
          Object.assign(product, action.payload.product)
        }
      })
      
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.analytics.loading = true
        state.analytics.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false
        state.analytics.overview = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.analytics.loading = false
        state.analytics.error = action.payload
      })
      
      // Fetch Revenue Data
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.analytics.revenue = action.payload
      })
      
      // Fetch Seller Performance
      .addCase(fetchSellerPerformance.fulfilled, (state, action) => {
        state.analytics.sellerPerformance = action.payload
      })
      
      // Fetch Product Performance
      .addCase(fetchProductPerformance.fulfilled, (state, action) => {
        state.analytics.productPerformance = action.payload
      })
      
      // Pricing Formula
      .addCase(fetchPricingFormula.pending, (state) => {
        state.pricingFormula.loading = true
        state.pricingFormula.error = null
      })
      .addCase(fetchPricingFormula.fulfilled, (state, action) => {
        state.pricingFormula.loading = false
        state.pricingFormula.data = action.payload
      })
      .addCase(fetchPricingFormula.rejected, (state, action) => {
        state.pricingFormula.loading = false
        state.pricingFormula.error = action.payload
      })
      
      .addCase(updatePricingFormula.fulfilled, (state, action) => {
        state.pricingFormula.data = action.payload
      })
      
      // Seller Documents
      .addCase(fetchSellerDocuments.pending, (state) => {
        state.documentsLoading = true
        state.documentsError = null
      })
      .addCase(fetchSellerDocuments.fulfilled, (state, action) => {
        state.documentsLoading = false
        state.sellerDocuments[action.meta.arg] = action.payload
      })
      .addCase(fetchSellerDocuments.rejected, (state, action) => {
        state.documentsLoading = false
        state.documentsError = action.payload
      })
  },
})

export const {
  clearErrors,
  setSelectedSeller,
  setSelectedUser,
  setSelectedProduct,
  openVerificationModal,
  closeVerificationModal,
  updateSellerStatus,
  updateProductStatus,
} = adminSlice.actions

// Selectors
export const selectSellers = (state) => state.admin.sellers
export const selectUsers = (state) => state.admin.users
export const selectProducts = (state) => state.admin.products
export const selectAnalytics = (state) => state.admin.analytics
export const selectPricingFormula = (state) => state.admin.pricingFormula
export const selectSellerDocuments = (sellerId) => (state) => 
  state.admin.sellerDocuments[sellerId]
export const selectVerificationModal = (state) => state.admin.verificationModal

export default adminSlice.reducer


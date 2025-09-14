import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { authAPI } from '../../services/api'

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ email, password })
      
      if (rememberMe) {
        // Set cookie for 30 days if "Keep me logged in" is checked
        Cookies.set('authToken', response.data.token, { expires: 30, secure: true, sameSite: 'strict' })
        Cookies.set('refreshToken', response.data.refreshToken, { expires: 30, secure: true, sameSite: 'strict' })
      } else {
        // Session cookie (expires when browser closes)
        Cookies.set('authToken', response.data.token, { secure: true, sameSite: 'strict' })
        Cookies.set('refreshToken', response.data.refreshToken, { secure: true, sameSite: 'strict' })
      }
      
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout()
      Cookies.remove('authToken')
      Cookies.remove('refreshToken')
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = Cookies.get('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      
      const response = await authAPI.refreshToken(refreshToken)
      Cookies.set('authToken', response.data.token, { secure: true, sameSite: 'strict' })
      
      return response.data
    } catch (error) {
      Cookies.remove('authToken')
      Cookies.remove('refreshToken')
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data')
    }
  }
)

const initialState = {
  user: null,
  token: Cookies.get('authToken') || null,
  refreshToken: Cookies.get('refreshToken') || null,
  isAuthenticated: !!Cookies.get('authToken'),
  loading: false,
  error: null,
  rememberMe: false,
  role: null, // 'user', 'seller', 'product-admin', 'super-admin'
  permissions: [],
  lastActivity: null,
  sessionExpiry: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload
    },
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString()
    },
    setSessionExpiry: (state, action) => {
      state.sessionExpiry = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.role = null
      state.permissions = []
      state.error = null
      Cookies.remove('authToken')
      Cookies.remove('refreshToken')
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.role = action.payload.user.role
        state.permissions = action.payload.user.permissions || []
        state.lastActivity = new Date().toISOString()
        state.sessionExpiry = action.payload.expiresAt
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.role = action.payload.user.role
        state.permissions = action.payload.user.permissions || []
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.role = null
        state.permissions = []
        state.loading = false
        state.error = null
      })
      
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.sessionExpiry = action.payload.expiresAt
        state.lastActivity = new Date().toISOString()
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.role = null
        state.permissions = []
      })
      
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.role = action.payload.user.role
        state.permissions = action.payload.user.permissions || []
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.role = null
        state.permissions = []
        Cookies.remove('authToken')
        Cookies.remove('refreshToken')
      })
  },
})

export const {
  clearError,
  setRememberMe,
  updateLastActivity,
  setSessionExpiry,
  clearAuth,
  updateUserProfile,
} = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUserRole = (state) => state.auth.role
export const selectUserPermissions = (state) => state.auth.permissions
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

// Role-based selectors
export const selectIsSuperAdmin = (state) => state.auth.role === 'super-admin'
export const selectIsProductAdmin = (state) => state.auth.role === 'product-admin'
export const selectIsSeller = (state) => state.auth.role === 'seller'
export const selectIsUser = (state) => state.auth.role === 'user'

// Permission-based selectors
export const selectHasPermission = (permission) => (state) => 
  state.auth.permissions?.includes(permission) || false

export default authSlice.reducer


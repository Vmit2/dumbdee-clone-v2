import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  seller: null,
  products: [],
  orders: [],
  loading: false,
  error: null,
  stats: {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  },
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSeller: (state, action) => {
      state.seller = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
      state.stats.totalProducts += 1;
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload);
      state.stats.totalProducts -= 1;
    },
    clearSeller: (state) => {
      state.seller = null;
      state.products = [];
      state.orders = [];
      state.stats = {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setSeller,
  setProducts,
  setOrders,
  setStats,
  addProduct,
  updateProduct,
  removeProduct,
  clearSeller,
} = sellerSlice.actions;

export default sellerSlice.reducer;

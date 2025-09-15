import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  selectedProduct: null,
  searchResults: [],
  filters: {
    category: '',
    priceRange: [0, 1000],
    sortBy: 'name',
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setCategories,
  setSelectedProduct,
  setSearchResults,
  setFilters,
  clearSearchResults,
} = productSlice.actions;

export default productSlice.reducer;

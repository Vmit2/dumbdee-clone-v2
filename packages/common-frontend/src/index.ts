import { configureStore, type ReducersMapObject } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
export { SEASONAL_THEMES, resolveThemeBySeason } from './themes';

export { cartReducer };

export function createAppStore(extraReducers: ReducersMapObject = {}) {
  return configureStore({ reducer: { cart: cartReducer, ...extraReducers } });
}

export type AppStore = ReturnType<typeof createAppStore>;

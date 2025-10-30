import { configureStore, type ReducersMapObject } from '@reduxjs/toolkit';
import cartReducer, { addItem, updateQty, setItems, removeItem, clear, selectItems, selectCartCount, selectSubtotal } from './slices/cartSlice';
export { SEASONAL_THEMES, resolveThemeBySeason } from './themes';

export { cartReducer };
export { addItem, updateQty, setItems, removeItem, clear, selectItems, selectCartCount, selectSubtotal };

export function createAppStore(extraReducers: ReducersMapObject = {}) {
  return configureStore({ reducer: { cart: cartReducer, ...extraReducers } });
}

export type AppStore = ReturnType<typeof createAppStore>;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = { productId: string; variantId?: string; qty: number; price: number; title?: string };

type CartState = { items: CartItem[] };
const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const idx = state.items.findIndex(i => i.productId === item.productId && i.variantId === item.variantId);
      if (idx >= 0) {
        state.items[idx].qty += item.qty || 1;
      } else {
        state.items.push({ ...item, qty: item.qty || 1 });
      }
    },
    updateQty(state, action: PayloadAction<{ productId: string; variantId?: string; qty: number }>) {
      const { productId, variantId, qty } = action.payload;
      const idx = state.items.findIndex(i => i.productId === productId && i.variantId === variantId);
      if (idx >= 0) state.items[idx].qty = Math.max(0, qty);
      state.items = state.items.filter(i => i.qty > 0);
    },
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    removeItem(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      state.items = state.items.filter(i => i.productId !== action.payload.productId || i.variantId !== action.payload.variantId);
    },
    clear(state) { state.items = []; }
  }
});

export const { addItem, updateQty, setItems, removeItem, clear } = cartSlice.actions;
export default cartSlice.reducer;

// selectors
export const selectItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((n, i) => n + (i.qty || 0), 0);
export const selectSubtotal = (state: { cart: CartState }) => state.cart.items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);

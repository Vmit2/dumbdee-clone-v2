import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = { productId: string; variantId?: string; qty: number; price: number; title?: string };

type CartState = { items: CartItem[] };
const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    removeItem(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      state.items = state.items.filter(i => i.productId !== action.payload.productId || i.variantId !== action.payload.variantId);
    },
    clear(state) { state.items = []; }
  }
});

export const { addItem, removeItem, clear } = cartSlice.actions;
export default cartSlice.reducer;

// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // 👈 persist will handle storage
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const idx = state.items.findIndex((i) => i.id === item.id);

      if (idx >= 0) {
        state.items[idx].qty += item.qty || 1;
      } else {
        state.items.push({ ...item, qty: item.qty || 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      if (qty <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        const item = state.items.find((i) => i.id === id);
        if (item) item.qty = qty;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.qty, 0);
export const selectSubtotal = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.qty * Number(i.price || 0), 0);

export default cartSlice.reducer;

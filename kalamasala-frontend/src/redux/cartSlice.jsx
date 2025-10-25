// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axios";

axios.defaults.withCredentials = true;

// --- Async thunks ---
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get("http://localhost:8080/api/cart");
  return res.data;
});

export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity }) => {
  const res = await axios.post("http://localhost:8080/api/cart/items", { productId, quantity });
  return res.data;
});

export const updateCartItem = createAsyncThunk("cart/updateCartItem", async ({ itemId, quantity }) => {
  const res = await axios.patch(`http://localhost:8080/api/cart/items/${itemId}`, { quantity });
  return res.data;
});

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (itemId) => {
  const res = await axios.delete(`http://localhost:8080/api/cart/items/${itemId}`);
  return res.data;
});

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  const res = await axios.delete("http://localhost:8080/api/cart");
  return res.data;
});

// --- Slice ---
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], subtotal: 0, status: "idle" },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.subtotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
      });
  },
});

export const { resetCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.quantity, 0);
export const selectSubtotal = (state) => state.cart.subtotal;

export default cartSlice.reducer;

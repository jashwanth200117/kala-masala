import React, { createContext, useContext, useReducer, useEffect } from "react";

/**
 * Cart item shape:
 * { id: number|string, name: string, price: number, image?: string, qty: number }
 */

// Helpers
const STORAGE_KEY = "km_cart_v1";

const initialState = {
  items: [], // array of cart items
};

// reducer
function cartReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return { ...state, items: action.payload || [] };
    }
    case "ADD_ITEM": {
      const item = action.payload;
      const idx = state.items.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        // increase qty
        const newItems = state.items.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + (item.qty || 1) } : i
        );
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, { ...item, qty: item.qty || 1 }] };
    }
    case "REMOVE_ITEM": {
      const id = action.payload;
      return { ...state, items: state.items.filter(i => i.id !== id) };
    }
    case "UPDATE_QTY": {
      const { id, qty } = action.payload;
      if (qty <= 0) return { ...state, items: state.items.filter(i => i.id !== id) };
      return {
        ...state,
        items: state.items.map(i => (i.id === id ? { ...i, qty } : i)),
      };
    }
    case "CLEAR": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // init from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw);
        dispatch({ type: "INIT", payload: items });
      }
    } catch (e) {
      console.error("Failed to read cart from storage", e);
    }
  }, []);

  // persist on items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [state.items]);

  // actions
  const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQty = (id, qty) => dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalItems = state.items.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = state.items.reduce((acc, i) => acc + i.qty * Number(i.price || 0), 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

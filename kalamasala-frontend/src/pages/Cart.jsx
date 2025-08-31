// src/pages/Cart.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectSubtotal,
  updateQty,
  removeItem,
} from "../redux/cartSlice";
import { Link } from "react-router-dom";

function Cart() {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const dispatch = useDispatch();

  const handleChange = (id, delta) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    dispatch(updateQty({ id, qty: newQty }));
  };

  if (!items.length) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link to="/shop" className="text-accent hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white p-4 rounded shadow-sm"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{item.name}</h3>
                <div className="text-lg font-semibold">
                  ₹{Number(item.price) * item.qty}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => handleChange(item.id, -1)}
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>
                <div className="px-3">{item.qty}</div>
                <button
                  onClick={() => handleChange(item.id, +1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
                <button
                  onClick={() => dispatch(removeItem(item.id))}
                  className="ml-4 text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end items-center gap-6">
        <div className="text-lg font-medium">
          Subtotal: <span className="text-2xl">₹{subtotal}</span>
        </div>
        <Link
          to="/checkout"
          className="bg-accent text-white px-4 py-2 rounded"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;

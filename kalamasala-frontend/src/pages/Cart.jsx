import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectSubtotal,
  fetchCart,
  updateCartItem,
  removeFromCart,
} from "../redux/cartSlice";
import { selectUser } from "../redux/authSlice";
import { Link } from "react-router-dom";

function Cart() {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const user = useSelector(selectUser);
  const hydrated = useSelector((state) => state.auth.hydrated);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchCart()); // ✅ only fetch cart if logged in
    }
  }, [dispatch, user]);

  const handleChange = (itemId, delta) => {
    const item = items.find((i) => i.productId === itemId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartItem({ itemId, quantity: newQty }));
    }
  };

  // 1️⃣ Wait until auth hydration finishes
  if (!hydrated) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  // 2️⃣ If user not logged in
  if (!user) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Please login to view your cart</h2>
        <Link to="/login" className="bg-accent text-white px-4 py-2 rounded hover:opacity-90">
          Go to Login
        </Link>
      </div>
    );
  }

  // 3️⃣ If logged in but cart empty
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

  // 4️⃣ If logged in & cart has items
  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
            <img src={item.imageUrl} alt={item.productName} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{item.productName}</h3>
                <div className="text-lg font-semibold">₹{Number(item.unitPrice) * item.quantity}</div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => handleChange(item.productId, -1)} className="px-3 py-1 border rounded">-</button>
                <div className="px-3">{item.quantity}</div>
                <button onClick={() => handleChange(item.productId, +1)} className="px-3 py-1 border rounded">+</button>
                <button onClick={() => dispatch(removeFromCart(item.productId))} className="ml-4 text-sm text-red-600">
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
        <Link to="/checkout" className="bg-accent text-white px-4 py-2 rounded">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;

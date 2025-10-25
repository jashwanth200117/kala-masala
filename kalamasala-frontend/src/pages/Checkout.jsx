// src/pages/CheckoutPage.jsx
import React, { useState } from "react";

const CheckoutPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Create order on backend (which will call Razorpay Orders API)
    const res = await fetch("http://localhost:8080/api/payments/create-order", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!data.orderId) {
      alert("Failed to create order");
      return;
    }

    // 2️⃣ Open Razorpay payment modal
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Karamasala Store",
      description: "Order Payment",
      order_id: data.orderId,

      //This function is called after the user successfully completes the payment in the Razorpay modal.
      handler: async function (response) {
        // 3️⃣ Verify payment on backend
        const verifyRes = await fetch("http://localhost:8080/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
          credentials: "include",
        });

        if (verifyRes.ok) {
          alert("Payment successful!");
          window.location.href = "/orders";
        } else {
          alert("Payment verification failed.");
        }
      },

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow rounded mt-8">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="border p-2 w-full" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 w-full" required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 w-full" required />
        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Pay Now</button>
      </form>
    </div>
  );
};

export default CheckoutPage;

import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just simulate success (no backend)
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <section className="bg-gradient-to-r from-yellow-50 to-orange-50 py-12 mt-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h4 className="text-2xl font-semibold">Join the KalaMasala family</h4>
        <p className="mt-2 text-gray-700">Get new recipes, launches and exclusive discounts — straight to your inbox.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-3 max-w-md mx-auto">
          <input

            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Email address"
          />
          <button type="submit" className="px-5 py-3 bg-accent text-white rounded-md">Subscribe</button>
        </form>

        {done && <div className="mt-4 text-sm text-green-600">Thanks — you’re subscribed!</div>}
      </div>
    </section>
  );
}

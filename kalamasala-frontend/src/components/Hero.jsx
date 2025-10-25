import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left - text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Kala Masala — <span className="text-accent">Authentic</span> taste,
            made in small batches
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Hand-roasted spices, balanced blends, and no added preservatives —
            our Kala Masala brings the traditional flavours of Maharashtra
            straight to your kitchen. Perfect for curries, gravies and everyday
            cooking.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-md shadow hover:opacity-80"
            >
              Shop Now
            </Link>

            <Link to="/about" className="text-sm text-gray-700 hover:underline">
              Learn More
            </Link>
          </div>

          {/* trust badges */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                ✓
              </div>
              <div className="text-sm text-gray-700">No preservatives</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                🌿
              </div>
              <div className="text-sm text-gray-700">Locally sourced</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                🚚
              </div>
              <div className="text-sm text-gray-700">Fast delivery</div>
            </div>
          </div>
        </div>

        {/* Right - static image */}
        <div className="relative">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg">
            <img
              src="/images/hero-banner.png" // 👈 static image path
              alt="Kala Masala Banner"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Decorative badge */}
          <div className="absolute -bottom-4 left-6 bg-white border rounded-lg px-4 py-2 shadow flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
              KM
            </div>
            <div>
              <div className="text-xs text-gray-500">Small batch</div>
              <div className="text-sm font-semibold">roasted weekly</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

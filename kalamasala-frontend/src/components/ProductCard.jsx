import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    // add quantity 1 by default
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price), // ensure numeric
      image: product.image,
      qty: 1
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="h-56 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.short ?? ""}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">₹{product.price}</div>
          <button onClick={handleAdd} className="text-sm bg-accent text-white px-3 py-1 rounded-md hover:opacity-90">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

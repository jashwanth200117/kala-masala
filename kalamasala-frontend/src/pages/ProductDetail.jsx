import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.imageUrl, // backend sends this
        qty,
      })
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
      </div>

      <div>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-xl text-gray-900 mt-3">₹{product.price}</p>
        <p className="text-gray-700 mt-4">{product.description}</p>

        <div className="mt-6">
          <label className="block mb-1 text-sm font-medium">Quantity</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <div>{qty}</div>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
            <button
              onClick={handleAddToCart}
              className="ml-auto bg-accent text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

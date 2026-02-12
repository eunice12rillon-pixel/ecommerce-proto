import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import BackButton from "../components/BackButton";
import { readCart, writeCart } from "../utils/cartStorage";
import { logCartEvent } from "../utils/cartEvents";

export default function ProductView({ products = [], user }) {
  const { id } = useParams();
  const { showToast } = useToast();
  const productById = products.find((p) => String(p.id) === id);
  const legacyIndex = Number.parseInt(id, 10);
  const productByIndex = Number.isNaN(legacyIndex) ? null : products[legacyIndex];
  const product = productById ?? productByIndex;
  const [quantity, setQuantity] = useState(1);

  if (!product) return <p className="text-gray-500 p-6">Product not found.</p>;

  const handleAddToCart = () => {
    const cart = readCart(user);
    const existing = cart.find((p) => p.id === product.id);
    const previousQuantity = existing ? Number(existing.quantity || 1) : 0;

    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, quantity });
    writeCart(user, cart);
    logCartEvent({
      user,
      productId: product.id,
      eventType: "add",
      quantity,
      previousQuantity,
    });

    showToast(`${product.name} successfully added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <BackButton fallbackTo="/products" label="Back" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-2xl shadow-md"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-2xl font-bold">
            ₱{product.price.toLocaleString()}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <span className="font-medium">Quantity:</span>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition"
            >
              -
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Suggested Products */}
      {products.length > 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${encodeURIComponent(p.id)}`}
                  className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition flex flex-col"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-xl mb-2"
                  />
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-gray-600 text-sm">{p.description}</p>
                  <p className="font-bold mt-2">₱{p.price.toLocaleString()}</p>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "./ToastContext";

export default function ProductsGrid({ products = [] }) {
  const { showToast } = useToast();

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex !== -1) cart[existingIndex].quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));

    showToast(`${product.name} successfully added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Products</h2>
        <p className="text-gray-600 mt-1">Products Recommended for Beginners</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const hoverColors = [
            "hover:border-red-400 hover:bg-red-50",
            "hover:border-blue-400 hover:bg-blue-50",
            "hover:border-green-400 hover:bg-green-50",
            "hover:border-purple-400 hover:bg-purple-50",
            "hover:border-yellow-400 hover:bg-yellow-50",
            "hover:border-pink-400 hover:bg-pink-50",
            "hover:border-teal-400 hover:bg-teal-50",
            "hover:border-orange-400 hover:bg-orange-50",
          ];
          const randomHover = hoverColors[index % hoverColors.length];

          return (
            <div
              key={product.id ?? index}
              className={`bg-white shadow-md rounded-lg p-4 transition-all duration-200 flex flex-col border border-transparent ${randomHover}`}
            >
              <Link
                to={`/products/${encodeURIComponent(product.id)}`}
                className="flex-1"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="mb-2 w-full h-40 object-cover rounded"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="font-bold mt-2 text-lg">
                  ₱{product.price.toLocaleString()}
                </p>
              </Link>

              <button
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/products"
          className="inline-block px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 transition"
        >
          See All Products
        </Link>
      </div>
    </div>
  );
}

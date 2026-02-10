import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function ProductsPage({ products = [] }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryFilter = params.get("category");

  const filteredProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {categoryFilter ? categoryFilter : "All Products"}
      </h1>

      {filteredProducts.length === 0 && (
        <p className="text-gray-500">No products found in this category.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => (
          <Link
            to={`/products/${idx}`}
            key={idx}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="mb-2 w-full h-40 object-cover rounded"
            />

            <h3 className="font-semibold">{product.name}</h3>

            <p className="text-gray-600 text-sm">
              {product.description}
            </p>

            <p className="font-bold mt-2 text-lg">
              ₱{product.price.toLocaleString()}
            </p>

            <button
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={(e) => {
                e.preventDefault();
                alert(`${product.name} added to cart!`);
              }}
            >
              Add to Cart
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

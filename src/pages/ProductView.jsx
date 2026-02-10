import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductView({ products }) {
  const { id } = useParams();

  const product = products[id];

  const [qty, setQty] = useState(1);

  if (!product) {
    return <p className="p-6">Product not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded shadow"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <p className="mt-4 text-2xl font-semibold">
          ₱{product.price.toLocaleString()}
        </p>

        <div className="mt-4">
          <label className="block mb-2">Quantity</label>

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="border p-2 w-24"
          />
        </div>

        <button
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() =>
            alert(`Added ${qty} item(s) of ${product.name} to cart!`)
          }
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

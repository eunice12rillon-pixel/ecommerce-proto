// src/components/AddProductForm.jsx
import React, { useState } from "react";

export default function AddProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !price) return;

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      image: image || "/default-product.jpg", // default image kung walang nilagay
    };

    onAdd(newProduct);

    // clear form
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold text-brown-700 mb-2">Add New Product</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-brown-500 focus:border-brown-500"
          placeholder="Enter product name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-brown-500 focus:border-brown-500"
          placeholder="Enter product description"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-brown-500 focus:border-brown-500"
          placeholder="Enter price"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-brown-500 focus:border-brown-500"
          placeholder="Optional image URL"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-brown-700 text-white py-2 rounded hover:bg-brown-800 transition"
      >
        Add Product
      </button>
    </form>
  );
}

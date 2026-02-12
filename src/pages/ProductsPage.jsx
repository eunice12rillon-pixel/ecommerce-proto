import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import BackButton from "../components/BackButton";
import { readCart, writeCart } from "../utils/cartStorage";
import { logCartEvent } from "../utils/cartEvents";

export default function ProductsPage({ products = [], user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const categories = [
    "All",
    "Watercolor, acrylic, oil paints & brushes",
    "Canvases & Paper",
    "Beads & Jewelry Making",
    "Wood & Carving Tools",
    "Eco-friendly Materials",
    "Craft Kits",
    "Handwoven Items",
    "Furniture & Decor",
  ];

  const params = new URLSearchParams(location.search);
  const categoryFilter = params.get("category") || "All";
  const priceFilter = params.get("price") || "All";
  const searchFilter = params.get("search") || "";

  const updateFilterParams = (updates) => {
    const nextParams = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      const normalizedValue = typeof value === "string" ? value.trim() : value;

      if (!normalizedValue || normalizedValue === "All") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, normalizedValue);
      }
    });

    navigate({ search: nextParams.toString() }, { replace: true });
  };

  let filteredProducts = [...products];

  if (categoryFilter !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === categoryFilter,
    );
  }

  if (priceFilter !== "All") {
    if (priceFilter === "Low") {
      filteredProducts = filteredProducts.filter((p) => p.price < 500);
    }
    if (priceFilter === "Medium") {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= 500 && p.price < 1500,
      );
    }
    if (priceFilter === "High") {
      filteredProducts = filteredProducts.filter((p) => p.price >= 1500);
    }
  }

  const normalizedSearch = searchFilter.trim().toLowerCase();
  if (normalizedSearch) {
    filteredProducts = filteredProducts.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";

      return (
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        category.includes(normalizedSearch)
      );
    });
  }

  const handleAddToCart = (product) => {
    const cart = readCart(user);
    const existing = cart.find((p) => p.id === product.id);
    const previousQuantity = existing ? Number(existing.quantity || 1) : 0;

    if (existing) existing.quantity = (existing.quantity || 1) + 1;
    else cart.push({ ...product, quantity: 1 });
    writeCart(user, cart);
    logCartEvent({
      user,
      productId: product.id,
      eventType: "add",
      quantity: 1,
      previousQuantity,
    });

    showToast(`${product.name} successfully added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-3">
        <BackButton fallbackTo="/" label="Back" />
      </div>
      <h1 className="text-3xl font-bold mb-4">All Products</h1>

      <div className="mb-6 border border-gray-200 rounded-xl p-4 bg-white/90">
        <h2 className="font-semibold mb-3">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => updateFilterParams({ category: e.target.value })}
              className="w-full border border-gray-300 rounded px-2 py-2"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <select
              value={priceFilter}
              onChange={(e) => updateFilterParams({ price: e.target.value })}
              className="w-full border border-gray-300 rounded px-2 py-2"
            >
              <option value="All">All Prices</option>
              <option value="Low">₱0 - ₱499</option>
              <option value="Medium">₱500 - ₱1499</option>
              <option value="High">₱1500+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map((product, idx) => {
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
            const randomHover = hoverColors[idx % hoverColors.length];

            return (
              <div
                key={product.id ?? idx}
                className={`bg-white shadow-md rounded-lg p-4 flex flex-col border border-transparent ${randomHover}`}
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
          })
        )}
      </div>
    </div>
  );
}

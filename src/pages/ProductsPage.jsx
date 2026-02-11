import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/ToastContext";

export default function ProductsPage({ products = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(products);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const price = params.get("price");
    setCategoryFilter(category || "All");
    setPriceFilter(price || "All");
  }, [location.search]);

  useEffect(() => {
    let tempProducts = [...products];

    if (categoryFilter !== "All")
      tempProducts = tempProducts.filter((p) => p.category === categoryFilter);

    if (priceFilter !== "All") {
      if (priceFilter === "Low")
        tempProducts = tempProducts.filter((p) => p.price < 500);
      if (priceFilter === "Medium")
        tempProducts = tempProducts.filter(
          (p) => p.price >= 500 && p.price < 1500,
        );
      if (priceFilter === "High")
        tempProducts = tempProducts.filter((p) => p.price >= 1500);
    }

    setFilteredProducts(tempProducts);

    const searchParams = new URLSearchParams();
    if (categoryFilter !== "All") searchParams.set("category", categoryFilter);
    if (priceFilter !== "All") searchParams.set("price", priceFilter);
    navigate({ search: searchParams.toString() }, { replace: true });
  }, [categoryFilter, priceFilter, products, navigate]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((p) => p.id === product.id);
    if (existing) existing.quantity = (existing.quantity || 1) + 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));

    showToast(`${product.name} successfully added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Products</h1>
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="flex-shrink-0 w-64 border border-gray-200 rounded p-4">
          <h2 className="font-semibold mb-2">Filters</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
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
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="All">All Prices</option>
              <option value="Low">₱0 - ₱499</option>
              <option value="Medium">₱500 - ₱1499</option>
              <option value="High">₱1500+</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  key={idx}
                  className={`bg-white shadow-md rounded-lg p-4 flex flex-col border border-transparent ${randomHover}`}
                >
                  <Link to={`/products/${idx}`} className="flex-1">
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
    </div>
  );
}

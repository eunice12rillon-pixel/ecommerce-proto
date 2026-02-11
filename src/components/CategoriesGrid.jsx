import React from "react";
import { Link } from "react-router-dom";
import {
  FaPaintBrush,
  FaPalette,
  FaGem,
  FaCube,
  FaLeaf,
  FaBasketballBall,
  FaCouch,
  FaPaperPlane,
} from "react-icons/fa";

const categories = [
  {
    title: "Paints & Brushes",
    category: "Watercolor, acrylic, oil paints & brushes",
    icon: <FaPaintBrush size={30} />,
    hoverBg: "hover:bg-yellow-100",
    hoverText: "hover:text-yellow-800",
  },
  {
    title: "Canvases & Paper",
    category: "Canvases & Paper",
    icon: <FaPalette size={30} />,
    hoverBg: "hover:bg-orange-100",
    hoverText: "hover:text-orange-800",
  },
  {
    title: "Beads & Jewelry Making",
    category: "Beads & Jewelry Making",
    icon: <FaGem size={30} />,
    hoverBg: "hover:bg-pink-100",
    hoverText: "hover:text-pink-800",
  },
  {
    title: "Wood & Carving Tools",
    category: "Wood & Carving Tools",
    icon: <FaCube size={30} />,
    hoverBg: "hover:bg-green-100",
    hoverText: "hover:text-green-800",
  },
  {
    title: "Eco-friendly Materials",
    category: "Eco-friendly Materials",
    icon: <FaLeaf size={30} />,
    hoverBg: "hover:bg-teal-100",
    hoverText: "hover:text-teal-800",
  },
  {
    title: "Craft Kits",
    category: "Craft Kits",
    icon: <FaPaperPlane size={30} />,
    hoverBg: "hover:bg-purple-100",
    hoverText: "hover:text-purple-800",
  },
  {
    title: "Handwoven Items",
    category: "Handwoven Items",
    icon: <FaBasketballBall size={30} />,
    hoverBg: "hover:bg-blue-100",
    hoverText: "hover:text-blue-800",
  },
  {
    title: "Furniture & Decor",
    category: "Furniture & Decor",
    icon: <FaCouch size={30} />,
    hoverBg: "hover:bg-red-100",
    hoverText: "hover:text-red-800",
  },
];

export default function CategoriesGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 my-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Explore Our Art Supplies & Handmade Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            to={`/products?category=${encodeURIComponent(cat.category)}`}
            className={`bg-white shadow-md rounded-lg flex flex-col items-center p-4 cursor-pointer transition-all duration-300
                        hover:shadow-xl hover:scale-105 focus:outline-none ${cat.hoverBg} ${cat.hoverText}`}
          >
            <div className="mb-3 text-brown-700">{cat.icon}</div>
            <h3 className="text-lg font-medium mb-1 text-center">
              {cat.title}
            </h3>
            <p className="text-gray-600 text-sm text-center">{cat.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

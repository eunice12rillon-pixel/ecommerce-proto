// src/components/HowToBuy.jsx
import React from "react";
import { FaBoxOpen, FaShoppingCart, FaHome, FaTruck } from "react-icons/fa";

export default function HowToBuy() {
  const steps = [
    {
      icon: <FaShoppingCart className="text-4xl text-white" />,
      title: "Select an Art Supply",
      description:
        "Choose from our wide range of Filipino-made art supplies, from brushes to handwoven materials.",
    },
    {
      icon: <FaHome className="text-4xl text-white" />,
      title: "View in Use",
      description:
        "Visualize how each art supply fits into your creative setup or workspace.",
    },
    {
      icon: <FaBoxOpen className="text-4xl text-white" />,
      title: "Place Your Order",
      description:
        "Order your selected supplies securely online, choosing the quantities you need.",
    },
    {
      icon: <FaTruck className="text-4xl text-white" />,
      title: "Have it Delivered",
      description:
        "Track your delivery and receive your art supplies safely at your doorstep.",
    },
  ];

  return (
    <div
      className="w-full h-64 relative flex items-center"
      style={{
        backgroundImage: "url('public/artsup1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 w-full text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">How to Buy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center p-4">
              <div className="mb-2">{step.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

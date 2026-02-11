// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import {
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiBarChart2,
  FiSettings,
  FiMessageCircle,
  FiBell,
  FiShield,
  FiCalendar,
  FiHome,
} from "react-icons/fi";

export default function AdminPage({user,role}) {

  const navigate = useNavigate();

   useEffect(() => {
     if (!user || role !== "admin") {
       navigate("/", { replace: true }); // Redirect non-admins to home
     }
   }, [user, role, navigate]);

    if (!user || role !== "admin") {
      return null;
    }

   

  const sections = [
    {
      key: "overview",
      label: "Overview",
      icon: <FiHome size={24} />,
      hoverColor: "hover:bg-yellow-200 hover:text-white",
      description: "Quick summary of metrics, sales, and notifications",
    },
    {
      key: "products",
      label: "Product Management",
      icon: <FiBox size={24} />,
      hoverColor: "hover:bg-green-200 hover:text-white",
      description: "Manage products, categories, inventory",
      
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <FiBarChart2 size={24} />,
      hoverColor: "hover:bg-blue-200 hover:text-white",
      description: "Sales trends, user activity, traffic reports",
    },
    {
      key: "orders",
      label: "Orders",
      icon: <FiShoppingCart size={24} />,
      hoverColor: "hover:bg-purple-200 hover:text-white",
      description: "Track orders, payments, shipping status",
    },
    {
      key: "messages",
      label: "Messages",
      icon: <FiMessageCircle size={24} />,
      hoverColor: "hover:bg-pink-200 hover:text-white",
      description: "Customer messages and support tickets",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <FiBell size={24} />,
      hoverColor: "hover:bg-yellow-300 hover:text-white",
      description: "Alerts, low inventory, system notifications",
    },
  ];

  const [activeSection, setActiveSection] = useState("overview");

  const renderContent = () => {
    const section = sections.find((s) => s.key === activeSection);
    return (
      <div className="p-4 bg-white rounded shadow mt-4">
        <h2 className="text-lg font-semibold mb-2">{section.label}</h2>
        <p className="text-gray-700 text-sm">{section.description}</p>
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-brown-700">
          Admin Dashboard
        </h1>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sections.map((section) => (
            <button
              key={section.key}
              className={`flex flex-col items-center justify-center p-4 rounded text-gray-800 bg-transparent border border-white/0 transition transform hover:scale-105 shadow-none ${section.hoverColor}`}
              onClick={() => setActiveSection(section.key)}
            >
              <div className="mb-2">{section.icon}</div>
              <span className="text-sm font-medium text-center">
                {section.label}
              </span>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        {renderContent()}

      </div>
    </PageWrapper>
  );
}

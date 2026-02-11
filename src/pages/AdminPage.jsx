// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { supabase } from "../utils/supabase";
import {
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiBarChart2,
  FiMessageCircle,
  FiBell,
  FiHome,
} from "react-icons/fi";

export default function AdminPage({ user, role }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || role !== "admin") {
      navigate("/", { replace: true });
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

  // 🔥 PRODUCT STATES
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });

  // 🔥 FETCH PRODUCTS (ONLY WHEN PRODUCT TAB ACTIVE)
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts(data);
  };

  useEffect(() => {
    if (activeSection === "products") {
      fetchProducts();
    }
  }, [activeSection]);

  // 🔥 FORM HANDLERS
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await supabase
        .from("products")
        .update({
          ...formData,
          price: Number(formData.price),
        })
        .eq("id", editingId);

      setEditingId(null);
    } else {
      await supabase.from("products").insert([
        {
          ...formData,
          price: Number(formData.price),
        },
      ]);
    }

    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      image: "",
    });

    fetchProducts();
  };

  const handleDelete = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
  };

  // 🔥 RENDER SECTION CONTENT
  const renderContent = () => {
    if (activeSection === "products") {
      return (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-4">Product Management</h2>

          {/* ADD / EDIT FORM */}
          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full border p-2 rounded"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border p-2 rounded"
              required
            />

            <button className="bg-black text-white px-6 py-2 rounded">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </form>

          {/* PRODUCT TABLE */}
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t text-center">
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 mx-auto"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>₱{product.price}</td>
                  <td>{product.category}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

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

        {renderContent()}
      </div>
    </PageWrapper>
  );
}

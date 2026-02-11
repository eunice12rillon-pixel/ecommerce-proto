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

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Analytics States
  const [popularProducts, setPopularProducts] = useState([]);
  const [cartEvents, setCartEvents] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [cartAnalytics, setCartAnalytics] = useState([]);
  const [mostAddedToCart, setMostAddedToCart] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image_url: "",
  });

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts(data);
  };

  // Fetch Analytics Data
  const fetchAnalytics = async () => {
    // Fetch Popular Products
    const { data: popularData } = await supabase
      .from("popular_products")
      .select("*")
      .order("times_ordered", { ascending: false })
      .limit(10);
    if (popularData) setPopularProducts(popularData);

    // Fetch Cart Events
    const { data: eventsData } = await supabase
      .from("cart_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (eventsData) setCartEvents(eventsData);

    // Fetch Daily Sales
    const { data: salesData } = await supabase
      .from("daily_sales")
      .select("*")
      .order("date", { ascending: false })
      .limit(30);
    if (salesData) setDailySales(salesData);

    // Fetch Cart Analytics
    const { data: analyticsData } = await supabase
      .from("cart_analytics")
      .select("*")
      .order("date", { ascending: false })
      .limit(30);
    if (analyticsData) setCartAnalytics(analyticsData);

    // Fetch Most Added to Cart
    const { data: mostAddedData } = await supabase
      .from("most_added_to_cart")
      .select("*")
      .order("times_added", { ascending: false })
      .limit(10);
    if (mostAddedData) setMostAddedToCart(mostAddedData);

    // Fetch Product Variants
    const { data: variantsData } = await supabase
      .from("product_variants")
      .select("*")
      .order("name", { ascending: true });
    if (variantsData) setProductVariants(variantsData);
  };

  useEffect(() => {
    if (activeSection === "products") {
      fetchProducts();
    } else if (activeSection === "analytics") {
      fetchAnalytics();
    }
  }, [activeSection]);

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
      image_url: "",
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
              name="image_url"
              value={formData.image_url}
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

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Stock</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No products found. Add your first product above!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </td>
                      <td className="p-2">{product.category}</td>
                      <td className="p-2 text-right">
                        ₱{product.price.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        <span
                          className={
                            product.stock < 10 ? "text-red-600 font-medium" : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (activeSection === "analytics") {
      return (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>

          {/* MOST ORDERED PRODUCTS */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">
              📊 Most Ordered Products (Popular Products)
            </h3>
            {popularProducts.length === 0 ? (
              <p className="text-gray-500">No data available yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="p-2 text-left">Product Name</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-right">Times Ordered</th>
                      <th className="p-2 text-right">Total Quantity Sold</th>
                      <th className="p-2 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularProducts.map((product, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.category}</td>
                        <td className="p-2 text-right">{product.times_ordered}</td>
                        <td className="p-2 text-right">{product.total_quantity_sold}</td>
                        <td className="p-2 text-right">
                          ₱{Number(product.total_revenue || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          

          {/* DAILY SALES */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-green-700">
              💰 Daily Sales (Last 30 Days)
            </h3>
            {dailySales.length === 0 ? (
              <p className="text-gray-500">No sales data available yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-right">Total Orders</th>
                      <th className="p-2 text-right">Total Revenue</th>
                      <th className="p-2 text-right">Average Order Value</th>
                      <th className="p-2 text-right">Unique Customers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySales.map((sale, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-2">{new Date(sale.date).toLocaleDateString()}</td>
                        <td className="p-2 text-right">{sale.total_orders}</td>
                        <td className="p-2 text-right">
                          ₱{Number(sale.total_revenue || 0).toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          ₱{Number(sale.average_order_value || 0).toLocaleString()}
                        </td>
                        <td className="p-2 text-right">{sale.unique_customers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CART ANALYTICS */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">
              🛒 Cart Analytics (Last 30 Days)
            </h3>
            {cartAnalytics.length === 0 ? (
              <p className="text-gray-500">No cart analytics available yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-right">Users with Cart</th>
                      <th className="p-2 text-right">Total Cart Items</th>
                      <th className="p-2 text-right">Avg Cart Items/User</th>
                      <th className="p-2 text-right">Avg Cart Quantity/User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartAnalytics.map((analytics, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-2">{new Date(analytics.date).toLocaleDateString()}</td>
                        <td className="p-2 text-right">{analytics.users_with_cart}</td>
                        <td className="p-2 text-right">{analytics.total_cart_items}</td>
                        <td className="p-2 text-right">
                          {Number(analytics.avg_quantity_per_item || 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-right">
                          {Number(analytics.avg_quantity_per_item || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* MOST ADDED TO CART */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-orange-700">
              🛍️ Most Added to Cart
            </h3>
            {mostAddedToCart.length === 0 ? (
              <p className="text-gray-500">No data available yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="p-2 text-left">Product Name</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-right">Times Added</th>
                      <th className="p-2 text-right">Total Quantity Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mostAddedToCart.map((item, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.category}</td>
                        <td className="p-2 text-right">{item.times_added}</td>
                        <td className="p-2 text-right">{item.total_quantity_added}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CART EVENTS */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-pink-700">
              📝 Recent Cart Events (Last 50)
            </h3>
            {cartEvents.length === 0 ? (
              <p className="text-gray-500">No cart events recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-pink-100">
                      <th className="p-2 text-left">User ID</th>
                      <th className="p-2 text-left">Product ID</th>
                      <th className="p-2 text-left">Variant ID</th>
                      <th className="p-2 text-left">Event Type</th>
                      <th className="p-2 text-right">Quantity</th>
                      <th className="p-2 text-right">Previous Quantity</th>
                      <th className="p-2 text-left">Session ID</th>
                      <th className="p-2 text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartEvents.map((event, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-2 text-xs">{event.user_id?.substring(0, 8)}...</td>
                        <td className="p-2 text-xs">{event.product_id?.substring(0, 8)}...</td>
                        <td className="p-2 text-xs">{event.variant_id?.substring(0, 8) || 'N/A'}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            event.event_type === 'add' ? 'bg-green-200' :
                            event.event_type === 'remove' ? 'bg-red-200' :
                            'bg-yellow-200'
                          }`}>
                            {event.event_type}
                          </span>
                        </td>
                        <td className="p-2 text-right">{event.quantity}</td>
                        <td className="p-2 text-right">{event.previous_quantity || 0}</td>
                        <td className="p-2 text-xs">{event.session_id?.substring(0, 8)}...</td>
                        <td className="p-2 text-xs">
                          {new Date(event.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PRODUCT VARIANTS / STOCK */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-teal-700">
              📦 Product Variants & Stock Levels
            </h3>
            {productVariants.length === 0 ? (
              <p className="text-gray-500">No product variants found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-teal-100">
                      <th className="p-2 text-left">Product Name</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Variant</th>
                      <th className="p-2 text-right">Stock</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productVariants.map((variant, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-2">{variant.name}</td>
                        <td className="p-2">{variant.category}</td>
                        <td className="p-2 text-xs text-gray-600">
                          {variant.variant_id?.substring(0, 12)}...
                        </td>
                        <td className="p-2 text-right font-semibold">
                          {variant.stock || 0}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            variant.stock > 20 ? 'bg-green-200 text-green-800' :
                            variant.stock > 5 ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {variant.stock > 20 ? 'In Stock' :
                             variant.stock > 5 ? 'Low Stock' :
                             'Critical'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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

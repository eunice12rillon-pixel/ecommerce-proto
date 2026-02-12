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

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  // Messages State (dummy data)
  const [messages] = useState([
    {
      id: 1,
      customer: "John Doe",
      email: "john@example.com",
      subject: "Question about product",
      preview: "Hi, I wanted to ask about the shipping time for...",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: true,
    },
    {
      id: 2,
      customer: "Jane Smith",
      email: "jane@example.com",
      subject: "Order issue",
      preview: "My order #1234 hasn't arrived yet. Can you...",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      unread: true,
    },
    {
      id: 3,
      customer: "Bob Johnson",
      email: "bob@example.com",
      subject: "Product feedback",
      preview: "Just wanted to say the quality is amazing! Will...",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
    },
    {
      id: 4,
      customer: "Alice Brown",
      email: "alice@example.com",
      subject: "Return request",
      preview: "I would like to return item #5678 because...",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      unread: false,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image_url: "",
    stock: "",
  });

  // Category options from CategoriesGrid
  const categoryOptions = [
    "Paints & Brushes",
    "Canvases & Paper",
    "Beads & Jewelry Making",
    "Wood & Carving Tools",
    "Eco-friendly Materials",
    "Craft Kits",
    "Handwoven Items",
    "Furniture & Decor",
  ];

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);

    // Fetch order items (checkouts) with product details
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select(
        `
        *,
        products (
          name,
          image_url,
          category
        ),
        orders (
          created_at,
          total,
          user_id
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (!itemsError) setOrderItems(itemsData || []);
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
    } else if (activeSection === "orders") {
      fetchOrders();
      fetchProducts();
    } else if (activeSection === "overview") {
      fetchProducts();
      fetchOrders();
    } else if (activeSection === "notifications") {
      fetchProducts();
    }
  }, [activeSection]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      image_url: formData.image_url,
      stock: Number(formData.stock),
    };

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating product:", error);
        alert("Error updating product: " + error.message);
      } else {
        alert("Product updated successfully!");
        setEditingId(null);
      }
    } else {
      const { error } = await supabase.from("products").insert([productData]);

      if (error) {
        console.error("Error adding product:", error);
        alert("Error adding product: " + error.message);
      } else {
        alert("Product added successfully!");
      }
    }

    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      image_url: "",
      stock: "",
    });

    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product: " + error.message);
    } else {
      alert("Product deleted successfully!");
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      image_url: product.image_url,
      stock: product.stock.toString(),
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get low stock products
  const getLowStockProducts = () => {
    return products.filter((p) => p.stock < 10);
  };

  const renderContent = () => {
    // OVERVIEW SECTION
    if (activeSection === "overview") {
      const totalProducts = products.length;
      const lowStockCount = getLowStockProducts().length;
      const totalOrders = orders.length;
      const unreadMessages = messages.filter((m) => m.unread).length;

      return (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-4">Dashboard Overview</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Total Products</h3>
              <p className="text-2xl font-bold text-blue-700">
                {totalProducts}
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Low Stock Items</h3>
              <p className="text-2xl font-bold text-red-700">{lowStockCount}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Total Orders</h3>
              <p className="text-2xl font-bold text-green-700">{totalOrders}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Unread Messages</h3>
              <p className="text-2xl font-bold text-yellow-700">
                {unreadMessages}
              </p>
            </div>
          </div>

          {/* Quick Add Product Form */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Quick Add Product</h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-3 p-4 bg-gray-50 rounded"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full border p-2 rounded"
                  required
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price "
                  className="w-full border p-2 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock Quantity"
                  className="w-full border p-2 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                  min="0"
                />

                <input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="Image URL"
                  className="w-full border p-2 rounded"
                  required
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                  rows="1"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      category: "",
                      price: "",
                      image_url: "",
                      stock: "",
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 ml-2"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {getLowStockProducts().length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-sm text-red-700">
                    ⚠️ {getLowStockProducts().length} product(s) are running low
                    on stock
                  </p>
                </div>
              )}
              {unreadMessages > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <p className="text-sm text-yellow-700">
                    📧 You have {unreadMessages} unread message(s)
                  </p>
                </div>
              )}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-sm text-blue-700">
                  ✅ System is running smoothly
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PRODUCTS SECTION
    if (activeSection === "products") {
      return (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-4">Product Management</h2>

          {/* ADD / EDIT FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3 mb-6 p-4 bg-gray-50 rounded"
          >
            <h3 className="font-medium text-gray-700">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>

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
              rows="3"
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border p-2 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />

            <input
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Image URL (e.g., /pro1.jpg or https://...)"
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock Quantity"
              className="w-full border p-2 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
              min="0"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      category: "",
                      price: "",
                      image_url: "",
                      stock: "",
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
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

    // ORDERS SECTION - Track Checkouts
    if (activeSection === "orders") {
      return (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-4">Orders & Checkouts</h2>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Total Orders</h3>
              <p className="text-2xl font-bold text-purple-700">
                {orders.length}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Total Items Sold</h3>
              <p className="text-2xl font-bold text-green-700">
                {orderItems.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0,
                )}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Total Revenue</h3>
              <p className="text-2xl font-bold text-blue-700">
                ₱
                {orders
                  .reduce((sum, order) => sum + Number(order.total || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>

          {/* Checkouts Table */}
          <h3 className="text-md font-semibold mb-3">Recent Checkouts</h3>
          {orderItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No checkouts found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Subtotal</th>
                    <th className="p-2 text-left">Customer</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">
                        {(item.products?.image_url || item.product_image_url) && (
                          <img
                            src={item.products?.image_url || item.product_image_url}
                            alt={item.products?.name || item.product_name || "Product"}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                        )}
                      </td>
                      <td className="p-2">
                        <div className="font-medium">
                          {item.products?.name || item.product_name || "Unknown Product"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Order: {item.order_id?.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="p-2">
                        {item.products?.category || item.product_category || "N/A"}
                      </td>
                      <td className="p-2 text-right font-medium">
                        {item.quantity}
                      </td>
                      <td className="p-2 text-right">
                        ₱{Number(item.price).toFixed(2)}
                      </td>
                      <td className="p-2 text-right font-semibold">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-2 text-xs">
                        {item.orders?.user_id?.substring(0, 8)}...
                      </td>
                      <td className="p-2 text-xs">
                        {item.orders?.created_at
                          ? new Date(item.orders.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders Summary */}
          <h3 className="text-md font-semibold mb-3 mt-8">Orders Summary</h3>
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No orders found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Order ID</th>
                    <th className="p-2 text-left">Customer</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-right">Total</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 text-xs font-mono">
                        {order.id?.substring(0, 8)}...
                      </td>
                      <td className="p-2 text-xs">
                        {order.user_id?.substring(0, 8)}...
                      </td>
                      <td className="p-2 text-xs">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-right font-semibold">
                        ₱{Number(order.total || 0).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-1 rounded text-xs bg-green-200 text-green-800">
                          {order.status || "Completed"}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2 justify-center">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    // MESSAGES SECTION
    if (activeSection === "messages") {
      return (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-4">Customer Messages</h2>

          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${
                  message.unread
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200"
                } hover:shadow-md transition`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {message.customer}
                      {message.unread && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded">
                          New
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500">{message.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {message.date.toLocaleString()}
                  </span>
                </div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">
                  {message.subject}
                </h4>
                <p className="text-sm text-gray-600">{message.preview}</p>
                <div className="mt-3 flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                    Reply
                  </button>
                  <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-400">
                    Mark as Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // NOTIFICATIONS SECTION
    if (activeSection === "notifications") {
      const lowStockProducts = getLowStockProducts();

      return (
        <div className="p-4 bg-white rounded shadow mt-4">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>

          <div className="space-y-4">
            {/* Low Stock Alerts */}
            <div>
              <h3 className="text-md font-semibold mb-3 text-red-700">
                🔴 Low Stock Alerts
              </h3>
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500">All products are well-stocked!</p>
              ) : (
                <div className="space-y-2">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-red-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-red-600">
                          Only {product.stock} left in stock - Restock needed!
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveSection("products");
                          handleEdit(product);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded text-xs hover:bg-red-600"
                      >
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* System Notifications */}
            <div>
              <h3 className="text-md font-semibold mb-3 text-blue-700">
                📢 System Notifications
              </h3>
              <div className="space-y-2">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-sm text-blue-700">
                    ✅ All systems operational
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="text-sm text-green-700">
                    ✓ Backup completed successfully
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ANALYTICS SECTION
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
                        <td className="p-2 text-right">
                          {product.times_ordered}
                        </td>
                        <td className="p-2 text-right">
                          {product.total_quantity_sold}
                        </td>
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
                        <td className="p-2">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-right">{sale.total_orders}</td>
                        <td className="p-2 text-right">
                          ₱{Number(sale.total_revenue || 0).toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          ₱
                          {Number(
                            sale.average_order_value || 0,
                          ).toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          {sale.unique_customers}
                        </td>
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
                        <td className="p-2">
                          {new Date(analytics.date).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-right">
                          {analytics.users_with_cart}
                        </td>
                        <td className="p-2 text-right">
                          {analytics.total_cart_items}
                        </td>
                        <td className="p-2 text-right">
                          {Number(analytics.avg_quantity_per_item || 0).toFixed(
                            2,
                          )}
                        </td>
                        <td className="p-2 text-right">
                          {Number(analytics.avg_quantity_per_item || 0).toFixed(
                            2,
                          )}
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
                        <td className="p-2 text-right">
                          {item.total_quantity_added}
                        </td>
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
                        <td className="p-2 text-xs">
                          {event.user_id?.substring(0, 8)}...
                        </td>
                        <td className="p-2 text-xs">
                          {event.product_id?.substring(0, 8)}...
                        </td>
                        <td className="p-2 text-xs">
                          {event.variant_id?.substring(0, 8) || "N/A"}
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              event.event_type === "add"
                                ? "bg-green-200"
                                : event.event_type === "remove"
                                  ? "bg-red-200"
                                  : "bg-yellow-200"
                            }`}
                          >
                            {event.event_type}
                          </span>
                        </td>
                        <td className="p-2 text-right">{event.quantity}</td>
                        <td className="p-2 text-right">
                          {event.previous_quantity || 0}
                        </td>
                        <td className="p-2 text-xs">
                          {event.session_id?.substring(0, 8)}...
                        </td>
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
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              variant.stock > 20
                                ? "bg-green-200 text-green-800"
                                : variant.stock > 5
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-red-200 text-red-800"
                            }`}
                          >
                            {variant.stock > 20
                              ? "In Stock"
                              : variant.stock > 5
                                ? "Low Stock"
                                : "Critical"}
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

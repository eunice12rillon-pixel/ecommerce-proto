// src/pages/AdminPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import AdminSectionContent from "../components/admin/AdminSectionContent";
import { supabase } from "../utils/supabase";
import { useToast } from "../components/toast-context";
import { getDashboardMessages } from "../utils/sellerMessages";
import {
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiBarChart2,
  FiMessageCircle,
  FiBell,
  FiHome,
} from "react-icons/fi";

const BASE_ADMIN_MESSAGES = [
  {
    id: 1,
    customer: "John Doe",
    email: "john@example.com",
    subject: "Question about product",
    preview: "Hi, I wanted to ask about the shipping time for...",
    date: new Date("2026-02-12T06:00:00"),
    unread: true,
  },
  {
    id: 2,
    customer: "Jane Smith",
    email: "jane@example.com",
    subject: "Order issue",
    preview: "My order #1234 hasn't arrived yet. Can you...",
    date: new Date("2026-02-12T03:00:00"),
    unread: true,
  },
  {
    id: 3,
    customer: "Bob Johnson",
    email: "bob@example.com",
    subject: "Product feedback",
    preview: "Just wanted to say the quality is amazing! Will...",
    date: new Date("2026-02-11T08:30:00"),
    unread: false,
  },
  {
    id: 4,
    customer: "Alice Brown",
    email: "alice@example.com",
    subject: "Return request",
    preview: "I would like to return item #5678 because...",
    date: new Date("2026-02-10T12:15:00"),
    unread: false,
  },
];

export default function AdminPage({ user, role }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!user || role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, role, navigate]);

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
  const [_analyticsFallback, setAnalyticsFallback] = useState({
    popularProducts: false,
    cartEvents: false,
    dailySales: false,
    cartAnalytics: false,
    mostAddedToCart: false,
    productVariants: false,
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [_orderDeliveryDetailsById, setOrderDeliveryDetailsById] = useState({});

  // Messages State (dummy + customer-to-seller chat)
  const [messages, setMessages] = useState(() =>
    getDashboardMessages(BASE_ADMIN_MESSAGES),
  );

  useEffect(() => {
    const refreshMessages = () => {
      setMessages(getDashboardMessages(BASE_ADMIN_MESSAGES));
    };

    refreshMessages();
    window.addEventListener("seller-messages-updated", refreshMessages);

    return () => {
      window.removeEventListener("seller-messages-updated", refreshMessages);
    };
  }, []);
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
    "Watercolor, acrylic, oil paints & brushes",
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

    if (!error && (data || []).length > 0) {
      const orderIds = data.map((order) => order.id);
      const { data: deliveryData, error: deliveryError } = await supabase
        .from("order_delivery_details")
        .select("*")
        .in("order_id", orderIds);

      if (!deliveryError && deliveryData) {
        const mapped = Object.fromEntries(
          deliveryData.map((detail) => [detail.order_id, detail]),
        );
        setOrderDeliveryDetailsById(mapped);
      } else {
        setOrderDeliveryDetailsById({});
      }
    } else {
      setOrderDeliveryDetailsById({});
    }
  };

  // Fetch Analytics Data
  const fetchAnalytics = async () => {
    const fallbackStatus = {
      popularProducts: false,
      cartEvents: false,
      dailySales: false,
      cartAnalytics: false,
      mostAddedToCart: false,
      productVariants: false,
    };

    const { data: popularData, error: popularError } = await supabase
      .from("popular_products")
      .select("*")
      .order("times_ordered", { ascending: false })
      .limit(10);

    if (popularData && popularData.length > 0) setPopularProducts(popularData);
    if (popularError || !popularData || popularData.length === 0) {
      fallbackStatus.popularProducts = true;
      const { data: orderItemsData } = await supabase
        .from("order_items")
        .select("product_id, quantity, price");

      const { data: allProducts } = await supabase
        .from("products")
        .select("id, name, category");

      const productById = Object.fromEntries(
        (allProducts || []).map((p) => [String(p.id), p]),
      );

      const grouped = new Map();
      (orderItemsData || []).forEach((item) => {
        const key = String(item.product_id || "");
        if (!key) return;

        const current = grouped.get(key) || {
          name: productById[key]?.name || "Unknown Product",
          category: productById[key]?.category || "N/A",
          times_ordered: 0,
          total_quantity_sold: 0,
          total_revenue: 0,
        };

        current.times_ordered += 1;
        current.total_quantity_sold += Number(item.quantity || 0);
        current.total_revenue +=
          Number(item.quantity || 0) * Number(item.price || 0);
        grouped.set(key, current);
      });

      setPopularProducts(
        Array.from(grouped.values())
          .sort(
            (a, b) =>
              b.times_ordered - a.times_ordered ||
              b.total_quantity_sold - a.total_quantity_sold,
          )
          .slice(0, 10),
      );
    }

    const { data: eventsData, error: eventsError } = await supabase
      .from("cart_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    let eventsForAnalytics = eventsData || [];

    if (eventsData && eventsData.length > 0) setCartEvents(eventsData);
    if (eventsError || !eventsData || eventsData.length === 0) {
      fallbackStatus.cartEvents = true;
      const { data: checkoutItems } = await supabase.from("order_items").select(`
          product_id,
          quantity,
          orders (
            created_at,
            user_id
          )
        `);

      eventsForAnalytics = (checkoutItems || [])
        .map((item, idx) => ({
          id: `checkout-${idx}`,
          user_id: item.orders?.user_id || null,
          product_id: item.product_id || null,
          variant_id: null,
          event_type: "checkout",
          quantity: Number(item.quantity || 0),
          previous_quantity: 0,
          session_id: "checkout",
          created_at: item.orders?.created_at || null,
        }))
        .filter((event) => Boolean(event.created_at))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 50);

      setCartEvents(eventsForAnalytics);
    }

    const { data: salesData, error: salesError } = await supabase
      .from("daily_sales")
      .select("*")
      .order("date", { ascending: false })
      .limit(30);

    if (salesData && salesData.length > 0) setDailySales(salesData);
    if (salesError || !salesData || salesData.length === 0) {
      fallbackStatus.dailySales = true;
      const { data: ordersData } = await supabase
        .from("orders")
        .select("created_at, total, user_id")
        .order("created_at", { ascending: false });

      const groupedByDate = new Map();
      (ordersData || []).forEach((order) => {
        const date = new Date(order.created_at).toISOString().slice(0, 10);
        const current = groupedByDate.get(date) || {
          date,
          total_orders: 0,
          total_revenue: 0,
          total_order_value: 0,
          unique_users: new Set(),
        };

        const amount = Number(order.total || 0);
        current.total_orders += 1;
        current.total_revenue += amount;
        current.total_order_value += amount;
        if (order.user_id) current.unique_users.add(order.user_id);
        groupedByDate.set(date, current);
      });

      const fallbackDailySales = Array.from(groupedByDate.values())
        .map((entry) => ({
          date: entry.date,
          total_orders: entry.total_orders,
          total_revenue: entry.total_revenue,
          average_order_value:
            entry.total_orders > 0
              ? entry.total_order_value / entry.total_orders
              : 0,
          unique_customers: entry.unique_users.size,
        }))
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .slice(0, 30);

      setDailySales(fallbackDailySales);
    }

    const { data: analyticsData, error: analyticsError } = await supabase
      .from("cart_analytics")
      .select("*")
      .order("date", { ascending: false })
      .limit(30);

    if (analyticsData && analyticsData.length > 0) setCartAnalytics(analyticsData);
    if (analyticsError || !analyticsData || analyticsData.length === 0) {
      fallbackStatus.cartAnalytics = true;
      const groupedByDate = new Map();
      eventsForAnalytics.forEach((event) => {
        const date = event.created_at
          ? new Date(event.created_at).toISOString().slice(0, 10)
          : null;
        if (!date) return;

        const current = groupedByDate.get(date) || {
          date,
          users: new Set(),
          total_cart_items: 0,
          total_quantity: 0,
          total_events: 0,
        };

        if (event.user_id) current.users.add(event.user_id);
        const qty = Number(event.quantity || 0);
        current.total_cart_items += qty;
        current.total_quantity += qty;
        current.total_events += 1;
        groupedByDate.set(date, current);
      });

      setCartAnalytics(
        Array.from(groupedByDate.values())
          .map((entry) => ({
            date: entry.date,
            users_with_cart: entry.users.size,
            total_cart_items: entry.total_cart_items,
            avg_quantity_per_item:
              entry.total_events > 0
                ? entry.total_quantity / entry.total_events
                : 0,
          }))
          .sort((a, b) => String(b.date).localeCompare(String(a.date)))
          .slice(0, 30),
      );
    }

    const { data: mostAddedData, error: mostAddedError } = await supabase
      .from("most_added_to_cart")
      .select("*")
      .order("times_added", { ascending: false })
      .limit(10);

    if (mostAddedData && mostAddedData.length > 0) setMostAddedToCart(mostAddedData);
    if (mostAddedError || !mostAddedData || mostAddedData.length === 0) {
      fallbackStatus.mostAddedToCart = true;
      const addedEventsRaw = eventsForAnalytics.filter(
        (e) => e.event_type === "add",
      );
      const addedEvents =
        addedEventsRaw.length > 0
          ? addedEventsRaw
          : eventsForAnalytics.filter((e) => e.event_type === "checkout");
      const productIds = [...new Set(addedEvents.map((e) => e.product_id).filter(Boolean))];

      let productById = {};
      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, category")
          .in("id", productIds);

        productById = Object.fromEntries(
          (productsData || []).map((p) => [String(p.id), p]),
        );
      }

      const grouped = new Map();
      addedEvents.forEach((event) => {
        const key = String(event.product_id || "");
        if (!key) return;

        const current = grouped.get(key) || {
          name: productById[key]?.name || "Unknown Product",
          category: productById[key]?.category || "N/A",
          times_added: 0,
          total_quantity_added: 0,
        };

        current.times_added += 1;
        current.total_quantity_added += Number(event.quantity || 0);
        grouped.set(key, current);
      });

      setMostAddedToCart(
        Array.from(grouped.values())
          .sort(
            (a, b) =>
              b.times_added - a.times_added ||
              b.total_quantity_added - a.total_quantity_added,
          )
          .slice(0, 10),
      );
    }

    const { data: variantsData, error: variantsError } = await supabase
      .from("product_variants")
      .select("*")
      .order("name", { ascending: true });

    if (variantsData && variantsData.length > 0) setProductVariants(variantsData);
    if (variantsError || !variantsData || variantsData.length === 0) {
      fallbackStatus.productVariants = true;
      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, category, stock")
        .order("name", { ascending: true });

      setProductVariants(
        (productsData || []).map((product) => ({
          variant_id: String(product.id),
          name: product.name,
          category: product.category,
          stock: Number(product.stock || 0),
        })),
      );
    }

    setAnalyticsFallback(fallbackStatus);
  };

  /* eslint-disable react-hooks/set-state-in-effect */
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
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (activeSection !== "analytics") return undefined;

    const intervalId = setInterval(() => {
      fetchAnalytics();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [activeSection]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminDisplayName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")?.[0] ||
      "Admin Seller";
    const sellerAvatarLetter = adminDisplayName.charAt(0).toUpperCase();

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      image_url: formData.image_url,
      stock: Number(formData.stock),
      seller_name: adminDisplayName,
      seller_avatar_letter: sellerAvatarLetter,
    };
    const fallbackProductData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      image_url: formData.image_url,
      stock: Number(formData.stock),
    };

    if (editingId) {
      let { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);

      if (
        error &&
        (String(error.message).includes("seller_name") ||
          String(error.message).includes("seller_avatar_letter"))
      ) {
        const retry = await supabase
          .from("products")
          .update(fallbackProductData)
          .eq("id", editingId);
        error = retry.error;
      }

      if (error) {
        console.error("Error updating product:", error);
        alert("Error updating product: " + error.message);
      } else {
        showToast("Product updated successfully!");
        setEditingId(null);
      }
    } else {
      let { error } = await supabase.from("products").insert([productData]);

      if (
        error &&
        (String(error.message).includes("seller_name") ||
          String(error.message).includes("seller_avatar_letter"))
      ) {
        const retry = await supabase.from("products").insert([fallbackProductData]);
        error = retry.error;
      }

      if (error) {
        console.error("Error adding product:", error);
        alert("Error adding product: " + error.message);
      } else {
        showToast("Product added successfully!");
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
      showToast("Product deleted successfully!");
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

  const renderContent = () => (
    <AdminSectionContent
      activeSection={activeSection}
      sections={sections}
      products={products}
      orders={orders}
      orderItems={orderItems}
      messages={messages}
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      editingId={editingId}
      setEditingId={setEditingId}
      setFormData={setFormData}
      categoryOptions={categoryOptions}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      popularProducts={popularProducts}
      cartEvents={cartEvents}
      dailySales={dailySales}
      cartAnalytics={cartAnalytics}
      mostAddedToCart={mostAddedToCart}
      productVariants={productVariants}
      setActiveSection={setActiveSection}
    />
  );

  if (!user || role !== "admin") {
    return null;
  }
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


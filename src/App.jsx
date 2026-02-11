import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./utils/supabase";
import { ToastProvider } from "./components/ToastContext";

import Header from "./components/Header";
import ImageCarousel from "./components/ImageCarousel";
import InfoGrid from "./components/InfoGrid";
import ProductsGrid from "./components/ProductsGrid";
import CategoriesGrid from "./components/CategoriesGrid";
import Testimonial from "./components/Testimonial";
import HowToBuy from "./components/HowToBuy";
import ContactUs from "./components/ContactUs";
import PageWrapper from "./components/PageWrapper";

import ProductsPage from "./pages/ProductsPage";
import ProductView from "./pages/ProductView";
import CartPage from "./pages/CartPage";

import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";
import Profile from "./pages/Profiles";
import Signup from "./pages/Signup";

function App() {
  const [user, setUser] = React.useState(null);
  const [role, setRole] = React.useState("customer");
  const [authResolved, setAuthResolved] = React.useState(false);

  const slides = [
    { image: "/img1.jpg", quote: "Art is the heartbeat of our local culture." },
    { image: "/img2.jpg", quote: "Every handmade piece tells a story." },
    { image: "/img3.jpg", quote: "Creativity connects communities." },
  ];

  useEffect(() => {
    let mounted = true;

    const syncAuthState = async (session) => {
      const sessionUser = session?.user || null;
      if (!mounted) return;

      setUser(sessionUser);

      if (!sessionUser) {
        setRole("customer");
        setAuthResolved(true);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionUser.id)
        .single();

      if (!mounted) return;
      setRole(data?.role || "customer");
      setAuthResolved(true);
    };
    

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuthState(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthResolved(false);
      syncAuthState(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole("customer");
  };

    if (!authResolved) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    const syncAuthState = async (session) => {
  const sessionUser = session?.user || null;
  if (!mounted) return;

  setUser(sessionUser);

  if (!sessionUser) {
    setRole("customer");
    localStorage.removeItem("userRole");  // Clear stored role
    setAuthResolved(true);
    return;
  }

  // Try to get role from localStorage first (for persistence)
  let userRole = localStorage.getItem("userRole");
  if (!userRole) {
    // Fetch from Supabase if not stored
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", sessionUser.id)
      .single();
    userRole = data?.role || "customer";
    localStorage.setItem("userRole", userRole);  // Store it
  }

  setRole(userRole);
  setAuthResolved(true);
};



  

  // Include the products array here
  const products = [
    {
      id: "1",
      image: "/paint-brush.webp",
      name: "Premium Paint Brush Set",
      description: "High-quality brushes for watercolor, acrylic & oil.",
      category: "Painting Tools",
      price: 550,
    },
    {
      id: "2",
      image: "/acrylic-set.webp",
      name: "Acrylic Paint Set",
      description: "Vibrant acrylic paints perfect for beginners & pros.",
      category: "Painting Tools",
      price: 799,
    },
    {
      id: "3",
      image: "/canvas-pack.webp",
      name: "Canvas Panel Pack",
      description: "Durable canvas panels for creative projects.",
      category: "Canvas & Surfaces",
      price: 650,
    },
    {
      id: "4",
      image: "/sketchbook.webp",
      name: "Hardbound Sketchbook",
      description: "Premium thick paper for sketching & drawing.",
      category: "Paper & Sketch",
      price: 450,
    },
    {
      id: "5",
      image: "/watercolor-set.webp",
      name: "Watercolor Paint Set",
      description: "Rich pigments with smooth blending capability.",
      category: "Painting Tools",
      price: 720,
    },
    {
      id: "6",
      image: "/palette.webp",
      name: "Wooden Paint Palette",
      description: "Ergonomic wooden palette for easy mixing.",
      category: "Accessories",
      price: 299,
    },
    {
      id: "7",
      image: "/easel.webp",
      name: "Adjustable Wooden Easel",
      description: "Stable and adjustable easel for studio use.",
      category: "Studio Equipment",
      price: 1499,
    },
    {
      id: "8",
      image: "/charcoal-set.webp",
      name: "Charcoal Drawing Set",
      description: "Professional charcoal sticks for deep shading.",
      category: "Drawing Tools",
      price: 399,
    },
  ];

return (
  <ToastProvider>
    <Router>
      <Header user={user} onLogout={handleLogout} role={role} />

      <Routes>
        {/* HOME PAGE - Accessible to everyone */}
        <Route
          path="/"
          element={
            <>
              <ImageCarousel slides={slides} />
              <InfoGrid />

              <div className="max-w-7xl mx-auto px-4 py-8">
                <ProductsGrid products={products.slice(0, 4)} />
              </div>

              <CategoriesGrid />
              <Testimonial />
              <HowToBuy />
              <PageWrapper>
                <div className="mt-6">
                  <p>Welcome to Artisan Alley!</p>
                </div>
              </PageWrapper>
              <ContactUs />
            </>
          }
        />

        {/* PRODUCTS LIST PAGE - Only for customers (role !== "admin") */}
        {role !== "admin" && (
          <Route
            path="/products"
            element={<ProductsPage products={products} />}
          />
        )}

        {/* SINGLE PRODUCT VIEW - Only for customers */}
        {role !== "admin" && (
          <Route
            path="/products/:id"
            element={<ProductView products={products} />}
          />
        )}

        {/* CART PAGE - Only for customers */}
        {role !== "admin" && <Route path="/cart" element={<CartPage />} />}

        {/* PROFILE PAGE - Accessible to everyone (or restrict if needed) */}
        <Route path="/profile" element={<Profile user={user} />} />

        {/* ADMIN PAGE - Only for admins (already handled in AdminPage.jsx) */}
        <Route path="/admin" element={<AdminPage user={user} role={role} />} />

        {/* LOGIN/SIGNUP - Accessible to everyone */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Fallback: Redirect admins away from any restricted or unmatched paths */}
        {role === "admin" && (
          <Route path="*" element={<Navigate to="/admin" replace />} />
        )}
      </Routes>
    </Router>
  </ToastProvider>
);
}

export default App;

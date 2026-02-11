import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./utils/supabase";

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

  // Include the products array here
  const products = [
    {
      id: "1",
      image: "/paint-brush.jpg",
      name: "Premium Paint Brush Set",
      description:
        "High-quality brushes for watercolor, acrylic, and oil painting.",
      variants: [
        { id: "basic", name: "Basic Set", price: 550 },
        { id: "advanced", name: "Advanced Set", price: 750 },
        { id: "pro", name: "Professional Set", price: 950 },
      ],
    },
    {
      id: "2",
      image: "/sketchbook.jpg",
      name: "Hardcover Sketchbook",
      description: "Perfect for drawing, sketching, and journaling.",
      variants: [
        { id: "a5", name: "A5 Size", price: 420 },
        { id: "a4", name: "A4 Size", price: 620 },
      ],
    },
    {
      id: "3",
      image: "/acrylic-paint.jpg",
      name: "Acrylic Paint Set (12 colors)",
      description: "Vibrant colors suitable for all types of surfaces.",
      variants: [
        { id: "standard", name: "Standard Set", price: 850 },
        { id: "premium", name: "Premium Set", price: 1200 },
      ],
    },
    {
      id: "4",
      image: "/charcoal-pencils.jpg",
      name: "Charcoal Pencil Set",
      description: "Set of 6 charcoal pencils for sketching and shading.",
      variants: [
        { id: "set6", name: "6 Pencils", price: 300 },
        { id: "set12", name: "12 Pencils", price: 500 },
      ],
    },
  ];

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <ImageCarousel slides={slides} />
              <InfoGrid />
              <ProductsGrid products={products} />
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

        {/* ALL PRODUCTS LIST PAGE */}
        <Route
          path="/products"
          element={<ProductsPage products={products} />}
        />

        {/* SINGLE PRODUCT VIEW WITH VARIANTS */}
        <Route
          path="/products/:id"
          element={<ProductView products={products} />}
        />

        {/* CART PAGE */}
        <Route path="/cart" element={<CartPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/admin" element={<AdminPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

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
import SaleBadge from "./components/SaleBadge";

import ProductsPage from "./pages/ProductsPage";
import ProductView from "./pages/ProductView";
import CartPage from "./pages/CartPage";

import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";
import Profile from "./pages/Profiles";
import Signup from "./pages/Signup";

function App() {
  const getSaleBadgeHiddenKey = (sessionUser) =>
    `saleBadgeHidden_${sessionUser?.id || "guest"}`;
  const getFallbackRating = (seedValue) => {
    const seed = String(seedValue || "product");
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
    }
    const base = 4.3;
    const step = (hash % 7) * 0.1;
    return Number((base + step).toFixed(1));
  };
  const getFallbackSoldCount = (seedValue) => {
    const seed = String(seedValue || "product");
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 37 + seed.charCodeAt(i)) % 100000;
    }
    return 20 + (hash % 480);
  };
  const getFallbackSellerName = (seedValue) => {
    const sellers = [
      "Maria's Art Shop",
      "Craft Corner PH",
      "Likhang Lokal",
      "Studio Supply Hub",
      "Handmade Finds",
    ];
    const seed = String(seedValue || "product");
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 41 + seed.charCodeAt(i)) % 100000;
    }
    return sellers[hash % sellers.length];
  };
  const getFallbackComments = (name) => [
    "Good quality and sulit for the price.",
    `I used this for my ${name?.toLowerCase() || "project"} and it worked great.`,
    "Fast delivery and maayos kausap si seller.",
  ];
  const extendDescription = (text) =>
    text && text.length > 85
      ? text
      : `${text} Great for students, hobbyists, and professional artists who want reliable results.`;

  const [user, setUser] = React.useState(null);
  const [role, setRole] = React.useState("customer");
  const [authResolved, setAuthResolved] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [, setSaleBadgeRefresh] = React.useState(0);

  const slides = [
    { image: "/img1.jpg", quote: "Art is the heartbeat of our local culture." },
    { image: "/img2.jpg", quote: "Every handmade piece tells a story." },
    { image: "/img3.jpg", quote: "Creativity connects communities." },
  ];

  // Hardcoded products that will always be available
  const hardcodedProducts = [
    {
      id: "hardcoded-1",
      image: "/paint-brush.webp",
      name: "Premium Paint Brush Set",
      description: "High-quality brushes for watercolor, acrylic & oil.",
      category: "Painting Tools",
      price: 550,
      rating: 4.7,
    },
    {
      id: "hardcoded-2",
      image: "/acrylic-set.webp",
      name: "Acrylic Paint Set",
      description: "Vibrant acrylic paints perfect for beginners & pros.",
      category: "Painting Tools",
      price: 799,
      rating: 4.8,
    },
    {
      id: "hardcoded-3",
      image: "/canvas-pack.webp",
      name: "Canvas Panel Pack",
      description: "Durable canvas panels for creative projects.",
      category: "Canvas & Surfaces",
      price: 650,
      rating: 4.6,
    },
    {
      id: "hardcoded-4",
      image: "/sketchbook.webp",
      name: "Hardbound Sketchbook",
      description: "Premium thick paper for sketching & drawing.",
      category: "Paper & Sketch",
      price: 450,
      rating: 4.7,
    },
    {
      id: "hardcoded-5",
      image: "/watercolor-set.webp",
      name: "Watercolor Paint Set",
      description: "Rich pigments with smooth blending capability.",
      category: "Painting Tools",
      price: 720,
      rating: 4.9,
    },
    {
      id: "hardcoded-6",
      image: "/palette.webp",
      name: "Wooden Paint Palette",
      description: "Ergonomic wooden palette for easy mixing.",
      category: "Accessories",
      price: 299,
      rating: 4.5,
    },
    {
      id: "hardcoded-7",
      image: "/easel.webp",
      name: "Adjustable Wooden Easel",
      description: "Stable and adjustable easel for studio use.",
      category: "Studio Equipment",
      price: 1499,
      rating: 4.8,
    },
    {
      id: "hardcoded-8",
      image: "/charcoal-set.webp",
      name: "Charcoal Drawing Set",
      description: "Professional charcoal sticks for deep shading.",
      category: "Drawing Tools",
      price: 399,
      rating: 4.6,
    },
  ];
  const enrichedHardcodedProducts = hardcodedProducts.map((product) => ({
    ...product,
    description: extendDescription(product.description),
    soldCount: getFallbackSoldCount(product.id),
    sellerName: getFallbackSellerName(product.id),
    comments: getFallbackComments(product.name),
  }));

  useEffect(() => {
    let mounted = true;

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

      if (!mounted) return;
      setRole(userRole);
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

  // Fetch products from Supabase database and combine with hardcoded products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Map database fields to match the expected format
        const formattedProducts = data.map((product) => ({
          id: product.id,
          image: product.image_url,
          name: product.name,
          description: extendDescription(product.description),
          category: product.category,
          price: product.price,
          rating: Number(product.rating ?? getFallbackRating(product.id)),
          soldCount: Number(product.sold_count ?? getFallbackSoldCount(product.id)),
          sellerName: product.seller_name || getFallbackSellerName(product.id),
          comments: Array.isArray(product.comments)
            ? product.comments
            : getFallbackComments(product.name),
        }));
        
        // Combine hardcoded products with database products
        // Database products appear first (newest first), then hardcoded products
        setProducts([...formattedProducts, ...enrichedHardcodedProducts]);
      } else {
        // If there's an error or no database products, just use hardcoded ones
        setProducts(enrichedHardcodedProducts);
      }
    };

    fetchProducts();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole("customer");
    localStorage.removeItem("userRole");
  };

  const handleDismissSaleBadge = () => {
    const hiddenKey = getSaleBadgeHiddenKey(user);
    localStorage.setItem(hiddenKey, "true");
    setSaleBadgeRefresh((value) => value + 1);
  };

  const saleBadgeVisible =
    localStorage.getItem(getSaleBadgeHiddenKey(user)) !== "true";

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

return (
  <ToastProvider>
    <Router>
      <Header user={user} onLogout={handleLogout} role={role} />
      {role !== "admin" && saleBadgeVisible && (
        <SaleBadge onClose={handleDismissSaleBadge} />
      )}

      <Routes>
        {/* HOME PAGE - Only for customers */}
        {role !== "admin" ? (
          <Route
            path="/"
            element={
              <>
                <ImageCarousel slides={slides} />
                <InfoGrid />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <ProductsGrid
                    products={enrichedHardcodedProducts.slice(0, 8)}
                    user={user}
                  />
                </div>

                <CategoriesGrid />
                <Testimonial />
                <HowToBuy />

                <section className="max-w-7xl mx-auto px-4 py-10">
                  <div className="bg-white/90 rounded-2xl shadow-md p-6 md:p-10 space-y-6">
                    <div className="space-y-3">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Buy and Sell Online on Artisan Alley Philippines
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Artisan Alley is a fun, free, and trusted online marketplace for art supplies, crafts, and handmade products. We connect Filipino artists, crafters, and creative sellers with buyers who love unique and high-quality items.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Shop safely and easily with trusted sellers and verified listings. Discover a wide variety of products from art materials, craft tools, DIY kits, handmade accessories, home decor, and more. Create listings for free and start selling your creations in just a few clicks!
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                        Experience Creative Shopping on Artisan Alley
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Find everything you need for your art and craft projects at the best prices. Browse products, compare shop ratings, and read reviews to make worry-free purchases. Whether you are a student, hobbyist, or professional artist, Artisan Alley has something for you.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Enjoy special deals, discounts, and promotions all year round. Get the best value with affordable prices and exciting offers from your favorite local creators.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                        Sell Your Crafts Easily
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Listing products on Artisan Alley is quick and simple. Manage orders, connect with customers, and grow your creative business online all in one platform.
                      </p>
                      <p className="text-gray-900 font-semibold">
                        So what are you waiting for? Join Artisan Alley today and be part of a growing creative community!
                      </p>
                    </div>
                  </div>
                </section>
                <ContactUs />
              </>
            }
          />
        ) : (
          <Route path="/" element={<Navigate to="/admin" replace />} />
        )}

        {/* PRODUCTS LIST PAGE - Only for customers */}
        {role !== "admin" && (
          <Route
            path="/products"
            element={<ProductsPage products={products} user={user} />}
          />
        )}

        {/* SINGLE PRODUCT VIEW - Only for customers */}
        {role !== "admin" && (
          <Route
            path="/products/:id"
            element={<ProductView products={products} user={user} />}
          />
        )}

        {/* CART PAGE - Only for customers */}
        {role !== "admin" && <Route path="/cart" element={<CartPage user={user} />} />}

        {/* PROFILE PAGE - Accessible to everyone (or restrict if needed) */}
        <Route path="/profile" element={<Profile user={user} />} />

        {/* ADMIN PAGE - Strictly protected at route level */}
        <Route
          path="/admin"
          element={
            role === "admin" ? (
              <AdminPage user={user} role={role} />
            ) : (
              <Navigate to="/productspage" replace />
            )
          }
        />

        {/* LOGIN/SIGNUP - Accessible to everyone */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Fallback: Redirect admins to /admin and customers to home */}
        <Route 
          path="*" 
          element={<Navigate to={role === "admin" ? "/admin" : "/"} replace />} 


        />
      </Routes>
    </Router>
  </ToastProvider>
);
}

export default App;

import React from "react";
import { User, ShoppingCart } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Header({ user, onLogout, role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (query) => {
    const searchText = query.trim();

    if (!searchText) {
      navigate("/", { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set("search", searchText);

    navigate(
      {
        pathname: "/products",
        search: params.toString(),
      },
      { replace: true },
    );
  };

  const handleLogout = async () => {
    await onLogout();
    navigate("/", { replace: true });
  };

  return (
    <header className="h-20 bg-[#ffffff] shadow-md w-full flex items-center">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 h-full">
        {/* Logo */}
        <h1
          className="text-3xl font-thin text-brown-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Artisan Alley
        </h1>

        {/* Search bar */}
        {role !== "admin" && (
          <div className="w-1/3">
            <SearchBar placeholder="Search products..." onSearch={handleSearch} />
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* CART ICON - Only show for non-admin users */}
          {role !== "admin" && (
            <button
              className="p-2 hover:bg-gray-200 rounded-full"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="w-6 h-6 text-gray-600" />
            </button>
          )}

          {/* Admin Login Icon - Only show if role is admin */}
          {role === "admin" && (
            <button
              className="p-2 hover:bg-gray-200 rounded-full"
              onClick={() => navigate("/admin")}
            >
              <User className="w-5 h-5 text-gray-500" />
            </button>
          )}

          {/* Authentication Nav */}
          <nav>
            {user ? (
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

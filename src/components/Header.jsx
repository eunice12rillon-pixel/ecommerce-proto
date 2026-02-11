import React from "react";
import { User, ShoppingCart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Header({ user, onLogout, role }) {
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-white shadow-md w-full flex items-center">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 h-full">
        {/* Logo */}
        <h1
          className="text-3xl font-thin text-brown-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Artisan Alley
        </h1>

        {/* Search bar */}
        <div className="w-1/3">
          <SearchBar placeholder="Search artisans..." />
        </div>

        <div className="flex items-center gap-4">
          {/* CART ICON */}
          <button
            className="p-2 hover:bg-gray-200 rounded-full"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="w-6 h-6 text-gray-600" />
          </button>

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
              <button onClick={onLogout} className="logout-button">
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

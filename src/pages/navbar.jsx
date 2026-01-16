import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogIn, FiHeart } from "react-icons/fi";
import SearchBar from "../components/search";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function NavBar({ search, upSearch }) {
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const showSearch = ["/home", "/allfigure", "/"].includes(location.pathname);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    api.get("/cart")
      .then((res) => setCartCount(res.data.items.length))
      .catch(() => setCartCount(0));
  }, [isAuthenticated]);

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50 px-6 md:px-12 flex items-center justify-between transition-all">
      {/* LOGO */}
      <Link to="/home" className="text-2xl font-black tracking-tighter text-white">
        Play<span className="text-pink-600">Box</span>.
      </Link>

      {/* LINKS */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
        <NavLink 
          to="/home" 
          className={({ isActive }) => `hover:text-white transition-colors ${isActive ? "text-white" : ""}`}
        >
          Home
        </NavLink>
        <NavLink 
          to="/allfigure" 
          className={({ isActive }) => `hover:text-white transition-colors ${isActive ? "text-white" : ""}`}
        >
          Collection
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => `hover:text-white transition-colors ${isActive ? "text-white" : ""}`}
        >
          About
        </NavLink>
      </div>

      {/* SEARCH */}
      <div className="hidden md:flex flex-1 justify-center px-8">
        {showSearch && <SearchBar search={search} upSearch={upSearch} />}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-5">
        {/* Wishlist Button - NEW */}
        <Link 
          to="/wishlist" 
          className="text-gray-400 hover:text-pink-500 transition-colors" 
          title="Wishlist"
        >
          <FiHeart size={22} />
        </Link>

        {/* Cart Button */}
        <Link 
          to="/cart" 
          className="relative text-gray-400 hover:text-white transition-colors"
          title="Cart"
        >
          <FiShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Profile / Login */}
        {isAuthenticated ? (
          <button
            onClick={() => navigate("/profile")}
            className="h-9 w-9 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform"
          >
            <FiUser size={16} />
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
          >
            <FiLogIn /> Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
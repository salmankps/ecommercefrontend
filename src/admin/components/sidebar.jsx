import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiBox, FiShoppingCart, FiLogOut, FiTag, FiLayers } from "react-icons/fi";

function SideBar() {
  const navigate = useNavigate();
  
  const navItems = [
    { to: "/adminhome", label: "Dashboard", icon: <FiHome /> },
    { to: "/users", label: "Users", icon: <FiUsers /> },
    { to: "/products", label: "Products", icon: <FiBox /> },
    { to: "/categories", label: "Categories", icon: <FiLayers /> }, // NEW LINK
    { to: "/orders", label: "Orders", icon: <FiShoppingCart /> },
    { to: "/coupons", label: "Coupons", icon: <FiTag /> },
  ];

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-[#121212] border-r border-white/5 flex flex-col sticky top-0">
      {/* Header */}
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <h2 className="text-2xl font-bold tracking-tighter text-white">
          Admin<span className="text-pink-600">Panel</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-white/5 text-red-400 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all font-bold"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
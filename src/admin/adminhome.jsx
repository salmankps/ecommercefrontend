import React, { useEffect, useState } from "react";
import SideBar from "./components/sidebar";
import api from "../api/axios"; // Use interceptor instance
import { FiUsers, FiBox, FiShoppingCart, FiDollarSign, FiActivity, FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";

function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Correct endpoint: GET /api/admin/dashboard
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a]">
        <SideBar />
        <div className="flex-1 flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-400 mt-1">Welcome back, Admin.</p>
          </div>
          <div className="text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Total Revenue */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FiDollarSign size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4">
                <FiDollarSign size={24} />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold text-white mt-1">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FiUsers size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                <FiUsers size={24} />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalUsers || 0}</p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FiShoppingCart size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                <FiShoppingCart size={24} />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">Total Orders</h3>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalOrders || 0}</p>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FiBox size={80} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 mb-4">
                <FiBox size={24} />
              </div>
              <h3 className="text-gray-400 text-sm font-medium">Total Products</h3>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        {/* ORDER STATUS BREAKDOWN */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FiActivity className="text-pink-500" /> Order Status Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Map through the Dictionary<string, int> from backend */}
             {stats?.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <FiPackage className="text-gray-500" />
                    <span className="font-medium text-gray-300 capitalize">{status}</span>
                  </div>
                  <span className="bg-white/10 px-3 py-1 rounded-lg font-bold text-white">{count}</span>
                </div>
             ))}

             {(!stats?.ordersByStatus || Object.keys(stats.ordersByStatus).length === 0) && (
                <p className="text-gray-500">No order data available yet.</p>
             )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default AdminHome;
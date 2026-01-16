import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FiUser, FiBox, FiLogOut, FiCalendar, FiPackage, FiClock } from "react-icons/fi";

function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Run both requests in parallel
        const [profileRes, ordersRes] = await Promise.all([
          api.get("/Profile/me"),
          api.get("/orders"),
        ]);

        setProfile(profileRes.data);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Session expired or unauthorized");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post(`/Auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`);
      }
    } catch (e) {
      console.warn("Logout API call failed", e);
    } finally {
      localStorage.clear();
      toast.info("Logged out successfully");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-28 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: User Profile Card */}
        <div className="lg:col-span-1 h-fit">
          <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 text-center shadow-2xl shadow-pink-500/5 sticky top-28">
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-[#1a1a1a] w-full h-full rounded-full flex items-center justify-center border-2 border-white/10">
                <FiUser size={40} className="text-gray-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">{profile?.username || "User"}</h2>
            <p className="text-pink-500 font-medium mb-6">{profile?.email}</p>

            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Role</span>
                <span className="text-white font-bold">{profile?.role || "Member"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Joined</span>
                <span className="text-white font-bold">2024</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 text-gray-300 rounded-xl transition-all font-bold"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Order History */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FiBox className="text-pink-500" /> Order History
          </h2>

          {orders.length === 0 ? (
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 text-center">
              <FiPackage size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No orders yet.</p>
              <button 
                onClick={() => navigate('/allfigure')}
                className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-500 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.orderId} 
                  className="bg-[#121212] border border-white/5 rounded-2xl p-6 hover:border-pink-500/30 transition-colors group"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-bold text-white">Order #{order.orderId}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === "Paid" 
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiCalendar /> {new Date(order.orderDate).toLocaleDateString()} 
                        <span className="mx-1">•</span>
                        <FiClock /> {new Date(order.orderDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-white">₹{order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-white/5 rounded-lg flex items-center justify-center text-xl">
                            📦
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{item.productName}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-300">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Footer (Optional Actions) */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                     <button className="text-sm font-bold text-pink-500 hover:text-white transition-colors">
                       View Invoice
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
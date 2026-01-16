
import React, { useEffect, useState } from "react";
import SideBar from "./components/sidebar";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiBox, FiClock, FiExternalLink } from "react-icons/fi";

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
     
        const userRes = await api.get(`/admin/${id}`);
        setUser(userRes.data);

       
        try {
            const ordersRes = await api.get(`/admin/${id}/orders`);
            setOrders(ordersRes.data || []);
        } catch (orderErr) {
        
            setOrders([]); 
        }
        
      } catch (err) {
        console.error("User fetch error:", err);
        toast.error("Failed to load user data");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
        fetchData();
    }
  }, [id, navigate]);

  if (loading) {
    return (
        <div className="flex min-h-screen bg-[#0a0a0a]">
            <SideBar />
            <div className="flex-1 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        </div>
    );
  }

  if (!user) return null;

  const displayName = user.email ? user.email.split('@')[0] : "User";

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 p-8 overflow-y-auto">
        <button onClick={() => navigate("/users")} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <FiArrowLeft /> Back to Users
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: User Profile Card */}
          <div className="lg:col-span-1 h-fit">
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-pink-500/20">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                {/* Changed from user.username to displayName */}
                <h2 className="text-2xl font-bold text-white capitalize">{displayName}</h2>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${user.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {user.isActive ? "Active Account" : "Blocked"}
                </span>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <FiMail className="text-pink-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <FiUser className="text-pink-500" />
                  <span>Role: <span className="text-white font-bold">{user.role}</span></span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                   <FiCalendar className="text-pink-500" />
                   <span>Customer ID: #{user.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order History */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiBox className="text-pink-500" /> Order History ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 text-center text-gray-500">
                This user has not placed any orders yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.orderId} className="bg-[#121212] border border-white/5 rounded-xl p-5 hover:border-pink-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-white text-lg">Order #{order.orderId}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <FiClock size={12} /> {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="mb-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                            order.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 
                            order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                            {order.status}
                            </span>
                        </div>
                        <p className="font-bold text-white">₹{order.totalAmount}</p>
                      </div>
                    </div>
                    
                 
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserEdit;
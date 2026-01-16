import React, { useEffect, useState } from "react";
import SideBar from "./components/sidebar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { 
  FiSearch, FiEye, FiX, FiCheckCircle, FiClock, 
  FiAlertCircle, FiChevronLeft, FiChevronRight, FiAlertTriangle 
} from "react-icons/fi";

// EXACT Backend Enum Mapping (String -> Integer)
// Namespace: ECommerce.Domain.Enums
const STATUS_ENUM_MAP = {
  "Pending": 1,
  "Paid": 2,
  "Failed": 3,
  "Cancelled": 4
};

const STATUS_OPTIONS = Object.keys(STATUS_ENUM_MAP);

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch Orders List
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders", {
        params: { PageNumber: page, PageSize: 10 }
      });
      
      setOrders(res.data.data || res.data.Data || []);
      setTotalPages(res.data.totalPages || res.data.TotalPages || 1);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  // Fetch Full Order Details
  const handleViewDetails = async (orderId) => {
    setShowModal(true);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      setSelectedOrder(res.data);
    } catch (err) {
      toast.error("Failed to load order details");
      setShowModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Update Status
  const handleStatusChange = async (orderId, newStatusString) => {
    try {
      // 1. Get the Integer value matching your Backend Enum
      const statusInt = STATUS_ENUM_MAP[newStatusString];

      if (statusInt === undefined) {
        toast.error("Invalid status selected");
        return;
      }

      // 2. Send Integer to Backend
      await api.put(`/admin/orders/${orderId}/status`, {
        status: statusInt 
      });
      
      toast.success(`Order #${orderId} marked as ${newStatusString}`);
      
      // 3. Update local state
      setOrders(prev => prev.map(o => 
        o.orderId === orderId ? { ...o, status: newStatusString } : o
      ));
      
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatusString }));
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    }
  };

  // Helper for Status Badge Color (Matches your specific statuses)
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Failed": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Cancelled": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "Pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-white/5 text-gray-400 border-white/10";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Order Management</h1>

        {/* Orders Table */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading Orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No orders found.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-gray-300">#{order.orderId}</td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold text-white">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border bg-transparent cursor-pointer focus:outline-none ${getStatusColor(order.status)}`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} className="bg-gray-900 text-gray-300">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleViewDetails(order.orderId)}
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                          title="View Items"
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
            <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg bg-black/20 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <FiChevronLeft />
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg bg-black/20 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ORDER DETAILS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
            
            <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-[#121212] z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiCheckCircle className="text-pink-500" /> Order Details
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              {detailsLoading || !selectedOrder ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-gray-500 text-xs uppercase font-bold">Order ID</p>
                      <p className="text-white font-mono font-bold">#{selectedOrder.orderId}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-gray-500 text-xs uppercase font-bold">User ID</p>
                      <p className="text-white font-mono font-bold">#{selectedOrder.userId}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-gray-500 text-xs uppercase font-bold">Date</p>
                      <p className="text-white font-bold text-sm">
                        {new Date(selectedOrder.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-gray-500 text-xs uppercase font-bold">Total</p>
                      <p className="text-green-400 font-bold">₹{selectedOrder.totalAmount}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-gray-400 font-bold">Current Status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.orderId, e.target.value)}
                      className={`px-4 py-2 rounded-lg font-bold uppercase border bg-transparent cursor-pointer focus:outline-none ${getStatusColor(selectedOrder.status)}`}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} className="bg-gray-900 text-gray-300">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <FiCheckCircle /> Items
                    </h3>
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center text-lg">
                                📦
                              </div>
                              <div>
                                <p className="text-white font-semibold">{item.productName}</p>
                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="text-white font-bold">₹{item.price * item.quantity}</p>
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-center text-gray-500">No items found.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersAdmin;
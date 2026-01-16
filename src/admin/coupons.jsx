import React, { useEffect, useState } from "react";
import SideBar from "./components/sidebar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FiTag, FiPlus, FiX, FiCheck, FiClock, FiPercent, FiDollarSign } from "react-icons/fi";

// DiscountType Enum: Percentage = 1, Flat = 2
const DISCOUNT_TYPES = {
  1: "Percentage",
  2: "Flat Amount"
};

function CouponsAdmin() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form State matching CreateCouponDto
  const [formData, setFormData] = useState({
    code: "",
    discountType: "1", // Default to Percentage (1)
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
    maxUsage: ""
  });

  // Fetch Coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/coupons");
      setCoupons(res.data);
    } catch (err) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Handle Create
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      // Prepare payload matches CreateCouponDto
      const payload = {
        code: formData.code.toUpperCase(),
        discountType: Number(formData.discountType),
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        maxUsage: formData.maxUsage ? Number(formData.maxUsage) : null
      };

      await api.post("/admin/coupons", payload);
      
      toast.success("Coupon created successfully! 🎉");
      setShowModal(false);
      
      // Reset form
      setFormData({
        code: "",
        discountType: "1",
        discountValue: "",
        minOrderAmount: "",
        expiryDate: "",
        maxUsage: ""
      });
      
      fetchCoupons(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Coupons</h1>
            <p className="text-gray-400 mt-1">Manage discounts and offers</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20"
          >
            <FiPlus size={20} /> Create Coupon
          </button>
        </div>

        {/* Coupon Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading Coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-12 text-center">
            <FiTag size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No active coupons found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-[#121212] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-pink-500/30 transition-all">
                {/* Status Indicator */}
                <div className={`absolute top-4 right-4 h-3 w-3 rounded-full ${coupon.isActive ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500"}`}></div>

                <div className="mb-4">
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Code</span>
                   <h3 className="text-2xl font-mono font-black text-white mt-1 tracking-wider">{coupon.code}</h3>
                </div>

                <div className="flex items-center gap-2 text-pink-500 font-bold text-xl mb-4">
                   {coupon.discountType === 1 ? <FiPercent /> : <FiDollarSign />}
                   <span>{coupon.discountValue} {coupon.discountType === 1 ? "OFF" : "Discount"}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-400 border-t border-white/5 pt-4">
                  <div className="flex justify-between">
                    <span>Min Order:</span>
                    <span className="text-white">₹{coupon.minOrderAmount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usage:</span>
                    <span className="text-white">{coupon.usageCount} times</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className="text-white">
                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "Never"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE COUPON MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiPlus className="text-pink-500" /> New Coupon
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code</label>
                <input 
                  required
                  type="text" 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SUMMER50"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-600 focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                    <select 
                        value={formData.discountType}
                        onChange={e => setFormData({...formData, discountType: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none appearance-none"
                    >
                        <option value="1">Percentage (%)</option>
                        <option value="2">Flat Amount (₹)</option>
                    </select>
                </div>
                {/* Value */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                    <input 
                      required
                      type="number" 
                      value={formData.discountValue}
                      onChange={e => setFormData({...formData, discountValue: e.target.value})}
                      placeholder="e.g. 10 or 500"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {/* Min Order */}
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Order (₹)</label>
                    <input 
                      type="number" 
                      value={formData.minOrderAmount}
                      onChange={e => setFormData({...formData, minOrderAmount: e.target.value})}
                      placeholder="Optional"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                    />
                 </div>
                 {/* Max Usage */}
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Uses</label>
                    <input 
                      type="number" 
                      value={formData.maxUsage}
                      onChange={e => setFormData({...formData, maxUsage: e.target.value})}
                      placeholder="Optional"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                    />
                 </div>
              </div>

              {/* Expiry */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  value={formData.expiryDate}
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={creating}
                className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Coupon"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default CouponsAdmin;
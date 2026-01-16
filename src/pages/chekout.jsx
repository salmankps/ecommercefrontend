// src/pages/chekout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./navbar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FiTag, FiShoppingBag, FiArrowRight } from "react-icons/fi";

function CheckOutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destructure all Razorpay props passed from CartPage
  const { orderId, razorpayOrderId, amount, currency, key } = location.state || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [finalAmount, setFinalAmount] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate("/cart");
      return;
    }
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await api.post("/coupons/apply", {
        code: couponCode,
        cartTotal: order.totalAmount,
      });
      setFinalAmount(res.data.finalAmount);
      toast.success("Coupon applied! 🏷️");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setFinalAmount(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const proceedToPayment = () => {
    // Pass everything to Payment Page
    // Note: If coupon applied, finalAmount is used for display, 
    // but Razorpay order might need the original amount if backend doesn't update it.
    // For now, passing data as is.
    navigate("/payment", {
      state: {
        orderId,
        razorpayOrderId,
        amount, // This is the original DB amount from PlaceOrder
        currency,
        key,
        displayAmount: finalAmount ?? amount // Useful if we need to show discounted price
      },
    });
  };

  if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading Order...</div>;

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-28 pb-10 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FiShoppingBag /> Order Summary
          </h1>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-800 rounded-lg flex items-center justify-center text-2xl">📦</div>
                  <div>
                    <h3 className="font-semibold text-white">{item.productName}</h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-white">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiTag /> Discount Code
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Code"
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={applyCoupon}
                disabled={applyingCoupon}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{order.totalAmount}</span>
              </div>
              {finalAmount !== null && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>- ₹{order.totalAmount - finalAmount}</span>
                </div>
              )}
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span>₹{finalAmount ?? order.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={proceedToPayment}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Payment <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckOutPage;
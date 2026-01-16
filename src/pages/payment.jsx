// src/pages/payment.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Helper to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user details for pre-fill
  
  // Destructure passed state
  const { orderId, razorpayOrderId, amount, currency, key, displayAmount } = location.state || {};

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId || !razorpayOrderId) {
      toast.error("Invalid Order Details");
      navigate("/cart");
    }
  }, [orderId, razorpayOrderId, navigate]);

  const handleRazorpayPayment = async () => {
    setLoading(true);

    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    // Options for Razorpay
    const options = {
      key: key, 
      amount: amount, // Amount in lowest denomination (e.g., paise) provided by backend
      currency: currency,
      name: "PlayBox Store",
      description: "Transaction for Order #" + orderId,
      image: "/src/assets/logo.png", // Optional: Add your logo URL here
      order_id: razorpayOrderId, // This is the ID from Razorpay backend
      handler: async function (response) {
        // Success Callback
        try {
          // Verify payment on backend
          // We send the signature to ensure authenticity
          await api.post(`/payments/confirm/${orderId}`, {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });

          toast.success("Payment Successful! 🎉");
          navigate("/placeorder");
        } catch (err) {
          console.error(err);
          toast.error("Payment Verification Failed");
          // Optionally verify status or navigate to failure page
        }
      },
      prefill: {
        name: user?.username || "",
        email: user?.email || "",
        contact: "", // Add phone if available in user profile
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#e71352",
      },
      modal: {
        ondismiss: function() {
           setLoading(false);
           toast.info("Payment Cancelled");
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if(!amount) return null;

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          
          <div className="mx-auto w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-6">
            <FaLock className="text-pink-500 text-2xl" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Secure Payment</h1>
          <p className="text-gray-400 mb-8">Complete your purchase with Razorpay.</p>

          <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Total Payable</div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              {/* Note: amount from backend is usually in subunits (paise), verify if backend sends paise or rupees. 
                  Based on OrderController usually sending Razorpay amount, it's likely paise. 
                  DisplayAmount from checkout is likely rupees. Using displayAmount if available. */}
              ₹{displayAmount || (amount / 100)}
            </div>
          </div>

          <button
            onClick={handleRazorpayPayment}
            disabled={loading}
            className="w-full py-4 bg-[#3395ff] hover:bg-[#287acc] rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
          
          <div className="mt-6 flex justify-center gap-4 opacity-50">
             {/* Icons for visual trust */}
             <FaCreditCard size={20} />
             {/* You can add more icons here */}
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;
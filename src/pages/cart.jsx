// src/pages/cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import api from "../api/axios";
import { toast } from "react-toastify";

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      if (err.response?.status === 404) setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put("/cart/update", { productId, quantity: newQty });
      fetchCart();
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      toast.success("Item removed");
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCreatingOrder(true);

    try {
      // Calls [HttpPost] PlaceOrder which returns { orderId, razorpayOrderId, amount, currency, key }
      const res = await api.post("/orders");
      
      const { orderId, razorpayOrderId, amount, currency, key } = res.data;

      if (!orderId) throw new Error("No order ID returned");

      toast.success("Order initiated! Proceeding to checkout...");

      // Pass ALL Razorpay details to the next page
      navigate("/checkout", {
        state: { orderId, razorpayOrderId, amount, currency, key },
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) return <div className="text-center text-white mt-32">Loading Cart...</div>;

  return (
    <>
      <NavBar />
      <div className="max-w-5xl mx-auto pt-28 px-4 min-h-screen">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        {(!cart || !cart.items || cart.items.length === 0) ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
            <button onClick={() => navigate('/home')} className="text-pink-500 font-bold hover:underline">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-white">{item.productName}</h3>
                    <p className="text-gray-400">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded">−</button>
                    <span className="font-bold text-white w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded">+</button>
                  </div>
                  <div className="text-right min-w-[80px]">
                     <p className="font-bold text-white">₹{item.price * item.quantity}</p>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-300 p-2">✕</button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 h-fit bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>₹{cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={creatingOrder}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50 flex justify-center items-center"
              >
                {creatingOrder ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
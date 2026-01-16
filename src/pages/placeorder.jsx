// src/pages/placeorder.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "./navbar";
import { FaCheckCircle } from "react-icons/fa";

function PlaceOrder() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl max-w-md w-full animate-fade-in-up">
          
          <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase. Your order is being processed.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              View Order Details
            </button>
            
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaceOrder;
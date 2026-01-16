import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; 
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function ProductCard({ item }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const imageUrl = item.images && item.images.length > 0 
    ? item.images[0].imageUrl 
    : "https://i.pinimg.com/736x/f0/7a/d0/f07ad08048227dddbe1ec703867c7302.jpg";

  
  useEffect(() => {
    if (isAuthenticated) {
    
    }
  }, [isAuthenticated, item.id]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    try {
      await api.post("/cart/add", {
        productId: item.id,
        quantity: 1,
      });
      toast.success(`Added ${item.name} to cart`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    try {
      if (isWishlisted) {
        // Remove
        await api.delete(`/wishlist/remove/${item.id}`);
        toast.info("Removed from Wishlist");
        setIsWishlisted(false);
      } else {
        // Add
        await api.post(`/wishlist/add/${item.id}`);
        toast.success("Added to Wishlist ❤️");
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div 
      onClick={() => navigate(`/details/${item.id}`)}
      className="group relative bg-[#121212] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300"
    >
      <div className="relative h-64 w-full overflow-hidden bg-gray-900">
        <img 
          src={imageUrl} 
          alt={item.name} 
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        
      
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-pink-600 transition-all z-10"
        >
          {isWishlisted ? (
             <FaHeart className="text-pink-500" size={18} />
          ) : (
             <FiHeart className="text-white hover:text-pink-500" size={18} />
          )}
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2">
          <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1">
            {item.category?.name || "Figure"}
          </p>
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-pink-500 transition-colors">
            {item.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-white">
            ₹{item.price}
          </span>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-pink-600 hover:text-white transition-all"
          >
            <FiShoppingCart /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
import React, { useEffect, useState } from "react";
import NavBar from "./navbar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FiTrash2, FiShoppingCart, FiHeart } from "react-icons/fi";

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Wishlist Items
  const fetchWishlist = async () => {
    try {
      // API: [HttpGet("get-all")]
      const res = await api.get("/wishlist/get-all");
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Handle Remove Item
  const removeFromWishlist = async (productId) => {
    try {
      // API: [HttpDelete("remove/{productId:int}")]
      await api.delete(`/wishlist/remove/${productId}`);
      
      // Update local state instantly
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  // Handle Move to Cart
  const handleMoveToCart = async (item) => {
    try {
      // API: [HttpPost("Wishmovetocart/{productId:int}")]
      await api.post(`/wishlist/Wishmovetocart/${item.productId}`);
      
      // Remove from local wishlist state after successful move
      setWishlist((prev) => prev.filter((i) => i.productId !== item.productId));
      
      toast.success(`${item.productName} moved to cart! 🛒`);
    } catch (err) {
      // Error handling: if already in cart or other issues
      toast.error(err.response?.data?.message || "Failed to move to cart");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <NavBar />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-8">
          <FiHeart className="text-pink-500 text-3xl" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Your Wishlist
          </h1>
          <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold text-gray-400">
            {wishlist.length} Items
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <FiHeart size={64} className="text-gray-600 mb-6" />
            <p className="text-xl text-gray-400 font-medium">Your wishlist is empty</p>
            <p className="text-gray-500 mt-2">Find something you love and save it here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="group relative bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-900">
                  {/* NOTE: Your WishlistItemResponseDto only has ProductId, ProductName, Price.
                     It misses 'ImageUrl'. I am using a placeholder. 
                     Please add 'public string? ImageUrl { get; set; }' to your DTO in backend.
                  */}
                  <img
                    src={item.imageUrl || "https://placehold.co/400?text=No+Image"} 
                    alt={item.productName}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Floating Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                    title="Remove"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {item.productName}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-pink-500">
                      ₹{item.price}
                    </span>
                    
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-pink-600 hover:text-white transition-all shadow-lg shadow-white/10"
                    >
                      <FiShoppingCart /> Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
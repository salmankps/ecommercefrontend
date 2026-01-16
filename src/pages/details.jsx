import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function ProduDetailsPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // IMAGE STATE
  const [selectedImage, setSelectedImage] = useState("");

  // 1. Fetch Product & Wishlist Status
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Product
        const productRes = await api.get(`/products/${itemId}`);
        const prod = productRes.data;
        setProduct(prod);

        // Set Initial Image (Primary or First)
        if (prod.images && prod.images.length > 0) {
            const primaryImg = prod.images.find(img => img.isPrimary);
            setSelectedImage(primaryImg ? primaryImg.imageUrl : prod.images[0].imageUrl);
        }

        // Fetch Wishlist Status (Only if logged in)
        if (isAuthenticated) {
          const wishlistRes = await api.get("/wishlist/get-all");
          const exists = wishlistRes.data.some(w => w.productId === parseInt(itemId));
          setIsWishlisted(exists);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [itemId, isAuthenticated]);

  // 2. Add To Cart Handler
  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.warning("Please login first");
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart/add", {
        productId: product.id,
        quantity: quantity,
      });
      toast.success("Added to cart 🛒");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // 3. Toggle Wishlist Handler
  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.warning("Please login first");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/remove/${product.id}`);
        setIsWishlisted(false);
        toast.info("Removed from Wishlist");
      } else {
        await api.post(`/wishlist/add/${product.id}`);
        setIsWishlisted(true);
        toast.success("Added to Wishlist ❤️");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading details...
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-white text-center pt-20">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 py-28">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <FiArrowLeft /> Back to collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative group bg-[#121212] rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-pink-500/5 aspect-square">
              <img
                src={selectedImage || "https://placehold.co/600?text=No+Image"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Category Tag */}
              <div className="absolute top-6 left-6 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {product.category?.name || "Collectible"}
              </div>
            </div>

            {/* Thumbnails (Only show if more than 1 image) */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img) => (
                  <div 
                    key={img.id}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === img.imageUrl ? "border-pink-500 opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: INFO & ACTIONS */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                {product.description || "No description available for this masterpiece."}
              </p>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              ₹{product.price}
            </div>

            <div className="h-px bg-white/10 my-2"></div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              
              {/* Quantity Selector */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2 h-14">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <FiPlus />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={addToCart}
                className="flex-1 h-14 bg-white text-black font-bold rounded-xl hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-white/5"
              >
                <FiShoppingCart size={20} /> Add to Cart
              </button>

              {/* Wishlist Toggle */}
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`h-14 w-14 rounded-xl border border-white/10 flex items-center justify-center transition-all ${
                  isWishlisted 
                    ? "bg-pink-500/10 border-pink-500 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {isWishlisted ? <FaHeart size={24} /> : <FiHeart size={24} />}
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-gray-500 text-xs uppercase font-bold">Stock Status</span>
                <p className="text-green-400 font-semibold flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-gray-500 text-xs uppercase font-bold">Authenticity</span>
                <p className="text-white font-semibold mt-1">100% Original</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProduDetailsPage;
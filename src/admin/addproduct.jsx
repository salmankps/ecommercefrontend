import React, { useState, useEffect } from "react";
import SideBar from "./components/sidebar";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSave, FiArrowLeft, FiUploadCloud } from "react-icons/fi";

function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // Store the file object
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: 10, // Matches backend DTO property 'StockQuantity'
    isActive: true
  });

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories"));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // STEP 1: Create the Product Basic Info
      // Backend expects: Name, Description, Price, StockQuantity, CategoryId, IsActive
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        stockQuantity: Number(formData.stockQuantity),
        isActive: formData.isActive
      };

      const res = await api.post("/products", productPayload);
      const newProductId = res.data.id; // Backend returns { id: ... }

      // STEP 2: Upload Image (if selected)
      if (imageFile && newProductId) {
        const imageFormData = new FormData();
        imageFormData.append("File", imageFile);
        imageFormData.append("IsPrimary", "true");

        // Call the separate Image Controller
        await api.post(`/products/${newProductId}/images`, imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      toast.success("Product created successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />
      <main className="flex-1 p-8 overflow-y-auto">
        <button onClick={() => navigate("/products")} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <FiArrowLeft /> Back to Products
        </button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Add New Product</h1>

          <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/5 p-8 rounded-2xl shadow-xl space-y-6">
            
            {/* Image Upload Input */}
            <div className="bg-black/30 border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-pink-500 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <FiUploadCloud size={32} className={imageFile ? "text-pink-500" : "text-gray-500"} />
                <span className="text-gray-400 font-medium">
                  {imageFile ? imageFile.name : "Click to Upload Product Image"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                <input 
                  required type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Price</label>
                <input 
                  required type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <select 
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Stock Quantity</label>
                <input 
                  required type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
              <textarea 
                required rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all flex justify-center items-center gap-2"
            >
              <FiSave size={20} /> {loading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddProduct;
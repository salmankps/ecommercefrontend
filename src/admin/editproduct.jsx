import React, { useState, useEffect } from "react";
import SideBar from "./components/sidebar";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSave, FiArrowLeft, FiTrash2, FiUpload, FiImage } from "react-icons/fi";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [newImage, setNewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: 0,
    isActive: true
  });

  // Load Data
  useEffect(() => {
    const loadData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                api.get("/categories"),
                api.get(`/products/${id}`)
            ]);
            
            setCategories(catRes.data);
            const p = prodRes.data;
            
            setFormData({
                name: p.name,
                description: p.description,
                price: p.price,
                categoryId: p.category?.id, 
                stockQuantity: p.stockQuantity, 
                isActive: true // Assuming active if fetching worked
            });

            // Set images from ProductDto
            setExistingImages(p.images || []);

        } catch(err) {
            toast.error("Failed to load details");
            navigate("/products");
        } finally {
            setDataLoading(false);
        }
    };
    loadData();
  }, [id, navigate]);

  // Update Basic Info
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/products/${id}`, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        stockQuantity: Number(formData.stockQuantity),
        isActive: formData.isActive
      });
      toast.success("Product Info Updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Upload New Image
  const handleUploadImage = async () => {
    if (!newImage) return;
    try {
        const data = new FormData();
        data.append("File", newImage);
        data.append("IsPrimary", existingImages.length === 0 ? "true" : "false");

        await api.post(`/products/${id}/images`, data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        
        toast.success("Image Uploaded");
        setNewImage(null);
        // Refresh product data to show new image
        const res = await api.get(`/products/${id}`);
        setExistingImages(res.data.images || []);

    } catch (err) {
        toast.error("Image upload failed");
    }
  };

  // Delete Image
  const handleDeleteImage = async (imageId) => {
      if(!window.confirm("Delete this image?")) return;
      try {
          await api.delete(`/products/${id}/images/${imageId}`);
          setExistingImages(prev => prev.filter(img => img.id !== imageId));
          toast.success("Image Deleted");
      } catch (err) {
          toast.error("Failed to delete image");
      }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />
      <main className="flex-1 p-8 overflow-y-auto">
        <button onClick={() => navigate("/products")} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <FiArrowLeft /> Back to Products
        </button>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Image Management */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FiImage /> Product Images
                </h3>
                
                {/* Image List */}
                <div className="space-y-4 mb-6">
                    {existingImages.length === 0 && <p className="text-gray-500 text-sm">No images yet.</p>}
                    {existingImages.map(img => (
                        <div key={img.id} className="relative group rounded-lg overflow-hidden border border-white/10">
                            <img src={img.imageUrl} alt="Product" className="w-full h-32 object-cover" />
                            <button 
                                onClick={() => handleDeleteImage(img.id)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FiTrash2 size={14} />
                            </button>
                            {img.isPrimary && <span className="absolute bottom-2 left-2 bg-pink-600 text-[10px] px-2 py-1 rounded font-bold text-white">PRIMARY</span>}
                        </div>
                    ))}
                </div>

                {/* Upload New */}
                <div className="pt-4 border-t border-white/10">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Upload New Image</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setNewImage(e.target.files[0])}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-pink-600 transition-all mb-3"
                    />
                    <button 
                        onClick={handleUploadImage}
                        disabled={!newImage}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                    >
                        <FiUpload /> Upload
                    </button>
                </div>
             </div>
          </div>

          {/* RIGHT: Basic Info Form */}
          <div className="lg:col-span-2">
            {dataLoading ? <div className="text-white">Loading...</div> : (
                <form onSubmit={handleUpdateInfo} className="bg-[#121212] border border-white/5 p-8 rounded-2xl shadow-xl space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Product Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Price</label>
                        <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none appearance-none">
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Stock Quantity</label>
                        <input required type="number" value={formData.stockQuantity} onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all flex justify-center items-center gap-2">
                    <FiSave size={20} /> {loading ? "Saving..." : "Save Changes"}
                </button>
                </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditProduct;
import React, { useEffect, useState } from "react";
import SideBar from "./components/sidebar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLayers } from "react-icons/fi";

function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = Create Mode
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setShowModal(true);
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    
    setSubmitting(true);
    try {
      if (editingCategory) {
        // UPDATE: PUT /api/categories/{id}
        await api.put(`/categories/${editingCategory.id}`, { name: categoryName });
        toast.success("Category updated");
      } else {
        // CREATE: POST /api/categories
        await api.post("/categories", { name: categoryName });
        toast.success("Category created");
      }
      
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This might affect products linked to it.")) return;
    
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Categories</h1>
            <p className="text-gray-400 mt-1">Organize your products</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20"
          >
            <FiPlus size={20} /> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-12 text-center">
            <FiLayers size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-pink-500/30 transition-all group"
              >
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">ID: {cat.id}</span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-pink-500 transition-colors">
                    {cat.name}
                  </h3>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingCategory ? <FiEdit2 className="text-pink-500" /> : <FiPlus className="text-pink-500" />}
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Action Figures"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : (editingCategory ? "Update Category" : "Create Category")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesAdmin;
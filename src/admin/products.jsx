import React, { useEffect, useState } from "react";
import SideBar from "./components/sidebar";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: {
          Search: search,
          PageNumber: page,
          PageSize: 10,
        },
      });
      // Handle PascalCase/camelCase response
      setProducts(res.data.data || res.data.Data || []);
      setTotalPages(res.data.totalPages || res.data.TotalPages || 1);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Products</h1>
            <p className="text-gray-400 mt-1">Manage your inventory</p>
          </div>
          <Link
            to="/addproduct"
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20"
          >
            <FiPlus size={20} /> Add New
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">No products found.</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-gray-800 overflow-hidden border border-white/10">
                            <img 
                               src={p.images?.[0]?.imageUrl || "https://placehold.co/100?text=No+Img"} 
                               alt="" 
                               className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-white group-hover:text-pink-500 transition-colors">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{p.category?.name || "-"}</td>
                      <td className="p-4 font-bold text-white">₹{p.price}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => navigate(`/editproduct/${p.id}`)}
                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
             <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
             <div className="flex gap-2">
               <button 
                 disabled={page === 1}
                 onClick={() => setPage(p => p - 1)}
                 className="p-2 rounded-lg bg-black/20 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
               >
                 <FiChevronLeft />
               </button>
               <button 
                 disabled={page === totalPages}
                 onClick={() => setPage(p => p + 1)}
                 className="p-2 rounded-lg bg-black/20 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30"
               >
                 <FiChevronRight />
               </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductsAdmin;
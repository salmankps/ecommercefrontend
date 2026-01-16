import React, { useEffect, useState } from "react";
import NavBar from "./navbar";
import api from "../api/axios";
import ProductCard from "../components/productcard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Category Images (You can replace these URLs with your local assets if you have them)
const categories = [
  { id: 1, name: "MARVEL", color: "from-red-600 to-red-900", img: "https://wallpapers.com/images/hd/marvel-characters-1920-x-1080-wallpaper-5047dr3e3n3a7t21.jpg" },
  { id: 2, name: "DC", color: "from-blue-600 to-blue-900", img: "https://wallpapers.com/images/featured/dc-comics-vm1626j8k648530m.jpg" },
  { id: 3, name: "ANIME", color: "from-orange-500 to-yellow-600", img: "https://wallpapers.com/images/hd/anime-characters-1920-x-1080-wallpaper-ec7e443171501633.jpg" },
  { id: 4, name: "STAR WARS", color: "from-slate-700 to-black", img: "https://wallpapers.com/images/hd/star-wars-characters-1920-x-1080-wallpaper-2776882292728282.jpg" }
];

function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  
  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  
  const [loading, setLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          PageNumber: pageNumber,
          PageSize: pageSize,
        };

        if (search) params.Search = search;
        if (categoryId) params.CategoryId = categoryId;

        const res = await api.get("/products", { params });
        
        // Handle potentially varying backend responses (PascalCase vs camelCase)
        setProducts(res.data.data || res.data.Data || []);
        setTotalPages(res.data.totalPages || res.data.TotalPages || 1);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, categoryId, pageNumber, pageSize]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar search={searchInput} upSearch={setSearchInput} />

      {/* CATEGORY HERO SECTION */}
      {/* Only show categories if not searching, to keep focus */}
      {!search && (
        <div className="pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-[500px] w-full">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setCategoryId(cat.id === categoryId ? null : cat.id);
                  setPageNumber(1);
                }}
                className={`relative group cursor-pointer overflow-hidden border-r border-black/50 last:border-r-0 ${
                  categoryId === cat.id ? "ring-4 ring-inset ring-pink-500 z-10" : ""
                }`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.img})` }}
                />
                
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-40 transition-opacity`} />

                {/* Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-4xl font-black tracking-widest text-white drop-shadow-lg group-hover:translate-y-[-10px] transition-transform duration-300">
                    {cat.name}
                  </h2>
                </div>

                {/* Active Indicator */}
                {categoryId === cat.id && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-pink-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS SECTION */}
      <div className={`max-w-7xl mx-auto px-6 py-12 ${search ? 'pt-28' : ''}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold border-l-4 border-pink-500 pl-4">
            {search ? `Results for "${search}"` : categoryId ? "Category Results" : "Latest Arrivals"}
          </h2>
          {categoryId && (
            <button 
              onClick={() => setCategoryId(null)} 
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No figures found in this sector.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
        )}

        {/* MODERN PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((p) => p - 1)}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-pink-600 hover:border-pink-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <FiChevronLeft size={24} />
            </button>

            <span className="text-lg font-mono text-gray-400">
              <span className="text-white font-bold">{pageNumber}</span> / {totalPages}
            </span>

            <button
              disabled={pageNumber === totalPages}
              onClick={() => setPageNumber((p) => p + 1)}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-pink-600 hover:border-pink-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
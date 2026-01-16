import React, { useEffect, useState } from "react";
import NavBar from "./navbar";
import api from "../api/axios";
import ProductCard from "../components/productcard";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";

// Hardcoded categories to match your backend IDs (from Home page logic)
const CATEGORIES = [
  { id: 1, name: "Marvel" },
  { id: 2, name: "DC" },
  { id: 3, name: "Anime" },
  { id: 4, name: "Star Wars" },
];

function Allfigure() {
  // Search State
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Filter States
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState(""); // 'Price', 'Name'
  const [sortOrder, setSortOrder] = useState(""); // 'asc', 'desc'
  
  // UI States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Construct params object based on ProductQueryDto
      const params = {
        PageNumber: 1,
        PageSize: 100,
        Search: search || undefined,
        CategoryId: categoryId || undefined,
        MinPrice: minPrice || undefined,
        MaxPrice: maxPrice || undefined,
        SortBy: sortBy || undefined,
        Order: sortOrder || undefined,
      };

      const res = await api.get("/products", { params });
      
      // Handle PascalCase/camelCase response
      setProducts(res.data.data || res.data.Data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when any filter changes
  useEffect(() => {
    fetchProducts();
  }, [search, categoryId, minPrice, maxPrice, sortBy, sortOrder]);

  // Handlers
  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "price_asc") {
      setSortBy("Price");
      setSortOrder("asc");
    } else if (value === "price_desc") {
      setSortBy("Price");
      setSortOrder("desc");
    } else if (value === "name_asc") {
      setSortBy("Name");
      setSortOrder("asc");
    } else {
      setSortBy("");
      setSortOrder("");
    }
  };

  const clearFilters = () => {
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setSortOrder("");
    setSearchInput("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <NavBar search={searchInput} upSearch={setSearchInput} />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        
        {/* Header & Mobile Filter Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Collection
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {products.length} Items Found
            </p>
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-bold"
          >
            <FiFilter /> Filters
          </button>
        </div>

        {/* Filter Bar (Desktop: Always visible / Mobile: Toggle) */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-8`}>
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 flex flex-wrap items-end gap-6">
            
            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="bg-black/30 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:border-pink-500 focus:outline-none min-w-[140px]"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-black/30 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 w-24 focus:border-pink-500 focus:outline-none"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-black/30 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 w-24 focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Sort By</label>
              <div className="relative">
                <select
                  onChange={handleSortChange}
                  className="bg-black/30 border border-white/10 text-white text-sm rounded-lg pl-3 pr-8 py-2.5 focus:border-pink-500 focus:outline-none appearance-none min-w-[160px]"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Reset Button */}
            <button 
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors ml-auto md:ml-0"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <p className="text-xl text-gray-400">No products match your filters.</p>
            <button onClick={clearFilters} className="mt-4 text-pink-500 hover:underline">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Allfigure;
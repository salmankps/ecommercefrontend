import React from 'react';
import { FiSearch } from 'react-icons/fi';

function SearchBar({ search, upSearch }) {
  return (
    <div className="relative w-full max-w-md mx-4 group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 group-focus-within:text-pink-500 transition-colors" />
      </div>
      <input
        type="search"
        placeholder="Search figures..."
        value={search}
        onChange={(e) => upSearch(e.target.value)}
        className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
      />
    </div>
  );
}

export default SearchBar;
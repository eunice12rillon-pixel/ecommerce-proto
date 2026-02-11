import { Search } from "lucide-react";
import React, { useState } from "react";

export default function SearchBar({ placeholder = "Search...", onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query); // tatawagin sa parent para i-filter products
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full justify-end">
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-96 transition-colors duration-200 bg-white focus-within:ring-2 focus-within:ring-blue-400">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onSearch) onSearch(e.target.value); // live search habang nagta-type
          }}
          placeholder={placeholder}
          className="flex-1 focus:outline-none bg-transparent text-gray-800"
        />
        <button type="submit">
          <Search className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </button>
      </div>
    </form>
  );
}

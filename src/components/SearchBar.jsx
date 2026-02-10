import { Search } from "lucide-react";

export default function SearchBar({ placeholder = "Search..." }) {
  return (
    <div className="flex w-full justify-end">
      {" "}
      {/* naka-gilid */}
      {/* Search input with icon inside */}
      <div className="flex items-center border border-black bg-white px-2 py-1 w-64">
        <input
          type="text"
          className="flex-1 focus:outline-none p-1"
          placeholder={placeholder}
        />
        <Search className="w-5 h-5 text-gray-500 ml-2" />
      </div>
    </div>
  );
}

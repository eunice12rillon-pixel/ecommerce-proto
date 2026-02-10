import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function ProductsGrid({ products = [] }) {
  const location = useLocation(); // para malaman ang current path

  const showSeeAll = location.pathname !== "/products"; // ipakita lang kapag hindi sa /products

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header sa product grid para hindi sila nakasagad sa taas*/}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>

        {showSeeAll && (
          <Link to="/products" className="text-blue-600 hover:underline">
            See All
          </Link>
        )}
      </div>

      {/* Grid para hiwalay product with details*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm 
                       flex flex-col items-center transition-all duration-300 
                       hover:shadow-md hover:scale-105 hover:bg-yellow-50 hover:text-brown-700 cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col items-center text-center">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {product.description}
              </p>
              <p className="mt-2 font-bold text-brown-700">₱{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

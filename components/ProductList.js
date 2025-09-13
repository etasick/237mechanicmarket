import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const itemsPerPage = 6;

  useEffect(() => {
    let updatedProducts = [...products];

    // Filtering
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    switch (sortOrder) {
      case "price-asc":
        updatedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        updatedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    // Update total results
    setTotalResults(updatedProducts.length);

    // Pagination
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = updatedProducts.slice(startIdx, startIdx + itemsPerPage);
    setFilteredProducts(paginatedProducts);
  }, [searchQuery, sortOrder, currentPage, products]);

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Generate page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Results Info and Sorting */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          Showing {filteredProducts.length} of {totalResults} results
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex justify-center mt-6 space-x-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === number
                  ? "bg-blue-500 text-white border-blue-500"
                  : "hover:bg-gray-100"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
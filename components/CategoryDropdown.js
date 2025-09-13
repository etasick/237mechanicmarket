"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added missing state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = `
          *[_type == "category"]{
            _id,
            name,
            "slug": slug.current,
            "productCount": count(*[_type == "product" && references(^._id)])
          }
        `;
        const data = await sanityClient.fetch(query);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center justify-between text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span>Exports</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <ul className="absolute z-10 bg-white text-black mt-2 w-48 shadow-lg rounded-md max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <li key={category._id} className="hover:bg-gray-200">
              <Link
                href={`/product-category/${category.slug}`}
                className="block px-4 py-2"
                onClick={() => setIsDropdownOpen(false)}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity"; // Ensure you have a configured Sanity client

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

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
    <section className="py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">Top Exports from cameroon</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 md:px-16">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-xl"
          >
            <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
            {category.productCount !== undefined && (
              <p className="text-gray-600 mb-4">
                {category.productCount}{" "}
                {category.productCount === 1 ? "Product" : "Products"}
              </p>
            )}
            <Link
              href={`/product-category/${category.slug}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Explore exports
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";

const RelatedProducts = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const query = `*[_type == "product" && category->._id == $categoryId && _id != $currentId] {
          _id,
          name,
          price,
          isVariable,
          variations[] { price },
          "slug": slug.current,
          "picture": picture,
          category->{title}
        }[0...3]`; // Get first 3 related products

        const params = {
          categoryId: product.category?._id,
          currentId: product._id
        };

        const data = await sanityClient.fetch(query, params);
        setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (product?.category?._id) {
      fetchRelatedProducts();
    }
  }, [product]);

  if (!relatedProducts.length || loading) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8 border-b pb-2">Other products avaialable for exports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((item) => (
          <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/product/${item.slug}`} className="block">
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={item.picture || "/default-image.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-blue-600 font-medium">
                  For exports
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
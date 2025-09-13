"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart, FaStar, FaRegStar, FaArrowRight } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { name, price, picture, reviewSummary, slug, isVariable, variations, description } = product;

  // Determine pricing information
  const minPrice = isVariable && variations?.length > 0 
    ? Math.min(...variations.map((v) => v.price))
    : price;

  // Truncate description to 100 characters
  const truncatedDescription = description?.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col font-sans bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Product Image with Export Tag */}
      <Link href={`/product/${slug}`} className="relative block group">
        <Image
          src={picture || "/default-image.jpg"}
          alt={name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
          {minPrice !== undefined ? `Export Ready` : "Available Soon"}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col p-4 flex-grow">
        {/* Product Name */}
        <h2 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
          <Link href={`/product/${slug}`}>{name}</Link>
        </h2>

        {/* Price */}
        <div className="mt-1">
          <span className="text-lg font-bold text-blue-600">
            {minPrice ? `` : "Price on request"}
          </span>
        </div>

        {/* Rating */}
        {reviewSummary?.count > 0 && (
          <div className="mt-2 flex items-center">
            <div className="flex mr-1">
              {renderStars(reviewSummary.averageRating)}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({reviewSummary.count})
            </span>
          </div>
        )}

        {/* Description with Read More */}
        <div className="mt-3 text-sm text-gray-600 flex-grow">
          {showFullDescription ? description : truncatedDescription}
          {description?.length > 100 && (
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-800 font-medium ml-1 focus:outline-none"
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-between space-x-2">
          <Link 
            href={`/product/${slug}`}
            className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md text-center transition-colors flex items-center justify-center"
          >
            Details <FaArrowRight className="ml-2" />
          </Link>
          <button
            onClick={() => window.location.href = '/contact-us'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            Get Quote <FaShoppingCart className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
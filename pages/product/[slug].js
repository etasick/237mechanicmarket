export const runtime = 'experimental-edge';

import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import Reviews from "@/components/Reviews";
import RelatedProducts from "@/components/RelatedProducts";
import FeaturesSection from "@/components/FeaturesSection";
import GetQuoteButton from "@/components/GetQuote";
import { sanityClient } from "@/lib/sanity";

// Fetch all product slugs to generate static paths
export async function getStaticPaths() {
  const query = `*[_type == "product"]{ "slug": slug.current }`;
  const products = await sanityClient.fetch(query);

  const paths = products.map((product) => ({
    params: {  slug: product.slug }, // Change "default" if stores are dynamic
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

// Fetch product details from Sanity
export async function getStaticProps({ params }) {
  const { slug } = params;

  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id, name, description, category->{title,_id}, stock, picture, price, isVariable, variations
  }`;

  const product = await sanityClient.fetch(query, { slug });

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product, slug },
    revalidate: 60, // Regenerate every 60 seconds
  };
}

const ProductDetails = ({ product, slug }) => {
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [review, setReview] = useState({ name: "", rating: "", review: "" });
  const [notification, setNotification] = useState(null);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = {
        _type: "review",
        product: {
          _type: "reference",
          _ref: product._id, // Reference the product
        },
        name: review.name,
        rating: parseInt(review.rating, 10),
        review: review.review,
        date: new Date().toISOString(),
        approved: false, // Default to unapproved
      };
  
      await sanityClient.create(newReview);
  
      setNotification("Review submitted! Pending admin approval.");
      setReview({ name: "", rating: "", review: "" });
    } catch (err) {
      setNotification("Failed to submit review: " + err.message);
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <Head>
        <title>{product.name} | MadeinKamer</title>
                
      </Head>

      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2">
          <Image src={product.picture || "/default-image.jpg"} alt={product.name} width={500} height={500} className="rounded-lg shadow-lg" />
        </div>
       
        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <GetQuoteButton/>
          
          <div className="mt-4 text-lg font-semibold">
            {" "}
            {product.isVariable
              ? `From $${Math.min(...product.variations.map((v) => v.price)).toFixed(2)}`
              : `${("For exports"|| "")}`}
          </div>
          <p className="mt-4 text-slate-600">{product.description}</p>
          {product.isVariable && (
            <div className="mt-4">
              <label htmlFor="variation" className="block mb-2">Select Variation:</label>
              <select
                id="variation"
                className="w-full border rounded p-2"
                value={selectedVariation?.size || ""}
                onChange={(e) => {
                  const selected = product.variations.find((v) => v.size === e.target.value);
                  setSelectedVariation(selected);
                }}
              >
                <option value="">-- Select --</option>
                {product.variations.map((variation) => (
                  <option key={variation.size} value={variation.size}>
                    {variation.size} - ${variation.price.toFixed(2)}
                  </option>
                ))}
              </select>
              
            </div>
          )}
        </div>
      </div>

      <RelatedProducts product={product} />

      
    </div>
  );
};

export default ProductDetails;

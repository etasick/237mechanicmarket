'use client'; // Required for useTranslations hook

import React, { useEffect, useState } from "react";
import { client } from "@/lib/amplifyClient";
import { listListings, listCategories } from "@/src/graphql/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import publicClient from "@/src/amplifyPublicClient";
import { listListingsWithCategory } from "@/src/graphql/customQueries";
import Link from "next/link";
import { useTranslations } from 'next-intl'; // Import useTranslations

const standardSpareParts = [
  "partName",
  "compatibleVehicles",
  "brand",
  "origin",
  "region",
  "city",
  "featured",
];

export default function SparePartsForSalePage() {
  const t = useTranslations('SpareParts'); // Use translations for this page
  const commonT = useTranslations('common'); // For common translations
  
  const [filters, setFilters] = useState({
    keyword: "",
    brand: "",
    region: "",
    city: "",
    featured: "",
    sortBy: "createdAt_DESC",
  });

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sparePartsCategory, setSparePartsCategory] = useState(null);

  const brands = ["Bosch", "Denso", "NGK", "Toyota Genuine", "Mercedes OEM"];
  const regions = [
    "Littoral", "Centre", "North West", "South West",
    "Far North", "West", "East", "South", "Adamawa", "North"
  ];
  const cities = ["Douala", "Yaoundé", "Bamenda", "Tiko","Limbe","Mutengene","Bafang"];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (sparePartsCategory) fetchListings();
  }, [filters, sparePartsCategory]);

  async function fetchCategories() {
    try {
      const { data } = await publicClient.graphql({ query: listCategories });
      setCategories(data.listCategories.items);
      const cat = data.listCategories.items.find(c => c.slug === "spare-parts");
      setSparePartsCategory(cat);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  async function fetchListings() {
    if (!sparePartsCategory) return;
    setLoading(true);
    try {
      const filterInput = {
        categoryId: { eq: sparePartsCategory.id },
        ...(filters.keyword && { title: { contains: filters.keyword } }),
        ...(filters.city && { location: { contains: filters.city } }),
        ...(filters.region && { region: { eq: filters.region } }),
        ...(filters.featured && { isFeatured: { eq: filters.featured === "true" } }),
      };

      const res = await publicClient.graphql({
        query: listListingsWithCategory,
        variables: { filter: filterInput, limit: 50 },
      });

      let items = res.data.listListings.items || [];

      // Parse spare parts specs
      items = items.map((item) => {
        let specsObj = {};
        try {
          specsObj = typeof item.specs === "string" ? JSON.parse(item.specs) : item.specs || {};
        } catch {}
        standardSpareParts.forEach((key) => {
          if (!specsObj[key]) specsObj[key] = "";
        });
        return { ...item, specs: specsObj };
      });

      // Client-side filtering
      if (filters.brand) {
        items = items.filter(
          (item) =>
            item.specs.brand &&
            item.specs.brand.toLowerCase() === filters.brand.toLowerCase()
        );
      }

      // Sorting
      if (filters.sortBy === "price_ASC") items.sort((a, b) => (a.price || 0) - (b.price || 0));
      else if (filters.sortBy === "price_DESC") items.sort((a, b) => (b.price || 0) - (a.price || 0));
      else if (filters.sortBy === "createdAt_ASC") items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      else if (filters.sortBy === "createdAt_DESC") items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setListings(items);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
    setLoading(false);
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-1/4 bg-white shadow p-4 rounded">
          <h2 className="text-lg font-bold mb-4">{t('filters.title')}</h2>
          <input
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder={t('filters.searchPlaceholder')}
            className="border p-2 rounded w-full mb-2"
          />
          <select
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">{t('filters.allBrands')}</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">{t('filters.allRegions')}</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">{t('filters.allCities')}</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            name="featured"
            value={filters.featured}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">{t('filters.featuredAll')}</option>
            <option value="true">{t('filters.featuredOnly')}</option>
            <option value="false">{t('filters.nonFeaturedOnly')}</option>
          </select>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="createdAt_DESC">{t('sort.newestFirst')}</option>
            <option value="createdAt_ASC">{t('sort.oldestFirst')}</option>
            <option value="price_ASC">{t('sort.priceLowToHigh')}</option>
            <option value="price_DESC">{t('sort.priceHighToLow')}</option>
          </select>
        </aside>

        {/* Spare Parts Listings */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>{t('listings.loading')}</p>
          ) : listings.length === 0 ? (
            <p>{t('listings.noResults')}</p>
          ) : (
            listings.map((part) => (
              <div
                key={part.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={part.mainImageUrl || "/placeholder-part.jpg"}
                  alt={part.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="font-semibold text-lg">{part.specs.partName}</h3>
                  <p className="text-gray-500">
                    {part.specs.brand} • {part.specs.origin}
                  </p>
                  <p className="text-sm text-gray-400">
                    {part.specs.region} {part.specs.city && `, ${part.specs.city}`}
                  </p>
                  <p className="text-red-600 font-bold">
                    {part.price
                      ? `${part.price} ${part.currency || "FCFA"}`
                      : t('listings.priceOnRequest')}
                  </p>
                  <Link
                    href={`/listings/${part.category.slug}/${part.id}`}
                    className="mt-auto inline-block bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700"
                  >
                    {t('listings.viewDetails')}
                  </Link>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
      locale,
    },
  };
}
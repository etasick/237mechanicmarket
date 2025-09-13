import React, { useEffect, useState } from "react";
import { client } from "@/lib/amplifyClient";
import { listListings, listCategories } from "@/src/graphql/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

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
      const { data } = await client.graphql({ query: listCategories });
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

      const res = await client.graphql({
        query: listListings,
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
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          <input
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder="Search parts..."
            className="border p-2 rounded w-full mb-2"
          />
          <select
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            name="featured"
            value={filters.featured}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">Featured & Non-Featured</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured Only</option>
          </select>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="createdAt_DESC">Newest First</option>
            <option value="createdAt_ASC">Oldest First</option>
            <option value="price_ASC">Price: Low to High</option>
            <option value="price_DESC">Price: High to Low</option>
          </select>
        </aside>

        {/* Spare Parts Listings */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading spare parts...</p>
          ) : listings.length === 0 ? (
            <p>No spare parts found.</p>
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
                      : "Price on request"}
                  </p>
                  <Link
                    href={`/listing/${part.id}`}
                    className="mt-auto inline-block bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700"
                  >
                    View Details
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

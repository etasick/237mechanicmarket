import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listListings, listCategories } from "@/src/graphql/queries";
import { listListingsWithCategory } from "@/src/graphql/customQueries";
import { client } from "@/lib/amplifyClient";
import Head from 'next/head';
import publicClient from "@/src/amplifyPublicClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useTranslations } from 'next-intl';

// Helper to parse specs JSON safely
function parseSpecs(specs) {
  try {
    return typeof specs === "string" ? JSON.parse(specs) : specs || {};
  } catch {
    return {};
  }
}

// Category-specific filters
const categoryFilters = {
  cars: [
    "manufacturer",
    "model",
    "year",
    "mileage",
    "fuelType",
    "transmission",
    "driveType",
    "engineSize",
    "color",
    "bodyType",
    "region",
    "city",
    "condition",
    "featured",
  ],
  motorcycles: [
    "manufacturer",
    "model",
    "year",
    "mileage",
    "engineCapacity",
    "bikeType",
    "color",
    "region",
    "city",
    "condition",
    "featured",
  ],
  spareParts: [
    "partName",
    "compatibleVehicles",
    "brand",
    "origin",
    "region",
    "city",
    "featured",
  ],
  default: ["manufacturer", "model", "year", "mileage", "region", "city", "condition", "featured"],
};

// Example static data
const manufacturers = ["Toyota", "Mercedes", "Nissan", "Kia", "Honda", "Hyundai", "BMW", "Peugeot"];
const models = ["Corolla", "Hilux", "Civic", "C-Class", "Navara", "Sportage","rx350"];
const regions = ["Littoral", "Centre", "North West", "South West"];
const cities = ["Douala", "Yaoundé", "Bamenda", "Buea"];
const conditions = ["new", "used"];

export default function CarsForSalePage({ initialCategory = "cars" }) {
  const t = useTranslations('CarsForSale');
  const tCommon = useTranslations('Common');
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const router = useRouter();

  // Get query params in App Router
  const getQueryParams = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return {
        region: params.get('region'),
        city: params.get('city')
      };
    }
    return { region: null, city: null };
  };

  const { region, city } = getQueryParams();

  const [filters, setFilters] = useState({
    keyword: "",
    manufacturer: "",
    model: "",
    region: region || "",
    city: city || "",
    condition: "",
    featured: "",
    sortBy: "createdAt_DESC",
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchListings();
    }
  }, [filters, selectedCategoryId]);

  async function fetchCategories() {
    try {
      const res = await publicClient.graphql({ query: listCategories });
      const cats = res.data.listCategories.items;
      setCategories(cats);

      // Map slug to categoryId
      const cat = cats.find((c) => c.slug === initialCategory); // initialCategory = "cars"
      if (cat) setSelectedCategoryId(cat.id);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  useEffect(() => {
    if (region || city) {
      setFilters((prev) => ({
        ...prev,
        region: region || "",
        city: city || "",
      }));
    }
  }, [region, city]);

  // Fetch listings whenever filters or category change
  useEffect(() => {
    fetchListings();
  }, [filters, selectedCategory]);

  const getFiltersForCategory = (category) => categoryFilters[category] || categoryFilters.default;

  async function fetchListings() {
    if (!selectedCategoryId) return;
    setLoading(true);
    try {
      // Prepare allowed filter fields for GraphQL input
       
      const filterInput = {
        categoryId: { eq: selectedCategoryId }, // slug e.g., "cars"
        ...(filters.keyword && { title: { contains: filters.keyword } }),
        ...(filters.city && { location: { contains: filters.city } }),
        ...(filters.region && { region: { eq: filters.region } }),
        ...(filters.condition && { condition: { eq: filters.condition } }),
        ...(filters.featured && { isFeatured: { eq: filters.featured === "true" } }),
      };

      const res = await publicClient.graphql({
        query: listListingsWithCategory,
        variables: { filter: filterInput, limit: 20 },
      });

      let items = res.data.listListings.items.filter((i) => i.status === "APPROVED") || [];
        items = items.map((item) => ({
  ...item,
  specs: typeof item.specs === "string" ? JSON.parse(item.specs) : item.specs || {},
}));
       if (filters.manufacturer) {
      items = items.filter(
        (item) =>
          item.specs &&
          item.specs.manufacturer &&
          item.specs.manufacturer.toLowerCase() === filters.manufacturer.toLowerCase()
      );
    }

    if (filters.model) {
      items = items.filter(
        (item) =>
          item.specs &&
          item.specs.model &&
          item.specs.model.toLowerCase() === filters.model.toLowerCase()
      );
    }

      // Manual sorting
      if (filters.sortBy === "price_ASC") items.sort((a, b) => (a.price || 0) - (b.price || 0));
      if (filters.sortBy === "price_DESC") items.sort((a, b) => (b.price || 0) - (a.price || 0));
      if (filters.sortBy === "createdAt_ASC") items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      if (filters.sortBy === "createdAt_DESC") items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setListings(items);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
    setLoading(false);
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setFilters({
      keyword: "",
      manufacturer: "",
      model: "",
      region: "",
      city: "",
      condition: "",
      featured: "",
      sortBy: "createdAt_DESC",
    });
  };

  const getFilterLabel = (filterKey) => {
    switch (filterKey) {
      case "manufacturer": return t('manufacturer');
      case "model": return t('model');
      case "region": return t('region');
      case "city": return t('city');
      case "condition": return t('condition');
      case "featured": return t('featured');
      default: return tCommon(filterKey);
    }
  };

  const getConditionLabel = (condition) => {
    switch (condition) {
      case "new": return t('new');
      case "used": return t('used');
      default: return condition;
    }
  };

  return (
    <>
     <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </Head>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 capitalize">
          {t('title', { category: selectedCategory.replace("-", " ") })}
        </h1>

        {/* Filters */}
        <div className="bg-white shadow p-4 rounded-lg mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {getFiltersForCategory(selectedCategory).map((filterKey) => {
            switch (filterKey) {
              case "manufacturer":
                return (
                  <select
                    key={filterKey}
                    name="manufacturer"
                    value={filters.manufacturer}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">{t('allManufacturers')}</option>
                    {manufacturers.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                );
              case "model":
                return (
                  <select
                    key={filterKey}
                    name="model"
                    value={filters.model}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">{t('allModels')}</option>
                    {models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                );
              case "region":
                return (
                  <select
                    key={filterKey}
                    name="region"
                    value={filters.region}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">{t('allRegions')}</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                );
              case "city":
                return (
                  <select
                    key={filterKey}
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">{t('allCities')}</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                );
              case "condition":
                return (
                  <select
                    key={filterKey}
                    name="condition"
                    value={filters.condition}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">{t('allConditions')}</option>
                    {conditions.map((c) => (
                      <option key={c} value={c}>{getConditionLabel(c)}</option>
                    ))}
                  </select>
                );
              case "featured":
                return (
                  <select
                    key={filterKey}
                    name="featured"
                    value={filters.featured}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                  >
                    <option value="">{t('featuredAll')}</option>
                    <option value="true">{t('featuredOnly')}</option>
                    <option value="false">{t('nonFeaturedOnly')}</option>
                  </select>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Listings */}
        {loading ? (
          <p>{t('loading')}</p>
        ) : listings.length === 0 ? (
          <p>{t('noListings')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => {
              const specs = parseSpecs(item.specs);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={item.mainImageUrl || "/placeholder-car.jpg"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {specs.manufacturer && `${t('manufacturer')}: ${specs.manufacturer}`}{" "}
                      {specs.model && `| ${t('model')}: ${specs.model}`}{" "}
                      {specs.year && `| ${t('year')}: ${specs.year}`}{" "}
                      {specs.mileage && `| ${t('mileage')}: ${specs.mileage} km`}
                    </p>
                    <p className="text-red-600 font-bold mt-2">
                      {item.price ? `${item.price} ${item.currency || "FCFA"}` : t('priceOnRequest')}
                    </p>
                    <p className="text-sm text-gray-400">
                      {item.location} {item.region && `, ${item.region}`}
                    </p>
                    <div className="mt-2">
                      <Link
                        href={`/listings/${item.category.slug}/${item.id}`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                      >
                        {t('contactSeller')}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
export async function getStaticProps({locale}) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
      locale
    }
  };
}
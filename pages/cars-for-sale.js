import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { listListings, listCategories } from "@/src/graphql/queries";
import { listListingsWithCategory } from "@/src/graphql/customQueries"; // Ensure this query supports nextToken
import { client } from "@/lib/amplifyClient";
import RefreshPage from "@/components/RefreshPage";
import Head from 'next/head';
import publicClient from "@/src/amplifyPublicClient"; // Assuming this is correctly configured
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useTranslations } from 'next-intl';

// --- Pagination Constants ---
const DEFAULT_PAGE_SIZE = 12; // Number of items per page/load

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
const models = ["Corolla", "Hilux", "Civic", "C-Class", "Navara", "Sportage", "rx350"];
const regions = ["Littoral", "Centre", "North West", "South West"];
const cities = ["Douala", "Yaoundé", "Bamenda", "Buea"];
const conditions = ["new", "used"];

export default function CarsForSalePage({ initialCategory = "cars" }) {
  const t = useTranslations('CarsForSale');
  const tCommon = useTranslations('Common');

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const router = useRouter();

  // --- Pagination State ---
  const [listings, setListings] = useState([]); // Holds all currently loaded listings
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // Specific state for "Load More"
  const [hasMore, setHasMore] = useState(true); // Flag to indicate if more data is available
  const [nextToken, setNextToken] = useState(null); // Token for the next page

  // Get query params in App Router
  const getQueryParams = useCallback(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return {
        region: params.get('region'),
        city: params.get('city'),
        // Note: For "Load More", we typically don't track page in URL,
        // but could if needed for deep linking to a specific state.
      };
    }
    return { region: null, city: null };
  }, []);

  const { region, city } = getQueryParams();

  // Initialize filters
  const [filters, setFilters] = useState({
    keyword: "",
    manufacturer: "",
    model: "",
    region: region || "",
    city: city || "",
    condition: "",
    featured: "",
    sortBy: "createdAt_DESC", // Sorting should ideally be handled server-side
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Effect to sync URL params with state on initial load or back/forward navigation
  useEffect(() => {
    if (region || city) {
      setFilters((prev) => ({
        ...prev,
        region: region || "",
        city: city || "",
      }));
    }
  }, [region, city]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Effect to trigger initial fetch when filters, category, or sorting changes ---
  useEffect(() => {
    if (selectedCategoryId) {
      // Reset pagination state and listings when filters/category/sort change
      setListings([]);
      setHasMore(true);
      setNextToken(null);
      fetchListings(true); // true indicates it's a new search/reset
    }
    // Scroll to top when filters/category/sort change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, selectedCategoryId]); // Removed currentPage dependency

  async function fetchCategories() {
    try {
      const res = await publicClient.graphql({ query: listCategories });
      const cats = res.data.listCategories.items;
      setCategories(cats);

      // Map slug to categoryId
      const cat = cats.find((c) => c.slug === initialCategory);
      if (cat) setSelectedCategoryId(cat.id);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  const getFiltersForCategory = (category) => categoryFilters[category] || categoryFilters.default;

  // --- Main Fetching Logic ---
  async function fetchListings(reset = false) {
    if (!selectedCategoryId || (!reset && !hasMore)) return; // Don't fetch if no more or not resetting

    const isInitialLoad = reset || nextToken === null;
    const setLoadingState = isInitialLoad ? setLoading : setLoadingMore;

    setLoadingState(true);
    try {
      // Prepare allowed filter fields for GraphQL input
      // Note: Sorting is kept client-side in this example, but ideally should be server-side
      const filterInput = {
        categoryId: { eq: selectedCategoryId },
        ...(filters.keyword && { title: { contains: filters.keyword } }),
        ...(filters.city && { location: { contains: filters.city } }),
        ...(filters.region && { region: { eq: filters.region } }),
        ...(filters.condition && { condition: { eq: filters.condition } }),
        ...(filters.featured && { isFeatured: { eq: filters.featured === "true" } }),
      };

      // --- Fetch with Pagination Support ---
      const variables = {
        filter: filterInput,
        limit: DEFAULT_PAGE_SIZE,
      };

      // Include nextToken if it's not the initial load/reset
      if (!isInitialLoad && nextToken) {
        variables.nextToken = nextToken;
      }

      const res = await publicClient.graphql({
        query: listListingsWithCategory,
        variables: variables,
      });

      const fetchedItems = res.data.listListings.items || [];
      const newNextToken = res.data.listListings.nextToken || null; // Get nextToken from response

      // Filter for approved status
      const approvedItems = fetchedItems.filter((item) => item.status === "APPROVED");

      // Parse specs for all fetched items
      const processedItems = approvedItems.map((item) => ({
        ...item,
        specs: parseSpecs(item.specs),
      }));

      // --- Update State ---
      if (isInitialLoad) {
        // Replace listings on initial load/reset
        setListings(processedItems);
      } else {
        // Append new listings on "Load More"
        setListings((prevListings) => [...prevListings, ...processedItems]);
      }

      // Update pagination state
      setNextToken(newNextToken);
      setHasMore(!!newNextToken); // If nextToken is null/undefined, no more data

    } catch (err) {
      console.error("Error fetching listings:", err);
      if (isInitialLoad) {
        setListings([]); // Clear on error for initial load
      }
      setHasMore(false); // Stop trying to load more on error
    } finally {
      setLoadingState(false);
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Note: Changing filters triggers the useEffect which calls fetchListings(true)
  };

  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory(categorySlug);
    // Changing category triggers the useEffect which calls fetchListings(true)
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

  // --- Load More Handler ---
  const handleLoadMore = () => {
    if (hasMore && !loadingMore && selectedCategoryId) {
      fetchListings(false); // false indicates it's a "Load More" call
    }
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
          <div className="text-center">
            <p>{t('noListings')}</p>
            <div className="mt-4">
              <RefreshPage />
            </div>
          </div>
        ) : (
          <>
            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => {
                // Specs are already parsed in fetchListings
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
                        {item.specs.manufacturer && `${t('manufacturer')}: ${item.specs.manufacturer}`}{" "}
                        {item.specs.model && `| ${t('model')}: ${item.specs.model}`}{" "}
                        {item.specs.year && `| ${t('year')}: ${item.specs.year}`}{" "}
                        {item.specs.mileage && `| ${t('mileage')}: ${item.specs.mileage} km`}
                      </p>
                      <p className="text-red-600 font-bold mt-2">
                        {item.price ? `${item.price} ${item.currency || "FCFA"}` : t('priceOnRequest')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.location} {item.region && `, ${item.region}`}
                      </p>
                      <div className="mt-2">
                        <Link
                          href={`/listings/${item.category?.slug || 'listing'}/${item.id}`} // Safeguard slug access
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

            {/* Load More Button */}
            <div className="mt-8 flex justify-center">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loadingMore ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {loadingMore ? tCommon('loading') : tCommon('loadMore')}
                </button>
              ) : (
                <p className="text-gray-500">{tCommon('noMoreItems')}</p>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
      locale
    }
  };
}
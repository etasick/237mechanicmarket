export const runtime = 'experimental-edge';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import RefreshPage from "@/components/RefreshPage";
import publicClient from "@/src/amplifyPublicClient";
import { listCategories } from "@/src/graphql/queries";
import { listListingsWithCategory } from "@/src/graphql/customQueries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';

export default function ManufacturerCarsForSale() {
  const t = useTranslations('ManufacturerCarsForSale');
  const router = useRouter();
  const { manufacturer } = router.query;

  const [filters, setFilters] = useState({
    keyword: "",
    region: "",
    city: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    year: "",
    fuelType: "",
    transmission: "",
  });

  const [listings, setListings] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Pagination state
  const [nextToken, setNextToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // ✅ Resolve categoryId from slug ("cars")
  async function fetchCategoryId() {
    try {
      const res = await publicClient.graphql({ query: listCategories });
      const categories = res.data.listCategories.items || [];

      const carsCategory = categories.find(
        (cat) => cat.slug?.toLowerCase() === "cars"
      );

      if (carsCategory) {
        setSelectedCategoryId(carsCategory.id);
      }
    } catch (err) {
      console.error("Error fetching category ID:", err);
    }
  }

  // ✅ Fetch listings (initial or refresh)
  async function fetchListings(reset = true) {
    if (!manufacturer || !selectedCategoryId) return;
    setLoading(true);

    try {
      const res = await publicClient.graphql({
        query: listListingsWithCategory,
        variables: {
          limit: 9, // fetch 9 per page
          filter: {
            categoryId: { eq: selectedCategoryId },
            ...(filters.keyword && { title: { contains: filters.keyword } }),
            ...(filters.region && { region: { eq: filters.region } }),
            ...(filters.city && { location: { contains: filters.city } }),
            ...(filters.condition && { condition: { eq: filters.condition } }),
            ...(filters.minPrice && { price: { ge: parseInt(filters.minPrice) } }),
            ...(filters.maxPrice && { price: { le: parseInt(filters.maxPrice) } }),
          },
        },
      });

      let items = res.data.listListings.items || [];
      items = items.map((item) => ({
        ...item,
        specs: typeof item.specs === "string" ? JSON.parse(item.specs) : item.specs || {},
      }));

      // ✅ Manufacturer filter
      items = items.filter(
        (item) =>
          item.specs?.manufacturer &&
          item.specs.manufacturer.toLowerCase() === manufacturer.toLowerCase()
      );

      // ✅ Apply extra filters
      if (filters.year) {
        items = items.filter((item) => item.specs?.year?.toString() === filters.year);
      }
      if (filters.fuelType) {
        items = items.filter(
          (item) => item.specs?.fuelType?.toLowerCase() === filters.fuelType.toLowerCase()
        );
      }
      if (filters.transmission) {
        items = items.filter(
          (item) =>
            item.specs?.transmission?.toLowerCase() === filters.transmission.toLowerCase()
        );
      }

      setListings(reset ? items : [...listings, ...items]);
      setNextToken(res.data.listListings.nextToken || null);
    } catch (err) {
      console.error("Error fetching manufacturer listings:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Load more
  async function loadMore() {
    if (!nextToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await publicClient.graphql({
        query: listListingsWithCategory,
        variables: {
          limit: 9,
          nextToken,
          filter: {
            categoryId: { eq: selectedCategoryId },
          },
        },
      });

      let items = res.data.listListings.items || [];
      items = items.map((item) => ({
        ...item,
        specs: typeof item.specs === "string" ? JSON.parse(item.specs) : item.specs || {},
      }));

      // ✅ Filter manufacturer again
      items = items.filter(
        (item) =>
          item.specs?.manufacturer?.toLowerCase() === manufacturer?.toLowerCase()
      );

      setListings((prev) => [...prev, ...items]);
      setNextToken(res.data.listListings.nextToken || null);
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setLoadingMore(false);
    }
  }

  // ✅ On mount
  useEffect(() => {
    fetchCategoryId();
  }, []);

  // ✅ Refetch when filters/manufacturer/categoryId changes
  useEffect(() => {
    fetchListings(true);
  }, [manufacturer, selectedCategoryId, filters]);

  const capitalizeManufacturer = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

  return (
    <>
      <Head>
        <title>
          {t('title', { manufacturer: capitalizeManufacturer(manufacturer) })}
        </title>
      </Head>
      <Header />

      <div className="flex flex-col md:flex-row p-6 gap-6">
        {/* ✅ Sidebar Filters */}
         <aside className="w-full md:w-1/4 bg-gray-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">
          {manufacturer ? t('filters.title', { manufacturer: capitalizeManufacturer(manufacturer) }) : t('filters.defaultTitle')}
        </h2>

        <input
          type="text"
          placeholder={t('filters.keyword')}
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder={t('filters.city')}
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder={t('filters.region')}
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        />

        <select
          value={filters.condition}
          onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">{t('filters.condition')}</option>
          <option value="new">{t('filters.conditions.new')}</option>
          <option value="used">{t('filters.conditions.used')}</option>
        </select>

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder={t('filters.minPrice')}
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder={t('filters.maxPrice')}
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-1/2 p-2 border rounded"
          />
        </div>

        <input
          type="text"
          placeholder={t('filters.year')}
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        />

        <select
          value={filters.fuelType}
          onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">{t('filters.fuelType')}</option>
          <option value="petrol">{t('filters.fuelTypes.petrol')}</option>
          <option value="diesel">{t('filters.fuelTypes.diesel')}</option>
          <option value="hybrid">{t('filters.fuelTypes.hybrid')}</option>
          <option value="electric">{t('filters.fuelTypes.electric')}</option>
        </select>

        <select
          value={filters.transmission}
          onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">{t('filters.transmission')}</option>
          <option value="automatic">{t('filters.transmissions.automatic')}</option>
          <option value="manual">{t('filters.transmissions.manual')}</option>
        </select>
      </aside>

       

        {/* ✅ Listings */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-4">
            {manufacturer
              ? t('listings.title', { manufacturer: capitalizeManufacturer(manufacturer) })
              : t('listings.defaultTitle')}
          </h1>

          {loading ? (
            <p>{t('listings.loading')}</p>
          ) : listings.length === 0 ? (
            <div className="text-center">
              <p>
                {manufacturer
                  ? t('listings.noResults', { manufacturer: capitalizeManufacturer(manufacturer) })
                  : t('listings.noResultsDefault')}
              </p>
              <div className="mt-4">
                <RefreshPage />
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white"
                  >
                    <img
                      src={listing.mainImageUrl}
                      alt={listing.title}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-gray-600">
                      {listing.price} {listing.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      {listing.specs?.year} • {listing.specs?.mileage} km •{" "}
                      {listing.region}
                    </p>
                    <button
                      onClick={() =>
                        router.push(`/listings/${listing.category.slug}/${listing.id}`)
                      }
                      className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      {t('listings.viewDetails')}
                    </button>
                  </div>
                ))}
              </div>

              {/* ✅ Load More */}
              {nextToken && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    {loadingMore ? t('listings.loading') : t('listings.loadMore')}
                  </button>
                </div>
              )}
            </>
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
      messages: (await import(`../../../messages/${locale}.json`)).default,
      locale,
    },
  };
}

export async function getStaticPaths() {
  const manufacturers = [
    "toyota", "mercedes-benz", "nissan", "hyundai", "kia",
    "honda", "bmw", "peugeot", "renault", "volkswagen",
    "lexus", "mazda"
  ];

  return {
    paths: manufacturers.map((m) => ({ params: { manufacturer: m } })),
    fallback: "blocking",
  };
}

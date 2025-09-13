export const runtime = 'experimental-edge';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { client } from "@/lib/amplifyClient";
import Head from 'next/head';
import publicClient from "@/src/amplifyPublicClient";
import { listListings, listCategories } from "@/src/graphql/queries";
import { listListingsWithCategory } from "@/src/graphql/customQueries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from 'next-intl';

export default function ModelCarsForSale() {
  const t = useTranslations('ModelCarsForSale');
  const router = useRouter();
  const { model } = router.query;

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

  // ✅ Resolve categoryId from slug "cars"
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

  // ✅ Fetch listings
  async function fetchListings() {
    if (!model || !selectedCategoryId) return;
    setLoading(true);

    try {
      const res = await publicClient.graphql({
        query: listListingsWithCategory,
        variables: {
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

      // ✅ Filter by model from specs
      items = items.filter(
        (item) =>
          item.specs &&
          item.specs.model &&
          item.specs.model.toLowerCase() === model.toLowerCase()
      );

      // ✅ Extra filters (year, fuelType, transmission, etc.)
      if (filters.year) {
        items = items.filter(
          (item) => item.specs?.year && item.specs.year.toString() === filters.year
        );
      }
      if (filters.fuelType) {
        items = items.filter(
          (item) =>
            item.specs?.fuelType &&
            item.specs.fuelType.toLowerCase() === filters.fuelType.toLowerCase()
        );
      }
      if (filters.transmission) {
        items = items.filter(
          (item) =>
            item.specs?.transmission &&
            item.specs.transmission.toLowerCase() === filters.transmission.toLowerCase()
        );
      }

      setListings(items);
    } catch (err) {
      console.error("Error fetching model listings:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Fetch categoryId once on mount
  useEffect(() => {
    fetchCategoryId();
  }, []);

  // ✅ Refetch listings when filters/model/categoryId changes
  useEffect(() => {
    fetchListings();
  }, [model, selectedCategoryId, filters]);
  const capitalizeModel = (model) => {
    if (!model) return '';
    return model.charAt(0).toUpperCase() + model.slice(1);
  };

  return (
    <>
    <Head>
<title>{t('title', { model: capitalizeModel(model) })}</title>
      </Head>
    <Header/>
    <div className="flex flex-col md:flex-row p-6 gap-6">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-50 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">{t('filters.title')}</h2>

        <input
          type="text"
          placeholder={t('filters.keyword')}
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />

        <select
          value={filters.condition}
          onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="">{t('filters.anyCondition')}</option>
          <option value="new">{t('filters.conditions.new')}</option>
          <option value="used">{t('filters.conditions.used')}</option>
        </select>

        <input
          type="number"
          placeholder={t('filters.minPrice')}
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="number"
          placeholder={t('filters.maxPrice')}
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="number"
          placeholder={t('filters.year')}
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        />

        <select
          value={filters.fuelType}
          onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="">{t('filters.fuelType')}</option>
          <option value="petrol">{t('filters.fuelTypes.petrol')}</option>
          <option value="diesel">{t('filters.fuelTypes.diesel')}</option>
          <option value="hybrid">{t('filters.fuelTypes.hybrid')}</option>
          <option value="electric">{t('filters.fuelTypes.electric')}</option>
        </select>

        <select
          value={filters.transmission}
          onChange={(e) =>
            setFilters({ ...filters, transmission: e.target.value })
          }
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="">{t('filters.transmission')}</option>
          <option value="manual">{t('filters.transmissions.manual')}</option>
          <option value="automatic">{t('filters.transmissions.automatic')}</option>
        </select>
      </aside>

      {/* Listings */}
      <main className="w-full md:w-3/4">
        <h1 className="text-2xl font-bold mb-6 capitalize">
          {model ? t('listings.title', { model }) : t('listings.defaultTitle')}
        </h1>

        {loading ? (
          <p>{t('listings.loading')}</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="border rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/listings/${listing.category.slug}/${listing.id}`)}
              >
                <img
                  src={listing.mainImageUrl}
                  alt={listing.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
                <p className="font-bold">
                  {listing.price} {listing.currency}
                </p>
                {listing.specs?.year && (
                  <p className="text-sm text-gray-500">
                    {listing.specs.year} • {listing.specs.transmission} •{" "}
                    {listing.specs.fuelType}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>{model ? t('listings.noResults', { model }) : t('listings.noResultsDefault')}</p>
        )}
      </main>
    </div>
    <Footer/>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
      locale
    }
  };
}

export async function getStaticPaths() {
  // Hardcoded manufacturer slugs for now
  const models = [
    "auris",
    "yaris",
    "toyota-corolla",
    "toyota-hilux",
    "rx350",
    "nissan-qashqai",
    "nissan-x-trail",
    "nissan-navara",
    "bmw-3-series",
    "bmw-5-series",
    "bmw-x5",
    "peugeot-208",
    "renault-clio",
    "renault-megane",
    "ford-focus",
    "volkswagen-golf",
    "volkswagen-polo",
    "mercedes-benz-c-class",
    "lexus-es",
    "lexus-rx",
    "honda-civic",
    "mazda-cx-5",
    "suzuki-vitara",
    "hyundai-tucson",
  ];

  const paths = models.map((m) => ({
    params: { model: m.toLowerCase() },
  }));

  return {
    paths,
    fallback: "blocking", // ensures new ones still work if not in list
  };
}

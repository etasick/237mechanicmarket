import { useEffect, useMemo, useRef, useState } from 'react';
import publicClient from '@/src/amplifyPublicClient';
import RefreshPage from '@/components/RefreshPage';
import loadMorePublicClient from '@/src/amplifyLoadMorePublicClient';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateClient } from 'aws-amplify/api';
import { useTranslations } from 'next-intl';
import { listListings, listCategories } from '@/src/graphql/queries';
import { listListingsWithCategory } from '@/src/graphql/customQueries';
import TestNavigationButton from '@/components/TestNavigationButton';

const client = generateClient();

// ---------- Helpers ----------
function parseSpecs(specs) {
  try {
    return typeof specs === 'string' ? JSON.parse(specs) : (specs || {});
  } catch {
    return {};
  }
}
const formatPrice = (price, currency) =>
  price != null ? `${currency} ${Number(price).toLocaleString()}` : 'Price on request';

// Curated quick-access filters
const POPULAR_BRANDS = [
  'Toyota','Mercedes','Nissan','Hyundai','Kia','Honda','BMW','Peugeot','Renault','Volkswagen','Lexus','Mazda'
];
const REGIONS = [
  'Littoral','Centre','North West','South West','West','Adamawa','East','Far North','North','South'
];
const POPULAR_CITIES = [
  'Douala','Yaoundé','Buea','Bamenda','Garoua','Maroua','Bafoussam','Limbe','Kumba','Ebolowa'
];

export default function HomePage() {
  const t = useTranslations('HomePage');
  const router = useRouter();
  
  // Data
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [defaultCategoryId, setDefaultCategoryId] = useState('');

  



  // Filters (live)
  const [filters, setFilters] = useState({
    categoryId: '',
    region: '',
    city: '',
    manufacturer: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  useEffect(() => { 
  (async () => {
    setLoading(true);
    try {
      const [{ data: cat }, { data: lst }] = await Promise.all([
        publicClient.graphql({ query: listCategories }),
        publicClient.graphql({
          query: listListingsWithCategory,
          variables: {
            limit: 12,
            filter: {
              status: { eq: 'APPROVED' }, 
              categoryId: { eq:'386a1714-07d2-423b-9eff-e6c842f1a09b'|| filters.categoryId || defaultCategoryId  }
      
            },
          },
        }),
      ]);

      const categoriesFetched = cat?.listCategories?.items ?? [];
      setCategories(categoriesFetched);

      // 🔑 Find the "cars" category and set it as default
      const carsCategory = categoriesFetched.find((c) => c.slug === 'cars');
      if (carsCategory) {
        setDefaultCategoryId(carsCategory.id);  
        setFilters((f) => ({ ...f, categoryId: carsCategory.id }));
      }

      const items = (lst?.listListings?.items ?? []).filter((i) => i?.status === 'APPROVED');
      setListings(items);
      setNextToken(lst?.listListings?.nextToken ?? null);
    } catch (e) {
      console.error('Init load error:', e);
    } finally {
      setLoading(false);
    }
  })();
}, []);


  // Load more
 const loadMore = async () => {
  if (!nextToken || loadingMore) return;
  setLoadingMore(true);
  try {
    const { data } = await loadMorePublicClient.graphql({
      query: listListingsWithCategory,
      variables: {
        limit: 12,
        nextToken,
        filter: {
          status: { eq: 'APPROVED' },
          categoryId: { eq: filters.categoryId || defaultCategoryId || '386a1714-07d2-423b-9eff-e6c842f1a09b' },
        },
      },
    });
    const items = (data?.listListings?.items ?? []).filter((i) => i?.status === 'APPROVED');
    setListings((prev) => [...prev, ...items]);
    setNextToken(data?.listListings?.nextToken ?? null);
  } catch (e) {
    console.error('Load more error:', e);
  } finally {
    setLoadingMore(false);
  }
};


  // Real-time filtered view
  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const specs = parseSpecs(item.specs);
      const matchesCategory = !filters.categoryId || item.categoryId === filters.categoryId;
      const matchesRegion = !filters.region || (item.region || '').toLowerCase() === filters.region.toLowerCase();
      const matchesCity = !filters.city || (item.location || '').toLowerCase() === filters.city.toLowerCase();
      const matchesBrand = !filters.manufacturer || (specs.manufacturer || '').toLowerCase().includes(filters.manufacturer.toLowerCase());
      const matchesModel = !filters.model || (specs.model || '').toLowerCase().includes(filters.model.toLowerCase());
      const matchesMin = !filters.minPrice || (item.price ?? Infinity) >= Number(filters.minPrice);
      const matchesMax = !filters.maxPrice || (item.price ?? -Infinity) <= Number(filters.maxPrice);
      const matchesText =
        !filters.search ||
        (item.title || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (specs.manufacturer || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (specs.model || '').toLowerCase().includes(filters.search.toLowerCase());
      return (
        matchesCategory &&
        matchesRegion &&
        matchesCity &&
        matchesBrand &&
        matchesModel &&
        matchesMin &&
        matchesMax &&
        matchesText
      );
    });
  }, [listings, filters]);

  // ---------- UI ----------
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-center">
            {t('hero.title')}
          </h1>
          <p className="text-center mt-3 opacity-90">
            {t('hero.subtitle')}
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              className="w-full sm:w-[520px] rounded-lg p-3 text-gray-900"
              placeholder={t('hero.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
            <button
              onClick={() => {}}
              className="rounded-lg px-5 py-3 bg-white text-blue-700 font-semibold"
            >
              {t('hero.searchButton')}
            </button>
          </div>

          {/* Category chips */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilters((f) => ({ ...f, categoryId: '' }))}
              className={`px-4 py-2 rounded-full border border-white/30 ${
                !filters.categoryId ? 'bg-white text-blue-700' : 'bg-blue-700 text-white'
              }`}
            >
              {t('hero.allCategories')}
            </button>
           {categories.map((c) => (
  <button
    key={c.id}
    onClick={() => setFilters((f) => ({ ...f, categoryId: c.id }))}
    className={`px-4 py-2 rounded-full border border-white/30 ${
      filters.categoryId === c.id ? 'bg-white text-blue-700' : 'bg-blue-700 text-white'
    }`}
  >
    {t(`categories.${c.slug}`)}   {/* slug = 'cars','motorcycles','spare-parts' */}
  </button>
))}

          </div>
        </div>
      </section>

      {/* POPULAR BRANDS */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{t('brands.title')}</h2>
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setFilters((f) => ({ ...f, manufacturer: '' }))}
          >
            {t('brands.clear')}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {/* POPULAR BRANDS */}
{POPULAR_BRANDS.map((b) => (
  <button
    key={b}
    onClick={() => setFilters((f) => ({ ...f, manufacturer: b }))}
    className={`whitespace-nowrap px-4 py-2 rounded-full border ${
      filters.manufacturer?.toLowerCase() === b.toLowerCase()
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-900'
    }`}
  >
    {t(`brands.items.${b.toLowerCase()}`)}
  </button>
))}


        </div>
      </section>

      {/* REGIONS + CITIES */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Regions */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{t('regions.title')}</h3>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setFilters((f) => ({ ...f, region: '' }))}
              >
                {t('regions.clear')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
             {/* REGIONS */}
{REGIONS.map((r) => (
  <button
    key={r}
    onClick={() => setFilters((f) => ({ ...f, region: r, city: '' }))}
    className={`px-3 py-2 rounded-lg border ${
      filters.region?.toLowerCase() === r.toLowerCase()
        ? 'bg-blue-600 text-white'
        : 'bg-white'
    }`}
  >
    {t(`regions.items.${r.replace(/\s+/g, '').toLowerCase()}`)}
  </button>
))}

            </div>
          </div>

          {/* Cities */}
          <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{t('cities.title')}</h3>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setFilters((f) => ({ ...f, city: '' }))}
              >
                {t('cities.clear')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
             {/* CITIES */}
{POPULAR_CITIES.map((c) => (
  <button
    key={c}
    onClick={() => setFilters((f) => ({ ...f, city: c, region: '' }))}
    className={`px-3 py-2 rounded-lg border ${
      filters.city?.toLowerCase() === c.toLowerCase()
        ? 'bg-blue-600 text-white'
        : 'bg-white'
    }`}
  >
    {t(`cities.items.${c.replace(/[éÉ]/g, 'e').replace(/\s+/g, '').toLowerCase()}`)}
  </button>
))}

            </div>
          </div>
        </div>
      </section>

      {/* ADVANCED FILTERS */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <input
              className="border p-2 rounded"
              placeholder={t('filters.manufacturer')}
              value={filters.manufacturer}
              onChange={(e) => setFilters((f) => ({ ...f, manufacturer: e.target.value }))}
            />
            <input
              className="border p-2 rounded"
              placeholder={t('filters.model')}
              value={filters.model}
              onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder={t('filters.minPrice')}
              value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder={t('filters.maxPrice')}
              value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
            />
            <button
              className="border rounded p-2"
              onClick={() =>
                setFilters({
                  categoryId: '',
                  region: '',
                  city: '',
                  manufacturer: '',
                  model: '',
                  minPrice: '',
                  maxPrice: '',
                  search: '',
                })
              }
            >
              {t('filters.clearAll')}
            </button>
            <Link
              className="bg-blue-600 text-white rounded p-2 text-center"
              href="/create-listing"
            >
              {t('filters.postListing')}
            </Link>
          </div>
        </div>
      </section>

      {/* LISTINGS (centered, full column) */}
      <main className="max-w-4xl mx-auto px-4 pb-16 pt-6">
        <h2 className="text-xl font-semibold mb-4">{t('listings.title')}</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-10">{t('listings.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            {t('listings.noResults')}
            <RefreshPage />
          </div>
        ) : (
          <>
            {filtered.map((item) => {
              const specs = parseSpecs(item.specs);
              return (
                <Link href={`/listings/${item.category.slug}/${item.id}`} key={item.id}>
                  <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden mb-6 cursor-pointer">
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={item.mainImageUrl}
                        alt={item.title}
                        className="w-full sm:w-1/3 h-64 object-cover"
                        loading="lazy"
                      />
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-2xl font-semibold">{item.title}</h3>
                          <span className="shrink-0 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {formatPrice(item.price, item.currency)}
                          </span>
                        </div>

                        <p className="text-gray-600 mt-1">
                          {item.location}{item.region ? `, ${item.region}` : ''}
                        </p>

                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
                          {specs.manufacturer && (
                            <div className="border rounded px-2 py-1">{t('listings.specs.brand')}: {specs.manufacturer}</div>
                          )}
                          {specs.model && (
                            <div className="border rounded px-2 py-1">{t('listings.specs.model')}: {specs.model}</div>
                          )}
                          {specs.year && (
                            <div className="border rounded px-2 py-1">{t('listings.specs.year')}: {specs.year}</div>
                          )}
                          {specs.fuelType && (
                            <div className="border rounded px-2 py-1">{t('listings.specs.fuel')}: {specs.fuelType}</div>
                          )}
                          {specs.transmission && (
                            <div className="border rounded px-2 py-1">{t('listings.specs.transmission')}: {specs.transmission}</div>
                          )}
                          {item.condition && (
                            <div className="border rounded px-2 py-1">{t('listings.specs.condition')}: {item.condition}</div>
                          )}
                        </div>

                        <p className="text-gray-600 mt-3 line-clamp-3">{item.description}</p>

                        <div className="mt-4">
                          <span className="inline-block text-blue-600 hover:underline font-medium">
                            {t('listings.viewDetails')} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Load more */}
            {nextToken && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                >
                  {loadingMore ? t('listings.loadingMore') : t('listings.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </main>

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

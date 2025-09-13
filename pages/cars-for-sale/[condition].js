export const runtime = 'experimental-edge';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listListings, listCategories } from "@/src/graphql/queries";
import { listListingsWithCategory } from "@/src/graphql/customQueries";
import { client } from "@/lib/amplifyClient";
import publicClient from "@/src/amplifyPublicClient";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const standardSpecs = [
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
  "engineCapacity",
];

export default function CarsForSaleConditionPage() {
  const t = useTranslations('CarsForSaleConditionPage');
  const router = useRouter();
  const { condition } = router.query; // "new" or "used"

  const [filters, setFilters] = useState({
    keyword: "",
    manufacturer: "",
    model: "",
    region: "",
    city: "",
    featured: "",
    sortBy: "createdAt_DESC",
  });

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [carCategory, setCarCategory] = useState(null);

  const manufacturers = ["Toyota","Mercedes","Nissan","Mazda","Lexus","Kia","Honda","Hyundai","BMW","Peugeot"];
  const models = ["Corolla","Hilux","Civic","C-Class","Navara","Sportage"];
  const regions = ["Littoral", "Centre", "North West", "South West", "Far North","West","East","South","Adamawa","North"];
  const cities = ["Douala","Yaoundé","Bamenda","Buea"];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if(carCategory && condition) fetchListings();
  }, [filters, carCategory, condition]);

  async function fetchCategories() {
    try {
      const { data } = await publicClient.graphql({ query: listCategories });
      setCategories(data.listCategories.items);
      // Find the car category
      const cat = data.listCategories.items.find(c => c.slug === "cars");
      setCarCategory(cat);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  async function fetchListings() {
    if(!carCategory) return;
    setLoading(true);
    try {
      const filterInput = {
        categoryId: { eq: carCategory.id },
        ...(condition && { condition: { eq: condition } }),
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

      // Parse specs and ensure standard keys
      items = items.map((item) => {
        let specsObj = {};
        try {
          specsObj = typeof item.specs === "string" ? JSON.parse(item.specs) : item.specs || {};
        } catch {}
        standardSpecs.forEach((key) => {
          if(!specsObj[key]) specsObj[key] = "";
        });
        return { ...item, specs: specsObj };
      });

      // Client-side filtering
      if(filters.manufacturer) {
        items = items.filter(item =>
          item.specs.manufacturer.toLowerCase() === filters.manufacturer.toLowerCase()
        );
      }
      if(filters.model) {
        items = items.filter(item =>
          item.specs.model.toLowerCase() === filters.model.toLowerCase()
        );
      }

      // Sorting
      if(filters.sortBy === "price_ASC") items.sort((a,b)=> (a.price||0)-(b.price||0));
      else if(filters.sortBy === "price_DESC") items.sort((a,b)=> (b.price||0)-(a.price||0));
      else if(filters.sortBy === "createdAt_ASC") items.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt));
      else if(filters.sortBy === "createdAt_DESC") items.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

      setListings(items);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
    setLoading(false);
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  // Capitalize condition for display
  const capitalizeCondition = (cond) => {
    if (!cond) return '';
    return cond.charAt(0).toUpperCase() + cond.slice(1);
  };

  return (
    <>
    <Header/>
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
      {/* Left sidebar filters */}
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
          name="manufacturer" 
          value={filters.manufacturer} 
          onChange={handleFilterChange} 
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">{t('filters.allManufacturers')}</option>
          {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select 
          name="model" 
          value={filters.model} 
          onChange={handleFilterChange} 
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">{t('filters.allModels')}</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select 
          name="region" 
          value={filters.region} 
          onChange={handleFilterChange} 
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">{t('filters.allRegions')}</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select 
          name="city" 
          value={filters.city} 
          onChange={handleFilterChange} 
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">{t('filters.allCities')}</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
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
          <option value="price_ASC">{t('sort.priceLowHigh')}</option>
          <option value="price_DESC">{t('sort.priceHighLow')}</option>
        </select>
      </aside>

      {/* Listings */}
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-6">
          {condition ? t('listings.title', { condition: capitalizeCondition(condition) }) : t('listings.defaultTitle')}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>{t('listings.loading')}</p>
          ) : listings.length === 0 ? (
            <p>{condition ? t('listings.noResults', { condition: capitalizeCondition(condition) }) : t('listings.noResultsDefault')}</p>
          ) : (
            listings.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <img src={car.mainImageUrl || "/placeholder-car.jpg"} alt={car.title} className="w-full h-48 object-cover" />
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="font-semibold text-lg">{car.title}</h3>
                  <p className="text-gray-500">{car.specs.manufacturer} {car.specs.model} {car.specs.year}</p>
                  <p className="text-red-600 font-bold">{car.price ? `${car.price} ${car.currency||"FCFA"}` : t('listings.priceOnRequest')}</p>
                  <p className="text-sm text-gray-400">{car.location} {car.region && `, ${car.region}`}</p>
                  <Link href={`/listings/${car.category.slug}/${car.id}`} className="mt-auto inline-block bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700">
                    {t('listings.viewDetails')}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
    <Footer/>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
      locale
    }
  };
}

export async function getStaticPaths() {
  // Hardcoded manufacturer slugs for now
  const conditions= [
    "new",
    "used"
  ];

  const paths = conditions.map((m) => ({
    params: { condition: m.toLowerCase() },
  }));

  return {
    paths,
    fallback: "blocking", // ensures new ones still work if not in list
  };
}
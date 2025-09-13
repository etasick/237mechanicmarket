export const runtime = 'experimental-edge';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { generateClient } from "aws-amplify/api";
import { createMessage } from "@/src/graphql/mutations";
import { Auth } from "aws-amplify"; 
import { getListing, listListings } from "@/src/graphql/queries";
import Header from "@/components/Header";
import Head from 'next/head';
import Footer from "@/components/Footer";
import { listListingsWithCategory } from "@/src/graphql/customQueries";
import { useTranslations } from 'next-intl';

const client = generateClient();

function parseSpecs(specs) {
  try {
    return typeof specs === "string" ? JSON.parse(specs) : specs;
  } catch {
    return {};
  }
}

export default function ListingDetails() {
  const t = useTranslations('ListingDetails');
  const router = useRouter();
  const { id } = router.query;

  const [listing, setListing] = useState(null);
  const [relatedListings, setRelatedListings] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fromName: "",
    fromEmail: "",
    body: ""
  });
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await client.graphql({
        query: getListing,
        variables: { id },
      });
      const item = data.getListing;
      setListing(item);
      setMainImage(item.mainImageUrl);
      fetchRelated(item.categoryId, item.id);
    } catch (err) {
      console.error("Error fetching listing:", err);
    }
  };

  const fetchRelated = async (categoryId, excludeId) => {
    if (!categoryId) return;
    try {
      const { data } = await client.graphql({
        query: listListingsWithCategory,
        variables: {
          filter: {
            categoryId: { eq: categoryId },
            id: { ne: excludeId },
            status: { eq: 'APPROVED' }
          },
          limit: 6,
        },
      });
      setRelatedListings(data.listListings.items);
    } catch (err) {
      console.error("Error fetching related listings:", err);
    }
  };

  const handleContactSeller = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      let currentUser = null;
      try {
        currentUser = await Auth.currentAuthenticatedUser();
      } catch {
        // User may be public, still allowed to create
      }

      const { fromName, fromEmail, body } = formData;

      
      const input = {
        listingId: listing.id,
        listingTitle: listing.title,
        fromUserId: currentUser?.username || null,
        fromName,
        fromEmail,
        body,
        ownerId: listing.ownerId,
        sentAt: new Date().toISOString(),
        answered: false
      };

      await client.graphql({
        query: createMessage,
        variables: { input }
      });

      alert(t('messageSuccess'));
      setFormData({ fromName: "", fromEmail: "", body: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      alert(t('messageError'));
    } finally {
      setSending(false);
    }
  };

  if (!listing) return <p className="p-6">{t('loading')}</p>;

  const specs = parseSpecs(listing.specs);
  const gallery = listing.galleryImageUrls || [];

  return (
    <>
     <Head>
            <title>{listing.title}</title>
            <meta name="description" content={listing.description} />
              </Head>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Title & Price */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
          <p className="text-blue-600 text-xl font-semibold mt-2">
            {listing.currency} {listing.price?.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm md:text-base">{listing.location}, {listing.region}</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Images and Content */}
          <div className="lg:w-2/3">
            {/* Main Image */}
            <div className="relative mb-4">
              <img
                src={mainImage}
                alt={listing.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow"
              />
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-3 mb-6">
                {gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${t('galleryImageAlt')} ${idx}`}
                    onClick={() => setMainImage(img)}
                    className={`h-16 w-16 md:h-24 md:w-32 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 ${
                      mainImage === img ? "border-blue-500" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Tabs for Mobile */}
            <div className="md:hidden mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-2 px-4 font-medium text-sm ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('description')}
                >
                  {t('tabs.description')}
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm ${activeTab === 'specs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('specs')}
                >
                  {t('tabs.specifications')}
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm ${activeTab === 'features' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('features')}
                >
                  {t('tabs.features')}
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              {/* Description */}
              <div className={`${(activeTab !== 'description' && window.innerWidth < 768) ? 'hidden' : ''} mb-6`}>
                <h2 className="text-xl font-bold mb-3">{t('sections.description')}</h2>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Specifications */}
             {/* Specifications */}
{Object.keys(specs).length > 0 && (
  <div
    className={`${
      activeTab !== "specs" && window.innerWidth < 768 ? "hidden" : ""
    } mb-6`}
  >
    <h2 className="text-xl font-bold mb-3">
      {t("sections.specifications")}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Object.entries(specs).map(([key, value]) => {
        if (!value) return null; // Skip empty specs
        const label = t(`specLabels.${key}`, { default: key });
        return (
          <div key={key} className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-gray-500 text-xs uppercase">{label}</p>
            <p className="font-semibold text-sm">{value}</p>
          </div>
        );
      })}
    </div>
  </div>
)}


              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div className={`${(activeTab !== 'features' && window.innerWidth < 768) ? 'hidden' : ''}`}>
                  <h2 className="text-xl font-bold mb-3">{t('sections.features')}</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {listing.features.map((feature, idx) => (
                      <li key={idx} className="ml-4 pl-1">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-4">
              <h2 className="text-lg font-bold mb-4">{t('contact.title')}</h2>
              <form onSubmit={handleContactSeller} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder={t('contact.namePlaceholder')}
                  className="p-3 border rounded-lg text-sm"
                  value={formData.fromName}
                  onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder={t('contact.emailPlaceholder')}
                  className="p-3 border rounded-lg text-sm"
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  required
                />
                <textarea
                  className="p-3 border rounded-lg resize-none text-sm"
                  rows="4"
                  placeholder={t('contact.messagePlaceholder')}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
                >
                  {sending ? t('contact.sending') : t('contact.sendButton')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-5">{t('related.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/listings/${item.category.slug}/${item.id}`)}
                  className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={item.mainImageUrl}
                    alt={item.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-base line-clamp-1">{item.title}</h3>
                    <p className="text-blue-600 font-semibold mt-1">
                      {item.currency} {item.price?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  );
}



export async function getStaticPaths() {
  try {
    const { data } = await client.query({
      query: getListing
    });

    const paths =
      data?.listListings?.items.map((item) => ({
        params: {
          category: item.category.slug, // must match your schema
          id: item.id
        }
      })) || [];

    return {
      paths,
      fallback: "blocking" // or true, depending on your needs
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking"
    };
  }
}

export async function getStaticProps({ params, locale }) {
  // fetch data for one listing using params.id
  // also load translations
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
      locale,
      category: params.category,
      id: params.id
    },
    revalidate: 60
  };
}



import { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '@/lib/amplifyClient'; // adjust path to your amplify client setup
import { listingsByOwnerIdAndCreatedAt } from '@/src/graphql/queries';
import SignOutButton from '@/components/SignOutButton';
import { deleteListing } from '@/src/graphql/mutations';
import { deleteListingMinimal } from '@/src/graphql/customMutations';
import { fetchAuthSession } from 'aws-amplify/auth';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

import { useAuthenticator } from '@aws-amplify/ui-react';

// If your Messages component is already made:
import Messages from '@/components/Messages'; 
import Settings from '@/components/AccountSettings'; // You'll create this

export default function Dashboard() {
  const { user } = useAuthenticator();
  const t = useTranslations('Dashboard');
  const tCommon = useTranslations('Common');
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  // Fetch listings for this user
  useEffect(() => {
    if (!user?.username) return;

    const fetchListings = async () => {
      try {
        const result = await client.graphql({
          query: listingsByOwnerIdAndCreatedAt,
          authMode:"userPool",
          variables: {
            ownerId: user.username,
            sortDirection: 'DESC',
            limit: 20,
          },
        });

        setListings(result.data.listingsByOwnerIdAndCreatedAt.items);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user?.username]);

  async function handleDelete(listingId) {
    if (!confirm(t('deleteConfirmation'))) return;

    try {
      // 1) Get owner (Cognito sub)
      const session = await fetchAuthSession();
      const ownerSub = session?.tokens?.idToken?.payload?.sub;
      if (!ownerSub) throw new Error(t('unableToIdentifyUser'));

      // 2) Delete from Cloudflare (R2 + D1)
      const workerUrl = 'https://listing.etasick.workers.dev/listing  ';
      const res = await fetch(workerUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: ownerSub, listing_id: listingId }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || t('workerDeleteFailed', { status: res.status }));
      }

      // 3) Delete from Amplify GraphQL
      await client.graphql({
        query: deleteListingMinimal,
        authMode:"userPool",
        variables: { input: { id: listingId } },
        // authMode optional if default is fine
      });

      // 4) Update UI state
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      alert(t('deleteSuccess'));
    } catch (err) {
      console.error('Delete listing error:', err);
      alert(t('deleteFailed', { message: err.message || tCommon('unknownError') }));
    }
  }

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'listings': return t('myListings');
      case 'messages': return t('messages');
      case 'settings': return t('settings');
      default: return tab;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <LanguageSwitcher/>
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <Link href="/">
        <span className="font-bold text-xl cursor-pointer hover:text-blue-400">
          {t('visitMarketplace')}
        </span>
      </Link>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-6">
        {['listings', 'messages', 'settings'].map((tab) => (
          <button
            key={tab}
            className={`pb-2 ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {getTabLabel(tab)}
          </button>
        ))}
        <SignOutButton/>
      </div>

      {/* Content */}
      {activeTab === 'listings' && (
        <div>
          <div className="mb-4">
            <a
              href="/account/create-listing"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {t('createNewListing')}
            </a>
          </div>

          {loading ? (
            <p>{t('loadingListings')}</p>
          ) : listings.length === 0 ? (
            <p className="text-gray-600">{t('noListings')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="border rounded-lg shadow p-4 flex flex-col">
                  <img
                    src={listing.mainImageUrl}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h2 className="text-lg font-semibold mt-4">{listing.title}</h2>
                  <p className="text-gray-600 truncate">{listing.description}</p>
                  <p className="text-gray-600 truncate">{t('status')}: {listing.status}</p>
            
                  <p className="text-gray-600 truncate">
                    {listing.status === "REJECTED" ? listing.statusReason : ""}
                  </p>
                  <p className="font-bold mt-2">
                    {listing.currency} {listing.price}
                  </p>
                  <div className="mt-auto flex justify-between items-center gap-2 pt-4">
                    <a
                      href={`/account/edit-listing/${listing.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      {t('edit')}
                    </a>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'messages' && (
        <div>
          <Messages />
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <Settings user={user} />
        </div>
      )}
    </div>
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
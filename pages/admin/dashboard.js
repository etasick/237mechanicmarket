'use client';
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { listCategories, listListings } from '@/src/graphql/queries';
import { updateListingMinimalApproval } from '@/src/graphql/customMutations';
import SuperadminDashboard from '@/components/SuperadminDashboard';
import { createCategory, updateCategory, deleteCategory, updateListing, deleteListing } from '@/src/graphql/mutations';
import { useTranslations } from 'next-intl';

const client = generateClient();

export default function AdminDashboard() {
  const t = useTranslations('AdminDashboard');
  
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [categories, setCategories] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('listings');

  // Category modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '', slug: '', description: '' });
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const session = await fetchAuthSession();
        const attributes = session.tokens.idToken.payload;
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setUserId(attributes.sub || "");

        const groups = attributes["cognito:groups"] || [];
        setIsAdmin(groups.includes("admin"));
        setIsSuperAdmin(groups.includes("superadmin"));
      } catch (err) {
        console.error("Auth error", err);
        setError(t('authError'));
      }
      setLoading(false);
    };

    fetchCategories();
    fetchPendingListings();
    checkAdmin();
  }, []);

  // --- Queries ---
  const fetchCategories = async () => {
    const { data } = await client.graphql({ query: listCategories });
    setCategories(data.listCategories.items);
  };

  const fetchPendingListings = async () => {
    const { data } = await client.graphql({
      query: listListings,
      variables: { filter: { status: { eq: "PENDING" } } }
    });
    setPendingListings(data.listListings.items);
  };

  // --- Categories ---
  const saveCategory = async () => {
    if (categoryForm.id) {
      await client.graphql({ query: updateCategory, variables: { input: categoryForm } });
    } else {
      await client.graphql({ query: createCategory, variables: { input: categoryForm } });
    }
    setShowCategoryModal(false);
    fetchCategories();
  };

  const deleteCategoryHandler = async (id) => {
    await client.graphql({ query: deleteCategory, variables: { input: { id } } });
    setConfirmAction(null);
    fetchCategories();
  };

  // --- Listings ---
  const approveListing = async (id) => {
    if (!statusReason) {
      alert(t('provideReason'));
      return;
    }
    await client.graphql({
      query: updateListingMinimalApproval,
      variables: {
        input: {
          id,
          statusReason,
          status: "APPROVED",
          approvedBy: userId,
          approvedAt: new Date().toISOString()
        }
      }
    });
    setStatusReason('');
    fetchPendingListings();
  };

  const rejectListing = async (id) => {
    if (!statusReason) {
      alert(t('provideReason'));
      return;
    }
    await client.graphql({
      query: updateListingMinimalApproval,
      variables: {
        input: {
          id,
          statusReason,
          status: "REJECTED",
          approvedBy: userId,
          approvedAt: new Date().toISOString()
        }
      }
    });
    setStatusReason('');
    fetchPendingListings();
  };

  const deleteListingHandler = async (listing) => {
    // 1. delete images via Cloudflare worker
    if (listing.mainImageUrl || listing.additionalImageUrls?.length) {
      await fetch("https://listing.etasick.workers.dev/delete  ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: listing.ownerId,
          listing_id: listing.id,
          images: [listing.mainImageUrl, ...(listing.additionalImageUrls || [])],
        }),
      });
    }

    // 2. delete listing in AppSync
    await client.graphql({ query: deleteListing, variables: { input: { id: listing.id } } });

    fetchPendingListings();
    setConfirmAction(null);
  };

  if (loading) {
    return <p className="text-center">{t('loading')}</p>;
  }

  if (!isAdmin && !isSuperAdmin) {
    return <p className="text-center text-red-500">{t('accessDenied')}</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">{t('adminPanel')}</h2>
        <nav>
          {isSuperAdmin && (
            <button onClick={() => setActiveTab('categories')}
              className={`block w-full text-left py-2 px-2 mb-1 rounded ${activeTab === 'categories' ? 'bg-gray-700' : ''}`}>
              {t('manageCategories')}
            </button>
          )}
          <button onClick={() => setActiveTab('listings')}
            className={`block w-full text-left py-2 px-2 mb-1 rounded ${activeTab === 'listings' ? 'bg-gray-700' : ''}`}>
            {t('reviewListings')}
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Listings */}
        {activeTab === 'listings' && (
          <section>
            <h2 className="text-2xl font-bold mb-4">{t('pendingListings')}</h2>
            {pendingListings.map(listing => (
              <div key={listing.id} className="bg-white shadow rounded p-6 mb-6">
                <h3 className="text-xl font-bold">{listing.title}</h3>
                <p><b>{t('price')}:</b> {listing.price} {listing.currency}</p>
                <p><b>{t('region')}:</b> {listing.region} / {listing.city}</p>
                <p><b>{t('description')}:</b> {listing.description}</p>
                <p><b>{t('contact')}:</b> {listing.contactPhone}</p>
                {listing.mainImageUrl && (
                  <img src={listing.mainImageUrl} alt="Main" className="w-48 h-32 object-cover rounded mt-2" />
                )}
                {listing.galleryImageUrls?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {listing.galleryImageUrls.map((url, idx) => (
                      <img key={idx} src={url} alt="extra" className="w-24 h-20 object-cover rounded" />
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder={t('reasonPlaceholder')}
                  className="border p-2 rounded w-full mt-4"
                />

                <div className="flex gap-3 mt-3">
                  <button onClick={() => approveListing(listing.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded">
                    {t('approve')}
                  </button>
                  <button onClick={() => rejectListing(listing.id)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded">
                    {t('reject')}
                  </button>
                  {isSuperAdmin && (
                    <button onClick={() => setConfirmAction({ type: 'deleteListing', listing })}
                            className="bg-red-600 text-white px-4 py-2 rounded">
                      {t('delete')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Categories */}
        {activeTab === 'categories' && isSuperAdmin && (
          <section>
            {/* category management UI (same as you have) */}
          </section>
        )}
      </main>

      {/* Confirmation Modal */}
      {confirmAction && confirmAction.type === 'deleteListing' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">{t('confirmDeleteTitle')}</h3>
            <p className="mb-4">{t('confirmDeleteMessage')}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 bg-gray-300 rounded">{t('cancel')}</button>
              <button onClick={() => deleteListingHandler(confirmAction.listing)} className="px-4 py-2 bg-red-500 text-white rounded">{t('delete')}</button>
            </div>
          </div>
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
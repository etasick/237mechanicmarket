// pages/account/listings/edit/[id].js
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getListing, updateListing } from '@/graphql/queries';
import { updateListing as updateListingMutation } from '@/graphql/mutations';
import { Amplify } from 'aws-amplify';
import awsconfig from '@/aws-exports';

Amplify.configure(awsconfig);
const client = generateClient();

export default function EditListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('id');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: '',
    region: '',
    mainImageUrl: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const { data } = await client.graphql({
          query: getListing,
          variables: { id: listingId }
        });

        const listing = data.getListing;
        setForm({
          title: listing.title,
          description: listing.description,
          category: listing.category,
          condition: listing.condition,
          location: listing.location,
          region: listing.region,
          mainImageUrl: listing.mainImageUrl
        });
      } catch (error) {
        console.error('Error loading listing:', error);
      }
    }

    if (listingId) fetchListing();
  }, [listingId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await client.graphql({
        query: updateListingMutation,
        variables: {
          input: {
            id: listingId,
            ...form
          }
        }
      });
      router.push('/account/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-3 bg-gray-800 border border-gray-600 rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-3 bg-gray-800 border border-gray-600 rounded" />
        <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full p-3 bg-gray-800 border border-gray-600 rounded" />
        <input type="text" name="condition" value={form.condition} onChange={handleChange} placeholder="Condition" className="w-full p-3 bg-gray-800 border border-gray-600 rounded" />
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-3 bg-gray-800 border border-gray-600 rounded" />
        <input type="text" name="region" value={form.region} onChange={handleChange} placeholder="Region" className="w-full p-3 bg-gray-800 border border-gray-600 rounded" />
        <input type="text" name="mainImageUrl" value={form.mainImageUrl} onChange={handleChange} placeholder="Main Image URL" className="w-full p-3 bg-gray-800 border border-gray-600 rounded" />

        <button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded">
          {isLoading ? 'Updating...' : 'Update Listing'}
        </button>
      </form>
    </div>
  );
}

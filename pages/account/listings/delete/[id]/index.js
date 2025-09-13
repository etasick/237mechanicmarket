// app/account/listings/delete/[id]/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { deleteListing } from '@/graphql/mutations';
import { getListing } from '@/graphql/queries';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const client = generateClient();

export default function DeleteListing({ params }) {
  const router = useRouter();
  const { id } = params;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await client.graphql({
          query: getListing,
          authMode:"userPool",
          variables: { id },
        });
        setListing(res.data.getListing);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load listing.');
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    try {
      await client.graphql({
        query: deleteListing,
        authMode:"userPool",
        variables: { input: { id } },
      });
      router.push('/account/listings');
    } catch (err) {
      console.error('Failed to delete listing:', err);
      setError('Could not delete listing.');
    }
  };

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl border border-gray-700">
      <h1 className="text-2xl font-bold text-white mb-4">Delete Listing</h1>
      <p className="text-gray-300 mb-4">Are you sure you want to delete this listing?</p>
      <div className="bg-gray-900 p-4 rounded-lg mb-4">
        <p className="text-white font-semibold">{listing.title}</p>
        <p className="text-gray-400 text-sm">{listing.location} | {listing.category}</p>
      </div>
      <div className="flex space-x-4">
        <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Yes, Delete</Button>
        <Link href="/account/listings">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/lib/amplifyClient';
import { getListing } from '@/src/graphql/queries';
import { updateListing } from '@/src/graphql/mutations';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function EditListing() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthenticator();

  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch listing data
  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const result = await client.graphql({
          query: getListing,
          variables: { id },
        });
        const data = result.data.getListing;
        if (!data) {
          alert('Listing not found.');
          router.push('/account/dashboard');
          return;
        }
        if (data.ownerId !== user.username) {
          alert('You do not have permission to edit this listing.');
          router.push('/account/dashboard');
          return;
        }
        setListing(data);
        // Pre-fill with editable fields only
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          currency: data.currency,
          categoryId: data.categoryId,
          condition: data.condition,
          contactPhone: data.contactPhone,
        });
      } catch (err) {
        console.error('Error fetching listing:', err);
      }
    };
    fetchListing();
  }, [id, user?.username]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit updated listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await client.graphql({
        query: updateListing,
        variables: {
          input: {
            id: listing.id,
            ...formData,
          },
        },
      });

      alert('Listing updated successfully!');
      router.push('/account/dashboard');
    } catch (err) {
      console.error('Error updating listing:', err);
      alert('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (!listing) return <p>Loading listing...</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price || ''}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded"
        />
        <input
          name="currency"
          value={formData.currency || ''}
          onChange={handleChange}
          placeholder="Currency (e.g., USD)"
          className="w-full border p-2 rounded"
        />
        <input
          name="categoryId"
          value={formData.categoryId || ''}
          onChange={handleChange}
          placeholder="Category ID"
          className="w-full border p-2 rounded"
        />
        <input
          name="condition"
          value={formData.condition || ''}
          onChange={handleChange}
          placeholder="Condition"
          className="w-full border p-2 rounded"
        />
        <input
          name="contactPhone"
          value={formData.contactPhone || ''}
          onChange={handleChange}
          placeholder="Contact Phone"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/amplifyClient';
import { updateListingUser } from '@/src/graphql/customMutations';
import { getListing } from '@/src/graphql/customQueries';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useTranslations } from 'next-intl';
import DashboardLayout from '@/components/DashboardLayout';

export default function EditListing() {
  const router = useRouter();
  const t = useTranslations('EditListing');
  
  // Get the ID from URL params (Next.js App Router way)
  const getIdFromPath = () => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      return pathParts[pathParts.length - 1];
    }
    return null;
  };
  
  const id = getIdFromPath();
  const { user } = useAuthenticator();

  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await client.graphql({
          query: getListing,
          authMode:"userPool",
          variables: { id }
        });
        const data = res.data.getListing;
        if (!data) {
          alert(t('listingNotFound'));
          router.push('/account');
          return;
        }
        if (data.ownerId !== user.username) {
          alert(t('permissionDenied'));
          router.push('/account');
          return;
        }
        setListing(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          currency: data.currency || '',
          condition: data.condition || '',
          contactPhone: data.contactPhone || '',
          location: data.location || '',
          region: data.region || ''
        });
      } catch (err) {
        console.error('Error loading listing:', err);
      }
    };
    fetchListing();
  }, [id, user?.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.graphql({
        query: updateListingUser,
        authMode:"userPool",
        variables: {
          input: {
            id: listing.id,
            ...formData
          }
        }
      });
      alert(t('updateSuccess'));
      router.push('/account');
    } catch (err) {
      console.error('Error updating listing:', err);
      alert(t('updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!listing) {
    return <p className="text-center mt-6">{t('loading')}</p>;
  }

  return (
    <DashboardLayout>
    <div className="max-w-2xl mx-auto py-8 text-gray-500">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <p className="text-sm text-gray-600 mb-6">
        {t('editInstructions')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={t('titlePlaceholder')}
          className="w-full border rounded p-2"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t('descriptionPlaceholder')}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder={t('pricePlaceholder')}
          className="w-full border rounded p-2"
        />
        <input
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          placeholder={t('currencyPlaceholder')}
          className="w-full border rounded p-2"
        />
        <input
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          placeholder={t('conditionPlaceholder')}
          className="w-full border rounded p-2"
        />
        <input
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          placeholder={t('contactPhonePlaceholder')}
          className="w-full border rounded p-2"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder={t('locationPlaceholder')}
          className="w-full border rounded p-2"
        />
        <input
          name="region"
          value={formData.region}
          onChange={handleChange}
          placeholder={t('regionPlaceholder')}
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t('saving') : t('saveChanges')}
        </button>
      </form>
    </div>
    </DashboardLayout>
  );
}
export async function getServerSideProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
      locale,
    },
  };
}





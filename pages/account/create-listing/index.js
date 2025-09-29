'use client';

import { useState, useEffect } from 'react';
import { createListing, updateListing } from '@/src/graphql/mutations';
import { useDropzone } from "react-dropzone";
import { listCategories } from '@/src/graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import imageCompression from 'browser-image-compression';
import ImageUploader from '@/components/ImageUploader';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createListingMinimal ,updateListingMinimal} from '@/src/graphql/customMutations';
import DashboardLayout from '@/components/DashboardLayout';

const client = generateClient();

const currencyOptions = ['USD', 'EUR', 'GBP', 'XAF', 'XOF'];
const listingStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export default function CreateListingPage() {
  const router = useRouter();
  const t = useTranslations('CreateListing');
  const tCommon = useTranslations('Common');
  
  const [step, setStep] = useState(1);
  const [listingId, setListingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ownerId, setOwnerId] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    condition: '',
    location: '',
    region: '',
    price: '',
    currency: 'XAF', // default currency
    isNegotiable: false,
    contactPhone: '',
    features: [], 
  });

  // Specs object to hold car/moto/spare-part details as JSON
  const [specs, setSpecs] = useState({
    // Example fields, adjust dynamically based on category
    manufacturer: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    driveType: '',
    engineSize: '',
    color: '',
    bodyType: '',
    engineCapacity: '',
    bikeType: '',
    partName: '',
    compatibleVehicles: '',
    brand: '',
    origin: '',
  });

  const [images, setImages] = useState({
    mainImage: null,
    additionalImages: [],
  });
  const regions = [
  'Adamawa',
  'Centre',
  'East',
  'Far North',
  'Littoral',
  'North',
  'North West',
  'South',
  'South West',
  'West',
];

  const locations = [
  'Douala',
  'Nkongsamba',
  'Loum',
  'Yaoundé',
  'Mbalmayo',
  'Obala',
  'Bafoussam',
  'Dschang',
  'Foumban',
  'Buea',
  'Limbe',
  'Kumba',
  'Bamenda',
  'Kumbo',
  'Ndop',
  'Garoua',
  'Guider',
  'Poli',
  'Maroua',
  'Kousséri',
  'Mora',
  'Bertoua',
  'Batouri',
  'Yokadouma',
  'Ngaoundéré',
  'Meiganga',
  'Tignère',
  'Ebolowa',
  'Sangmélima',
  'Kribi',
];

  useEffect(() => {
    async function fetchUser() {
      try {
        const session = await fetchAuthSession();
        const payload = session.tokens.idToken.payload;
        setOwnerId(payload.sub);
        setOwnerName(payload.name || ''); // or any other claim for display name
      } catch (e) {
        console.error('Auth error:', e);
      }
    }
    async function fetchCats() {
      try {
        const res = await client.graphql({ query: listCategories });
        setCategories(res.data.listCategories.items);
      } catch (e) {
        console.error('Fetch categories error:', e);
      }
    }
    fetchUser();
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'features') {
      // parse comma separated features input if used
      setForm((f) => ({ ...f, features: value.split(',').map(s => s.trim()) }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setSpecs((s) => ({ ...s, [name]: value }));
  };

  const selectedCategory = categories.find((cat) => cat.id === form.categoryId);
  const slug = selectedCategory?.slug;

  // Render specs inputs dynamically by category slug
  const renderSpecsInputs = () => {
    if (!slug) return null;

    // Define fields per category slug
    const fieldsByCategory = {
      cars: [
        'manufacturer', 'model', 'year', 'mileage', 'fuelType',
        'transmission', 'driveType', 'engineSize', 'color', 'bodyType',
      ],
      motorcycles: [
        'manufacturer', 'model', 'year', 'mileage', 'engineCapacity',
        'fuelType', 'color', 'transmission', 'bikeType',
      ],
      'spare-parts': [
        'partName', 'compatibleVehicles', 'brand', 'condition', 'origin',
      ],
    };

    const fields = fieldsByCategory[slug] || [];

    return (
      <div className="grid grid-cols-2 gap-4 text-white">
        {fields.map((field) => (
          <input
            key={field}
            className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name={field}
            placeholder={t(field)}
            value={specs[field] || ''}
            onChange={handleSpecsChange}
            type={['year', 'mileage', 'engineCapacity', 'engineSize'].includes(field) ? 'number' : 'text'}
          />
        ))}
      </div>
    );
  };

  const handleSubmitStepOne = async () => {
    setLoading(true);

    if (!form.title || !form.categoryId || !form.price || !form.condition || !form.location || !form.region || !form.currency) {
      alert(t('requiredFields'));
      setLoading(false);
      return;
    }

    try {
      // Compose listing input
      const listingInput = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        condition: form.condition,
        location: form.location,
        region: form.region,
        price: parseFloat(form.price),
        currency: form.currency,
        approvedBy: null,
        approvedAt: null,
        status: listingStatus.PENDING,
        statusReason: null,
        mainImageUrl: 'pending',
        galleryImageUrls: [],
        ownerId,
        ownerName,
        features: form.features,
        contactPhone: form.contactPhone,
        specs: JSON.stringify(specs),
      };

      const { data } = await client.graphql({
        query: createListingMinimal,
        variables: { input: listingInput },
      });
      const createdListing = data.createListing;
      setListingId(createdListing.id);
      setStep(2);
    } catch (err) {
      console.error('Create listing error:', err);
      alert(t('createFailed', { message: err.message || tCommon('unknownError') }));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!images.mainImage) {
      alert(t('selectMainImage'));
      return;
    }

    setLoading(true);
    try {
      const { mainImageUrl, additionalImageUrls } = await uploadImagesToCloudflare({
        userId: ownerId,
        listingId,
        mainImage: images.mainImage,
        additionalImages: images.additionalImages,
      });

      await client.graphql({
        query: updateListingMinimal,
        variables: {
          input: {
            id: listingId,
            mainImageUrl,
            galleryImageUrls: additionalImageUrls,
          },
        },
      });

      alert(t('listingCreated'));
      router.push('/account');
    } catch (err) {
      console.error('Image upload or update error:', err);
      alert(t('uploadFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-10 px-4 text-white">
        <h1 className="text-2xl font-bold mb-6">{step === 1 ? t('createListing') : t('uploadImages')}</h1>

        {step === 1 && (
          <div className="space-y-4">
            <input
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={t('title')}
            />
            <textarea
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t('description')}
            />
            <select
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full"
              name="condition"
              value={form.condition}
              onChange={handleChange}
            >
              <option value="">{t('condition')}</option>
              <option value="new">{t('new')}</option>
              <option value="used">{t('used')}</option>
            </select>
            <select
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full"
              name="location"
              value={form.location}
              onChange={handleChange}
            >
              <option value="">{t('location')}</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full"
              name="region"
              value={form.region}
              onChange={handleChange}
            >
              <option value="">{t('region')}</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full"
              name="currency"
              value={form.currency}
              onChange={handleChange}
            >
              {currencyOptions.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
            <input
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full"
              name="price"
              type="number"
              placeholder={t('price')}
              value={form.price}
              onChange={handleChange}
            />
            <input
              className="bg-black text-white border border-gray-600 rounded px-4 py-2 w-full"
              name="contactPhone"
              placeholder={t('contactPhone')}
              value={form.contactPhone}
              onChange={handleChange}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isNegotiable"
                checked={form.isNegotiable}
                onChange={handleChange}
              />
              <span>{t('negotiable')}</span>
            </label>

            {renderSpecsInputs()}

            <button
              onClick={handleSubmitStepOne}
              disabled={loading}
              className="bg-blue-600 px-6 py-3 rounded text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? t('creating') : t('continueToUpload')}
            </button>
          </div>
        )}

        {step === 2 && (
          <ImageUploader
            images={images}
            setImages={setImages}
            handleImageUpload={handleImageUpload}
            loading={loading}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// Helper function to compress and upload images to Cloudflare Worker (R2)
async function uploadImagesToCloudflare({ userId, listingId, mainImage, additionalImages }) {
  const endpoint = 'https://listing.etasick.workers.dev/upload  ';

  const compress = async (file) => {
    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    });
  };

  const upload = async (file, imageType) => {
    const compressed = await compress(file);
    const formData = new FormData();
    formData.append('file', compressed);
    formData.append('user_id', userId);
    formData.append('listing_id', listingId);
    formData.append('image_type', imageType);

    const res = await fetch(endpoint, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Image upload failed');
    const json = await res.json();
    return json.imageUrl;
  };

  const mainImageUrl = await upload(mainImage, 'main');
  const additionalImageUrls = await Promise.all(
    additionalImages.map((img) => upload(img, 'extra'))
  );

  return { mainImageUrl, additionalImageUrls };
}
export async function getStaticProps({locale}) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
      locale
    }
  };
}
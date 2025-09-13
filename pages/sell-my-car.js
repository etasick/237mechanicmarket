'use client';

import { useState, useEffect } from 'react';
import { listCategories } from '@/src/graphql/queries';
import { useRouter } from 'next/navigation';
import { Auth } from "aws-amplify";
import { getCurrentUser } from '@/lib/auth';
import publicClient from '@/src/amplifyPublicClient';
import authClient from '@/src/amplifyClient';
import { createListingMinimal, updateListingMinimal } from '@/src/graphql/customMutations';
import { signUp, confirmSignUp, signIn, fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import imageCompression from 'browser-image-compression';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { Hub } from 'aws-amplify/utils';
import { useTranslations } from 'next-intl';

const client = generateClient();

export default function SellVehiclePage({ category = 'cars' }) {
  const t = useTranslations('SellVehiclePage');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState("386a1714-07d2-423b-9eff-e6c842f1a09b");
  const [selectedCategory, setCategories] = useState(null);
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const listingStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
  };

  // === Listing Form ===
  const [listingForm, setListingForm] = useState({
    title: '',
    description: '',
    category,
    condition: 'used',
    price: '',
    currency: 'XAF',
    region: '',
    city: '',
    contactPhone: '',
    isNegotiable: false,
    features: [],
  });

  // Specialized specs by category
  const [specs, setSpecs] = useState({
    // cars
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
    // motorcycle
    engineCapacity: '',
    bikeType: '',
    // spare parts
    partCategory: '',
    compatibility: '',
  });

  const [images, setImages] = useState({
    mainImage: null,
    additionalImages: [],
  });

  // === Signup state ===
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [cognitoUsername, setCognitoUsername] = useState('');
  const [user, setUser] = useState(null);
  const [listingId, setListingId] = useState(null);

  // === Validation Errors ===
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Track touched fields to show errors only after interaction
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // === Handlers ===
  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (setter, field) => (e) => {
    setter((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sess = await fetchAuthSession();
        if (sess?.tokens?.idToken) {
          setSession(sess);
          setUser({
            attributes: {
              sub: sess.tokens.idToken.payload.sub,
              email: sess.tokens.idToken.payload.email,
              name: sess.tokens.idToken.payload.name,
            },
          });
        }
        setSessionLoading(false);
      } catch {
        setSession(null);
        setSessionLoading(true);
      }
    };

    checkSession();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        checkSession();
      }
      if (payload.event === "signedOut") {
        setSession(null);
        setSessionLoading(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await client.graphql({ query: listCategories });
      const cats = res.data.listCategories.items;
      setCategories(cats);
      const cat = cats.find((c) => c.slug === category);
      if (cat) setSelectedCategoryId(cat.id);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  // === Validation Functions ===
  const validateStep1 = () => {
    const newErrors = {};

    if (!listingForm.title.trim()) newErrors.title = t('errors.titleRequired');
    else if (listingForm.title.length < 5) newErrors.title = t('errors.titleTooShort');

    if (!listingForm.description.trim()) newErrors.description = t('errors.descriptionRequired');
    else if (listingForm.description.length < 20) newErrors.description = t('errors.descriptionTooShort');

    if (!listingForm.price || isNaN(listingForm.price) || parseFloat(listingForm.price) <= 0)
      newErrors.price = t('errors.priceInvalid');
    
    if (!listingForm.region.trim()) newErrors.region = t('errors.regionRequired');
    if (!listingForm.city.trim()) newErrors.city = t('errors.cityRequired');
    if (!listingForm.contactPhone.trim()) newErrors.contactPhone = t('errors.phoneRequired');
    else if (!/^\+?[0-9]{8,15}$/.test(listingForm.contactPhone.replace(/\s/g, '')))
      newErrors.contactPhone = t('errors.phoneInvalid');

    if (category === 'cars') {
      if (!specs.manufacturer.trim()) newErrors.manufacturer = t('errors.manufacturerRequired');
      if (!specs.model.trim()) newErrors.model = t('errors.modelRequired');
      if (specs.year && (isNaN(specs.year) || specs.year < 1900 || specs.year > new Date().getFullYear() + 1))
        newErrors.year = t('errors.yearInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = t('errors.fullNameRequired');
    if (!email) newErrors.email = t('errors.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('errors.emailInvalid');
    if (!password) newErrors.password = t('errors.passwordRequired');
    else if (password.length < 8) newErrors.password = t('errors.passwordTooShort');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    if (!otpCode || otpCode.length !== 6 || !/^\d{6}$/.test(otpCode.trim())) {
      setErrorMsg(t('errors.otpInvalid'));
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email, name: fullName },
        },
      });
      setCognitoUsername(email);
      if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setIsOtpRequired(true);
        setStep(2.5);
      } else {
        router.push('/signin');
      }
    } catch (err) {
      setErrorMsg(err.message || t('errors.signupFailed'));
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { isSignedIn } = await signIn({
        username: cognitoUsername,
        password,
      });

      if (isSignedIn) {
        setStep(3);
      } else {
        setErrorMsg(t('errors.signInFailed'));
      }
    } catch (err) {
      console.error("Signin error:", err);
      setErrorMsg(err.message || t('errors.signinFailed'));
    }
    setLoading(false);
  };

  const handleConfirmSignUp = async () => {
    if (!validateOTP()) return;

    setLoading(true);
    try {
      await confirmSignUp({
        username: cognitoUsername,
        confirmationCode: otpCode.trim(),
      });
      setStep(2.75);
    } catch (err) {
      setErrorMsg(err.message || t('errors.otpVerificationFailed'));
    }
    setLoading(false);
  };

  const handleCreateListing = async () => {
    if (!session) return;
    if (!validateStep1()) return;

    setLoading(true);
    try {
      const session = await fetchAuthSession();
      const payload = session.tokens.idToken.payload;
      const ownerId = payload.sub;
      const ownerName = payload.name;

      const listingInput = {
        title: listingForm.title.trim(),
        description: listingForm.description.trim(),
        categoryId: selectedCategoryId,
        condition: listingForm.condition,
        price: parseFloat(listingForm.price),
        currency: listingForm.currency,
        region: listingForm.region.trim(),
        location: listingForm.city.trim(),
        contactPhone: listingForm.contactPhone.replace(/\s/g, ''),
        approvedBy: null,
        approvedAt: null,
        status: listingStatus.PENDING,
        statusReason: null,
        ownerId,
        ownerName,
        specs: JSON.stringify(specs),
        mainImageUrl: 'pending',
        galleryImageUrls: [],
        features: listingForm.features,
      };

      const { data } = await client.graphql({
        query: createListingMinimal,
        authMode: "userPool",
        variables: { input: listingInput },
      });

      setListingId(data.createListing.id);
      setStep(4);
    } catch (err) {
      setErrorMsg(err.message || t('errors.createListingFailed'));
    }
    setLoading(false);
  };

  const handleImageUpload = async () => {
    if (!images.mainImage) {
      setErrorMsg(t('alerts.selectMainImage'));
      return;
    }
    if (images.additionalImages.length > 9) {
      setErrorMsg(t('imageUploader.maxImages', { count: 9 }));
      return;
    }

    setLoading(true);
    try {
      const { mainImageUrl, additionalImageUrls } = await uploadImagesToCloudflare({
        userId: user.attributes.sub,
        listingId,
        mainImage: images.mainImage,
        additionalImages: images.additionalImages,
      });

      await client.graphql({
        query: updateListingMinimal,
        authMode: "userPool",
        variables: {
          input: { id: listingId, mainImageUrl, galleryImageUrls: additionalImageUrls },
        },
      });

      setStep(5);
    } catch (err) {
      setErrorMsg(err.message || t('errors.imageUploadFailed'));
    }
    setLoading(false);
  };

  // === Render specialized fields by category ===
  const renderSpecializedFields = () => {
    if (category === 'cars') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form.manufacturer')}</label>
            <input
              placeholder={t('form.manufacturer')}
              name="manufacturer"
              value={specs.manufacturer}
              onChange={(e) => handleChange(e, setSpecs)}
              onBlur={() => handleBlur('manufacturer')}
              className={`input w-full ${errors.manufacturer ? 'border-red-500' : ''}`}
            />
            {errors.manufacturer && touched.manufacturer && (
              <p className="text-red-500 text-xs mt-1">{errors.manufacturer}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form.model')}</label>
            <input
              placeholder={t('form.model')}
              name="model"
              value={specs.model}
              onChange={(e) => handleChange(e, setSpecs)}
              onBlur={() => handleBlur('model')}
              className={`input w-full ${errors.model ? 'border-red-500' : ''}`}
            />
            {errors.model && touched.model && (
              <p className="text-red-500 text-xs mt-1">{errors.model}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form.year')}</label>
            <input
              placeholder={t('form.year')}
              name="year"
              value={specs.year}
              onChange={(e) => handleChange(e, setSpecs)}
              onBlur={() => handleBlur('year')}
              type="number"
              className={`input w-full ${errors.year ? 'border-red-500' : ''}`}
            />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>
        </>
      );
    }
    return null;
  };

  const getVehicleTypeTitle = () => {
    if (category === 'cars') return t('vehicleTypes.car');
    if (category === 'motorcycles') return t('vehicleTypes.motorcycle');
    if (category === 'spare-parts') return t('vehicleTypes.sparePart');
    return '';
  };

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">
          {step === 1 ? t('steps.listingInfo.title', { vehicleType: getVehicleTypeTitle() }) : 
           step <= 2.5 ? t('steps.signup.title') : 
           step === 3 ? t('steps.finalize.title') : 
           t('steps.uploadImages.title')}
        </h1>

        {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}

        {/* Step 1: Listing Info */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                {t('form.title')}
              </label>
              <input
                id="title"
                name="title"
                placeholder={t('form.titlePlaceholder')}
                value={listingForm.title}
                onChange={(e) => handleChange(e, setListingForm)}
                onBlur={() => handleBlur('title')}
                className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                {t('form.description')}
              </label>
              <textarea
                id="description"
                name="description"
                placeholder={t('form.descriptionPlaceholder')}
                value={listingForm.description}
                onChange={(e) => handleChange(e, setListingForm)}
                onBlur={() => handleBlur('description')}
                className={`input w-full ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                {t('form.price')}
              </label>
              <input
                id="price"
                name="price"
                placeholder={t('form.pricePlaceholder')}
                value={listingForm.price}
                onChange={(e) => handleChange(e, setListingForm)}
                onBlur={() => handleBlur('price')}
                type="number"
                step="0.01"
                min="0"
                className={`input w-full ${errors.price ? 'border-red-500' : ''}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Region */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                {t('form.region')}
              </label>
              <input
                id="region"
                name="region"
                placeholder={t('form.regionPlaceholder')}
                value={listingForm.region}
                onChange={(e) => handleChange(e, setListingForm)}
                onBlur={() => handleBlur('region')}
                className={`input w-full ${errors.region ? 'border-red-500' : ''}`}
              />
              {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                {t('form.city')}
              </label>
              <input
                id="city"
                name="city"
                placeholder={t('form.cityPlaceholder')}
                value={listingForm.city}
                onChange={(e) => handleChange(e, setListingForm)}
                onBlur={() => handleBlur('city')}
                className={`input w-full ${errors.city ? 'border-red-500' : ''}`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                {t('form.phone')}
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                placeholder={t('form.phonePlaceholder')}
                value={listingForm.contactPhone}
                onChange={(e) => handleChange(e, setListingForm)}
                onBlur={() => handleBlur('contactPhone')}
                className={`input w-full ${errors.contactPhone ? 'border-red-500' : ''}`}
              />
              {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                {t('form.condition')}
              </label>
              <select
                id="condition"
                name="condition"
                value={listingForm.condition}
                onChange={(e) => handleChange(e, setListingForm)}
                className="input w-full"
              >
                <option value="">{t('form.selectCondition')}</option>
                <option value="new">{t('form.conditions.new')}</option>
                <option value="used">{t('form.conditions.used')}</option>
              </select>
            </div>

            {/* Negotiable */}
            <div>
              <label htmlFor="isNegotiable" className="block text-sm font-medium text-gray-700">
                {t('form.negotiable')}
              </label>
              <select
                id="isNegotiable"
                name="isNegotiable"
                value={listingForm.isNegotiable}
                onChange={(e) => handleChange(e, setListingForm)}
                className="input w-full"
              >
                <option value="">{t('form.selectOption')}</option>
                <option value="true">{t('form.yes')}</option>
                <option value="false">{t('form.no')}</option>
              </select>
            </div>

            {/* Specialized fields */}
            {renderSpecializedFields()}

            <button
              onClick={() => {
                if (validateStep1()) {
                  !session ? setStep(2) : setStep(3);
                }
              }}
              className="btn-blue mt-4"
            >
              {t('buttons.continue')}
            </button>
          </div>
        )}

        {/* Step 2: Signup */}
        {step === 2 && !isOtpRequired && (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            <input
              placeholder={t('signup.fullName')}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              onBlur={() => handleBlur('fullName')}
              className={`input w-full ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}

            <input
              placeholder={t('signup.email')}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: '' }));
              }}
              onBlur={() => handleBlur('email')}
              className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

            <input
              placeholder={t('signup.password')}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: '' }));
              }}
              onBlur={() => handleBlur('password')}
              className={`input w-full ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

            <button onClick={handleSignUp} disabled={loading} className="btn-blue">
              {loading ? t('buttons.creating') : t('buttons.createAccount')}
            </button>
          </div>
        )}

        {/* Step 2.5: OTP */}
        {step === 2.5 && (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">{t('otp.description')}</p>
            <input
              placeholder={t('otp.placeholder')}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className={`input text-center w-full ${errorMsg ? 'border-red-500' : ''}`}
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <button onClick={handleConfirmSignUp} disabled={loading} className="btn-green">
              {loading ? t('buttons.verifying') : t('buttons.verifyContinue')}
            </button>
          </div>
        )}

        {/* Step 2.75: Sign In */}
        {step === 2.75 && (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">{t('signin.description')}</p>
            <input type="email" value={email} readOnly className="input bg-gray-100" />
            <input
              placeholder={t('signin.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <button onClick={handleSignIn} disabled={loading} className="btn-green">
              {loading ? t('buttons.signingIn') : t('buttons.signIn')}
            </button>
          </div>
        )}

        {/* Step 3: Create Listing */}
        {step === 3 && (
          <button
            onClick={handleCreateListing}
            disabled={sessionLoading || loading}
            className="btn-blue"
          >
            {sessionLoading ? t('buttons.waitingCredentials') : loading ? t('buttons.creating') : t('buttons.createListing')}
          </button>
        )}

        {/* Step 4: Image Upload */}
        {step === 4 && (
          <ImageUploader
            images={images}
            setImages={setImages}
            handleImageUpload={handleImageUpload}
            loading={loading}
            t={t}
          />
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-600">{t('success.title')}</h2>
            <p className="text-gray-600">{t('success.description')}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => router.push(`/account/edit-listing/listing/${listingId}`)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {t('success.editListing')}
              </button>
              <button
                onClick={() => router.push("/account/")}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                {t('success.goToDashboard')}
              </button>
              <button
                onClick={() => {
                  setListingForm({});
                  setListingId(null);
                  setStep(1);
                }}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                {t('success.createNew')}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

// ImageUploader (unchanged, but ensure it uses `t`)
function ImageUploader({ images, setImages, handleImageUpload, loading, t }) {
  const onMainImageDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert(t('imageUploader.fileRejected'));
      return;
    }
    if (acceptedFiles.length > 0) {
      setImages((prev) => ({ ...prev, mainImage: acceptedFiles[0] }));
    }
  };

  const onAdditionalImagesDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert(t('imageUploader.fileRejected'));
      return;
    }
    if (acceptedFiles.length > 0) {
      setImages((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...acceptedFiles].slice(0, 9),
      }));
    }
  };

  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } = useDropzone({
    onDrop: onMainImageDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
  });

  const { getRootProps: getAdditionalRootProps, getInputProps: getAdditionalInputProps } = useDropzone({
    onDrop: onAdditionalImagesDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 9,
    multiple: true,
  });

  const removeImage = (index, isMain = false) => {
    if (isMain) {
      setImages((prev) => ({ ...prev, mainImage: null }));
    } else {
      setImages((prev) => ({
        ...prev,
        additionalImages: prev.additionalImages.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t('imageUploader.title')}</h2>

      {/* Main Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('imageUploader.mainImage')}</label>
        {!images.mainImage ? (
          <div {...getMainRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
            <input {...getMainInputProps()} />
            <p className="text-gray-600">{t('imageUploader.dropMain')}</p>
          </div>
        ) : (
          <div className="relative inline-block">
            <img src={URL.createObjectURL(images.mainImage)} alt={t('imageUploader.mainImagePreview')} className="w-48 h-48 object-cover rounded-lg" />
            <button onClick={() => removeImage(0, true)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('imageUploader.additionalImages')}</label>
        <div {...getAdditionalRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500">
          <input {...getAdditionalInputProps()} />
          <p className="text-gray-600">{t('imageUploader.dropAdditional')}</p>
        </div>

        {images.additionalImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
            {images.additionalImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(img)} alt={`${t('imageUploader.additionalImage')} ${index + 1}`} className="w-full h-24 object-cover rounded" />
                <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleImageUpload} disabled={loading} className="btn-blue w-full">
        {loading ? t('buttons.uploading') : t('buttons.uploadImages')}
      </button>
    </div>
  );
}

// Image upload helper
async function uploadImagesToCloudflare({ userId, listingId, mainImage, additionalImages }) {
  const compress = async (file) => await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1200 });
  const uploadFile = async (file, type) => {
    const compressed = await compress(file);
    const fd = new FormData();
    fd.append('file', compressed);
    fd.append('user_id', userId);
    fd.append('listing_id', listingId);
    fd.append('image_type', type);
    const res = await fetch('https://listing.etasick.workers.dev/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    return (await res.json()).imageUrl;
  };
  const mainImageUrl = await uploadFile(mainImage, 'main');
  const additionalImageUrls = await Promise.all(additionalImages.map((img) => uploadFile(img, 'extra')));
  return { mainImageUrl, additionalImageUrls };
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
      locale,
    },
  };
}
'use client';

import { useState ,useEffect} from 'react';
import { listCategories } from '@/src/graphql/queries';
import { useRouter } from 'next/navigation';
import { signUp, confirmSignUp,signIn,fetchAuthSession} from 'aws-amplify/auth';
import { Auth } from "aws-amplify";
import { getCurrentUser } from '@/lib/auth';
import publicClient from '@/src/amplifyPublicClient';
import authClient from '@/src/amplifyClient';
import { createListingMinimal ,updateListingMinimal} from '@/src/graphql/customMutations';
import { generateClient } from 'aws-amplify/api';
import imageCompression from 'browser-image-compression';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useDropzone } from "react-dropzone";
import { Hub } from "aws-amplify/utils";


const client = generateClient();

export default function SellVehiclePage({ category = 'cars' }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState("386a1714-07d2-423b-9eff-e6c842f1a09b");
  const [selectedCategory,setCategories]=useState(null);
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

  // === Handlers ===
  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sess = await fetchAuthSession();
        if (sess?.tokens?.idToken) {
          setSession(sess);
          setSessionLoading(false);
        } else {
          setSession(null);
          setSessionLoading(true);
        }
      } catch {
        setSession(null);
        setSessionLoading(true);
      }
    };

    // Run once (in case user already signed in)
    checkSession();

    // ✅ Listen for sign-in/out events
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        checkSession();
      }
      if (payload.event === "signedOut") {
        setSession(null);
        setSessionLoading(true);
      }
    });

    // ✅ Proper cleanup in Amplify v6
    return unsubscribe;
  }, []);

  useEffect(() => {
      fetchCategories();
    }, []);
    async function fetchCategories() {
      try {
        const res = await publicClient.graphql({ query: listCategories});
        const cats = res.data.listCategories.items;
        setCategories(cats);
    
        // Map slug to categoryId
        const cat = cats.find((c) => c.slug === category); // initialCategory = "cars"
        if (cat) setSelectedCategoryId(cat.id);
        console.log(cat);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

  
  
  const handleSignUp = async () => {
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
      setErrorMsg(err.message || 'Signup failed');
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
  setLoading(true);
  setErrorMsg('');
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: cognitoUsername,
      password,
    });

    if (isSignedIn) {
      
      setStep(3);
    } else {
      // handle MFA etc.
      console.log("Next step:", nextStep);
    }
  } catch (err) {
    console.error("Signin error:", err);
    setErrorMsg(err.message || 'Signin failed');
  }
  setLoading(false);
};

  
 async function handleConfirmSignUp() {
  try {
    await confirmSignUp({
      username: cognitoUsername,
      confirmationCode: otpCode.trim(),
    });
    // ✅ Instead of auto sign in, push to Sign In step
    setStep(2.75);
  } catch (err) {
    console.error("Confirmation error:", err);
    setErrorMsg(err.message || "OTP verification failed");
  }
}

  

  

  /*const handleConfirmSignUp = async () => {
    setLoading(true);
    try {
      await confirmSignUp({ username: cognitoUsername, confirmationCode: otpCode.trim() });
      const {isSignedIn} = await signIn({username:cognitoUsername,password: password});
      if(isSignedIn){
      const session = await fetchAuthSession();
      const currentUser = session.user; 
      
      if (currentUser) {
        setUser(currentUser);
        setStep(3);
        console.log(currentUser);
      } else {
        throw new Error('Failed to get user information');
      }
    }
    } catch (err) {
      setErrorMsg(err.message || 'Confirmation failed');
    }
    setLoading(false);
  };
**/



  const handleCreateListing = async () => {
    if (!session) return;

    setLoading(true);
    try {
     
      const session = await fetchAuthSession();
     const payload = session.tokens.idToken.payload;
      const ownerId = payload.sub;
      const ownerName = payload.name;
      const currentUser = {
      attributes: {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
      }
    };
    setUser(currentUser);
      const listingInput = {
        title: listingForm.title,
        description: listingForm.description,
        categoryId: selectedCategoryId,
        condition: listingForm.condition,
        price: parseFloat(listingForm.price),
        currency: listingForm.currency,
        region: listingForm.region,
        location: listingForm.city,
        contactPhone: listingForm.contactPhone,
        approvedBy: null,
        approvedAt: null,
        status: listingStatus.PENDING,
        statusReason: null,
        ownerId,
        ownerName,
        specs: JSON.stringify(specs),
        mainImageUrl: 'pending',
        galleryImageUrls: [],
        features:listingForm.features
      };
      //console.log(user);
      const {data} = await client.graphql({
        query: createListingMinimal,
        authMode:"userPool",
        variables: { input: listingInput },
      });
      //console.log(data);
      setListingId(data.createListing.id);
      setStep(4);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create listing.');
    }
    setLoading(false);
  };

  const handleImageUpload = async () => {
    if (!images.mainImage) return alert('Select a main image');
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
        authMode:"userPool",
        variables: {
          input: { id: listingId, mainImageUrl, galleryImageUrls: additionalImageUrls },
        },
      });

      ///alert('Listing created successfully!');
      setStep(5);
     // router.push('/account');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload images');
    }
    setLoading(false);
  };

  // === Render specialized fields by category ===
  const renderSpecializedFields = () => {
    if (category === 'cars') {
      return (
        <>
         <input placeholder="Manufacturer" name="manufacturer" value={specs.manufacturer} onChange={(e) => handleChange(e, setSpecs)} className="input" />
<input placeholder="Model" name="model" value={specs.model} onChange={(e) => handleChange(e, setSpecs)} className="input" />
<input placeholder="Year" name="year" value={specs.year} onChange={(e) => handleChange(e, setSpecs)} className="input" />
<input placeholder="Mileage" name="mileage" value={specs.mileage} onChange={(e) => handleChange(e, setSpecs)} className="input" />

<input placeholder="Fuel Type" name="fuelType" value={specs.fuelType} onChange={(e) => handleChange(e, setSpecs)} className="input" />
<input placeholder="Transmission" name="transmission" value={specs.transmission} onChange={(e) => handleChange(e, setSpecs)} className="input" />
<input placeholder="Drive Type" name="driveType" value={specs.driveType} onChange={(e) => handleChange(e, setSpecs)} className="input" />
<input placeholder="Engine Size" name="engineSize" value={specs.engineSize} onChange={(e) => handleChange(e, setSpecs)} className="input" />
<input placeholder="Color" name="color" value={specs.color} onChange={(e) => handleChange(e, setSpecs)} className="input" />
<input placeholder="Body Type" name="bodyType" value={specs.bodyType} onChange={(e) => handleChange(e, setSpecs)} className="input" />

        </>
      );
    }
    if (category === 'motorcycles') {
      return (
        <>
          <input placeholder="Engine Capacity (cc)" name="engineCapacity" value={specs.engineCapacity} onChange={(e) => handleChange(e, setSpecs)} className="input" />
          <input placeholder="Motorcycle Type" name="bikeType" value={specs.bikeType} onChange={(e) => handleChange(e, setSpecs)} className="input" />
        </>
      );
    }
    if (category === 'spare-parts') {
      return (
        <>
          <input placeholder="Part Category" name="partCategory" value={specs.partCategory} onChange={(e) => handleChange(e, setSpecs)} className="input" />
          <input placeholder="Compatibility (e.g. Toyota Corolla 2010-2015)" name="compatibility" value={specs.compatibility} onChange={(e) => handleChange(e, setSpecs)} className="input" />
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">
          {step === 1 ? `Sell Your ${category === 'cars' ? 'Car' : category === 'motorcycles' ? 'Motorcycle' : 'Spare Part'}` : step <= 2.5 ? 'Sign Up to Continue' : step === 3 ? 'Finalize Listing' : 'Upload Images'}
        </h1>

        {/* Step 1: Listing Info */}
        {step === 1 && (
  <div className="space-y-4">
    {/* Title */}
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
        Title
      </label>
      <input
        id="title"
        name="title"
        placeholder="Enter title"
        value={listingForm.title}
        onChange={(e) => handleChange(e, setListingForm)}
        className="input w-full"
      />
    </div>

    {/* Description */}
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        placeholder="Enter description"
        value={listingForm.description}
        onChange={(e) => handleChange(e, setListingForm)}
        className="input w-full"
      />
    </div>

    {/* Price */}
    <div>
      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
        Price
      </label>
      <input
        id="price"
        name="price"
        placeholder="Enter price"
        value={listingForm.price}
        onChange={(e) => handleChange(e, setListingForm)}
        className="input w-full"
      />
    </div>

    {/* Region */}
    <div>
      <label htmlFor="region" className="block text-sm font-medium text-gray-700">
        Region
      </label>
      <input
        id="region"
        name="region"
        placeholder="Enter region"
        value={listingForm.region}
        onChange={(e) => handleChange(e, setListingForm)}
        className="input w-full"
      />
    </div>

    {/* City */}
    <div>
      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
        City
      </label>
      <input
        id="city"
        name="city"
        placeholder="Enter city"
        value={listingForm.city}
        onChange={(e) => handleChange(e, setListingForm)}
        className="input w-full"
      />
    </div>

    {/* Phone */}
    <div>
      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
        Phone
      </label>
      <input
        id="contactPhone"
        name="contactPhone"
        placeholder="Enter phone"
        value={listingForm.contactPhone}
        onChange={(e) => handleChange(e, setListingForm)}
        className="input w-full"
      />
    </div>

    {/* Condition */}
    <div>
      <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
        Condition
      </label>
      <select
        id="condition"
        name="condition"
        value={listingForm.condition}
        onChange={(e) => handleChange(e, setListingForm)}
        className="input w-full"
      >
        <option value="">Select condition</option>
        <option value="new">New</option>
        <option value="used">Used</option>
      </select>
    </div>

    {/* Negotiable */}
    <div>
      <label htmlFor="isNegotiable" className="block text-sm font-medium text-gray-700">
        Is price negotiable?
      </label>
      <select
        id="isNegotiable"
        name="isNegotiable"
        value={listingForm.isNegotiable}
        onChange={(e) => handleChange(e, setListingForm)}
        className="input w-full"
      >
        <option value="">Select</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>

    {/* Specialized fields */}
    {renderSpecializedFields()}

    <button onClick={() => !session?setStep(2): setStep(3)} className="btn-blue">
      Continue
    </button>
  </div>
)}


        {/* Step 2 + OTP same as before */}
        {step === 2 && !isOtpRequired && (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            {errorMsg && <div className="text-red-600">{errorMsg}</div>}
            <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
            <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
            <button onClick={handleSignUp} disabled={loading} className="btn-blue">{loading ? 'Creating...' : 'Create Account'}</button>
          </div>
        )}

        {step === 2.5 && (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            {errorMsg && <div className="text-red-600">{errorMsg}</div>}
            <p className="text-gray-600">Enter the OTP sent to your email</p>
            <input placeholder="OTP Code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="input text-center" />
            <button onClick={handleConfirmSignUp} disabled={loading} className="btn-green">{loading ? 'Verifying...' : 'Verify & Continue'}</button>
          </div>
        )}
        {step === 2.75 && (
  <div className="space-y-4 bg-white p-6 rounded-lg shadow">
    {errorMsg && <div className="text-red-600">{errorMsg}</div>}
    <p className="text-gray-600">Your account is verified. Please sign in to continue.</p>
    <input placeholder="Email" type="email" value={email} readOnly className="input bg-gray-100" />
    <input
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="input"
    />
    <button onClick={handleSignIn} disabled={loading} className="btn-green">
      {loading ? 'Signing in...' : 'Sign In'}
    </button>
  </div>
)}


       {step === 3 && (
  <button
    onClick={handleCreateListing}
    disabled={sessionLoading || loading}
    className={`px-4 py-2 rounded-lg text-white ${
      sessionLoading || loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {sessionLoading
      ? "Waiting for credentials..."
      : loading
      ? "Creating..."
      : "Create Listing"}
  </button>
)}

{step === 4 && (
  <ImageUploader
    images={images}
    setImages={setImages}
    handleImageUpload={handleImageUpload}
    loading={loading}
  />
)}

        {step === 5 && (
  <div className="text-center space-y-6">
    <h2 className="text-2xl font-bold text-green-600">
       Listing Created Successfully!
    </h2>
    <p className="text-gray-600">
      Your listing has been submitted it will go public in about 10 minutes after approval. You can now view it or manage your listings in your dashboard.
    </p>

    <div className="flex justify-center gap-4">
      <button
        onClick={() => router.push(`account/edit-listing/listing/${listingId}`)}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Edit My Listing
      </button>

      <button
        onClick={() => router.push("account/")}
        className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
      >
        Go to Dashboard
      </button>
       <button
        onClick={() => {
          setListingForm({});  
          setListingId(null);  
          setStep(1);          
        }}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        + Create New Listing
      </button>
    </div>
  </div>
)}

      </div>
      <Footer />
    </>
  );
}

// Image upload helper stays the same...
async function uploadImagesToCloudflare({ userId, listingId, mainImage, additionalImages }) {
  const compress = async (file) => await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1200 });
  const uploadFile = async (file, type) => {
    const compressed = await compress(file);
    const fd = new FormData();
    fd.append('file', compressed);
    fd.append('user_id', userId);
    fd.append('listing_id', listingId);
    fd.append('image_type', type);
    const res = await fetch('https://listing.etasick.workers.dev/upload  ', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    return (await res.json()).imageUrl;
  };
  const mainImageUrl = await uploadFile(mainImage, 'main');
  const additionalImageUrls = await Promise.all(additionalImages.map((img) => uploadFile(img, 'extra')));
  return { mainImageUrl, additionalImageUrls };
}

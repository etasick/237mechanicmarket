"use client";

import { useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import GeneralInfoForm from "@/components/GeneralInfoForm";
import CategorySelector from "@/components/CategorySelector";
import SignupFlow from "@/components/SignupFlow";
import ImageUploadStep from "@/components/ImageUploadStep";

export default function ListingWizard() {
  const [step, setStep] = useState(1);
  const [generalInfo, setGeneralInfo] = useState({});
  const [category, setCategory] = useState(null);
  const [categoryFields, setCategoryFields] = useState({});
  const [user, setUser] = useState(null);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleGeneralInfoSubmit = async (data) => {
    setGeneralInfo(data);

    // check if user is signed in before moving to category
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      setStep("signup");
    } else {
      setUser(currentUser);
      setStep(2); // go to category fields
    }
  };

  const handleSignupComplete = async (signedUpUser) => {
    setUser(signedUpUser);
    setStep(2); // move to category step
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {step === 1 && (
        <GeneralInfoForm
          initialData={generalInfo}
          onSubmit={handleGeneralInfoSubmit}
        />
      )}

      {step === "signup" && (
        <SignupFlow
          onSignupComplete={handleSignupComplete}
          onBack={back}
        />
      )}

      {step === 2 && (
        <CategorySelector
          category={category}
          setCategory={setCategory}
          initialData={categoryFields}
          onSubmit={(data) => {
            setCategoryFields(data);
            next();
          }}
          onBack={back}
        />
      )}

      {step === 3 && (
        <ImageUploadStep
          generalInfo={generalInfo}
          category={category}
          categoryFields={categoryFields}
          user={user}
          onBack={back}
        />
      )}
    </div>
  );
}

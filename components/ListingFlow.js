import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import SignupFlow from "./SignupFlow";

export default function ListingFlow({ formComponent: FormComponent, categoryId }) {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(authUser);
    } catch {
      setUser(null);
    }
  }

  const handleFormSubmit = (data) => {
    setFormData(data);
    if (user) {
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleSignupSuccess = (authUser) => {
    setUser(authUser);
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    // send GraphQL mutation to save listing
    console.log("Submitting listing:", { ...formData, categoryId, userId: user.username });
    // TODO: call client.graphql({ mutation: createListing, variables: { input: { ...formData, categoryId } }})
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
      {step === 1 && (
        <FormComponent onSubmit={handleFormSubmit} />
      )}
      {step === 2 && (
        <SignupFlow onSuccess={handleSignupSuccess} />
      )}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Review & Submit</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">{JSON.stringify(formData, null, 2)}</pre>
          <button
            onClick={handleFinalSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Post Listing
          </button>
        </div>
      )}
    </div>
  );
}

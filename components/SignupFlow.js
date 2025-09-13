"use client";

import { useState } from "react";
import { Auth } from "aws-amplify";

export default function SignupFlow({ onSignupComplete, onBack }) {
  const [step, setStep] = useState("signup"); // signup | confirm
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await Auth.signUp({
        username: formData.email,
        password: formData.password,
        attributes: {
          email: formData.email,
          name: formData.name,
        },
      });
      setStep("confirm");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
    setLoading(false);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await Auth.confirmSignUp(formData.email, code);
      const user = await Auth.signIn(formData.email, formData.password);
      onSignupComplete(user);
    } catch (err) {
      setError(err.message || "Confirmation failed");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md">
      {step === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <h2 className="text-xl font-bold">Create an Account</h2>

          <input
            type="text"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full border p-2 rounded"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-gray-600 hover:underline"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {step === "confirm" && (
        <form onSubmit={handleConfirm} className="space-y-4">
          <h2 className="text-xl font-bold">Confirm Your Email</h2>
          <p className="text-sm text-gray-600">
            A confirmation code has been sent to your email.
          </p>

          <input
            type="text"
            placeholder="Enter confirmation code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>
        </form>
      )}
    </div>
  );
}

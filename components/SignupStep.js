import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignupStep({ onSuccess }) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSignup = async () => {
    setLoading(true);
    await signUp(form.email, form.password);
    setLoading(false);
    setConfirmationSent(true);
  };

  const handleConfirm = async () => {
    // in your auth provider, confirm email → sign user in
    await onSuccess();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sign up to continue</h2>
      {!confirmationSent ? (
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handleSignup}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">We’ve sent you a confirmation email. Click the link, then press confirm below.</p>
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirm & Continue
          </button>
        </div>
      )}
    </div>
  );
}

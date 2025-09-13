// components/CloseAccount.js
"use client";

import { useState } from "react";
import { deleteUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function CloseAccount() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== "DELETE ACCOUNT") {
      return setError("You must type DELETE ACCOUNT to confirm.");
    }

    try {
      setDeleting(true);
      await deleteUser();
      router.push("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-red-600">Close Account</h2>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close Account
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700">
            This action is <strong>irreversible</strong>. All your account data will be deleted.
            To confirm, type <code className="bg-gray-100 px-2 py-1 rounded">DELETE ACCOUNT</code>.
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Type DELETE ACCOUNT"
          />

          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div className="flex space-x-4">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>

            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmText("");
                setError("");
              }}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

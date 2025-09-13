// components/CreateCategoryForm.js
import { useState } from "react";
import { API } from "aws-amplify";
import { createCategory } from "@/src/graphql/mutations";

export default function CreateCategoryForm({ onCreate }) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const input = { name };
      await API.graphql({
        query: createCategory,
        variables: { input },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      setName("");
      onCreate && onCreate(); // optional callback
    } catch (err) {
      console.error(err);
      setError("Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block font-semibold">New Category Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={creating}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {creating ? "Creating..." : "Create Category"}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}

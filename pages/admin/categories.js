import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createCategory } from "@/src/graphql/mutations";
import { client } from "@/src/graphql/client";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false); // tracks if user manually edited slug
  const [slugError, setSlugError] = useState("");

  const router = useRouter();

  // Function to generate slug from name
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with dash
      .replace(/[^a-z0-9-]/g, ""); // Remove invalid chars

  // Update slug automatically when name changes (only if user hasn't manually edited slug)
  useEffect(() => {
    if (!slugTouched) {
      setSlug(generateSlug(name));
      setSlugError("");
    }
  }, [name, slugTouched]);

  // Validate slug on user input
  const handleSlugChange = (e) => {
    const value = e.target.value;
    // Allow only letters, numbers, dashes
    if (/^[a-z0-9-]*$/.test(value)) {
      setSlug(value);
      setSlugError("");
    } else {
      setSlugError("Slug can only contain lowercase letters, numbers, and dashes.");
    }
    setSlugTouched(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slug) {
      alert("Slug cannot be empty.");
      return;
    }

    if (slugError) {
      alert("Please fix slug errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const input = { name, description, slug };
      await client.graphql({
        query: createCategory,
        variables: { input },
      });

      alert("Category created!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border px-4 py-2 w-full"
          placeholder="Category Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlugError("");
          }}
          required
        />
        <input
          className="border px-4 py-2 w-full"
          placeholder="Slug"
          value={slug}
          onChange={handleSlugChange}
          required
        />
        {slugError && <p className="text-red-600 text-sm">{slugError}</p>}

        <textarea
          className="border px-4 py-2 w-full"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
}

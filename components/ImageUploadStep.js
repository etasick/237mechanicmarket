import { useState } from "react";

export default function ImageUploadStep({ listingId, onComplete }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    for (let file of files) {
      // Send file to Cloudflare Worker
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/cloudflare-upload", { method: "POST", body: formData });

      // After Cloudflare Worker processes, update AWS listing with returned path
      await client.graphql({
        query: updateListing,
        variables: { input: { id: listingId, images: ["cloudflare_path.jpg"] } },
      });
    }

    setUploading(false);
    onComplete();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Photos</h2>
      <input type="file" multiple onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}

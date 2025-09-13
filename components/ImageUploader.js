import React, { useState } from "react";

export default function ImageUploader({
  images,
  setImages,
  handleImageUpload,
  loading,
}) {
  const MAX_ADDITIONAL = 5;
  const [dragOverMain, setDragOverMain] = useState(false);
  const [dragOverAdditional, setDragOverAdditional] = useState(false);

  // ---- Main Image ----
  const handleMainImageChange = (file) => {
    if (file) {
      setImages({ ...images, mainImage: file });
    }
  };

  const handleMainDrop = (e) => {
    e.preventDefault();
    setDragOverMain(false);
    const file = e.dataTransfer.files[0];
    handleMainImageChange(file);
  };

  // ---- Additional Images ----
  const handleAdditionalChange = (files) => {
    const newFiles = Array.from(files);
    const total = (images.additionalImages?.length || 0) + newFiles.length;

    if (total > MAX_ADDITIONAL) {
      alert(`You can only upload up to ${MAX_ADDITIONAL} additional images.`);
      return;
    }

    setImages({
      ...images,
      additionalImages: [...(images.additionalImages || []), ...newFiles],
    });
  };

  const handleAdditionalDrop = (e) => {
    e.preventDefault();
    setDragOverAdditional(false);
    handleAdditionalChange(e.dataTransfer.files);
  };

  const removeAdditional = (index) => {
    setImages({
      ...images,
      additionalImages: images.additionalImages.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Image Drag & Drop */}
      <div>
        <label className="block font-medium mb-2">Main Image (required)</label>

        {!images.mainImage ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition 
              ${dragOverMain ? "border-green-500 bg-green-50" : "border-gray-300"}
            `}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverMain(true);
            }}
            onDragLeave={() => setDragOverMain(false)}
            onDrop={handleMainDrop}
            onClick={() => document.getElementById("mainImageInput").click()}
          >
            <p className="text-gray-600">
              Drag & drop main image here, or click to select
            </p>
            <input
              id="mainImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleMainImageChange(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="relative inline-block">
            <img
              src={URL.createObjectURL(images.mainImage)}
              alt="Main preview"
              className="w-32 h-32 object-cover rounded shadow"
            />
            <button
              type="button"
              onClick={() => setImages({ ...images, mainImage: null })}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Additional Images Drag & Drop */}
      <div>
        <label className="block font-medium mb-2">
          Additional Images (max {MAX_ADDITIONAL})
        </label>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer
            ${dragOverAdditional ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverAdditional(true);
          }}
          onDragLeave={() => setDragOverAdditional(false)}
          onDrop={handleAdditionalDrop}
          onClick={() => document.getElementById("additionalImagesInput").click()}
        >
          <p className="text-gray-600">
            Drag & drop additional images here, or click to select
          </p>
          <input
            id="additionalImagesInput"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAdditionalChange(e.target.files)}
          />
        </div>

        {images.additionalImages?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {images.additionalImages.map((file, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Extra preview ${i + 1}`}
                  className="w-24 h-24 object-cover rounded shadow"
                />
                <button
                  type="button"
                  onClick={() => removeAdditional(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleImageUpload}
        disabled={loading || !images.mainImage}
        className={`btn-green ${
          (!images.mainImage || loading) && "opacity-50 cursor-not-allowed"
        }`}
      >
        {loading ? "Uploading..." : "Finish & Publish"}
      </button>

      {!images.mainImage && (
        <p className="text-red-500 text-sm">Main image is required to publish.</p>
      )}
    </div>
  );
}

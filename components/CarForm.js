import { useState } from "react";

export default function CarForm({ onSubmit }) {
  const [form, setForm] = useState({ make: "", model: "", year: "", price: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sell Your Car</h2>
      <input
        name="make"
        placeholder="Make (e.g. Toyota)"
        value={form.make}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="model"
        placeholder="Model (e.g. Corolla)"
        value={form.model}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="year"
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={() => onSubmit(form)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
}

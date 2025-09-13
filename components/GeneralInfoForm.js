import { useState } from "react";

export default function GeneralInfoForm({ onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "", price: "", region: "", city: "" });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">General Information</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 w-full mb-2" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input name="region" placeholder="Region" value={form.region} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2 w-full mb-2" />
      <button onClick={() => onSubmit(form)} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
    </div>
  );
}

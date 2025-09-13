import { useState } from "react";

export default function SparePartForm({ onSubmit }) {
  const [form, setForm] = useState({
    partName: "",
    compatibleVehicles: "",
    brand: "",
    origin: "",
    region: "",
    city: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sell Spare Part</h2>
      <input
        name="partName"
        placeholder="Part Name (e.g. Brake Pads)"
        value={form.partName}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="compatibleVehicles"
        placeholder="Compatible Vehicles (e.g. Toyota Corolla, Honda Civic)"
        value={form.compatibleVehicles}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="origin"
        placeholder="Origin (e.g. Japan)"
        value={form.origin}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="region"
        placeholder="Region"
        value={form.region}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="city"
        placeholder="City"
        value={form.city}
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

import { useState } from "react";

export default function MotorcycleForm({ onSubmit }) {
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    engineCapacity: "",
    mileage: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sell Your Motorcycle</h2>
      <input
        name="make"
        placeholder="Make (e.g. Yamaha)"
        value={form.make}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="model"
        placeholder="Model (e.g. R1)"
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
        name="engineCapacity"
        placeholder="Engine Capacity (cc)"
        value={form.engineCapacity}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        name="mileage"
        placeholder="Mileage (km)"
        value={form.mileage}
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

export default function CategorySelector({ onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Listing Category</h2>
      <div className="flex gap-4">
        <button onClick={() => onSelect("cars")} className="bg-gray-200 px-4 py-2 rounded">Car</button>
        <button onClick={() => onSelect("motorcycles")} className="bg-gray-200 px-4 py-2 rounded">Motorcycle</button>
        <button onClick={() => onSelect("spare-parts")} className="bg-gray-200 px-4 py-2 rounded">Spare Part</button>
      </div>
    </div>
  );
}

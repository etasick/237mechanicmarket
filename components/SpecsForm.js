function SpecsForm({ category, onSubmit }) {
  if (category === "cars") return <CarForm onSubmit={onSubmit} />;
  if (category === "motorcycles") return <MotorcycleForm onSubmit={onSubmit} />;
  if (category === "spare-parts") return <SparePartForm onSubmit={onSubmit} />;
  return null;
}

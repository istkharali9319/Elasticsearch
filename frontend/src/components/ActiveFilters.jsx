export default function ActiveFilters({ filters, onChange }) {
  const chips = [
    ...filters.categories.map((v) => ({ key: "categories", value: v, label: v })),
    ...filters.brands.map((v) => ({ key: "brands", value: v, label: v })),
    ...(filters.minPrice ? [{ key: "minPrice", label: `Min $${filters.minPrice}` }] : []),
    ...(filters.maxPrice ? [{ key: "maxPrice", label: `Max $${filters.maxPrice}` }] : []),
    ...(filters.minRating ? [{ key: "minRating", label: `${filters.minRating}★ & up` }] : []),
  ];

  if (chips.length === 0) return null;

  const removeChip = (chip) => {
    if (chip.key === "categories" || chip.key === "brands") {
      onChange({
        ...filters,
        [chip.key]: filters[chip.key].filter((v) => v !== chip.value),
      });
    } else {
      onChange({ ...filters, [chip.key]: "" });
    }
  };

  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      {chips.map((chip, i) => (
        <span className="chip" key={`${chip.key}-${chip.value ?? i}`}>
          {chip.label}
          <button onClick={() => removeChip(chip)} aria-label="Remove filter">
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}

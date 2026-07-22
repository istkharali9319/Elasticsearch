const OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      className="form-select sort-select"
      style={{ maxWidth: 220 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          Sort by: {opt.label}
        </option>
      ))}
    </select>
  );
}

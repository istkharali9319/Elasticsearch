export default function CategoryDropdown({ categories, value, onChange }) {
  return (
    <select
      className="form-select sort-select"
      style={{ maxWidth: 220 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.value} ({opt.count})
        </option>
      ))}
    </select>
  );
}

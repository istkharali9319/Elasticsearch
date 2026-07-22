const ICONS = {
  category: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  brand: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41 11 3.83 3.83 11l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  price: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  rating: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

function CheckboxGroup({ groupId, icon, title, options, selected, onToggle }) {
  return (
    <div className="mb-3">
      <div className="filter-section-title">
        {ICONS[icon]}
        {title}
      </div>
      {options.map((opt) => (
        <div className="form-check" key={opt.value}>
          <input
            className="form-check-input"
            type="checkbox"
            id={`${groupId}-${opt.value}`}
            checked={selected.includes(opt.value)}
            onChange={() => onToggle(opt.value)}
          />
          <label className="form-check-label" htmlFor={`${groupId}-${opt.value}`}>
            <span>{opt.value}</span>
            <span className="text-muted">{opt.count}</span>
          </label>
        </div>
      ))}
    </div>
  );
}

export default function FilterSidebar({ facets, filters, onChange, onClear }) {
  if (!facets) return null;

  const toggleValue = (key, value) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <aside className="filter-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
        <button className="btn btn-sm btn-link clear-link text-decoration-none p-0" onClick={onClear}>
          Clear all
        </button>
      </div>

      <CheckboxGroup
        groupId="category"
        icon="category"
        title="Category"
        options={facets.categories}
        selected={filters.categories}
        onToggle={(v) => toggleValue("categories", v)}
      />

      <hr className="filter-divider" />

      <CheckboxGroup
        groupId="brand"
        icon="brand"
        title="Brand"
        options={facets.brands}
        selected={filters.brands}
        onToggle={(v) => toggleValue("brands", v)}
      />

      <hr className="filter-divider" />

      <div className="mb-3">
        <div className="filter-section-title">
          {ICONS.price}
          Price
        </div>
        <div className="d-flex gap-2 align-items-center">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder={`Min ${Math.floor(facets.priceRange.min)}`}
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder={`Max ${Math.ceil(facets.priceRange.max)}`}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <hr className="filter-divider" />

      <div>
        <div className="filter-section-title">
          {ICONS.rating}
          Minimum Rating
        </div>
        {[4, 3, 2, 1].map((stars) => (
          <div className="form-check" key={stars}>
            <input
              className="form-check-input"
              type="radio"
              name="minRating"
              id={`rating-${stars}`}
              checked={filters.minRating === String(stars)}
              onChange={() => onChange({ ...filters, minRating: String(stars) })}
            />
            <label className="form-check-label" htmlFor={`rating-${stars}`}>
              <span>
                <span className="stars">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span> & up
              </span>
            </label>
          </div>
        ))}
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="minRating"
            id="rating-any"
            checked={filters.minRating === ""}
            onChange={() => onChange({ ...filters, minRating: "" })}
          />
          <label className="form-check-label" htmlFor="rating-any">
            <span>Any rating</span>
          </label>
        </div>
      </div>
    </aside>
  );
}

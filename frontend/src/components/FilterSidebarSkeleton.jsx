export default function FilterSidebarSkeleton() {
  return (
    <aside className="filter-sidebar">
      <div className="skeleton mb-4" style={{ width: 80, height: 22 }} />

      <div className="skeleton mb-3" style={{ width: 70, height: 12 }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="d-flex align-items-center gap-2 mb-3">
          <div className="skeleton" style={{ width: 17, height: 17, borderRadius: 5, flexShrink: 0 }} />
          <div className="skeleton" style={{ width: `${60 + (i % 3) * 15}%`, height: 12 }} />
        </div>
      ))}

      <hr className="filter-divider" />

      <div className="skeleton mb-3" style={{ width: 55, height: 12 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="d-flex align-items-center gap-2 mb-3">
          <div className="skeleton" style={{ width: 17, height: 17, borderRadius: 5, flexShrink: 0 }} />
          <div className="skeleton" style={{ width: `${50 + (i % 3) * 15}%`, height: 12 }} />
        </div>
      ))}
    </aside>
  );
}

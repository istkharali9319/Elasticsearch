export default function Pagination({ page, size, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / size));

  return (
    <div className="pagination-bar d-flex justify-content-between align-items-center mt-3">
      <span className="result-summary">
        Page <strong>{page}</strong> of {totalPages} — <strong>{total.toLocaleString()}</strong> results
      </span>
      <div className="d-flex gap-2">
        <button
          className="page-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Previous
        </button>
        <button
          className="page-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

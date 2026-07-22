export default function ProductCardSkeleton() {
  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="product-card" style={{ animation: "none" }}>
        <div className="skeleton" style={{ height: 92 }} />
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 999 }} />
            <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 999 }} />
          </div>
          <div className="skeleton mb-2" style={{ width: "90%", height: 14 }} />
          <div className="skeleton mb-3" style={{ width: "60%", height: 14 }} />
          <div className="skeleton mb-1" style={{ width: "100%", height: 11 }} />
          <div className="skeleton mb-3" style={{ width: "80%", height: 11 }} />
          <div className="d-flex justify-content-between mb-3">
            <div className="skeleton" style={{ width: 70, height: 22 }} />
            <div className="skeleton" style={{ width: 90, height: 14 }} />
          </div>
          <div className="skeleton" style={{ width: 110, height: 24, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}

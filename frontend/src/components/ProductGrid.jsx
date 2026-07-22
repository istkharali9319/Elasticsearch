import ProductCard from "./ProductCard.jsx";
import ProductCardSkeleton from "./ProductCardSkeleton.jsx";

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="row">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="state-panel">
        <div className="fs-2 mb-2">🔍</div>
        No products match your search and filters.
      </div>
    );
  }

  return (
    <div className="row">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

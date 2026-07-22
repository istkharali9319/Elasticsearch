import { colorForCategory } from "../utils/categoryColor.js";
import { iconForCategory } from "../utils/categoryIcon.js";

export default function ProductCard({ product }) {
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock < 30;
  const topRated = product.rating >= 4.5;
  const catColor = colorForCategory(product.category);

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="product-card">
        <div
          className="card-visual"
          style={{ background: `linear-gradient(135deg, ${catColor}26, ${catColor}0d)` }}
        >
          {topRated && <span className="ribbon">⭐ Top Rated</span>}
          <span>{iconForCategory(product.category)}</span>
        </div>

        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <span className="brand-badge-outline">{product.brand}</span>
            <span
              className="soft-badge"
              style={{ background: `${catColor}1a`, color: catColor }}
            >
              {product.category}
            </span>
          </div>

          <h6 className="product-title">{product.title}</h6>
          <p className="product-desc flex-grow-1">{product.description}</p>

          <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
            <span className="price-tag">${product.price.toFixed(2)}</span>
            <span className="stars">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
              <span className="text-muted ms-1" style={{ fontWeight: 500 }}>
                ({product.rating})
              </span>
            </span>
          </div>

          <span
            className={`stock-pill ${!inStock ? "stock-out" : lowStock ? "stock-low" : "stock-in"}`}
          >
            {!inStock
              ? "Out of stock"
              : lowStock
              ? `Only ${product.stock} left`
              : `In stock · ${product.stock}`}
          </span>
        </div>
      </div>
    </div>
  );
}

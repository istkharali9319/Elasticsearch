import { useEffect, useState } from "react";
import { fetchProducts, fetchFacets } from "./api/productApi.js";
import SearchBar from "./components/SearchBar.jsx";
import CategoryDropdown from "./components/CategoryDropdown.jsx";
import SortDropdown from "./components/SortDropdown.jsx";
import FilterSidebar from "./components/FilterSidebar.jsx";
import FilterSidebarSkeleton from "./components/FilterSidebarSkeleton.jsx";
import ActiveFilters from "./components/ActiveFilters.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import Pagination from "./components/Pagination.jsx";
import TopProgressBar from "./components/TopProgressBar.jsx";
import "./App.css";

const EMPTY_FILTERS = {
  categories: [],
  brands: [],
  minPrice: "",
  maxPrice: "",
  minRating: "",
};

function App() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const size = 12;

  const [facets, setFacets] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounce free-text search input so we don't fire a request per keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // Facets (filter sidebar options) only need to load once.
  useEffect(() => {
    fetchFacets().then(setFacets);
  }, []);

  // Any change to query/filters/sort resets to page 1 and re-fetches.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filters, sort]);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      q: debouncedQuery || undefined,
      category: filters.categories.join(",") || undefined,
      brand: filters.brands.join(",") || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      minRating: filters.minRating || undefined,
      sort,
      page,
      size,
    })
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, filters, sort, page]);

  return (
    <div className="min-vh-100">
      <TopProgressBar active={loading} />

      <nav className="app-navbar">
        <div className="container-fluid px-4 navbar-inner">
          <span className="brand">
            <span className="brand-badge">🔍</span>
            Product Search Platform
          </span>
          <div className="tagline">Powered by Elasticsearch — full-text search across 100,000 products</div>
        </div>
      </nav>

      <div className="container-fluid px-4" style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div className="search-panel d-flex gap-3 mb-4 flex-wrap">
          <SearchBar value={query} onChange={setQuery} />
          {facets && (
            <CategoryDropdown
              categories={facets.categories}
              value={filters.categories.length === 1 ? filters.categories[0] : ""}
              onChange={(value) =>
                setFilters({ ...filters, categories: value ? [value] : [] })
              }
            />
          )}
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        <div className="row">
          <div className="col-lg-3 mb-4">
            {facets ? (
              <FilterSidebar
                facets={facets}
                filters={filters}
                onChange={setFilters}
                onClear={() => setFilters(EMPTY_FILTERS)}
              />
            ) : (
              <FilterSidebarSkeleton />
            )}
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="result-summary">
                <strong>{total.toLocaleString()}</strong> products found
              </span>
            </div>

            <ActiveFilters filters={filters} onChange={setFilters} />

            <ProductGrid products={products} loading={loading} />
            {!loading && products.length > 0 && (
              <Pagination page={page} size={size} total={total} onPageChange={setPage} />
            )}
          </div>
        </div>
      </div>

      <div style={{ height: "3rem" }} />
    </div>
  );
}

export default App;

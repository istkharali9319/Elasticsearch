import { esClient, PRODUCT_INDEX } from "../config/elasticsearch.js";

// Full-text search — analyzes the query string the same way the field
// was analyzed at index time, then ranks results by BM25 relevance.
export async function searchProductsByText(queryText) {
  const result = await esClient.search({
    index: PRODUCT_INDEX,
    query: {
      match: {
        title: queryText,
      },
    },
  });

  return result.hits.hits.map((hit) => ({
    id: hit._id,
    score: hit._score,
    ...hit._source,
  }));
}

// Preview of Module 7 (Aggregations): terms aggregations count how many
// documents fall into each bucket of a keyword field — this powers the
// filter sidebar's "Category (1234)" style counts without loading any docs.
export async function getProductFacets() {
  const result = await esClient.search({
    index: PRODUCT_INDEX,
    size: 0,
    aggs: {
      categories: { terms: { field: "category", size: 20 } },
      brands: { terms: { field: "brand", size: 20 } },
      maxPrice: { max: { field: "price" } },
      minPrice: { min: { field: "price" } },
    },
  });

  return {
    categories: result.aggregations.categories.buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    })),
    brands: result.aggregations.brands.buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    })),
    priceRange: {
      min: result.aggregations.minPrice.value,
      max: result.aggregations.maxPrice.value,
    },
  };
}

// Shared across from/size pagination and search_after cursor pagination —
// both need the identical must/filter/should/must_not bool structure from
// Module 5, they only differ in how they page through the results.
function buildProductBoolQuery({
  query,
  category,
  brand,
  minPrice,
  maxPrice,
  minRating,
  excludeBrand,
}) {
  const must = query
    ? [{ multi_match: { query, fields: ["title^2", "description"] } }]
    : [{ match_all: {} }];

  // category/brand arrive as comma-separated strings from query params;
  // "terms" (plural) matches ANY value in the list — an OR across exact
  // keyword values, which is what checkbox-style multi-select filters need.
  const filter = [];
  if (category) filter.push({ terms: { category: category.split(",") } });
  if (brand) filter.push({ terms: { brand: brand.split(",") } });
  if (minPrice || maxPrice) {
    filter.push({
      range: {
        price: {
          ...(minPrice ? { gte: Number(minPrice) } : {}),
          ...(maxPrice ? { lte: Number(maxPrice) } : {}),
        },
      },
    });
  }
  if (minRating) {
    filter.push({ range: { rating: { gte: Number(minRating) } } });
  }

  // should — optional scoring boost, not a requirement to match. In-stock
  // products rank above otherwise-equal out-of-stock ones instead of being
  // excluded outright, since a sold-out item is still a valid search result.
  const should = [{ range: { stock: { gt: 0 } } }];

  // must_not — excludes a brand entirely, non-scoring (same filter-context
  // cost profile as `filter`), distinct from simply omitting it from `terms`.
  const mustNot = [];
  if (excludeBrand) {
    mustNot.push({ terms: { brand: excludeBrand.split(",") } });
  }

  return { bool: { must, filter, should, must_not: mustNot } };
}

// Preview of Module 4 (Range) + Module 5 (Bool) + Module 6 (Sort/Pagination):
// combines full-text relevance (must), exact filters (filter — no scoring
// cost, cacheable), and numeric ranges (filter) into one bool query.
export async function searchProductsAdvanced({
  query,
  category,
  brand,
  minPrice,
  maxPrice,
  minRating,
  excludeBrand,
  sort = "relevance",
  page = 1,
  size = 12,
}) {
  const boolQuery = buildProductBoolQuery({
    query,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    excludeBrand,
  });

  const sortOptions = {
    relevance: undefined, // default _score sort
    price_asc: [{ price: "asc" }],
    price_desc: [{ price: "desc" }],
    rating_desc: [{ rating: "desc" }],
    newest: [{ createdAt: "desc" }],
  };

  const result = await esClient.search({
    index: PRODUCT_INDEX,
    track_total_hits: true,
    from: (page - 1) * size,
    size,
    query: boolQuery,
    sort: sortOptions[sort],
  });

  return {
    total: result.hits.total.value,
    page,
    size,
    products: result.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    })),
  };
}

// search_after — cursor-based pagination for infinite scroll. Unlike
// from/size, this has no max_result_window ceiling and doesn't get slower
// as you page deeper, because each request only has to find documents
// after the cursor rather than re-sorting everything before it.
//
// Every sort MUST end with a unique tiebreaker field (id) — without one,
// documents sharing the same sort value (e.g. identical price) could be
// skipped or repeated as the cursor advances.
const INFINITE_SCROLL_SORT_OPTIONS = {
  relevance: [{ _score: "desc" }, { id: "asc" }],
  price_asc: [{ price: "asc" }, { id: "asc" }],
  price_desc: [{ price: "desc" }, { id: "asc" }],
  rating_desc: [{ rating: "desc" }, { id: "asc" }],
  newest: [{ createdAt: "desc" }, { id: "asc" }],
};

export async function searchProductsInfiniteScroll({
  query,
  category,
  brand,
  minPrice,
  maxPrice,
  minRating,
  excludeBrand,
  sort = "relevance",
  cursor,
  size = 12,
}) {
  const boolQuery = buildProductBoolQuery({
    query,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    excludeBrand,
  });

  const result = await esClient.search({
    index: PRODUCT_INDEX,
    size,
    query: boolQuery,
    sort: INFINITE_SCROLL_SORT_OPTIONS[sort],
    ...(cursor ? { search_after: cursor } : {}),
  });

  const hits = result.hits.hits;
  const lastHit = hits[hits.length - 1];

  return {
    products: hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    })),
    // Opaque cursor the client passes back as `cursor` to fetch the next
    // page; null once there are no more results.
    nextCursor: lastHit ? lastHit.sort : null,
  };
}

// Exact filter — no analysis on the value, must match a keyword field's
// stored string exactly (case-sensitive).
export async function findProductsByExactBrand(brand) {
  const result = await esClient.search({
    index: PRODUCT_INDEX,
    query: {
      term: {
        brand,
      },
    },
  });

  return result.hits.hits.map((hit) => ({
    id: hit._id,
    score: hit._score,
    ...hit._source,
  }));
}

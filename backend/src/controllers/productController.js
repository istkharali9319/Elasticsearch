import {
  searchProductsByText,
  findProductsByExactBrand,
  getProductFacets,
  searchProductsAdvanced,
  searchProductsInfiniteScroll,
} from "../services/productSearchService.js";

export async function searchProducts(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query param 'q' is required" });
  }

  const products = await searchProductsByText(q);
  res.json({ count: products.length, products });
}

export async function getProductsByBrand(req, res) {
  const { brand } = req.params;

  const products = await findProductsByExactBrand(brand);
  res.json({ count: products.length, products });
}

export async function getFacets(_req, res) {
  const facets = await getProductFacets();
  res.json(facets);
}

export async function browseProducts(req, res) {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    excludeBrand,
    sort,
    page,
    size,
  } = req.query;

  const result = await searchProductsAdvanced({
    query: q,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    excludeBrand,
    sort,
    page: page ? Number(page) : 1,
    size: size ? Number(size) : 12,
  });

  res.json(result);
}

export async function scrollProducts(req, res) {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    excludeBrand,
    sort,
    cursor,
    size,
  } = req.query;

  const result = await searchProductsInfiniteScroll({
    query: q,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    excludeBrand,
    sort,
    // cursor arrives as a JSON-encoded array string, e.g. cursor=[2.5,"41215"]
    cursor: cursor ? JSON.parse(cursor) : undefined,
    size: size ? Number(size) : 12,
  });

  res.json(result);
}

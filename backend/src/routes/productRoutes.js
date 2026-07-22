import { Router } from "express";
import {
  searchProducts,
  getProductsByBrand,
  getFacets,
  browseProducts,
} from "../controllers/productController.js";

const router = Router();

// GET /api/products/search?q=Samsung+Chair  -> match query (full-text)
router.get("/search", searchProducts);

// GET /api/products/facets  -> category/brand counts + price range for filter sidebar
router.get("/facets", getFacets);

// GET /api/products?q=&category=&brand=&minPrice=&maxPrice=&minRating=&sort=&page=&size=
router.get("/", browseProducts);

// GET /api/products/brand/Samsung  -> term query (exact, keyword field)
router.get("/brand/:brand", getProductsByBrand);

export default router;

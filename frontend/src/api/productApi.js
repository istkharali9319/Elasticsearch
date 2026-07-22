import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/products";

export async function fetchProducts(params) {
  const { data } = await axios.get(API_URL, { params });
  return data;
}

export async function fetchFacets() {
  const { data } = await axios.get(`${API_URL}/facets`);
  return data;
}

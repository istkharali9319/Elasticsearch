import { Client } from "@elastic/elasticsearch";

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9201",
});

export const PRODUCT_INDEX = "products";

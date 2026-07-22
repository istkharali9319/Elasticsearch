import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { Client as ElasticClient } from "@elastic/elasticsearch";

const prisma = new PrismaClient();
const es = new ElasticClient({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9201",
});

const INDEX = "products";
const TOTAL_PRODUCTS = 100_000;
const BATCH_SIZE = 5_000;

// Fixed vocabularies (not pure random faker words) so later aggregation
// modules have realistic, repeating buckets to group by.
const CATEGORIES = [
  "Electronics", "Computers", "Mobile Phones", "Home & Kitchen",
  "Sports & Outdoors", "Books", "Toys & Games", "Fashion",
  "Beauty & Personal Care", "Automotive",
];

const BRANDS = [
  "Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Lenovo",
  "Nike", "Adidas", "Puma", "IKEA", "Bosch", "Philips", "Xiaomi", "Asus",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProduct() {
  const brand = randomFrom(BRANDS);
  const category = randomFrom(CATEGORIES);
  const createdAt = faker.date.past({ years: 3 });

  return {
    title: `${brand} ${faker.commerce.productName()}`,
    description: faker.commerce.productDescription(),
    brand,
    category,
    price: Number(faker.commerce.price({ min: 5, max: 3000 })),
    rating: Number(faker.number.float({ min: 1, max: 5, fractionDigits: 1 })),
    stock: faker.number.int({ min: 0, max: 500 }),
    seller: faker.company.name(),
    createdAt,
    updatedAt: createdAt,
  };
}

async function prepareIndexForBulkLoad() {
  console.log("Disabling refresh_interval and replicas for fast bulk load...");
  await es.indices.putSettings({
    index: INDEX,
    settings: {
      refresh_interval: "-1",
      number_of_replicas: 0,
    },
  });
}

async function restoreIndexAfterBulkLoad() {
  console.log("Restoring refresh_interval and replicas...");
  await es.indices.putSettings({
    index: INDEX,
    settings: {
      refresh_interval: "1s",
      number_of_replicas: 1,
    },
  });
  await es.indices.refresh({ index: INDEX });
}

async function importBatch(batchNumber, totalBatches) {
  const fakeProducts = Array.from({ length: BATCH_SIZE }, generateProduct);

  // 1. Postgres is the source of truth — insert here first.
  const inserted = await prisma.product.createManyAndReturn({
    data: fakeProducts,
  });

  // 2. Build the Bulk API operations array. The ES JS client accepts a flat
  //    array of alternating {action} / {document} objects and serializes it
  //    to NDJSON internally before sending — this is the client doing for us
  //    exactly what the raw NDJSON body in Module 2's notes shows by hand.
  const operations = inserted.flatMap((product) => [
    { index: { _index: INDEX, _id: product.id.toString() } },
    {
      id: product.id,
      title: product.title,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      seller: product.seller,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    },
  ]);

  const bulkResponse = await es.bulk({ refresh: false, operations });

  if (bulkResponse.errors) {
    const failed = bulkResponse.items.filter((item) => item.index?.error);
    console.error(`Batch ${batchNumber}: ${failed.length} documents failed`);
    console.error(JSON.stringify(failed[0], null, 2));
  }

  console.log(
    `Batch ${batchNumber}/${totalBatches} done — ${inserted.length} products in Postgres + Elasticsearch`
  );
}

async function main() {
  const totalBatches = TOTAL_PRODUCTS / BATCH_SIZE;
  const startTime = Date.now();

  await prepareIndexForBulkLoad();

  for (let batch = 1; batch <= totalBatches; batch++) {
    await importBatch(batch, totalBatches);
  }

  await restoreIndexAfterBulkLoad();

  const elapsedSeconds = (Date.now() - startTime) / 1000;
  const throughput = Math.round(TOTAL_PRODUCTS / elapsedSeconds);

  console.log("\n--- Import complete ---");
  console.log(`Total products: ${TOTAL_PRODUCTS}`);
  console.log(`Total time: ${elapsedSeconds.toFixed(1)}s`);
  console.log(`Throughput: ${throughput} docs/sec`);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});

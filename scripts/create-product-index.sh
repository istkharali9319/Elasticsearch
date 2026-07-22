#!/bin/bash
set -e

ES_URL="${ELASTICSEARCH_URL:-http://localhost:9201}"

curl -s -X PUT "$ES_URL/products" \
  -H "Content-Type: application/json" \
  -d '{
    "mappings": {
      "properties": {
        "id":          { "type": "integer" },
        "title": {
          "type": "text",
          "fields": {
            "keyword": { "type": "keyword" }
          }
        },
        "description": { "type": "text" },
        "brand":       { "type": "keyword" },
        "category":    { "type": "keyword" },
        "price":       { "type": "float" },
        "rating":      { "type": "float" },
        "stock":       { "type": "integer" },
        "seller":      { "type": "keyword" },
        "createdAt":   { "type": "date" },
        "updatedAt":   { "type": "date" }
      }
    }
  }' | python3 -m json.tool

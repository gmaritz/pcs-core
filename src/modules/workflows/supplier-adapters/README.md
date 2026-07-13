# WF-006 Supplier Adapter Framework

This module adds adapter-based supplier feed ingestion and maps supplier-specific feeds into shared import contracts.

## Endpoint

POST /api/v1/imports/products/json

## Request body

{
  "supplierId": "<supplier-id>",
  "file": "sample-products.json"
}

## Notes

- The JSON adapter only parses and translates data.
- Validation and database import remain in the WF-005 Supplier Import Framework.
- New feed types can be added through SupplierAdapterFactory without changing import workflow logic.

# WF-005 Supplier Import Framework

This module provides the supplier-agnostic import pipeline for product imports.

## Endpoint

POST /api/v1/imports/products

## MVP request body

{
  "supplierId": "<supplier-id>",
  "file": "sample-products.json"
}

## Notes

- The sample file is loaded from `sample-data/`.
- Workflow is transactional and rolls back on failures.
- Parser, normalizer, validator and importer are separated for future supplier adapters.

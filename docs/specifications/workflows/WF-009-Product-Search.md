# PCS Core Workflow Specification

Workflow:
WF-009

Title:
Product Search

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 30

Module:
Search

Author:
ChatGPT

---

# Objective

Implement the Product Search workflow.

The workflow provides a reusable search service for products and product variants.

The Search module is responsible for searching, filtering, sorting and paging products.

The workflow must remain independent from the Storefront UI.

---

# References

WF-008 Pricing Engine Foundation

Maintain the existing PCS Core architecture.

---

# Existing Modules Used

Product

Product Variant

Brand

Category

Sport

Pricing

Inventory

Authentication

Authorization

---

# Architecture

```
Client

↓

Search Controller

↓

Search Service

↓

Search Engine

↓

Repository

↓

Database
```

---

# Folder Structure

Create

```
src/modules/workflows/

    product-search/

        controllers/

        middleware/

        routes/

        services/

        validation/

        types/

        index.ts

        README.md
```

---

# Search Module

Use

```
src/modules/search/
```

Create

```
controllers/

services/

engines/

filters/

types/

index.ts
```

---

# Search Engine

Create

```
ProductSearchEngine.ts
```

Responsibilities

Search products.

No HTTP.

No Prisma.

No EJS.

Pure search logic.

---

# Search Service

Create

```
ProductSearchService.ts
```

Responsibilities

Receive search request.

↓

Build search criteria.

↓

Call Search Engine.

↓

Return results.

---

# Search Filters

Create

```
ProductFilter.ts
```

Supports

Sport

Brand

Category

Price Range

Availability

---

# Endpoint

GET

```
/api/v1/products/search
```

Public endpoint.

Authentication not required.

---

# Query Parameters

```
q

sport

brand

category

minPrice

maxPrice

available

page

pageSize

sort
```

Example

```
/products/search?q=pro staff&brand=Wilson&page=1&pageSize=20
```

---

# Search Behaviour

Search

Product Name

Description

Brand

Category

Sport

Case insensitive.

---

# Sorting

Support

```
relevance

price-asc

price-desc

name-asc

name-desc

newest
```

Default

```
relevance
```

---

# Pagination

Default

```
page = 1

pageSize = 20
```

Maximum

```
100
```

---

# Response

```json
{
    "page":1,

    "pageSize":20,

    "total":35,

    "results":[]
}
```

---

# Business Rules

Only active products.

Only active variants.

Selling Price only.

Hidden products excluded.

Inventory optional.

Search is case insensitive.

---

# Search Engine Responsibilities

Keyword search.

↓

Apply filters.

↓

Sort.

↓

Page.

↓

Return results.

---

# Search Service Responsibilities

Validation.

↓

Criteria creation.

↓

Engine.

↓

DTO mapping.

---

# Future Features

Reserved

Synonyms

Autocomplete

Recently Viewed

Popular Products

Elasticsearch

Meilisearch

AI Search

---

# Acceptance Criteria

Application compiles.

Search module implemented.

Search engine implemented.

Search service implemented.

Public endpoint operational.

Paging implemented.

Sorting implemented.

Filtering implemented.

No TypeScript errors.

---

# Verification

## Test 1

Keyword search.

Expected

Matching products returned.

---

## Test 2

Brand filter.

Expected

Only Wilson.

---

## Test 3

Category filter.

Expected

Only Tennis Racquets.

---

## Test 4

Price range.

Expected

Correct products.

---

## Test 5

Pagination.

Expected

Correct page returned.

---

## Test 6

Sort by price.

Expected

Ascending order.

---

## Test 7

Case insensitive search.

Expected

Same results.

---

# Completion Checklist

☐ Search module created

☐ Search engine implemented

☐ Search service implemented

☐ Filters implemented

☐ Pagination implemented

☐ Sorting implemented

☐ Endpoint implemented

☐ Tests passed

☐ Project compiles

☐ Commit completed

---

# Commit Message

```
feat(search): implement product search
```

---

# Notes

This workflow establishes the PCS Core Search Platform.

The workflow is intentionally UI-independent.

The Storefront will consume the search service rather than implementing search logic itself.

Future enhancements such as autocomplete, synonyms, AI search and external search engines will extend the Search module without requiring changes to the Storefront.

---

# End Workflow
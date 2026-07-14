# PCS Core Workflow Specification

Workflow:
WF-010B

Title:
Dynamic Home Page

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 32

Module:
Storefront

Author:
ChatGPT

---

# Objective

Transform the static storefront homepage into a fully dynamic homepage powered by existing PCS Core business services.

No presentation redesign is permitted.

The visual appearance established during the onboarding site and WF-010A must remain unchanged.

Replace static content with live data supplied through View Models.

---

# References

WF-010A Storefront Foundation

WF-009 Product Search

WF-008 Pricing Engine Foundation

WF-007 Inventory Synchronisation

Maintain the existing storefront architecture.

---

# Existing Modules Used

Search

Catalog

Pricing

Inventory

Brand

Category

Sport

Storefront

---

# Architecture

```
                Home Request

                      │

                      ▼

         StorefrontController

                      │

                      ▼

           StorefrontFacade

      ┌──────────┬──────────┬──────────┬──────────┐
      ▼          ▼          ▼          ▼
 Search      Catalog     Pricing   Inventory

      └──────────┬──────────┬──────────┘

                 ▼

          HomeViewModel

                 ▼

             home.ejs
```

---

# Folder Structure

Create

```
src/modules/storefront/

    controllers/

    facades/

    services/

    view-models/

    routes/

    types/

    index.ts
```

---

# Facade

Create

```
StorefrontFacade.ts
```

Responsibilities

Coordinate all homepage business services.

The controller must never call multiple business services directly.

The facade builds the complete HomeViewModel.

---

# View Models

Create

```
HomeViewModel.ts

FeaturedProductsViewModel.ts

BrandsViewModel.ts

CategoriesViewModel.ts

SportsViewModel.ts

HeroStatisticsViewModel.ts
```

View Models must contain presentation-ready data.

No formatting logic inside EJS.

---

# Dynamic Sections

Replace static homepage content.

---

## Hero Statistics

Populate dynamically.

Display

- Total Active Products
- Total Active Brands
- Total Court Sports
- Total Categories

These values come from existing services.

---

## Featured Products

Populate dynamically.

Requirements

- Active products only
- Active variants only
- Selling price only
- Primary image
- Brand
- Sport
- Stock availability
- Product URL

Maximum

```
8
```

products.

---

## Categories

Load dynamically.

Display

- Category name
- Category image
- Product count

---

## Brands

Load dynamically.

Display

- Brand logo
- Brand name

Only active brands.

---

## Court Sports

Load dynamically.

Display

- Sport
- Hero image
- Description

---

## Search Bar

Wire homepage search.

Submit to

```
GET /api/v1/products/search
```

No autocomplete yet.

---

# Storefront Controller

Responsibilities

Receive request.

↓

Call StorefrontFacade.

↓

Render

```
home.ejs
```

No business logic.

---

# StorefrontFacade

Responsibilities

Retrieve

Hero statistics.

↓

Retrieve

Featured products.

↓

Retrieve

Brands.

↓

Retrieve

Categories.

↓

Retrieve

Sports.

↓

Build

HomeViewModel.

↓

Return.

---

# Services

Existing business services remain responsible for data retrieval.

No duplicate queries.

No direct Prisma access from the Storefront.

---

# Business Rules

Homepage must remain visually identical.

Only active entities displayed.

Only selling prices displayed.

Out-of-stock products display an availability badge.

Featured products limited to eight.

No business calculations in EJS.

---

# Routes

Homepage

```
GET /
```

Search

```
GET /search
```

No route changes beyond existing storefront foundation.

---

# Acceptance Criteria

Homepage visually unchanged.

Hero statistics dynamic.

Featured products dynamic.

Brands dynamic.

Categories dynamic.

Sports dynamic.

Facade implemented.

View Models implemented.

Controller simplified.

Project compiles.

No TypeScript errors.

---

# Verification

## Compile

```
npm run build
```

Passes.

---

## Integration Tests

Create

```
wf-010b-homepage.integration.ts
```

Verify

- Homepage renders
- Hero statistics populated
- Featured products loaded
- Brands loaded
- Categories loaded
- Sports loaded

---

## Business Tests

### Test 1

Add a new Brand.

Homepage reflects it.

---

### Test 2

Deactivate a Product.

Featured Products updates.

---

### Test 3

Deactivate a Category.

Homepage removes it.

---

### Test 4

Change a Selling Price.

Homepage reflects new price.

---

### Test 5

Set Inventory to zero.

Homepage displays Out of Stock.

---

### Test 6

Verify Homepage.

Visual appearance unchanged.

---

# Completion Checklist

☐ StorefrontFacade implemented

☐ View Models implemented

☐ Dynamic hero statistics

☐ Dynamic featured products

☐ Dynamic categories

☐ Dynamic brands

☐ Dynamic sports

☐ Homepage search wired

☐ Integration tests passing

☐ Project compiles

☐ Commit completed

---

# Commit Message

```
feat(storefront): implement dynamic homepage
```

---

# Notes

WF-010B transforms the homepage from a static marketing page into a live storefront powered entirely by existing PCS Core business services.

The Storefront acts exclusively as a presentation layer.

The StorefrontFacade coordinates business services and assembles View Models.

Business logic remains within the existing domain services.

This workflow establishes the architectural pattern that will be reused by the Product Catalogue, Product Detail, Customer Account and future storefront pages.

---

# End Workflow
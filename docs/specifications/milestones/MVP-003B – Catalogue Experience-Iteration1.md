# PCS Core Implementation Specification

Module:
Catalogue

Milestone:
MVP-003B

Iteration:
01

Title:
Catalogue Experience Foundation

Version:
1.0

Status:
Ready for Implementation

---

# Objective

Implement the production catalogue browsing experience for Pro Court Sports.

This milestone establishes the foundation for product discovery while preserving the existing domain architecture.

The catalogue must reinforce Pro Court Sports as South Africa's premium specialist for Tennis, Padel and Squash.

---

# Guiding Principles

The catalogue should feel like a specialist pro shop.

It should never resemble a generic marketplace.

Customers should always know:

- Where they are
- What they are browsing
- How to narrow their choices
- How to move deeper into the catalogue

---

# Architecture

Introduce a dedicated catalogue module.

```
CatalogueController

↓

CatalogueFacade

↓

CataloguePresentationService

↓

Catalog Domain Services

↓

Repositories
```

Do not overload StorefrontFacade.

Catalogue becomes its own bounded context within the storefront.

---

# Folder Structure

Create

```
src/

    controllers/

        CatalogueController.ts

    facades/

        CatalogueFacade.ts

    services/

        presentation/

            CataloguePresentationService.ts

    views/

        catalogue/

            landing.ejs

            sport.ejs

            category.ejs

            brand.ejs

            partials/

                filter-sidebar.ejs

                product-grid.ejs

                sort-toolbar.ejs

                breadcrumb.ejs

                pagination.ejs
```

Reuse ProductCard from MVP-003A.

---

# Routes

Create

```
GET /shop

GET /shop/:sport

GET /shop/:sport/:category

GET /brands/:brand
```

Routes should use existing router conventions.

---

# Catalogue Landing Page

Purpose

Introduce shopping.

Display

Hero

Featured Sports

Featured Categories

Featured Brands

Featured Products

This page becomes the entry point to the catalogue.

---

# Sport Landing Page

Example

```
/shop/tennis
```

Display

Sport Hero

Category Grid

Featured Products

Featured Brands

Breadcrumb

---

# Category Page

Example

```
/shop/tennis/racquets
```

Display

Category Hero

Breadcrumb

Sort Toolbar

Filter Sidebar

Product Grid

Pagination

---

# Brand Page

Example

```
/brands/wilson
```

Display

Brand Hero

Brand Description

Featured Categories

Products

---

# Breadcrumb Component

Always visible.

Example

```
Home

>

Shop

>

Tennis

>

Racquets
```

All levels clickable.

---

# Product Grid

Desktop

4 columns

Tablet

3 columns

Mobile

2 columns

Reuse existing ProductCard.

---

# Product Card

Continue using

Image

Brand

Name

Price

Stock Badge

Add To Cart

Reserved

Wishlist

Compare

No redesign required.

---

# Filter Sidebar

Iteration 1

Static layout.

Sections

Sport

Category

Brand

Price

Availability

Performance Tier

Filtering logic should already connect to existing services where possible.

---

# Performance Tier

Replace "Beginner".

Available values

Performance

Competition

Elite

Supports premium positioning.

---

# Sort Toolbar

Display

Sort By

Results Count

View Toggle (future)

Sorting

Featured

Newest

Price

Brand

Alphabetical

---

# Pagination

Traditional pagination.

Display

Previous

Pages

Next

Preserve filters and sorting.

---

# Brand Pages

Brands

Wilson

HEAD

Babolat

Tecnifibre

Dunlop

Yonex

ASICS

Brand hero image supplied through MediaService.

---

# View Models

Introduce

```
CatalogueLandingViewModel

SportCatalogueViewModel

CategoryCatalogueViewModel

BrandCatalogueViewModel
```

Presentation only.

---

# CatalogueFacade

Implement

```
getLanding()

getSport()

getCategory()

getBrand()
```

Return complete view models.

Controllers remain thin.

---

# CataloguePresentationService

Responsibilities

Build breadcrumbs.

Resolve hero images.

Prepare product cards.

Prepare filters.

Prepare sorting.

Prepare pagination.

No business rules.

---

# Search Compatibility

Catalogue pages must remain compatible with future:

Global Search

AI Search

Guided Shopping

Wishlist

Comparison

No implementation required.

---

# Responsive Behaviour

Desktop

Sidebar filters.

Tablet

Collapsible filters.

Mobile

Slide-in filter drawer placeholder.

No advanced drawer logic required yet.

---

# Accessibility

Semantic headings.

Keyboard accessible filters.

Visible focus.

ARIA labels.

Accessible pagination.

---

# Performance

Optimised product queries.

Pagination.

Lazy-loaded images.

Minimal layout shift.

Reuse MediaService.

---

# Validation

Verify

Landing page renders.

Sport pages render.

Category pages render.

Brand pages render.

Breadcrumbs display.

Product cards display.

Responsive layouts work.

Existing storefront tests continue passing.

---

# Acceptance Criteria

- Dedicated CatalogueController introduced.
- Dedicated CatalogueFacade introduced.
- Dedicated CataloguePresentationService introduced.
- Catalogue landing page implemented.
- Sport landing pages implemented.
- Category pages implemented.
- Brand landing pages implemented.
- Breadcrumb navigation implemented.
- Product grid implemented.
- Sidebar filter UI implemented.
- Sort toolbar implemented.
- Pagination implemented.
- Existing architecture preserved.

---

# Commit Message

```
feat(catalogue): implement catalogue browsing foundation
```

---

# Out of Scope

The following are intentionally excluded from Iteration 1:

- Dynamic faceted filtering
- Compare Products
- Wishlist
- AI Search
- Guided Shopping
- Product recommendations
- Infinite scrolling
- Buying guides
- Product videos
- Recently viewed products

These will be introduced in later milestones without changing the catalogue architecture.

---

# End Specification
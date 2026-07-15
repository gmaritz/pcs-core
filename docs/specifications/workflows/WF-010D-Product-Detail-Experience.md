# PCS Core Workflow Specification

Workflow:
WF-010D

Title:
Product Detail Experience

Version:
2.0

Status:
Ready for Implementation

Sprint:
Sprint 34

Module:
Storefront

Author:
ChatGPT

---

# Objective

Implement the Product Detail page by integrating the existing Catalog, Pricing, Inventory, Media, Recommendation and Search services into a premium customer shopping experience.

The Product Detail page remains a presentation layer.

Business logic remains inside existing domain services.

No duplicate pricing, inventory, search or recommendation logic may be implemented.

---

# References

WF-010A Storefront Foundation

WF-010B Dynamic Home Page

WF-010C Product Catalogue & Search

Maintain the existing Storefront architecture.

---

# Existing Modules Used

Catalog

Search

Pricing

Inventory

Media

Content

Recommendation

Storefront

---

# Architecture

```
Customer

↓

ProductController

↓

ProductFacade

↓

StorefrontPresentationService

↓

PageMetadataService

↓

MediaService

↓

RecommendationService

↓

Catalog Services

↓

Pricing Services

↓

Inventory Services

↓

ProductDetailViewModel

↓

product.ejs
```

---

# Folder Structure

## Storefront

```
src/modules/storefront/

    facades/

        ProductFacade.ts

    view-models/

        ProductDetailViewModel.ts

        ProductGalleryViewModel.ts

        ProductSpecificationViewModel.ts

        RelatedProductsViewModel.ts

        BreadcrumbViewModel.ts
```

---

## Recommendation Module

Create

```
src/modules/recommendation/

    services/

        RecommendationService.ts

    types/

        RecommendationCriteria.ts

        RecommendationResult.ts

    index.ts
```

---

# RecommendationService

The Recommendation Service owns all product recommendation logic.

The Product Detail page must never determine which products are recommended.

Initial recommendation strategy

1.

Same Category

↓

2.

Same Brand

↓

3.

Same Sport

Maximum

```
4
```

products.

Exclude

Current Product.

Only active products.

Only active variants.

Only in-stock products (preferred).

Future enhancements

- Customers Also Bought
- Frequently Bought Together
- Recently Viewed
- Trending Products
- AI Recommendations
- Customer Personalisation
- Cross-selling
- Up-selling

The Product Detail page must not change when these future capabilities are added.

---

# Product Controller

Responsibilities

Receive

```
GET /product/:slug
```

↓

Call ProductFacade.

↓

Render

```
product.ejs
```

No business logic.

No Prisma.

---

# ProductFacade

Responsibilities

Retrieve Product

↓

Resolve Images

↓

Resolve Pricing

↓

Resolve Inventory

↓

Resolve Metadata

↓

Resolve Breadcrumbs

↓

Call RecommendationService

↓

Build ProductDetailViewModel

↓

Return

---

# Product Detail Page

Display

- Product Name
- Brand
- Sport
- Category
- SKU
- Selling Price
- Availability
- Product Gallery
- Primary Image
- Product Description
- Specifications
- Product Attributes
- Related Products
- Breadcrumbs

---

# Product Gallery

Use

MediaService

Display

- Primary Image
- Additional Images
- Placeholder Image

Future

- Zoom
- Video
- 360° Images

---

# Specifications

Display

Dynamic Attributes.

Examples

- Grip Size
- Weight
- Balance
- String Pattern
- Head Size
- Length
- Material

No hardcoded attributes.

---

# Pricing

Display

Selling Price only.

Future

- Sale Price
- Member Price
- Dealer Price

No calculations.

---

# Inventory

Display

```
In Stock
```

or

```
Out of Stock
```

Future

- Low Stock
- Backorder
- Incoming Stock

---

# Related Products

Display

Maximum

```
4
```

Products supplied exclusively by

RecommendationService.

The Product Detail page must never calculate recommendations.

---

# Breadcrumbs

Generate

```
Home

>

Shop

>

Sport

>

Category

>

Product
```

Reuse the existing breadcrumb partial.

---

# SEO Metadata

Generate

Title

```
<Brand> <Product Name> | Pro Court Sports
```

Description

Use Product Description.

Canonical

```
/product/:slug
```

Open Graph

Include

Primary Product Image.

Generated through

PageMetadataService.

---

# Business Rules

Only active products.

Only active variants.

Selling Price only.

Availability displayed.

Media resolved through MediaService.

Metadata resolved through PageMetadataService.

Recommendations resolved through RecommendationService.

No Prisma inside Storefront.

No business calculations.

No recommendation logic inside Storefront.

---

# Acceptance Criteria

ProductFacade implemented.

RecommendationService implemented.

ProductDetailViewModel implemented.

Gallery implemented.

Specifications implemented.

Breadcrumbs implemented.

Related Products implemented.

SEO metadata generated.

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
wf-010d-product.integration.ts
```

Verify

- Product rendering
- Gallery
- Specifications
- Metadata
- RecommendationService
- Related products
- Breadcrumbs
- Availability

---

## Business Tests

### Test 1

Open valid product.

Expected

Product page renders.

---

### Test 2

Missing image.

Expected

Placeholder displayed.

---

### Test 3

Deactivate product.

Expected

404.

---

### Test 4

Update selling price.

Expected

Page reflects new price.

---

### Test 5

RecommendationService

Expected

Maximum 4 products.

Current product excluded.

Priority

Category

↓

Brand

↓

Sport

---

### Test 6

Inspect page source.

Verify

- Title
- Meta Description
- Canonical
- Open Graph

---

### Test 7

Responsive layout.

Desktop

Tablet

Mobile

---

# Completion Checklist

☐ ProductFacade implemented

☐ RecommendationService implemented

☐ ProductDetailViewModel implemented

☐ Gallery implemented

☐ Specifications implemented

☐ Related Products implemented

☐ Breadcrumbs implemented

☐ Metadata implemented

☐ Integration tests passing

☐ Project compiles

☐ Commit completed

---

# Commit Message

```
feat(storefront): implement product detail experience
```

---

# Notes

WF-010D establishes the premium Product Detail experience for PCS Core.

The Storefront remains exclusively a presentation layer.

Business logic remains within the existing Catalog, Pricing, Inventory and Search services.

MediaService resolves all visual assets.

PageMetadataService generates reusable SEO metadata.

RecommendationService owns all product recommendation logic and future recommendation strategies.

StorefrontPresentationService prepares presentation-ready View Models.

ProductFacade orchestrates all business services into a single ProductDetailViewModel.

This architecture enables future enhancements—including AI recommendations, customer personalisation, cross-selling, up-selling and behavioural merchandising—without requiring changes to the Product Detail page.

No further architectural changes to the Product Detail experience should be required after this workflow.

---

# End Workflow
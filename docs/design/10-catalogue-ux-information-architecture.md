# PCS Core

# Catalogue UX & Information Architecture

Version: 1.0

Status: Draft

Owner: Storefront Domain

Related Milestone:
MVP-003B – Catalogue Experience

---

# Purpose

This document defines the user experience, navigation structure and information architecture of the Pro Court Sports catalogue.

Its purpose is to ensure every browsing journey is:

- Fast
- Intuitive
- Consistent
- Premium
- Scalable

The catalogue should support both experienced players who know exactly what they want and customers who are still exploring.

---

# Design Philosophy

The catalogue should never feel like a database.

It should feel like a specialist retail showroom.

Customers should always know:

- where they are
- what they are looking at
- how to narrow their search
- how to move back

Navigation should require minimal effort.

---

# Primary Navigation

```
Home

↓

Shop

↓

Sport

↓

Category

↓

Products

↓

Product Detail
```

---

# Catalogue Hierarchy

```
Shop

├── Tennis
│
│   ├── Racquets
│   ├── Shoes
│   ├── Apparel
│   ├── Bags
│   ├── Strings
│   ├── Balls
│   └── Accessories
│
├── Padel
│
│   ├── Racquets
│   ├── Shoes
│   ├── Apparel
│   ├── Bags
│   ├── Balls
│   └── Accessories
│
└── Squash
    │
    ├── Racquets
    ├── Shoes
    ├── Apparel
    ├── Bags
    ├── Strings
    ├── Balls
    └── Accessories
```

This hierarchy should remain stable.

Future sports can be inserted without redesign.

---

# Catalogue Entry Points

Users should be able to enter the catalogue through multiple paths.

## Homepage

Shop by Sport

Featured Categories

Featured Products

Brands

---

## Navigation

Shop

Sports

Brands

Search

---

## Search

Direct product search.

---

## Brand Landing Pages

Wilson

HEAD

Babolat

Tecnifibre

Dunlop

Yonex

ASICS

---

# Navigation Flow

The browsing journey should always follow:

```
Sport

↓

Category

↓

Filter

↓

Sort

↓

Browse

↓

Product
```

Never expose filters before users have meaningful context.

---

# Shop Landing Page

Purpose

Introduce the catalogue.

Display

Featured Sports

Featured Categories

Featured Brands

Popular Products

Latest Arrivals

---

# Sport Landing Page

Example

Tennis

Contains

Hero Banner

Category Grid

Featured Products

Popular Brands

Buying Guides (future)

---

# Category Landing Page

Example

Tennis Racquets

Contains

Category Hero

Filter Sidebar

Product Grid

Sorting

Pagination

---

# Brand Landing Page

Example

Wilson

Contains

Brand Hero

Brand Description

Brand Categories

Featured Products

Product Grid

---

# Product Grid

Desktop

Four columns

Tablet

Three columns

Mobile

Two columns

Cards remain identical throughout the storefront.

---

# Product Card

Display

Image

Brand

Product Name

Price

Stock Badge

Add to Cart

Reserved

Wishlist

Compare

Badges

New

Best Seller

Staff Pick

Future

---

# Breadcrumb Navigation

Every catalogue page should display breadcrumbs.

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

Breadcrumbs must always be clickable.

---

# Filtering Strategy

Filters should never overwhelm users.

Only show relevant filters.

---

## Sport

Tennis

Padel

Squash

---

## Category

Racquets

Shoes

Apparel

Bags

Strings

Balls

Accessories

---

## Brand

Dynamic.

Only brands available within current results.

---

## Price

Range slider.

Future

Preset ranges.

---

## Availability

In Stock

Out of Stock

Coming Soon (future)

---

## Performance Tier

Supports the business strategy.

Performance

Competition

Elite

No Beginner category.

---

# Sorting

Default

Featured

Additional

Newest

Price Low to High

Price High to Low

Brand

Popularity

Alphabetical

---

# Search Experience

Global search.

Autocomplete (future)

Suggestions

Products

Brands

Sports

Categories

Search should prioritise:

Exact matches

Brand

Product Name

Category

---

# Empty States

Never show an empty catalogue.

Display

Friendly message

Suggested products

Clear Filters button

Continue Shopping

---

# Pagination

Traditional pagination.

Display

Previous

Page Numbers

Next

Future

Infinite scrolling may be introduced later.

---

# URL Structure

Clean URLs.

Examples

```
/shop

/shop/tennis

/shop/tennis/racquets

/shop/padel

/shop/squash/shoes

/brands/wilson

/product/wilson-blade-98-v9
```

URLs should remain stable.

---

# Mobile Experience

Desktop

Persistent filter sidebar.

Tablet

Collapsible sidebar.

Mobile

Filter drawer.

Sticky sorting controls.

Large touch targets.

---

# Catalogue State

URL should preserve

Filters

Sorting

Pagination

Search

Users should be able to share filtered URLs.

---

# Performance

Catalogue pages should load quickly.

Optimise

Images

Pagination

Database queries

Caching

---

# Accessibility

Keyboard navigation.

Visible focus.

ARIA labels.

Screen-reader friendly filters.

Accessible pagination.

---

# Future Enhancements

Planned but excluded from MVP-003B.

- Compare Products
- Wishlist
- Recently Viewed
- AI Search
- Guided Shopping
- Saved Filters
- Product Recommendations
- Buying Guides
- Product Videos
- Product Availability by Supplier

---

# Catalogue Principles

The catalogue should always answer four customer questions immediately.

## 1

What sport am I shopping for?

---

## 2

What type of product do I need?

---

## 3

Which brands are available?

---

## 4

How do I narrow my choices?

If the interface answers these four questions clearly, customers will naturally progress toward a purchase.

---

# Technical Architecture

The catalogue is owned by:

```
CatalogueController

↓

CatalogueFacade

↓

Presentation Services

↓

Business Services

↓

Repositories
```

Catalogue responsibilities should remain independent of:

- Shopping
- Checkout
- Product Detail
- Supplier Integration

---

# Success Criteria

A first-time visitor should be able to:

- Find their sport in one click.
- Reach the correct category in two clicks.
- Apply filters without confusion.
- Compare products visually.
- Reach a product detail page effortlessly.
- Never feel lost within the catalogue.

If these goals are achieved, the catalogue experience supports the premium positioning of Pro Court Sports.

---

# Revision History

| Version | Description |
|----------|-------------|
| 1.0 | Initial Catalogue UX & Information Architecture |
# PCS Core Workflow Specification

Workflow:
WF-010A

Title:
Storefront Foundation

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 31

Module:
Storefront

Author:
ChatGPT

---

# Objective

Transform the existing Pro Court Sports onboarding site into the architectural foundation for the production ecommerce storefront.

This workflow is primarily a refactoring exercise.

The existing visual design, branding, typography, and user experience must be preserved while separating presentation into reusable layouts, partials, stylesheets and JavaScript modules.

No business functionality is introduced in this workflow.

No database changes.

No API changes.

No pricing changes.

No search changes.

Only presentation architecture.

---

# References

WF-009 Product Search

Current onboarding site

home.ejs

Maintain existing Pro Court Sports branding.

Do not redesign the UI.

---

# Existing Modules Used

Catalog

Search

Pricing

Inventory

Authentication

Commerce

(No implementation changes required.)

---

# Architectural Principles

The Storefront is a Presentation Layer.

Business logic must never exist inside EJS.

Controllers provide View Models.

Views render View Models.

Services perform business logic.

---

# New Folder Structure

Refactor the current views into the following structure.

```
src/

    views/

        layouts/

            main.ejs

        storefront/

            home.ejs

            catalog.ejs

            product.ejs

            search.ejs

            category.ejs

            login.ejs

            register.ejs

            account.ejs

            cart.ejs

            checkout.ejs

            orders.ejs

            wishlist.ejs

            contact.ejs

            about.ejs

            faq.ejs

            privacy.ejs

            terms.ejs

            error.ejs

            partials/

                navigation.ejs

                hero.ejs

                categories.ejs

                brands.ejs

                sports.ejs

                featured-products.ejs

                why-us.ejs

                supplier-cta.ejs

                newsletter.ejs

                contact.ejs

                footer.ejs

                breadcrumbs.ejs

                page-header.ejs

                empty-state.ejs
```

---

# Public Assets

Refactor public assets.

```
public/

    css/

        storefront/

            base.css

            typography.css

            layout.css

            navigation.css

            hero.css

            buttons.css

            cards.css

            forms.css

            products.css

            categories.css

            brands.css

            sports.css

            footer.css

            utilities.css

            responsive.css

            storefront.css

    js/

        storefront/

            navigation.js

            search.js

            filters.js

            product-grid.js

            storefront.js

    images/

        hero/

        products/

        sports/

        brands/

        ui/
```

---

# Layout

Create

```
layouts/main.ejs
```

Responsibilities

HTML shell

Head

Navigation include

Content placeholder

Footer include

JavaScript includes

All pages inherit from this layout.

---

# Partial Extraction

Split the existing home.ejs into reusable partials.

Extract

Navigation

Hero

Categories

Brands

Court Sports

Featured Products

Why Partner

Supplier CTA

Contact

Footer

Do not redesign any section.

Preserve the existing appearance.

---

# Skeleton Pages

Create placeholder pages.

Catalog

Product

Category

Search

Cart

Checkout

Login

Register

Account

Orders

Wishlist

About

Contact

FAQ

Privacy Policy

Terms & Conditions

Error

Each page should:

Use main.ejs

Display page heading

Display placeholder content

Be fully navigable.

---

# Navigation

Update navigation.

Menu items.

```
Home

Shop

Sports

Brands

About

Contact

Login

Cart
```

Desktop and mobile.

---

# Styling

Move all embedded CSS from home.ejs.

No CSS may remain inside EJS.

Organise styles by responsibility.

No duplicated CSS.

---

# JavaScript

Move all JavaScript to

```
public/js/storefront/
```

No inline JavaScript.

---

# Routing

Create storefront routes.

```
/

/shop

/search

/category/:slug

/product/:slug

/cart

/checkout

/login

/register

/account

/orders

/about

/contact

/privacy

/terms
```

Skeleton routes only.

No business functionality.

---

# Controllers

Create

StorefrontController

Responsibilities

Render pages.

No business logic.

No Prisma.

---

# Business Rules

No database queries.

No Prisma.

No Search Service.

No Pricing Service.

No Inventory Service.

Static rendering only.

Business integration begins in WF-010B.

---

# Acceptance Criteria

Current homepage preserved.

Visual appearance unchanged.

All CSS externalised.

All JavaScript externalised.

Layouts implemented.

Partials implemented.

Skeleton pages implemented.

Routing complete.

Project compiles.

No TypeScript errors.

---

# Verification

## Test 1

Homepage renders.

Appearance unchanged.

---

## Test 2

Inspect source.

No embedded CSS.

---

## Test 3

Inspect source.

No inline JavaScript.

---

## Test 4

Navigate every route.

Every page loads.

---

## Test 5

Responsive layout.

Desktop

Tablet

Mobile

---

## Test 6

Navigation links.

All operational.

---

## Test 7

Project build.

```
npm run build
```

Passes.

---

# Completion Checklist

☐ Layout implemented

☐ Partials extracted

☐ CSS separated

☐ JavaScript separated

☐ Skeleton pages created

☐ Routing completed

☐ Navigation updated

☐ Homepage preserved

☐ Responsive layout verified

☐ Build successful

☐ Commit completed

---

# Commit Message

```
feat(storefront): implement storefront foundation
```

---

# Future Work

WF-010B

Dynamic Home Page

WF-010C

Product Catalogue

WF-010D

Product Details

WF-010E

Customer Shopping Experience

No further structural refactoring should be required after WF-010A.

All future storefront work will build upon this foundation.

---

# End Workflow
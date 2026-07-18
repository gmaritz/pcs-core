# PCS Core Implementation Specification

Module:
Storefront

Milestone:
MVP-003A

Iteration:
01

Title:
Production Homepage Foundation

Version:
1.0

Status:
Ready for Implementation

---

# Objective

Replace the current onboarding homepage with the first production-ready homepage.

This iteration focuses on:

- Layout
- Information hierarchy
- Component architecture
- Dynamic data integration
- Responsive structure

This iteration intentionally does **not** focus on animations, advanced styling or visual polish.

Those will be implemented during Iteration 2.

---

# Philosophy

The homepage should immediately communicate three things.

1.

Pro Court Sports is a specialist.

2.

We sell premium equipment.

3.

Shopping is quick and intuitive.

The homepage should never feel like a generic ecommerce website.

---

# Existing Architecture

Continue using the existing architecture.

```
Controller

↓

Facade

↓

Presentation Services

↓

Business Services

↓

Repositories

↓

Prisma
```

No business logic inside EJS templates.

---

# Homepage Layout

```
Announcement Bar

↓

Header

↓

Hero

↓

Shop by Sport

↓

Featured Categories

↓

Featured Products

↓

Featured Brands

↓

Why Pro Court Sports

↓

Newsletter

↓

Footer
```

Each section becomes an independent reusable component.

---

# Component Structure

Create

```
src/

    views/

        components/

            announcement-bar.ejs

            header.ejs

            hero-banner.ejs

            sport-card.ejs

            category-card.ejs

            product-card.ejs

            featured-products.ejs

            featured-categories.ejs

            featured-brands.ejs

            trust-section.ejs

            newsletter.ejs

            footer.ejs
```

Each component must receive data through locals.

No direct database calls.

---

# Homepage View

Create a clean production homepage.

```
views/

    storefront/

        home.ejs
```

The page should simply compose reusable components.

Example

```
Announcement Bar

Header

Hero

Sports

Categories

Products

Brands

Trust

Newsletter

Footer
```

---

# Announcement Bar

Height

40px

Single line.

Dynamic message.

Initial message

```
South Africa's Court Sports Specialists
```

Future messages will become configurable.

---

# Header

Sticky.

Desktop first.

Include

Logo

Navigation

Search

Account

Cart

Navigation

```
Shop

Sports

Brands

New Arrivals

About

Contact
```

Search remains icon-only during Iteration 1.

---

# Hero Banner

Use full-width layout.

Large lifestyle image placeholder.

Content

Headline

```
Performance Equipment

for Tennis, Padel & Squash
```

Supporting text

```
Premium racquets, footwear, apparel and accessories from the world's leading court sports brands.
```

Buttons

Primary

```
Shop Now
```

Secondary

```
Browse Sports
```

Hero image should be configurable.

---

# Shop by Sport

Display exactly three cards.

```
Tennis

Padel

Squash
```

Each card contains

- Image
- Sport Name
- Short Description
- Shop Collection button

Cards link to sport pages.

---

# Featured Categories

Display categories dynamically.

Limit

6

Suggested order

```
Racquets

Shoes

Apparel

Bags

Strings

Accessories
```

Category cards use icons or placeholder imagery.

---

# Featured Products

Retrieve dynamically.

Limit

8

Display

Image

Brand

Product Name

Price

Stock

Add to Cart

No ratings yet.

No badges yet.

---

# Featured Brands

Display supplier logos.

Initial brands

Wilson

HEAD

Babolat

Tecnifibre

Dunlop

Yonex

ASICS

Horizontal layout.

Simple hover state.

---

# Why Pro Court Sports

Display four cards.

Card One

```
Premium Brands
```

Card Two

```
Court Sports Specialists
```

Card Three

```
Nationwide Delivery
```

Card Four

```
Secure Checkout
```

Simple icon above title.

---

# Newsletter

Heading

```
Stay Ahead of the Game
```

Subheading

```
Receive product launches, promotions and court sports news.
```

Single email input.

Subscribe button.

No backend integration yet.

---

# Footer

Four columns.

Column One

Shop

Column Two

Customer Service

Column Three

Company

Column Four

Legal

Bottom row

Copyright

Social Icons

---

# Homepage Data Contract

Extend the existing StorefrontFacade.

Return

```
Announcement

Hero

Sports

Featured Categories

Featured Products

Featured Brands

Trust Cards
```

No placeholder arrays inside views.

---

# StorefrontFacade

Add methods

```
getHomepage()

getFeaturedSports()

getFeaturedCategories()

getFeaturedProducts()

getFeaturedBrands()
```

Reuse existing services.

---

# Responsive Behaviour

Desktop

Three-column layouts.

Tablet

Two-column layouts.

Mobile

Single-column layouts.

Header collapses.

Cards stack vertically.

---

# CSS

Continue using existing CSS architecture.

Do not create page-specific inline styles.

Create reusable classes.

Spacing should follow consistent design tokens.

---

# JavaScript

Minimal.

Only

Mobile navigation

Future sections remain static.

---

# Images

Temporary placeholders acceptable.

Image aspect ratios should remain consistent.

All image URLs routed through MediaService.

---

# Performance

Lazy load

Featured Products

Brands

Newsletter

Use responsive image sizing.

---

# Accessibility

Semantic HTML.

Proper heading order.

Alt text.

Keyboard accessible navigation.

Visible focus states.

---

# Files Expected

```
views/storefront/home.ejs

views/components/announcement-bar.ejs

views/components/header.ejs

views/components/hero-banner.ejs

views/components/sport-card.ejs

views/components/category-card.ejs

views/components/product-card.ejs

views/components/featured-products.ejs

views/components/featured-categories.ejs

views/components/featured-brands.ejs

views/components/trust-section.ejs

views/components/newsletter.ejs

views/components/footer.ejs
```

Update

```
StorefrontController

StorefrontFacade

Presentation Services
```

where required.

---

# Validation

Verify

Homepage loads.

No template errors.

All sections render.

Featured products display.

Categories display.

Brands display.

Responsive layouts function.

No business logic inside EJS.

---

# Acceptance Criteria

- New production homepage created.
- Homepage composed entirely from reusable components.
- Dynamic featured products.
- Dynamic featured categories.
- Dynamic featured brands.
- Three featured sports.
- Responsive layout.
- Existing architecture preserved.
- Ready for visual refinement during Iteration 2.

---

# Commit Message

```
feat(storefront): implement homepage foundation
```

---

# End Specification
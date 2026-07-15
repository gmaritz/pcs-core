# PCS Core Shared Services

Version: 1.0

Status: MVP Feature Development Complete

Last Updated: July 2026

Author: ChatGPT

---

# Purpose

This document defines the Shared Services Architecture used throughout PCS Core.

Shared Services provide reusable capabilities that are consumed by multiple workflows and modules without duplicating implementation.

They are intentionally designed to be independent of any specific page or workflow.

---

# Philosophy

Instead of embedding reusable logic inside controllers or workflows, PCS Core promotes shared capabilities into dedicated services.

This provides:

- Reusability
- Consistency
- Testability
- Extensibility
- Separation of Concerns

---

# Architecture

```
                 Shared Services

                       │

      ┌────────────────┼────────────────┐

      │                │                │

 Presentation      Business         Infrastructure

      │                │                │

 Media           Recommendation    Notification

 Metadata         Pricing          Search

 Presentation     Inventory        Supplier
```

---

# Current Shared Services

## StorefrontPresentationService

### Responsibility

Build presentation-ready View Models.

Responsibilities include:

- Formatting display data
- Building composite View Models
- Preparing UI-friendly models
- Hiding domain complexity

### Consumers

- StorefrontFacade
- CatalogFacade
- ProductFacade
- ShoppingFacade

---

## MediaService

### Responsibility

Resolve all media used by the storefront.

Responsibilities include:

- Primary images
- Gallery images
- Placeholder images
- Image fallbacks

### Future

- CDN integration
- Image optimisation
- Responsive images
- WebP support
- Lazy loading

### Consumers

- Homepage
- Catalogue
- Product Detail
- Shopping
- Future Administration

---

## PageMetadataService

### Responsibility

Generate SEO metadata.

Produces:

- Page titles
- Meta descriptions
- Canonical URLs
- Open Graph metadata

### Consumers

Every public page.

---

## RecommendationService

### Responsibility

Generate product recommendations.

Current Strategy

```
Category

↓

Brand

↓

Sport
```

Current Rules

- Maximum four products
- Active products only
- Active variants only
- Current product excluded
- Prefer in-stock items

### Future

- AI recommendations
- Frequently bought together
- Customers also bought
- Recently viewed
- Trending products
- Personalisation
- Cross-selling
- Up-selling

---

## NotificationService

### Responsibility

Provide customer notification abstraction.

Current Notifications

- Product added
- Product removed
- Cart updated
- Login successful
- Registration successful
- Checkout successful
- Order placed

Current Delivery

Presentation View Models only.

### Future Channels

- Email
- SMS
- WhatsApp
- Push Notifications
- Supplier Notifications
- Administration Notifications

---

# Design Principles

All Shared Services must:

- Be reusable.
- Be independent.
- Be testable.
- Avoid Prisma access unless they are true business services.
- Avoid presentation logic unless explicitly presentation-oriented.
- Expose typed contracts.
- Hide implementation details.

---

# Dependency Rules

Presentation

↓

Facade

↓

Shared Services

↓

Business Services

↓

Persistence

Dependencies always point downward.

Shared Services never depend on Storefront Views.

---

# Service Lifecycle

New shared services should only be introduced when:

- Used by multiple workflows.
- Solving a cross-cutting concern.
- Preventing duplicated implementation.

Avoid creating services for single-use functionality.

---

# Future Shared Services

Potential candidates include:

## SearchIndexService

Centralised search indexing.

---

## CacheService

Application-level caching.

---

## AuditService

Business event auditing.

---

## EventBusService

Internal domain events.

---

## FileStorageService

Cloud storage abstraction.

---

## EmailService

Transactional email delivery.

---

## PaymentService

Payment gateway abstraction.

---

## ShippingService

Courier integration.

---

## AnalyticsService

Usage metrics and reporting.

---

# Current Shared Service Matrix

| Service | Homepage | Catalogue | Product | Shopping | Admin |
|----------|:--------:|:---------:|:-------:|:--------:|:-----:|
| StorefrontPresentationService | ✅ | ✅ | ✅ | ✅ | ⏳ |
| MediaService | ✅ | ✅ | ✅ | ✅ | ⏳ |
| PageMetadataService | ✅ | ✅ | ✅ | ✅ | ⏳ |
| RecommendationService | ❌ | ❌ | ✅ | ⏳ | ❌ |
| NotificationService | ❌ | ❌ | ❌ | ✅ | ⏳ |

---

# Architecture Goal

Shared Services reduce duplication and provide stable extension points.

As PCS Core grows, new functionality should extend existing Shared Services wherever possible before introducing new services.

This keeps the architecture cohesive and maintainable.

---

# Conclusion

The Shared Services Architecture is one of the key design patterns within PCS Core.

It enables a clean separation between presentation, orchestration and business logic while providing reusable capabilities across the platform.

Future development should preserve this architectural pattern.

---

# End Document
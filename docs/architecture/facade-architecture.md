# PCS Core Facade Architecture

Version: 1.0

Status: MVP Feature Development Complete

Last Updated: July 2026

Author: ChatGPT

---

# Purpose

This document defines the Facade Architecture used throughout the PCS Core Storefront.

Facades provide the orchestration layer between the Presentation Layer and the Business Platform.

Controllers remain lightweight and delegate all orchestration responsibilities to Facades.

The Facade Pattern is a core architectural principle of PCS Core.

---

# Philosophy

A Controller should never coordinate multiple business services.

Instead

```
Controller

↓

Facade

↓

Shared Services

↓

Business Services

↓

Persistence
```

Controllers render.

Facades orchestrate.

Services execute business logic.

Prisma persists data.

---

# Benefits

The Facade Architecture provides

- Separation of Concerns
- Lightweight Controllers
- Reusable orchestration
- Consistent page construction
- Easier testing
- Better maintainability
- Future extensibility

---

# Current Facades

```
StorefrontFacade

↓

Homepage

-----------------------------

CatalogFacade

↓

Product Catalogue

-----------------------------

ProductFacade

↓

Product Detail

-----------------------------

ShoppingFacade

↓

Shopping Experience
```

Each Facade owns a single customer-facing workflow.

---

# Controller Responsibilities

Controllers are responsible for

- Receiving requests
- Validating request parameters
- Calling the appropriate Facade
- Returning a View
- Returning HTTP responses

Controllers must not

- Access Prisma
- Build View Models
- Calculate business values
- Coordinate multiple services

---

# Facade Responsibilities

Facades coordinate multiple services into a single presentation model.

Responsibilities include

- Calling business services
- Calling shared services
- Building composite View Models
- Returning presentation-ready data

Facades never render HTML.

---

# Facade Lifecycle

```
HTTP Request

↓

Controller

↓

Facade

↓

Business Services

↓

Shared Services

↓

View Models

↓

Controller

↓

EJS View

↓

HTML Response
```

---

# StorefrontFacade

## Purpose

Build the homepage.

Coordinates

- Featured Products
- Sports
- Categories
- Brands
- Hero Statistics
- Homepage Metadata

Produces

HomeViewModel

Consumes

- StorefrontPresentationService
- MediaService
- PageMetadataService

---

# CatalogFacade

## Purpose

Build the product catalogue.

Coordinates

- Search
- Filters
- Pagination
- Sorting
- Pricing
- Inventory
- Media
- Metadata

Produces

CatalogViewModel

Consumes

- Product Search
- MediaService
- PageMetadataService
- StorefrontPresentationService

---

# ProductFacade

## Purpose

Build the Product Detail page.

Coordinates

- Product
- Gallery
- Pricing
- Inventory
- Recommendations
- Breadcrumbs
- Metadata

Produces

ProductDetailViewModel

Consumes

- RecommendationService
- MediaService
- PageMetadataService
- StorefrontPresentationService

---

# ShoppingFacade

## Purpose

Build customer shopping pages.

Coordinates

- Authentication
- Cart
- Checkout
- Orders
- Notifications
- Customer Account
- Metadata

Produces

ShoppingViewModels

Consumes

- NotificationService
- PageMetadataService
- StorefrontPresentationService

---

# View Model Ownership

Each Facade owns its View Models.

```
StorefrontFacade

↓

HomeViewModel

-----------------------

CatalogFacade

↓

CatalogViewModel

-----------------------

ProductFacade

↓

ProductDetailViewModel

-----------------------

ShoppingFacade

↓

ShoppingViewModels
```

No View Model should be shared across unrelated workflows unless it represents a reusable component.

---

# Dependency Rules

```
Presentation

↓

Controllers

↓

Facades

↓

Shared Services

↓

Business Services

↓

Persistence
```

Dependencies always point downward.

Facades never depend on Views.

Business Services never depend on Facades.

Persistence never depends on Presentation.

---

# Error Handling

Facades translate business failures into presentation-friendly outcomes.

Examples

- Product not found
- Out of stock
- Customer not authenticated
- Invalid cart

Controllers simply return the appropriate HTTP response.

---

# Future Facades

The following facades are expected as PCS Core grows.

## AdministrationFacade

Administration Dashboard.

---

## SupplierFacade

Supplier onboarding and management.

---

## ReportingFacade

Analytics and reporting.

---

## CustomerFacade

Customer profile management.

---

## CMSFacade

Content management.

---

## MarketingFacade

Campaigns and promotions.

---

# Facade Design Rules

Every Facade must

- Represent one customer workflow.
- Produce presentation-ready View Models.
- Never render HTML.
- Never access Prisma directly.
- Never duplicate business logic.
- Delegate specialised work to Shared Services.
- Be independently testable.

---

# Testing Strategy

Each Facade should have

- Compile validation
- Integration tests
- Workflow validation
- Mocked business service tests where appropriate

Facades should be validated independently from Controllers.

---

# Architecture Assessment

Current Facades

4

Controllers

Lightweight

Shared Services

Integrated

Business Logic Duplication

None

Presentation Isolation

Complete

---

# Future Evolution

As PCS Core expands, new customer experiences should introduce additional Facades rather than extending existing ones beyond their single responsibility.

The goal is to maintain small, focused orchestration layers that remain easy to understand, test and evolve.

---

# Conclusion

The Facade Architecture is one of the defining characteristics of PCS Core.

It separates presentation from business logic while allowing complex customer workflows to be assembled from reusable services.

Future development should preserve this pattern to maintain the platform's modularity, scalability and maintainability.

---

# End Document
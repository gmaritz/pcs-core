# PCS Core Architecture

## Document

Canonical Domain Model

## Version

3.0

## Status

Approved

## Last Updated

2026-07-02

## Purpose

Defines the canonical business domains, aggregate roots,
responsibilities and business principles for PCS Core.

------------------------------------------------------------------------

# Overview

PCS Core is an enterprise ecommerce platform for Pro Court Sports. The
architecture is organised into six bounded business domains.

1.  Commerce
2.  Catalog
3.  Supply Chain
4.  Customer
5.  Sales
6.  Content

Each domain has a single responsibility and communicates through
well-defined relationships.

------------------------------------------------------------------------

# Commerce Domain

## Purpose

Owns commercial configuration used throughout the platform.

## Aggregate Roots

-   Store
-   Currency
-   TaxRate
-   ShippingMethod
-   PaymentMethod

## Business Principles

-   Configuration is centrally managed.
-   Commercial settings are reusable across the platform.
-   No product or customer data is owned here.

------------------------------------------------------------------------

# Catalog Domain

## Purpose

Owns the canonical product catalogue.

## Aggregate Roots

-   Sport
-   Category
-   Brand
-   Product
-   ProductVariant
-   Specification
-   ProductSpecification
-   Media

## Business Principles

-   Product is the canonical product.
-   ProductVariant is the purchasable entity.
-   Specifications are reusable.
-   Media belongs to Products.

------------------------------------------------------------------------

# Supply Chain Domain

## Purpose

Owns supplier integrations, inventory and pricing history.

## Aggregate Roots

-   Supplier
-   SupplierFeed
-   ImportJob
-   SupplierProduct
-   Warehouse
-   Inventory
-   InventoryMovement
-   PriceHistory

## Business Principles

-   Supplier catalogues map to canonical ProductVariants.
-   Inventory is tracked per warehouse.
-   Inventory movements are fully auditable.
-   Historical pricing is preserved.

------------------------------------------------------------------------

# Customer Domain

## Purpose

Owns customer identities and shopping activity.

## Aggregate Roots

-   Customer
-   Address
-   ShoppingCart
-   CartItem
-   Wishlist

## Business Principles

-   One active shopping cart per customer.
-   Customers purchase ProductVariants.
-   Wishlists reference ProductVariants.

------------------------------------------------------------------------

# Sales Domain

## Purpose

Owns completed commercial transactions.

## Aggregate Roots

-   Order
-   OrderItem
-   Payment
-   Shipment
-   Refund

## Business Principles

-   Orders preserve historical snapshots.
-   Completed sales are immutable.
-   Payments, shipments and refunds are operational records linked to
    orders.

------------------------------------------------------------------------

# Content Domain

## Purpose

Owns all marketing and editorial content.

## Aggregate Roots

-   Page
-   Article
-   Banner
-   Navigation

## Business Principles

-   Pages provide static business information.
-   Articles provide dynamic editorial content.
-   Articles may reference Products but never own Product data.
-   SEO metadata is embedded within Page and Article.
-   Content remains independent of Commerce and Sales.

------------------------------------------------------------------------

# Cross-Domain Principles

-   Each aggregate has a single responsibility.
-   Relationships express business rules.
-   Business history is preserved through snapshot data where required.
-   ProductVariant is the central commercial entity.
-   Architecture changes require a genuine business justification.

------------------------------------------------------------------------

# Architecture Status

Architecture Version: **3.0**

Status: **Approved Implementation Baseline**

This document reflects the architecture after successful implementation
and validation of the Commerce, Catalog, Supply Chain, Customer and
Sales domains, and the approved evolution of the Content Domain.

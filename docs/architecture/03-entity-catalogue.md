# PCS Core Architecture

## Document

Entity Catalogue

## Version

3.0

## Status

Approved

## Last Updated

2026-07-02

## Purpose

Defines every canonical entity within PCS Core, grouped by business
domain.

------------------------------------------------------------------------

# Commerce Domain

  ID        Entity           Type             Description
  --------- ---------------- ---------------- --------------------------------
  ENT-001   Store            Aggregate Root   Commercial store configuration
  ENT-002   Currency         Entity           Supported currencies
  ENT-003   TaxRate          Entity           Tax configuration
  ENT-004   ShippingMethod   Entity           Shipping configuration
  ENT-005   PaymentMethod    Entity           Payment configuration

------------------------------------------------------------------------

# Catalog Domain

  ----------------------------------------------------------------------------
  ID        Entity                 Type          Description
  --------- ---------------------- ------------- -----------------------------
  ENT-100   Sport                  Aggregate     Court sport classification
                                   Root          

  ENT-101   Category               Aggregate     Product category
                                   Root          

  ENT-102   Brand                  Aggregate     Product manufacturer
                                   Root          

  ENT-103   Product                Aggregate     Canonical product
                                   Root          

  ENT-104   ProductVariant         Entity        Purchasable SKU

  ENT-105   Specification          Aggregate     Reusable specification
                                   Root          definition

  ENT-106   ProductSpecification   Entity        Product specification value

  ENT-107   Media                  Entity        Product media assets
  ----------------------------------------------------------------------------

Business Rules: - ProductVariant is the commercial purchasing unit. -
Specifications are reusable. - Media belongs to Products.

------------------------------------------------------------------------

# Supply Chain Domain

  ID        Entity              Type             Description
  --------- ------------------- ---------------- ------------------------
  ENT-200   Supplier            Aggregate Root   Supplier organisation
  ENT-201   SupplierFeed        Entity           Supplier data feed
  ENT-202   ImportJob           Entity           Feed execution history
  ENT-203   SupplierProduct     Entity           Supplier SKU mapping
  ENT-204   Warehouse           Aggregate Root   Physical warehouse
  ENT-205   Inventory           Entity           Warehouse stock
  ENT-206   InventoryMovement   Entity           Inventory ledger
  ENT-207   PriceHistory        Entity           Historical pricing

Business Rules: - SupplierProducts map supplier catalogues to
ProductVariants. - Inventory is unique per Warehouse and ProductVariant.

------------------------------------------------------------------------

# Customer Domain

  ID        Entity         Type             Description
  --------- -------------- ---------------- -----------------------
  ENT-300   Customer       Aggregate Root   Customer account
  ENT-301   Address        Entity           Customer address
  ENT-302   ShoppingCart   Aggregate Root   Active shopping cart
  ENT-303   CartItem       Entity           Shopping cart line
  ENT-304   Wishlist       Entity           Saved ProductVariants

Business Rules: - One active shopping cart per customer. - Wishlists
reference ProductVariants.

------------------------------------------------------------------------

# Sales Domain

  ID        Entity      Type             Description
  --------- ----------- ---------------- --------------------------
  ENT-400   Order       Aggregate Root   Customer order
  ENT-401   OrderItem   Entity           Purchased ProductVariant
  ENT-402   Payment     Entity           Payment transaction
  ENT-403   Shipment    Entity           Shipment record
  ENT-404   Refund      Entity           Refund transaction

Business Rules: - Orders preserve historical snapshots. - OrderItems
store immutable commercial data.

------------------------------------------------------------------------

# Content Domain

  ID        Entity       Type             Description
  --------- ------------ ---------------- ---------------------
  ENT-600   Page         Aggregate Root   Static website page
  ENT-601   Article      Aggregate Root   Editorial content
  ENT-602   Banner       Aggregate Root   Promotional banner
  ENT-603   Navigation   Aggregate Root   Site navigation

Business Rules: - Pages contain static business information. - Articles
drive SEO and content marketing. - Articles may reference Products but
never own Product data. - SEO metadata is embedded within Page and
Article.

------------------------------------------------------------------------

# Catalogue Status

Version: **3.0**

Status: **Approved**

This catalogue reflects the implemented and validated architecture
baseline for PCS Core.

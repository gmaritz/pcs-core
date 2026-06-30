# PCS Core Database Standards

# Prisma Standards

---

**Document Version:** 1.0.0

**Document Status:** Approved

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Last Updated:** 2026-06-29

---

# 1. Purpose

This document defines the standards used when implementing the PCS Core persistence layer using Prisma ORM.

Every Prisma model within the project must follow these standards to ensure consistency, maintainability and scalability.

---

# 2. Guiding Principle

The Domain Model defines the business.

Prisma implements the Domain Model.

Prisma models must never introduce business concepts that do not exist within the Domain Model.

---

# 3. Naming Standards

## Model Names

Models use PascalCase.

Examples:

- Product
- ProductVariant
- Supplier
- SupplierProduct
- Inventory

---

## Database Tables

Database tables use snake_case plural names.

Examples:

- products
- product_variants
- suppliers
- supplier_products
- inventory

Every Prisma model will use:

```prisma
@@map("table_name")
```

---

## Fields

Fields use camelCase.

Examples:

```text
createdAt

updatedAt

supplierId

productVariantId
```

---

## Foreign Keys

Foreign keys always end with **Id**.

Examples:

```text
supplierId

warehouseId

productId

productVariantId
```

---

# 4. Primary Keys

All entities use UUIDs.

Example:

```prisma
id String @id @default(uuid())
```

No business meaning may be encoded within a primary key.

---

# 5. Auditing

Every mutable entity contains:

```text
createdAt

updatedAt
```

Historical entities additionally contain:

```text
createdBy
```

where appropriate.

---

# 6. Soft Deletes

Soft deletes are only used for master data.

Examples:

- Supplier
- Brand
- Category
- Warehouse

Transactional history is never soft deleted.

Examples:

- Inventory Movement
- Price History
- Import Job

---

# 7. Relationships

Relationships must always be explicit.

Every foreign key has:

- scalar field
- relation field

Example:

```prisma
supplierId String

supplier Supplier @relation(...)
```

---

# 8. Cascading Rules

Default behaviour:

- Restrict deletes
- Cascade updates

Historical records must never be automatically deleted.

---

# 9. Indexing Standards

Indexes are created for:

- Foreign keys
- Frequently searched fields
- Business identifiers
- Composite business keys

Examples:

```prisma
@@index([supplierId])

@@index([brandId])

@@unique([supplierId, supplierSku])
```

---

# 10. Enums

Enums are used for stable business values.

Examples:

- SupplierStatus
- InventoryStatus
- ImportJobStatus

Lookup tables are preferred where values are expected to change frequently.

---

# 11. Decimal Values

Financial values use:

```prisma
Decimal
```

Never Float.

Examples:

- Cost Price
- Selling Price
- Tax Rate

---

# 12. Date & Time

All timestamps use UTC.

Prisma type:

```prisma
DateTime
```

Application code handles timezone conversion.

---

# 13. Transactions

Multi-entity business operations must use Prisma transactions.

Examples:

- Checkout
- Supplier synchronisation
- Inventory allocation

---

# 14. Migration Standards

Every schema change requires:

- Updated Domain Model (if applicable)
- Prisma schema update
- Prisma migration
- Git commit

Production databases are never modified manually.

---

# 15. Documentation First

Every Prisma model must originate from:

Entity Catalogue

↓

Business Rules

↓

Prisma Model

↓

Migration

↓

Repository

↓

Service

↓

API

No Prisma model should be created without an approved Domain Model.

---

# 16. Summary

These standards ensure that every Prisma model follows a consistent architectural approach and remains aligned with the Domain Model throughout the lifecycle of PCS Core.

---

**End of Document**
# PCS Core Service Layer
## Version 1.0

---

# Purpose

The Service Layer is the business engine of PCS Core.

Its responsibility is to implement business behaviour while delegating all persistence concerns to Prisma.

The Service Layer provides a clean separation between:

- HTTP
- Business Logic
- Database Access

This allows the application to evolve independently from the presentation layer while maintaining a single location for business rules.

---

# Layered Architecture

```
Browser / Mobile App
        │
        ▼
Controllers
        │
        ▼
Business Services
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL
```

Every request follows this flow.

Controllers never access Prisma directly.

Business logic always resides inside Services.

---

# Core Principles

## Principle 1

Services implement business behaviour.

They represent business capabilities rather than database operations.

Examples:

- Create Product
- Place Order
- Publish Article
- Synchronize Inventory

Services should express the language of the business.

---

## Principle 2

Prisma owns data persistence.

PCS Core does not duplicate Prisma's capabilities.

Prisma already provides:

- Type Safety
- Pagination
- Filtering
- Sorting
- Includes
- Select
- Transactions
- Aggregations
- Relations

The Service Layer leverages these capabilities rather than wrapping them.

---

## Principle 3

Controllers never communicate directly with Prisma.

Correct:

```
Controller
    ↓
ProductService
    ↓
Prisma
```

Incorrect:

```
Controller
    ↓
Prisma
```

---

## Principle 4

Services expose business operations.

Preferred:

```
createProduct()

publishProduct()

placeOrder()

archiveProduct()
```

Avoid generic method names such as:

```
create()

update()

delete()
```

Method names should clearly describe the business action.

---

## Principle 5

Prefer Prisma types.

Use Prisma's generated types whenever practical.

Examples:

```
Prisma.ProductFindManyArgs

Prisma.ProductCreateInput

Prisma.ProductUpdateInput
```

Avoid creating duplicate query abstractions.

---

## Principle 6

Only build abstractions that provide business value.

PCS Core does not wrap Prisma unless additional business behaviour is introduced.

Good abstraction:

```
publishProduct()

placeOrder()

synchronizeSupplierInventory()
```

Poor abstraction:

```
getProductsWrapper()

customPaginationObject()

customFilterObject()
```

---

# Standard Service Structure

Every service follows the same structure.

```
Imports

↓

Service Declaration

↓

Queries

↓

Commands

↓

Service Instance
```

Example:

```typescript
export class ProductService extends BaseService {

    // Queries

    getProduct()

    getProducts()

    // Commands

    createProduct()

    updateProduct()

    deleteProduct()

}

export const productService = new ProductService();
```

---

# Query Methods

Query methods retrieve information.

Examples:

```
getBrand()

getBrands()

getProduct()

getProducts()
```

Collection queries accept Prisma FindMany arguments.

Example:

```typescript
async getProducts(
    options?: Prisma.ProductFindManyArgs
): Promise<Product[]> {

    return this.db.product.findMany(options);

}
```

This automatically supports:

- Pagination
- Filtering
- Ordering
- Includes
- Field Selection

without additional framework code.

---

# Command Methods

Command methods modify business state.

Examples:

```
createProduct()

updateProduct()

deleteProduct()

placeOrder()

publishArticle()
```

Commands are responsible for enforcing business rules before interacting with Prisma.

---

# BaseService

All services inherit from BaseService.

Current responsibility:

- Shared Prisma Client

Future enhancements will only be added if they provide genuine business value.

BaseService should remain intentionally lightweight.

---

# Module Organization

Business services are organised by business capability.

Example:

```
modules/

catalog/

customers/

orders/

content/

suppliers/
```

Each module owns its own:

- Controllers
- Services
- Validation
- Types
- Routes
- Tests

This keeps business capabilities cohesive.

---

# Design Philosophy

The Service Layer is not a CRUD framework.

It is a Business Framework.

Prisma handles persistence.

PCS Core handles business behaviour.

---

# Future Evolution

As the platform matures, Services will gradually evolve from simple CRUD operations into rich business orchestration.

Examples include:

- Publish Product
- Archive Product
- Add Product Variant
- Assign Category
- Synchronize Supplier Inventory
- Calculate Order Totals
- Complete Checkout
- Publish Article

These methods represent business capabilities rather than database mechanics.

---

# Governance

The Service Layer should remain consistent across all domains.

Changes to the service pattern should only occur when:

- a genuine business requirement exists; or
- implementation demonstrates a significantly better architectural approach.

Speculative abstractions should be avoided.

---

# Status

Version:

```
Service Standard v1.0
```

Status:

```
ACTIVE
```

Approved:

```
Phase 2 – Service Layer Foundation
```

---

_End of Document_
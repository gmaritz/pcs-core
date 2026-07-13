# PCS Core Workflow Specification

Workflow:
WF-007

Title:
Inventory Synchronisation

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 28

Module:
Inventory Synchronisation

Author:
ChatGPT

---

# Objective

Implement the Inventory Synchronisation workflow.

The workflow updates PCS Core inventory levels using normalized supplier inventory data produced by the Supplier Adapter Framework.

The workflow must update inventory efficiently, maintain a complete audit trail and avoid unnecessary database writes.

---

# References

STD-001 Import Contracts

WF-005 Supplier Import Framework

WF-006 Supplier Adapter Framework

Maintain the existing PCS Core architecture.

Do not redesign the import framework.

---

# Existing Modules Used

Supplier

Supplier Product

Inventory

Inventory Movement

Warehouse

Authentication

Authorization

Shared Import Contracts

---

# Workflow Overview

```
Supplier Feed

↓

Supplier Adapter

↓

NormalizedSupplierProduct

↓

Inventory Synchronisation

↓

Inventory

↓

Inventory Movement

↓

Synchronisation Summary
```

---

# Architecture

Create

```
src/modules/workflows/

    inventory-sync/

        controllers/

        middleware/

        routes/

        services/

        validation/

        types/

        index.ts

        README.md
```

---

# Endpoint

POST

```
/api/v1/inventory/sync
```

Protected

```
authenticate()

authorize(Permissions.INVENTORY_WRITE)
```

---

# Request

```json
{
    "supplierId":"<supplier-id>",

    "products":[
        {
            "supplierSku":"WR125001",

            "quantity":18
        },
        {
            "supplierSku":"WR125002",

            "quantity":7
        }
    ]
}
```

For MVP the products array may come directly from the request body.

In later workflows it will come from WF-006 adapters.

---

# Processing Steps

## Step 1

Validate Supplier.

Reject

404

if supplier not found.

---

## Step 2

For every supplier SKU

Locate

Supplier Product

↓

Inventory

Reject

404

if SKU not found.

---

## Step 3

Compare

Current Quantity

↓

Incoming Quantity

If unchanged

Skip.

No database update.

---

## Step 4

If quantity changed

Update

Inventory

Create

Inventory Movement

Movement Type

```
SYNC
```

Record

Old Quantity

↓

New Quantity

↓

Difference

↓

Supplier

↓

Timestamp

---

## Step 5

Repeat

for every product.

---

## Step 6

Return Summary.

---

# Summary

```json
{
    "processed":2,

    "updated":1,

    "unchanged":1,

    "missing":0,

    "errors":[]
}
```

---

# Controller

Implement

InventorySyncController

Method

```
synchronise()
```

Responsibilities

Validate request

↓

Call Service

↓

Return ApiResponse

No business logic.

---

# Service

Implement

InventorySyncService

Method

```
synchronise()
```

Responsibilities

Validate supplier

↓

Load inventory

↓

Compare quantities

↓

Update inventory

↓

Create Inventory Movement

↓

Generate Summary

Entire workflow executes inside

```
db.$transaction()
```

---

# Business Rules

Inventory quantities cannot become negative.

Only changed quantities are updated.

Every quantity change creates an Inventory Movement.

Unchanged records generate no database updates.

Entire synchronisation executes as one transaction.

---

# Responses

Success

```
200
```

Returns Synchronisation Summary.

---

# Error Responses

Supplier not found

404

SKU not found

404

Validation

400

Unauthorized

401

Forbidden

403

---

# Acceptance Criteria

Application compiles.

Synchronisation endpoint operational.

Inventory updated.

Inventory Movements created.

Unchanged records skipped.

Summary returned.

Rollback verified.

No TypeScript errors.

---

# Verification

## Test 1

Synchronise

Changed quantity.

Expected

```
200
```

Inventory updated.

Movement created.

---

## Test 2

Synchronise

Same quantity.

Expected

Inventory unchanged.

No movement.

---

## Test 3

Unknown Supplier.

Expected

```
404
```

---

## Test 4

Unknown SKU.

Expected

```
404
```

---

## Test 5

Multiple products.

Expected

All updates committed.

---

## Test 6

Force exception after first update.

Expected

Entire transaction rolled back.

---

# Completion Checklist

☐ Workflow folder created

☐ Controller implemented

☐ Service implemented

☐ Validation implemented

☐ Route implemented

☐ Transaction implemented

☐ Inventory updated

☐ Inventory Movements created

☐ Summary returned

☐ Rollback verified

☐ Project compiles

☐ No TypeScript errors

☐ Commit completed

---

# Commit Message

```
feat(workflows): implement inventory synchronisation
```

---

# Notes

This workflow synchronises inventory only.

It does not update pricing.

It does not create products.

It does not modify supplier product mappings.

It consumes normalized supplier data and keeps PCS Core inventory aligned with supplier stock levels while maintaining a complete inventory audit trail.

Future workflows will extend this capability to scheduled synchronisation and automatic supplier polling.

---

# End Workflow
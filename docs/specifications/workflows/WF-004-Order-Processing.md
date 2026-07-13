# PCS Core Workflow Specification

Workflow:
WF-004

Title:
Order Processing

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 25

Module:
Order Processing

Author:
ChatGPT

---

# Objective

Implement the Order Processing workflow.

This workflow begins the fulfilment lifecycle after a successful checkout.

Its primary responsibility is to reserve inventory, record inventory movements, update order status and prepare the order for shipment.

This workflow executes entirely inside a Prisma transaction.

---

# Existing Modules Used

Authentication

Authorization

Order

Order Item

Inventory

Inventory Movement

Warehouse

Product Variant

Supplier Product

Payment

No new CRUD modules are introduced.

---

# Workflow Overview

```
Order

↓

Validate Order

↓

Load Order Items

↓

Reserve Inventory

↓

Create Inventory Movements

↓

Update Inventory

↓

Update Order Status

↓

Return Processed Order
```

---

# Folder Structure

Create

```
src/modules/workflows/

    order-processing/

        controllers/

        services/

        routes/

        validation/

        types/
```

---

# Files

Create

```
OrderProcessingController.ts

OrderProcessingService.ts

order-processing.routes.ts

order-processing.validation.ts

order-processing.dto.ts

index.ts
```

Register routes.

---

# Endpoint

POST

```
/api/v1/order-processing
```

Protected

```
authenticate()

authorize(Permissions.ORDERS_WRITE)
```

---

# Request Body

```json
{
    "orderId":"<order-id>"
}
```

---

# Processing Steps

## Step 1

Load Order

Include

Order Items

Product Variant

Inventory

Warehouse

Reject

404

if Order not found.

---

## Step 2

Validate

Order Status

Must equal

```
PENDING
```

Otherwise

400

---

## Step 3

For every Order Item

Retrieve

Inventory

Reject

409

if

Available Quantity

is less than

Order Quantity

---

## Step 4

Reserve Inventory

Decrease

```
availableQuantity
```

Increase

```
reservedQuantity
```

Inventory must never become negative.

---

## Step 5

Create Inventory Movement

Movement Type

```
RESERVED
```

Record

Inventory

↓

Product Variant

↓

Warehouse

↓

Order

↓

Quantity

↓

Timestamp

---

## Step 6

Repeat

for every Order Item.

---

## Step 7

Update Order

Status

```
PROCESSING
```

---

## Step 8

Return

```
Order

Inventory Movements

Updated Inventory
```

---

# Prisma Transaction

Entire workflow

must execute using

```
db.$transaction()
```

If any step fails

rollback

everything.

---

# Controller

Implement

```
OrderProcessingController
```

Method

```
processOrder()
```

Responsibilities

Validate

↓

Call Service

↓

Return ApiResponse

No business logic.

---

# Validation

Implement

```
validateProcessOrder()
```

Rules

```
orderId

required
```

---

# Service

Implement

```
processOrder()
```

Responsibilities

Load Order

↓

Validate Status

↓

Reserve Inventory

↓

Create Inventory Movements

↓

Update Order

↓

Commit Transaction

---

# Business Rules

Inventory cannot become negative.

Orders cannot be processed twice.

Only

PENDING

orders may be processed.

Every inventory reservation creates one Inventory Movement.

Payments are NOT captured.

Shipment is NOT created.

Emails are NOT sent.

---

# Responses

Success

```
200
```

Returns

```json
{
    "order": {},
    "inventoryMovements": [],
    "inventory": []
}
```

---

# Error Responses

Order not found

404

Order already processed

400

Inventory unavailable

409

Validation

400

Unauthorized

401

Forbidden

403

---

# Acceptance Criteria

Application compiles.

Workflow endpoint operational.

Prisma transaction implemented.

Inventory reserved.

Inventory Movement created.

Order updated.

Rollback verified.

Project compiles.

No TypeScript errors.

---

# Verification

## Test 1

Valid

Pending Order

POST

```
/api/v1/order-processing
```

Expected

```
200
```

Inventory reserved.

Order

↓

PROCESSING

---

## Test 2

Order not found.

Expected

```
404
```

---

## Test 3

Order already

PROCESSING

Expected

```
400
```

---

## Test 4

Inventory shortage.

Expected

```
409
```

---

## Test 5

Force exception after first Inventory Movement.

Expected

Entire transaction rolled back.

Inventory restored.

Order remains

PENDING.

---

## Test 6

Verify

Inventory Movement

records created.

---

# Completion Checklist

☐ Controller implemented

☐ Service implemented

☐ Validation implemented

☐ Transaction implemented

☐ Inventory reservation working

☐ Inventory Movements created

☐ Order updated

☐ Rollback verified

☐ Project compiles

☐ No TypeScript errors

☐ Commit completed

---

# Commit Message

```
feat(workflows): implement order processing workflow
```

---

# Notes

This workflow intentionally reserves inventory rather than shipping products.

The fulfilment lifecycle becomes:

```
Checkout

↓

Order Processing

↓

Shipment Creation

↓

Dispatch

↓

Delivery

↓

Order Complete
```

Shipment creation, courier integration, invoice generation and customer notifications are implemented in later workflow specifications.

---

# End Workflow
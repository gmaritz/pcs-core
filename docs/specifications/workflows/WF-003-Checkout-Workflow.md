# PCS Core Workflow Specification

Workflow:
WF-003

Title:
Checkout Workflow

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 24

Module:
Checkout

Author:
ChatGPT

---

# Objective

Implement the complete Checkout Workflow.

Checkout converts an active Cart into an Order.

This is the first workflow that orchestrates multiple completed CRUD modules into a single business transaction.

---

# Workflow Overview

```
Customer

↓

Authenticate

↓

Retrieve Active Cart

↓

Validate Cart

↓

Validate Inventory

↓

Create Order

↓

Create Order Items

↓

Create Payment (Pending)

↓

Mark Cart

CHECKED_OUT

↓

Return Order
```

---

# Existing Modules Used

Customer

Address

Cart

Cart Item

Product Variant

Inventory

Order

Order Item

Payment

Authentication

Authorization

No new CRUD modules are introduced.

---

# Architecture

```
HTTP

↓

CheckoutController

↓

CheckoutService

↓

Prisma Transaction

↓

Database
```

The complete workflow must execute inside a single Prisma transaction.

If any step fails, rollback the transaction.

---

# Folder Structure

Create

```
src/modules/checkout/

    controllers/

    routes/

    services/

    validation/

    types/
```

---

# Files

Create

```
CheckoutController.ts

CheckoutService.ts

checkout.routes.ts

checkout.validation.ts

checkout.dto.ts

index.ts
```

Register routes.

---

# Endpoint

POST

```
/api/v1/checkout
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
    "cartId":"<cart-id>",

    "billingAddressId":"<billing-address-id>",

    "shippingAddressId":"<shipping-address-id>",

    "notes":"Deliver after 14:00"
}
```

---

# Checkout Steps

## Step 1

Load Cart

Include

Customer

Cart Items

Product Variant

Inventory

Reject

404

if cart not found.

---

## Step 2

Ensure

Cart Status

ACTIVE

Else

400

---

## Step 3

Ensure

Cart contains items.

Else

400

```
Cart is empty.
```

---

## Step 4

Inventory Validation

Every Cart Item

↓

Check Inventory

↓

Quantity Available

↓

If insufficient

Reject

409 Conflict

```
Insufficient inventory.
```

No inventory updates yet.

That occurs in WF-004.

---

## Step 5

Create Order

Status

PENDING

Generate Order Number

Reuse existing OrderService.

---

## Step 6

Create Order Items

For every Cart Item

↓

Create Order Item

Copy

Quantity

Unit Price

Total Price

If pricing has not yet been implemented

Use

0.00

temporarily.

---

## Step 7

Create Payment

Status

PENDING

Amount

0.00

until pricing workflow exists.

---

## Step 8

Update Cart

Status

CHECKED_OUT

---

## Step 9

Return

```
Order

Order Items

Payment
```

---

# Prisma Transaction

Entire workflow

```
db.$transaction()
```

If any operation fails

Rollback everything.

---

# Controller

Implement

CheckoutController

Method

checkout()

Responsibilities

Validate request

↓

Call CheckoutService

↓

Return ApiResponse

No business logic.

---

# Validation

Implement

validateCheckout()

Rules

cartId required

billingAddressId optional

shippingAddressId optional

---

# Service

Implement

checkout()

Responsibilities

Perform all checkout steps.

Must use

Prisma Transaction.

---

# Business Rules

Cart must exist.

Cart must be ACTIVE.

Cart must contain items.

Inventory must be sufficient.

Order created.

Order Items created.

Payment created.

Cart marked

CHECKED_OUT.

No inventory deduction.

No payment processing.

No emails.

---

# Responses

Success

201

Returns

```json
{
    "order":{},

    "items":[],

    "payment":{}
}
```

---

# Error Responses

Cart not found

404

Cart empty

400

Inventory insufficient

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

Checkout endpoint working.

Prisma transaction implemented.

Rollback verified.

Order created.

Order Items created.

Payment created.

Cart updated.

No TypeScript errors.

---

# Verification

## Test 1

Authenticated Administrator

POST

```
/checkout
```

Valid cart.

Expected

201

---

## Test 2

Cart not found.

Expected

404

---

## Test 3

Empty cart.

Expected

400

---

## Test 4

Checked-out cart.

Expected

400

---

## Test 5

Inventory insufficient.

Expected

409

---

## Test 6

Force an exception during Order Item creation.

Expected

Entire transaction rolled back.

No Order.

No Payment.

Cart remains ACTIVE.

---

# Postman Collection Snippet

Use this minimal collection snippet to verify WF-003 quickly.

Set collection variables before running:

`baseUrl`, `jwtToken`, `validCartId`, `emptyCartId`, `checkedOutCartId`, `insufficientInventoryCartId`

```json
{
    "info": {
        "name": "PCS Core WF-003 Checkout Verification",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        { "key": "baseUrl", "value": "http://localhost:3000/api/v1" },
        { "key": "jwtToken", "value": "" },
        { "key": "validCartId", "value": "" },
        { "key": "emptyCartId", "value": "" },
        { "key": "checkedOutCartId", "value": "" },
        { "key": "insufficientInventoryCartId", "value": "" }
    ],
    "item": [
        {
            "name": "WF-003 / Checkout - 201 Success",
            "request": {
                "method": "POST",
                "header": [
                    { "key": "Content-Type", "value": "application/json" },
                    { "key": "Authorization", "value": "Bearer {{jwtToken}}" }
                ],
                "url": "{{baseUrl}}/checkout",
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"cartId\": \"{{validCartId}}\",\n  \"notes\": \"WF-003 happy path\"\n}"
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "type": "text/javascript",
                        "exec": [
                            "pm.test('Status is 201', function () {",
                            "  pm.response.to.have.status(201);",
                            "});",
                            "const json = pm.response.json();",
                            "pm.test('Response has order, items, payment', function () {",
                            "  pm.expect(json).to.have.property('order');",
                            "  pm.expect(json).to.have.property('items');",
                            "  pm.expect(json).to.have.property('payment');",
                            "});"
                        ]
                    }
                }
            ]
        },
        {
            "name": "WF-003 / Checkout - 404 Cart Not Found",
            "request": {
                "method": "POST",
                "header": [
                    { "key": "Content-Type", "value": "application/json" },
                    { "key": "Authorization", "value": "Bearer {{jwtToken}}" }
                ],
                "url": "{{baseUrl}}/checkout",
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"cartId\": \"00000000-0000-0000-0000-000000000000\"\n}"
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "type": "text/javascript",
                        "exec": [
                            "pm.test('Status is 404', function () {",
                            "  pm.response.to.have.status(404);",
                            "});"
                        ]
                    }
                }
            ]
        },
        {
            "name": "WF-003 / Checkout - 400 Empty Cart",
            "request": {
                "method": "POST",
                "header": [
                    { "key": "Content-Type", "value": "application/json" },
                    { "key": "Authorization", "value": "Bearer {{jwtToken}}" }
                ],
                "url": "{{baseUrl}}/checkout",
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"cartId\": \"{{emptyCartId}}\"\n}"
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "type": "text/javascript",
                        "exec": [
                            "pm.test('Status is 400', function () {",
                            "  pm.response.to.have.status(400);",
                            "});"
                        ]
                    }
                }
            ]
        },
        {
            "name": "WF-003 / Checkout - 400 Checked Out Cart",
            "request": {
                "method": "POST",
                "header": [
                    { "key": "Content-Type", "value": "application/json" },
                    { "key": "Authorization", "value": "Bearer {{jwtToken}}" }
                ],
                "url": "{{baseUrl}}/checkout",
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"cartId\": \"{{checkedOutCartId}}\"\n}"
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "type": "text/javascript",
                        "exec": [
                            "pm.test('Status is 400', function () {",
                            "  pm.response.to.have.status(400);",
                            "});"
                        ]
                    }
                }
            ]
        },
        {
            "name": "WF-003 / Checkout - 409 Inventory Insufficient",
            "request": {
                "method": "POST",
                "header": [
                    { "key": "Content-Type", "value": "application/json" },
                    { "key": "Authorization", "value": "Bearer {{jwtToken}}" }
                ],
                "url": "{{baseUrl}}/checkout",
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"cartId\": \"{{insufficientInventoryCartId}}\"\n}"
                }
            },
            "event": [
                {
                    "listen": "test",
                    "script": {
                        "type": "text/javascript",
                        "exec": [
                            "pm.test('Status is 409', function () {",
                            "  pm.response.to.have.status(409);",
                            "});"
                        ]
                    }
                }
            ]
        }
    ]
}
```

---

## Completion Checklist

☐ Controller implemented

☐ Service implemented

☐ Transaction implemented

☐ Validation implemented

☐ Order creation working

☐ Order Items created

☐ Payment created

☐ Cart updated

☐ Rollback verified

☐ Project compiles

☐ No TypeScript errors

☐ Commit completed

---

# Commit Message

```
feat(checkout): implement checkout workflow
```

---

# Notes

This workflow intentionally orchestrates existing CRUD modules without duplicating their business logic.

Inventory deduction, payment gateway integration, email notifications and shipment creation are deferred to later workflow specifications.

This workflow marks the transition of PCS Core from a CRUD-based platform to a transactional ecommerce system.

---

# End Workflow
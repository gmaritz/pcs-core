# PCS Core Workflow Specification

Workflow:
WF-008

Title:
Pricing Engine Foundation

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 29

Module:
Pricing

Author:
ChatGPT

---

# Objective

Implement the Pricing Engine Foundation.

The Pricing module is responsible for calculating selling prices from supplier costs.

Supplier feeds update supplier costs only.

The Pricing Engine owns all selling price calculations.

This separation ensures supplier pricing changes never overwrite commercial pricing decisions.

---

# References

STD-001 Import Contracts

WF-005 Supplier Import Framework

WF-006 Supplier Adapter Framework

WF-007 Inventory Synchronisation

Maintain the existing PCS Core architecture.

---

# Existing Modules Used

Supplier

Supplier Product

Product

Product Variant

Pricing

Authentication

Authorization

---

# Architecture

```
Supplier Feed

        ↓

Supplier Adapter

        ↓

NormalizedSupplierProduct

        ↓

Supplier Cost

        ↓

Pricing Engine

        ↓

Selling Price

        ↓

Database
```

---

# Pricing Module

Use the existing module

```
src/modules/pricing/

    calculators/

    rules/

    services/

    types/

    index.ts
```

No workflow-specific pricing logic may exist outside this module.

---

# Pricing Concepts

Supplier Cost

↓

Markup

↓

Selling Price

↓

Sale Price (future)

↓

Effective Price

---

# Product Variant

Add pricing fields.

```text
supplierCost

markupPercentage

sellingPrice

manualPriceOverride
```

---

# Default Values

```
markupPercentage = 35

manualPriceOverride = false
```

---

# Endpoint

POST

```
/api/v1/pricing/sync
```

Protected

```
authenticate()

authorize(Permissions.PRODUCTS_WRITE)
```

---

# Request

```json
{
    "supplierId":"<supplier-id>",

    "products":[

        {

            "supplierSku":"WR125001",

            "supplierCost":3299.95

        },

        {

            "supplierSku":"WR125002",

            "supplierCost":2899.95

        }

    ]

}
```

---

# Workflow

## Step 1

Validate Supplier.

---

## Step 2

Locate Supplier Product.

---

## Step 3

Locate Product Variant.

---

## Step 4

Update

Supplier Cost.

---

## Step 5

Check

manualPriceOverride

If TRUE

Skip price calculation.

---

## Step 6

Calculate

Selling Price.

Formula

```
Selling Price

=

Supplier Cost

×

(1 + Markup%)
```

Example

```
3299.95

×

1.35

=

4454.93
```

Round

2 decimals.

---

## Step 7

Update

Product Variant.

---

## Step 8

Return Summary.

---

# Pricing Calculator

Create

```
PriceCalculator.ts
```

Location

```
pricing/calculators/
```

Responsibilities

```
calculateSellingPrice()

calculateMarkup()

roundPrice()
```

No database access.

Pure calculations only.

---

# Pricing Rules

Create

```
DefaultMarkupRule.ts
```

Location

```
pricing/rules/
```

Responsibilities

Return default markup.

Initially

```
35%
```

Future rules may override this by

Brand

Category

Supplier

Product

Customer

Promotion

---

# Pricing Service

Create

```
PricingService.ts
```

Location

```
pricing/services/
```

Responsibilities

Retrieve pricing rule.

↓

Calculate price.

↓

Return calculated values.

No persistence.

---

# Workflow Service

Workflow owns

Synchronization.

Pricing module owns

Calculations.

---

# Business Rules

Supplier feeds never update

Selling Price

directly.

Supplier feeds update

Supplier Cost

only.

Pricing Engine calculates

Selling Price.

Manual override always wins.

Prices rounded to two decimals.

Entire workflow executes inside

```
db.$transaction()
```

---

# Responses

Success

```json
{
    "processed":2,

    "updated":2,

    "manualOverrides":0,

    "errors":[]
}
```

---

# Error Responses

Supplier not found

404

Supplier Product not found

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

Pricing module implemented.

Price Calculator implemented.

Pricing Rules implemented.

Pricing Service implemented.

Workflow implemented.

Supplier costs updated.

Selling prices calculated.

Manual overrides respected.

Transaction implemented.

No TypeScript errors.

---

# Verification

## Test 1

Supplier cost changed.

Expected

Selling price recalculated.

---

## Test 2

Supplier cost unchanged.

Expected

No update.

---

## Test 3

manualPriceOverride = true

Expected

Supplier cost updated.

Selling price unchanged.

---

## Test 4

Unknown Supplier.

Expected

404.

---

## Test 5

Multiple products.

Expected

Single transaction.

---

## Test 6

Force exception.

Expected

Rollback.

---

# Completion Checklist

☐ Pricing module completed

☐ Calculator implemented

☐ Rules implemented

☐ Service implemented

☐ Workflow implemented

☐ Transaction implemented

☐ Manual override implemented

☐ Tests passed

☐ Project compiles

☐ Commit completed

---

# Commit Message

```
feat(pricing): implement pricing engine foundation
```

---

# Notes

This workflow establishes the commercial pricing architecture for PCS Core.

Supplier integrations own supplier costs.

The Pricing module owns selling prices.

Future enhancements such as promotional pricing, customer pricing, dealer pricing, category markups, brand-specific rules, and seasonal campaigns will extend the Pricing module without requiring changes to supplier integrations or synchronization workflows.

The Pricing module is the single source of truth for all commercial pricing decisions.

---

# End Workflow
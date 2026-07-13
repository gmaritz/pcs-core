# PCS Core Workflow Specification

Workflow:
WF-005

Title:
Supplier Import Framework

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 26

Module:
Supplier Import Framework

Author:
ChatGPT

---

# Objective

Implement the Supplier Import Framework.

The framework provides the core infrastructure required to import products into PCS Core from external suppliers.

The framework itself is supplier-agnostic.

Supplier-specific parsers and adapters will be implemented in WF-006.

The framework must support importing products from JSON during MVP and be extensible to CSV, XML, Excel, REST APIs and FTP/SFTP feeds.

---

# Existing Modules Used

Supplier

Supplier Product

Brand

Sport

Category

Product

Product Variant

Inventory

Warehouse

Media

Authentication

Authorization

---

# Workflow Overview

```
Import File

↓

Import Source

↓

Parser

↓

Normalizer

↓

Validator

↓

Import Pipeline

↓

Database

↓

Import Result
```

---

# Architecture

Create a new workflow module.

```
src/modules/workflows/

    supplier-import/

        controllers/

        middleware/

        routes/

        services/

        validation/

        types/

        parsers/

        normalizers/

        validators/

        importers/

        sample-data/

        index.ts

        README.md
```

---

# Purpose of Each Folder

## parsers/

Convert supplier data into objects.

Future examples

WilsonJsonParser

HeadXmlParser

BabolatCsvParser

---

## normalizers/

Convert supplier objects into the PCS Core import format.

---

## validators/

Validate imported products.

Examples

Missing SKU

Missing Name

Negative Price

Unknown Brand

Unknown Category

---

## importers/

Business logic responsible for creating or updating records.

---

## sample-data/

Contains MVP sample import files.

Example

sample-products.json

---

# Endpoint

POST

```
/api/v1/imports/products
```

Protected

```
authenticate()

authorize(Permissions.SUPPLIERS_WRITE)
```

---

# MVP Request

```json
{
    "supplierId":"<supplier-id>",

    "file":"sample-products.json"
}
```

No file upload required.

The framework loads the sample file from

```
sample-data/
```

---

# Sample JSON

```json
[
    {
        "supplierSku":"WR125001",
        "name":"Wilson Pro Staff RF97",

        "brand":"Wilson",

        "category":"Tennis Racquets",

        "sport":"Tennis",

        "price":4599.95,

        "quantity":12
    },

    {
        "supplierSku":"WR125002",

        "name":"Wilson Blade 98",

        "brand":"Wilson",

        "category":"Tennis Racquets",

        "sport":"Tennis",

        "price":3999.95,

        "quantity":7
    }
]
```

---

# Processing Steps

## Step 1

Load Supplier

Reject

404

if not found.

---

## Step 2

Load Sample JSON

---

## Step 3

Parse

↓

Normalize

↓

Validate

---

## Step 4

For every imported record

Determine

Existing Supplier Product?

↓

YES

Update

↓

NO

Create

---

## Step 5

If Product does not exist

Create Product.

---

## Step 6

If Variant does not exist

Create Variant.

---

## Step 7

If Inventory does not exist

Create Inventory.

---

## Step 8

Update

Supplier Product

Price

Inventory

---

## Step 9

Return Import Summary

---

# Import Summary

Example

```json
{
    "processed":2,

    "createdProducts":2,

    "updatedProducts":0,

    "createdVariants":2,

    "updatedVariants":0,

    "createdInventory":2,

    "updatedInventory":0,

    "errors":[]
}
```

---

# Business Rules

Supplier SKU must be unique per supplier.

Brand must exist.

Category must exist.

Sport must exist.

Duplicate Products must not be created.

Duplicate Variants must not be created.

Duplicate Inventory must not be created.

Entire import runs inside

```
db.$transaction()
```

---

# Validation

Reject

Missing SKU

Missing Name

Unknown Brand

Unknown Category

Unknown Sport

Negative Quantity

Negative Price

---

# Controller

Implement

ImportController

Method

```
importProducts()
```

---

# Service

Implement

SupplierImportService

Methods

```
loadSample()

parse()

normalize()

validate()

import()

createSummary()
```

Each method should have a single responsibility.

---

# Routes

POST

```
/imports/products
```

---

# Responses

Success

```
200
```

Returns Import Summary.

---

# Error Responses

Supplier not found

404

Invalid JSON

400

Validation

400

Unauthorized

401

Forbidden

403

---

# Acceptance Criteria

Application compiles.

Framework implemented.

Sample JSON imported.

Products created.

Variants created.

Inventory created.

Supplier Products created.

Summary returned.

Rollback verified.

No TypeScript errors.

---

# Verification

## Test 1

Import

sample-products.json

Expected

```
200
```

Products imported.

---

## Test 2

Run import again.

Expected

Products updated.

No duplicates created.

---

## Test 3

Unknown Supplier.

Expected

404

---

## Test 4

Invalid JSON.

Expected

400

---

## Test 5

Unknown Brand.

Expected

400

---

## Test 6

Negative Quantity.

Expected

400

---

## Test 7

Force exception.

Expected

Entire transaction rolled back.

---

# Completion Checklist

☐ Framework created

☐ Parser implemented

☐ Normalizer implemented

☐ Validator implemented

☐ Importer implemented

☐ Transaction implemented

☐ Sample JSON imported

☐ Duplicate detection working

☐ Import Summary returned

☐ Rollback verified

☐ Project compiles

☐ No TypeScript errors

☐ Commit completed

---

# Commit Message

```
feat(workflows): implement supplier import framework
```

---

# Notes

This workflow deliberately separates the import engine from supplier-specific file formats.

Future suppliers will integrate by implementing new parser classes without modifying the import framework.

This architecture follows the Open/Closed Principle and enables PCS Core to scale to many suppliers while keeping the core import engine stable.

---

# End Workflow
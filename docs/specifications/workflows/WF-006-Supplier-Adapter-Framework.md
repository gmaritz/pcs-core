# PCS Core Workflow Specification

Workflow:
WF-006

Title:
Supplier Adapter Framework

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 27

Module:
Supplier Adapter Framework

Author:
ChatGPT

---

# Objective

Implement the Supplier Adapter Framework.

The Supplier Adapter Framework converts supplier-specific product feeds into the shared import contracts introduced by STD-001.

The framework must support multiple supplier implementations without modifying the Supplier Import Framework.

This workflow implements the first adapter using JSON sample data.

Future workflows will introduce XML, CSV, REST API and FTP adapters.

---

# References

STD-001 Import Contracts

WF-005 Supplier Import Framework

Maintain the existing PCS Core architecture.

Do not redesign the Supplier Import Framework.

---

# Existing Modules Used

Supplier

Supplier Import Framework

Shared Import Contracts

Authentication

Authorization

---

# Architecture

```
Supplier Feed

        ↓

Supplier Adapter

        ↓

SupplierImportParser

        ↓

NormalizedSupplierProduct

        ↓

Import Pipeline

        ↓

Database
```

---

# Folder Structure

Create

```
src/modules/workflows/

    supplier-adapters/

        controllers/

        middleware/

        routes/

        services/

        validation/

        types/

        adapters/

            json/

        factories/

        index.ts

        README.md
```

---

# Adapter Structure

Create

```
adapters/

    json/

        JsonSupplierAdapter.ts
```

---

# Factory

Create

```
SupplierAdapterFactory.ts
```

Responsibilities

Receive

Supplier Feed Type

↓

Return

Correct Adapter

Example

```
JSON

↓

JsonSupplierAdapter
```

Future

```
XML

↓

XmlSupplierAdapter

CSV

↓

CsvSupplierAdapter

REST

↓

ApiSupplierAdapter
```

No workflow changes required.

---

# Adapter Interface

Every adapter must implement

```
SupplierImportParser
```

introduced in STD-001.

---

# JsonSupplierAdapter

Responsibilities

Read JSON

↓

Deserialize

↓

Return

NormalizedSupplierProduct[]

No validation.

No database access.

No business logic.

---

# Endpoint

POST

```
/api/v1/imports/products/json
```

Protected

```
authenticate()

authorize(Permissions.SUPPLIERS_WRITE)
```

---

# Request

```json
{
    "supplierId":"<supplier-id>",

    "file":"sample-products.json"
}
```

---

# Processing Steps

## Step 1

Load Supplier.

---

## Step 2

Factory returns

JsonSupplierAdapter.

---

## Step 3

Adapter

↓

Parse JSON

↓

Return

NormalizedSupplierProduct[]

---

## Step 4

Pass products to

Supplier Import Framework.

---

## Step 5

Framework imports products.

---

## Step 6

Return Import Summary.

---

# Controller

Implement

SupplierAdapterController

Method

```
importJson()
```

Responsibilities

Validate

↓

Factory

↓

Framework

↓

Return ApiResponse

---

# Service

Implement

SupplierAdapterService

Responsibilities

Create Adapter

↓

Execute Parser

↓

Execute Import Framework

↓

Return Summary

---

# Business Rules

Adapters never access Prisma.

Adapters never create Products.

Adapters never validate business rules.

Adapters only translate data.

Business rules remain inside the Supplier Import Framework.

---

# Future Adapters

Reserved

```
XmlSupplierAdapter

CsvSupplierAdapter

ExcelSupplierAdapter

ApiSupplierAdapter

FtpSupplierAdapter
```

These should require no changes to the framework.

---

# Acceptance Criteria

Application compiles.

Factory implemented.

JSON Adapter implemented.

Import Framework reused.

No duplicate import logic.

No TypeScript errors.

---

# Verification

## Test 1

Import sample JSON.

Expected

```
200
```

Import successful.

---

## Test 2

Run import again.

Expected

Updates existing products.

No duplicates.

---

## Test 3

Unknown Supplier.

Expected

```
404
```

---

## Test 4

Malformed JSON.

Expected

```
400
```

---

## Test 5

Verify

Factory returns

JsonSupplierAdapter.

---

## Test 6

Create temporary

DummyXmlAdapter

implementing

SupplierImportParser.

Compile.

No framework changes required.

Delete afterwards.

---

# Completion Checklist

☐ Adapter folder created

☐ Factory implemented

☐ JSON Adapter implemented

☐ Framework reused

☐ Factory verified

☐ No duplicate logic

☐ Project compiles

☐ No TypeScript errors

☐ Commit completed

---

# Commit Message

```
feat(workflows): implement supplier adapter framework
```

---

# Notes

The Supplier Adapter Framework follows the Adapter Pattern.

Each supplier implementation is isolated behind a common contract.

The Supplier Import Framework remains completely supplier-agnostic.

Future supplier integrations require only new adapters and no modifications to the import pipeline.

This architecture allows PCS Core to scale to an unlimited number of suppliers while keeping the core import engine stable.

---

# End Workflow
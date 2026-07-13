# PCS Core Engineering Standard

Standard:
STD-001

Title:
Import Contracts

Version:
1.0

Status:
Approved

Author:
ChatGPT

---

# Purpose

This standard defines the shared contracts that form the foundation of the PCS Core Supplier Import Framework.

The goal is to completely separate supplier-specific data formats from the internal PCS Core import process.

Every supplier integration must comply with these contracts.

No supplier implementation may bypass this standard.

---

# Scope

This standard applies to all future supplier integrations including, but not limited to:

- JSON
- CSV
- XML
- Excel
- REST API
- FTP
- SFTP
- Manual Upload

---

# Architecture

```
Supplier Source

        ↓

Supplier Parser

        ↓

Normalizer

        ↓

Validation

        ↓

Import Pipeline

        ↓

Database
```

Every supplier implementation must follow this architecture.

---

# Folder Structure

Create

```
src/shared/import/

    contracts/

    models/

    services/

    types/

    errors/

    index.ts
```

---

# contracts/

Create

```
SupplierImportParser.ts

SupplierNormalizer.ts

SupplierValidator.ts

SupplierImporter.ts
```

---

## SupplierImportParser

```typescript
export interface SupplierImportParser<TSource = unknown> {

    parse(
        source: TSource
    ): Promise<NormalizedSupplierProduct[]>;

}
```

Purpose

Reads supplier data.

Produces normalized products.

---

## SupplierNormalizer

```typescript
export interface SupplierNormalizer<TInput = unknown> {

    normalize(
        input: TInput
    ): Promise<NormalizedSupplierProduct>;

}
```

Purpose

Transforms supplier-specific objects into PCS Core objects.

---

## SupplierValidator

```typescript
export interface SupplierValidator {

    validate(
        product: NormalizedSupplierProduct
    ): Promise<ValidationResult>;

}
```

Purpose

Validates imported products.

---

## SupplierImporter

```typescript
export interface SupplierImporter {

    import(

        products: NormalizedSupplierProduct[]

    ): Promise<ImportSummary>;

}
```

Purpose

Persists products into PCS Core.

---

# models/

Create

```
NormalizedSupplierProduct.ts

ImportSummary.ts

ImportError.ts
```

---

## NormalizedSupplierProduct

```typescript
export interface NormalizedSupplierProduct {

    supplierSku: string;

    name: string;

    description?: string;

    brand: string;

    category: string;

    sport: string;

    variant?: string;

    barcode?: string;

    price: number;

    quantity: number;

    currency?: string;

    images?: string[];

}
```

This is the canonical import model used throughout PCS Core.

Every supplier parser must eventually produce this model.

---

## ImportSummary

```typescript
export interface ImportSummary {

    processed: number;

    createdProducts: number;

    updatedProducts: number;

    createdVariants: number;

    updatedVariants: number;

    createdInventory: number;

    updatedInventory: number;

    skipped: number;

    errors: ImportError[];

}
```

Returned after every import.

---

## ImportError

```typescript
export interface ImportError {

    row: number;

    supplierSku: string;

    message: string;

}
```

---

# services/

Create

```
ImportFramework.ts

ImportPipeline.ts
```

---

## ImportFramework

Responsibilities

Load source

↓

Create Parser

↓

Execute Pipeline

↓

Return Summary

Contains no supplier-specific logic.

---

## ImportPipeline

Responsibilities

Normalize

↓

Validate

↓

Import

↓

Generate Summary

The pipeline owns the import sequence.

---

# errors/

Create

```
ImportValidationError.ts

ImportException.ts
```

Purpose

Provide consistent import-related exceptions.

---

# types/

Create

```
ValidationResult.ts

ImportResult.ts
```

---

## ValidationResult

```typescript
export interface ValidationResult {

    valid: boolean;

    errors: string[];

}
```

---

## ImportResult

```typescript
export interface ImportResult {

    success: boolean;

    summary: ImportSummary;

}
```

---

# Dependency Rules

Supplier Parsers

↓

Normalizers

↓

Validators

↓

Import Pipeline

↓

Database

The dependency direction must never be reversed.

The Import Pipeline must never know which supplier produced the data.

---

# Extension Rules

New suppliers are added by creating a new parser.

Examples

```
WilsonJsonParser

HeadXmlParser

BabolatCsvParser

TecnifibreApiParser

DunlopExcelParser
```

No changes should be required to

ImportPipeline

or

ImportFramework.

---

# Design Principles

The Supplier Import Framework follows:

- Single Responsibility Principle
- Open/Closed Principle
- Interface Segregation Principle
- Dependency Inversion Principle

---

# Acceptance Criteria

The following files exist.

```
contracts/

models/

services/

types/

errors/
```

All interfaces compile.

No supplier-specific code exists in shared/import.

All future supplier adapters implement these contracts.

No TypeScript errors.

---

# Verification

Create a dummy parser.

Example

```typescript
class DummyParser implements SupplierImportParser {

    async parse() {

        return [];

    }

}
```

Project must compile.

---

# Completion Checklist

☐ Folder structure created

☐ Contracts implemented

☐ Models implemented

☐ Services implemented

☐ Types implemented

☐ Errors implemented

☐ Project compiles

☐ No TypeScript errors

☐ Commit completed

---

# Commit Message

```
refactor(import): introduce shared import contracts
```

---

# Notes

This standard establishes the canonical import architecture for PCS Core.

All supplier integrations must implement these contracts.

No supplier-specific implementation may bypass this standard.

This standard is considered foundational infrastructure and should remain stable as additional suppliers are added.

---

# End Standard
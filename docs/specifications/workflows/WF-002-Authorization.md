# PCS Core Workflow Specification

Workflow:
WF-002

Title:
Authorization

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 23

Module:
Authorization

Author:
ChatGPT

---

# Objective

Implement Role-Based Access Control (RBAC) for PCS Core.

This workflow builds on WF-001 Authentication and controls what authenticated users are allowed to access.

Authentication verifies **who** the user is.

Authorization determines **what** the user may do.

---

# Reference

WF-001 Authentication

Maintain the existing PCS Core architecture.

Do not redesign any completed modules.

Maintain existing coding standards.

---

# Authorization Strategy

Implement

Role-Based Access Control (RBAC)

using

Permissions

↓

Roles

↓

Users

---

# Prisma Requirements

## Create Role

```prisma
model Role {

  id String @id @default(uuid())

  name String @unique

  description String?

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  users User[]

  permissions RolePermission[]

  @@map("roles")

}
```

---

## Create Permission

```prisma
model Permission {

  id String @id @default(uuid())

  code String @unique

  name String

  description String?

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  roles RolePermission[]

  @@map("permissions")

}
```

---

## Create RolePermission

```prisma
model RolePermission {

  roleId String

  permissionId String

  role Role
    @relation(fields:[roleId], references:[id])

  permission Permission
    @relation(fields:[permissionId], references:[id])

  @@id([roleId, permissionId])

  @@map("role_permissions")

}
```

---

## Update User

Add

```prisma
roleId String?

role Role?
    @relation(fields:[roleId], references:[id])
```

---

Create migration.

Apply migration.

Generate Prisma Client.

---

# Seed Data

Automatically create

Administrator

Manager

Sales

Customer

Roles.

---

Automatically create Permissions.

Suggested MVP

```
users.read
users.write

products.read
products.write

orders.read
orders.write

customers.read
customers.write

inventory.read
inventory.write

suppliers.read
suppliers.write

payments.read
payments.write

settings.manage
```

---

Assign

Administrator

all permissions.

---

# Folder Structure

```
src/modules/auth/

    middleware/

    services/

    types/
```

---

# Files

Create

```
authorization.middleware.ts

AuthorizationService.ts

permissions.ts

roles.ts
```

---

# Middleware

Implement

authorize()

Usage

```typescript
authorize("products.write")
```

Responsibilities

Read authenticated user

↓

Load role

↓

Load permissions

↓

Verify permission

↓

Continue

Otherwise

403 Forbidden

---

# Authorization Service

Implement

hasPermission()

Parameters

```
userId

permission
```

Returns

```
boolean
```

---

# Constants

Create

permissions.ts

Example

```typescript
export const Permissions = {

PRODUCTS_READ:"products.read",

PRODUCTS_WRITE:"products.write",

ORDERS_READ:"orders.read",

ORDERS_WRITE:"orders.write",

...
};
```

---

Create

roles.ts

```typescript
Administrator

Manager

Sales

Customer
```

---

# Protect Routes

Protect

POST

PUT

DELETE

endpoints.

GET endpoints remain authenticated only.

Example

```typescript
router.post(

"/",

authenticate,

authorize(Permissions.PRODUCTS_WRITE),

controller.create
);
```

---

# Error Responses

Unauthenticated

```
401 Unauthorized
```

Unauthorized

```
403 Forbidden
```

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

Seed data created.

Administrator has all permissions.

Permission middleware working.

Protected endpoints reject unauthorized users.

Project compiles.

No TypeScript errors.

---

# Verification

---

## Test 1

Administrator login.

Access

POST

```
/products
```

Expected

201

---

## Test 2

Sales login.

Access

POST

```
/products
```

Expected

403

---

## Test 3

Sales login.

Access

GET

```
/products
```

Expected

200

---

## Test 4

Unauthenticated

GET

```
/products
```

Expected

401

---

## Test 5

Administrator

DELETE

```
/products/:id
```

Expected

204

---

## Test 6

Manager

PUT

```
/inventory
```

Expected

Depends on assigned permission.

---

# Completion Checklist

☐ Migration created

☐ Prisma Client generated

☐ Roles created

☐ Permissions created

☐ Administrator seeded

☐ Middleware implemented

☐ Protected routes working

☐ Unauthorized requests rejected

☐ Project compiles

☐ No TypeScript errors

☐ Commit completed

---

# Commit Message

```
feat(auth): implement role-based authorization
```

---

# Notes

This workflow intentionally implements a generic Role-Based Access Control (RBAC) system.

All future modules should protect endpoints by using permission constants rather than hard-coded role names. This allows permissions to evolve over time without changing controller or route logic.

---

# End Workflow
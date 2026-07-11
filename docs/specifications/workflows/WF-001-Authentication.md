# PCS Core Workflow Specification

Workflow:
WF-001

Title:
Authentication

Version:
1.0

Status:
Ready for Implementation

Sprint:
Sprint 22

Module:
Authentication

Author:
ChatGPT

---

# Objective

Implement JWT-based authentication for PCS Core.

This workflow introduces secure authentication for administrators and prepares the platform for future customer authentication.

This workflow does **not** implement authorization. Authorization is implemented in WF-002.

---

# Reference

Use the existing PCS Core architecture.

Do not redesign the application.

Do not change any completed CRUD modules unless specifically required.

Maintain all existing coding standards.

---

# Authentication Strategy

Use

JWT

with

HTTP Authorization Header

```
Authorization: Bearer <token>
```

Passwords must be hashed using

bcrypt

---

# Authentication Scope

MVP Administrator Authentication only.

Customer login will reuse the same authentication infrastructure later.

---

# Prisma Requirements

Create model

```prisma
model User {

  id String @id @default(uuid())

  firstName String

  lastName String

  email String @unique

  passwordHash String

  status RecordStatus @default(ACTIVE)

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt

  @@map("users")

}
```

Create migration.

Apply migration.

Generate Prisma Client.

---

# Environment Variables

Add

```
JWT_SECRET=

JWT_EXPIRES_IN=24h

BCRYPT_ROUNDS=10
```

---

# Folder Structure

Create

```
src/modules/auth/

    controllers/

    routes/

    services/

    validation/

    middleware/

    types/
```

---

# Files

Create

```
AuthController.ts

AuthService.ts

auth.routes.ts

auth.validation.ts

jwt.middleware.ts

auth.dto.ts

index.ts
```

Register routes.

---

# Endpoints

## Login

```
POST

/api/v1/auth/login
```

---

Body

```json
{
    "email":"admin@procourtsports.co.za",
    "password":"password123"
}
```

Returns

```json
{
    "token":"<jwt>",
    "user":{
        ...
    }
}
```

---

## Current User

```
GET

/api/v1/auth/me
```

Requires JWT.

Returns authenticated user.

---

# Password Hashing

Use

bcrypt

Never store plaintext passwords.

---

# JWT Requirements

Include

```
userId

email
```

inside payload.

Default expiry

24 hours.

---

# Middleware

Implement

authenticate()

Responsibilities

Read

Authorization header

↓

Validate JWT

↓

Load User

↓

Attach user to request

↓

Continue

Otherwise

401 Unauthorized

---

# Validation

validateLogin()

Rules

email required

password required

email valid

---

# Service

Implement

login()

Responsibilities

Find user

↓

Compare bcrypt password

↓

Generate JWT

↓

Return token

---

Implement

getCurrentUser()

Returns authenticated user.

---

# Routes

POST

```
/login
```

GET

```
/me
```

---

# Registration

Register

```
/api/v1/auth
```

---

# Security Rules

Passwords hashed.

JWT signed.

No password returned.

No password hash returned.

Inactive users cannot authenticate.

---

# Acceptance Criteria

Application compiles.

Migration succeeds.

JWT generated.

Password hashed.

Login works.

Protected endpoint works.

Invalid password returns

401

Invalid JWT returns

401

Inactive users denied.

---

# Verification

---

## Create Test User

Insert

```text
Email

admin@procourtsports.co.za

Password

password123
```

Store password using bcrypt.

---

## Test 1

POST

```
/api/v1/auth/login
```

Expected

200

Returns JWT.

---

## Test 2

Wrong password.

Expected

401

---

## Test 3

Unknown email.

Expected

401

---

## Test 4

GET

```
/api/v1/auth/me
```

Without token.

Expected

401

---

## Test 5

GET

```
/api/v1/auth/me
```

With JWT.

Expected

200

Returns user.

---

## Test 6

Expired JWT.

Expected

401

---

# Completion Checklist

☐ Migration created

☐ Prisma Client generated

☐ JWT implemented

☐ bcrypt implemented

☐ Login working

☐ Protected route working

☐ Invalid login rejected

☐ Invalid token rejected

☐ Project compiles

☐ No TypeScript errors

☐ Commit completed

---

# Commit Message

```
feat(auth): implement JWT authentication
```

---

# End Workflow
# PCS Core Implementation Prompt

## Milestone 0 — Project Structure & Organization

### Objective

Implement the PCS Core project structure as defined in:

* Chapter 01 — Vision, Principles & Technology Strategy
* Chapter 02 — System Architecture
* Chapter 03 — Project Structure & Organization

The implementation must follow the documented architecture exactly.

Do not redesign, simplify or extend the architecture unless explicitly instructed.

---

# Implementation Scope

Implement only the project structure.

Do **not** implement business functionality.

Do **not** implement application logic.

Do **not** implement routes, controllers, services or repositories beyond minimal placeholders.

---

# Architectural Principles

The implementation must respect the following principles:

* Feature-based architecture
* Modular business domains
* Separation of concerns
* Replaceable infrastructure
* Thin controllers
* Business logic belongs in services
* Database access belongs in repositories
* Shared code remains generic
* Infrastructure remains isolated
* One responsibility per directory

---

# Milestone Deliverables

## Root Structure

Ensure the following directories exist:

```text
docs/
docs/handbook/
docs/decisions/
docs/diagrams/
docs/meeting-notes/
docs/specifications/

prompts/

prisma/

public/

scripts/

src/

tests/

.github/
```

---

## Source Structure

Create:

```text
src/

app.ts

server.ts

config/

infrastructure/

middleware/

modules/

shared/

types/

utils/

views/
```

---

## Business Modules

Create the following feature modules.

```text
catalog/

suppliers/

inventory/

customers/

orders/

checkout/

authentication/

administration/

content/

search/
```

Each module must contain:

```text
controllers/

services/

repositories/

routes/

validation/

types/

views/

tests/

index.ts
```

---

## Shared

Create:

```text
shared/

constants/

errors/

helpers/

logger/

pagination/

responses/

validation/
```

---

## Infrastructure

Create:

```text
infrastructure/

database/

storage/

email/

cache/

payments/

search/

suppliers/
```

---

## Configuration

Create placeholder configuration files for:

* environment
* database
* logging
* sessions

---

## Middleware

Create placeholder middleware files for:

* authentication
* authorization
* error-handler
* request-logger
* validation

---

# Coding Rules

* Use TypeScript.
* Use ES Modules.
* Do not introduce business logic.
* Keep placeholder implementations minimal.
* Follow the naming conventions defined in Chapter 03.
* Do not add packages or dependencies.
* Do not create undocumented folders.
* Do not deviate from the handbook.

---

# Acceptance Criteria

Implementation is complete when:

* The project structure exactly matches Chapter 03.
* Every business module exists.
* Every shared directory exists.
* Every infrastructure directory exists.
* Placeholder files compile successfully.
* No architectural rules have been violated.

If any uncertainty exists, prefer the handbook over assumptions.

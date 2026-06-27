# PCS Core

> The core commerce platform powering **Pro Court Sports**.

## Overview

PCS Core is a modern ecommerce platform built specifically for the South African sporting goods market.

The platform is designed around a modular, scalable architecture that supports multiple suppliers, automated inventory synchronisation, supplier integrations, and a premium online shopping experience.

While the initial implementation focuses on racquet sports (tennis, padel and squash), the architecture is intentionally designed to expand into additional sports and product categories without requiring significant changes to the core platform.

---

## Project Status

**Current Version**

Pre-Alpha — Architecture & Foundation

The current focus is on establishing the project's architecture, engineering standards, database design, and development workflow before production development begins.

---

## Technology Stack

* Node.js
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* EJS
* Tailwind CSS

---

## Project Structure

```text
docs/
    handbook/
    decisions/
    diagrams/

src/

prisma/

public/

scripts/

tests/
```

---

## Documentation

The project documentation is located in:

```text
/docs/handbook
```

This handbook serves as the primary reference for:

* Architecture
* Database design
* Coding standards
* API design
* Security
* Development roadmap
* Deployment

All significant architectural decisions are recorded as Architecture Decision Records (ADRs) located in:

```text
/docs/decisions
```

---

## Engineering Principles

PCS Core is built around the following principles:

* Simplicity over complexity
* Scalability from day one
* Maintainable, modular architecture
* Documentation before implementation
* Clean, readable code
* Security by design

---

## Development Philosophy

This project follows an iterative development approach.

Each major feature progresses through the following stages:

1. Architecture
2. Documentation
3. Database Design
4. API Design
5. Implementation
6. Testing
7. Review

---

## Codename

**PCS Core**

The internal codename for the Pro Court Sports commerce platform.

---

## License

Copyright © Pro Court Sports.

All rights reserved.

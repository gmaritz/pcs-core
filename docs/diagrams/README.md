# PCS Core Architecture

# Diagrams

---

**Document Version:** 1.0.0

**Document Status:** Draft

**Project Codename:** PCS Core

**Project Name:** Pro Court Sports

**Author:** Pro Court Sports Engineering

**Last Updated:** 2026-06-29

---

# Purpose

This directory contains all architectural diagrams for the PCS Core platform.

The diagrams provide a visual representation of the business architecture, domain model, database design, workflows, integrations and deployment architecture.

Every diagram has a corresponding Markdown document that serves as its authoritative source.

The Markdown document explains the business concepts, while the Mermaid diagram provides the visual representation.

---

# Documentation Standard

PCS Core follows a documentation-first approach.

Every architectural concept should exist in two forms:

1. A Markdown document explaining the concept.
2. A Mermaid diagram illustrating the concept.

Both artefacts should be created, reviewed and versioned together.

---

# Mermaid Standard

All Mermaid diagrams follow the **PCS Core Mermaid Standard v1.0**.

## Diagram Structure

* Mermaid metadata comments
* Diagram declaration
* Business diagram
* Legend (where applicable)
* Styles

## Relationship Types

| Syntax | Meaning                         |
| ------ | ------------------------------- |
| `-->`  | Ownership / Business Dependency |
| `-.->` | Reference / Association         |
| `==>`  | Workflow / Process Flow         |

All diagrams use business terminology rather than implementation terminology.

---

# Folder Structure

```text
docs/
└── diagrams/
    ├── README.md
    ├── business/
    ├── database/
    ├── deployment/
    ├── domain-model/
    ├── integrations/
    ├── uml/
    └── workflows/
```

---

# Directory Overview

## business/

Business process diagrams and capability maps.

Examples:

* Business capability map
* Customer journey
* Value stream

---

## database/

Database design documentation.

Examples:

* Entity Relationship Diagram (ERD)
* PostgreSQL schema
* Index strategy

---

## deployment/

Infrastructure and deployment architecture.

Examples:

* Production topology
* CI/CD pipeline
* Hosting architecture

---

## domain-model/

Business domain architecture.

Current diagrams include:

* Aggregate Roots
* Business Domains
* Canonical Domain Model
* Entity Relationships

This directory forms the architectural foundation of PCS Core.

---

## integrations/

External system integrations.

Examples:

* Supplier APIs
* Payment Gateway
* Shipping Providers
* Email Services
* Authentication Providers

---

## uml/

Software engineering diagrams.

Examples:

* Class diagrams
* Sequence diagrams
* Component diagrams
* Package diagrams

---

## workflows/

Business and technical workflows.

Examples:

* Supplier Import Process
* Checkout Process
* Order Fulfilment
* Inventory Synchronisation

---

# Current Domain Model Diagrams

| Diagram                      | Purpose                                               |
| ---------------------------- | ----------------------------------------------------- |
| `aggregate-roots.mmd`        | Defines aggregate ownership boundaries.               |
| `business-domains.mmd`       | Defines the responsibilities of each business domain. |
| `canonical-domain-model.mmd` | High-level business architecture of PCS Core.         |
| `entity-relationships.mmd`   | Business relationships between catalog entities.      |

Additional diagrams will be added as new bounded contexts are designed.

---

# Diagram Lifecycle

Every new diagram follows the same lifecycle.

1. Business concept is documented.
2. Mermaid diagram is created.
3. Diagram is reviewed.
4. Markdown and Mermaid files are committed together.
5. Future changes are tracked through Architecture Decision Records (ADRs) where appropriate.

This process ensures that documentation and visual architecture remain synchronised throughout the lifetime of the project.

---

# Design Philosophy

Diagrams are architectural artefacts rather than implementation artefacts.

They are intended to communicate business concepts, ownership boundaries and system responsibilities before implementation begins.

Implementation details belong in the codebase, while architectural intent belongs in the documentation.

---

# Summary

The diagrams contained within this directory provide the visual architecture of PCS Core.

Together with the Architecture Handbook, Domain Model and Architecture Decision Records, they form the primary reference for understanding how the Pro Court Sports platform is designed and how it evolves over time.

---

**End of Diagrams README**

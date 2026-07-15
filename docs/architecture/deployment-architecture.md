# PCS Core Deployment Architecture

Version: 1.0

Status: MVP Feature Development Complete

Last Updated: July 2026

Author: ChatGPT

---

# Purpose

This document defines the deployment architecture for PCS Core.

It describes how the platform is deployed from the development environment through to production and establishes the standards for infrastructure, configuration, monitoring, backups and operational readiness.

This document serves as the deployment reference for future production releases.

---

# Deployment Philosophy

PCS Core follows a staged deployment model.

```
Developer

↓

Development

↓

Testing

↓

Staging (Future)

↓

Production
```

Each environment should closely resemble the next to minimise deployment risk.

---

# Platform Overview

```
                    Internet

                         │

                 HTTPS Requests

                         │

                    Load Balancer
                    (Future)

                         │

                  Render Platform

                         │

                  Express Server

                         │

                 Business Modules

                         │

                    Prisma ORM

                         │

                   PostgreSQL

                         │

                 Persistent Storage
```

---

# Current Deployment

## Application

Platform

Node.js

Framework

Express

Language

TypeScript

View Engine

EJS

---

## Database

Platform

PostgreSQL

ORM

Prisma

Connection

Environment Variables

---

## Hosting

Current Target

Render

Future

Dedicated infrastructure if required.

---

## Version Control

Git

↓

GitHub

↓

Deployment

↓

Render

---

# Environment Strategy

## Development

Purpose

Active feature development.

Characteristics

- Local database
- Local assets
- Debug logging
- Hot reload
- Development environment variables

---

## Staging (Future)

Purpose

Pre-production validation.

Characteristics

- Production-like configuration
- Seeded data
- Performance testing
- Supplier validation
- Regression testing

---

## Production

Purpose

Public ecommerce platform.

Characteristics

- Production database
- Secure environment variables
- Monitoring
- Logging
- Backups
- Optimised assets

---

# Configuration Management

All configuration should be supplied through environment variables.

Examples

```
DATABASE_URL

JWT_SECRET

PORT

NODE_ENV

LOG_LEVEL

SESSION_SECRET

SUPPLIER_STORAGE_PATH

MEDIA_STORAGE_PATH
```

Secrets must never be committed to source control.

---

# Asset Strategy

Current

Local media.

Future

Cloud storage.

Possible providers

- Cloudflare R2
- AWS S3
- Azure Blob Storage

MediaService remains responsible for media resolution.

Changing storage providers should not affect Storefront pages.

---

# Static Assets

Current

```
public/

    css/

    js/

    images/
```

Future

- Bundled assets
- Compression
- Cache headers
- CDN delivery

---

# Logging Strategy

Development

Console logging.

Future

Structured logging.

Recommended

- Winston
- Pino

Production logs should include

- Errors
- Authentication events
- Supplier imports
- Pricing synchronisation
- Inventory synchronisation
- Orders
- Checkout failures

Sensitive information must never be logged.

---

# Monitoring

Future

Application Monitoring

Database Monitoring

Error Tracking

Performance Metrics

Recommended

- Render Metrics
- Sentry
- Uptime Monitoring

---

# Backup Strategy

Database

Daily automated backups.

Retention

30 days minimum.

Before

- Major releases
- Supplier onboarding
- Database migrations

Application

GitHub

↓

Tagged Releases

↓

Milestone ZIP Archives

---

# Disaster Recovery

Recovery priorities

1.

Database

2.

Application

3.

Media

4.

Supplier imports

Recovery should support

- Full restore
- Point-in-time recovery
- Rollback after deployment

---

# Deployment Workflow

```
Developer

↓

Git Commit

↓

GitHub

↓

Build

↓

Integration Tests

↓

Deployment

↓

Health Checks

↓

Production
```

Every deployment must compile successfully before release.

---

# Health Checks

Recommended endpoint

```
GET /health
```

Returns

```
{
    status: "healthy"
}
```

Future

Include

- Database connectivity
- Prisma connectivity
- Version
- Build timestamp
- Environment

---

# Database Strategy

Database

PostgreSQL

Access

Prisma ORM

Rules

- Migrations through Prisma
- Version controlled schema
- No manual production schema changes

Migration process

```
Schema

↓

Migration

↓

Review

↓

Deploy
```

---

# Security

HTTPS

Required.

Environment Variables

Encrypted.

JWT Secret

Protected.

Database

Private.

Admin routes

Authenticated.

Production should enforce

- Security headers
- Rate limiting
- Input validation
- Secure cookies
- CSRF strategy (where applicable)

---

# Performance Strategy

Current

Optimised queries.

Future

- Database indexing
- Response caching
- CDN
- Lazy loading
- Image optimisation

Performance testing becomes part of MVP Hardening.

---

# Deployment Checklist

Before every deployment

✓ Build passes

✓ Integration tests pass

✓ Regression tests pass

✓ Database migrations reviewed

✓ Environment variables verified

✓ Documentation updated

✓ Version tagged

✓ Backup completed

---

# Supplier Deployment Strategy

Supplier onboarding must not require platform deployment.

Only

- Supplier configuration
- Adapter implementation

should be necessary.

The Supplier Platform has been designed to isolate supplier-specific logic from the rest of the application.

---

# Release Strategy

Recommended Versioning

Semantic Versioning

```
Major.Minor.Patch
```

Examples

```
1.0.0

1.1.0

1.2.0

2.0.0
```

Milestone releases should be tagged in Git.

---

# Infrastructure Evolution

Future enhancements may include

- CDN
- Redis cache
- Search indexing
- Queue processing
- Background workers
- Microservices (only if justified)

The current architecture intentionally remains a modular monolith.

---

# Operational Readiness

Before production

Verify

- Platform Validation
- Storefront
- Supplier Platform
- Performance
- Security
- Monitoring
- Logging
- Backups
- Documentation

---

# Current Assessment

Architecture

Enterprise Ready

Deployment Model

Excellent

Documentation

Comprehensive

Supplier Readiness

Pending MVP Hardening

Production Readiness

Pending MVP Hardening

Infrastructure Complexity

Appropriate

Operational Risk

Low

---

# Conclusion

PCS Core has been designed around a deployment architecture that prioritises simplicity, maintainability and operational reliability.

The platform remains a modular monolith with clear separation between presentation, business and persistence layers.

This architecture provides an excellent foundation for production deployment and future growth while avoiding unnecessary infrastructure complexity.

Future enhancements should evolve the deployment architecture without compromising the modular design principles established during MVP development.

---

# End Document
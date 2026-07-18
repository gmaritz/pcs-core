# PCS Core

# Storefront Design System

Version: 1.0

Status: Living Document

Owner: Storefront Domain

---

# Purpose

The Storefront Design System defines the visual language for Pro Court Sports.

Its purpose is to ensure every customer-facing page provides a consistent, premium experience regardless of feature or module.

This document serves as the visual counterpart to the technical architecture.

Whenever new UI components are introduced, they should follow the principles and standards defined here.

---

# Brand Identity

## Positioning

South Africa's Court Sports Specialists.

Focused exclusively on:

- Tennis
- Padel
- Squash

The visual language should communicate:

- Specialist
- Premium
- Modern
- Performance
- Trust
- Simplicity

Never:

- Cheap
- Discount-driven
- Busy
- Generic
- Marketplace-style

---

# Design Principles

Every page should satisfy these principles.

## Specialist

Visitors should immediately understand that Pro Court Sports specialises in court sports.

---

## Premium

Whitespace is preferred over clutter.

Quality over quantity.

---

## Fast

Users should never struggle to find products.

Navigation should feel effortless.

---

## Consistent

Every page should feel like part of the same application.

---

## Accessible

Accessibility is never optional.

---

# Colour Palette

## Primary

Gold

Purpose

Primary buttons

Highlights

Links

Interactive states

---

## Secondary

Black

Purpose

Navigation

Footer

Primary typography

---

## Background

White

Default page background.

---

## Neutral Palette

Very Light Grey

Light Grey

Medium Grey

Dark Grey

Charcoal

Used for

Cards

Borders

Muted text

Section backgrounds

---

## Status Colours

Success

Warning

Error

Information

Reserved for application messaging only.

Never use them decoratively.

---

# Typography

## Font Family

Primary

Current application font.

Future replacements should occur globally.

---

## Heading Scale

H1

Homepage Hero

Page Titles

---

H2

Major Sections

---

H3

Cards

Subsections

---

H4

Component Titles

---

Body

Primary content.

---

Small

Descriptions

Captions

Meta information

---

# Layout

## Maximum Content Width

Standard container.

Used consistently across the storefront.

---

## Section Spacing

Large vertical spacing.

Sections should breathe.

Avoid compressed layouts.

---

## Grid System

Desktop

12 columns

Tablet

Responsive grid

Mobile

Single column

---

# Border Radius

Buttons

Medium

Cards

Medium

Images

Medium

Inputs

Medium

Maintain consistency.

---

# Shadows

Small

Cards

Hover

Medium

Hero

Large feature cards

Large

Reserved.

Avoid excessive shadow usage.

---

# Motion

Purpose

Motion should improve usability.

Never distract.

---

## Standard Duration

Fast

150ms

Normal

200ms

Slow

300ms

---

## Hover Effects

Cards

Lift

6px

Image

Scale

102%

Buttons

Subtle lift

Navigation

Underline animation

Icons

Scale

105%

---

## Page Reveal

Fade

Translate

Respect reduced-motion preferences.

---

# Components

---

## Announcement Bar

Purpose

Site-wide communication.

Height

40px

Single message only.

---

## Header

Sticky.

Transparent over Hero.

Solid after scroll.

Contains

Logo

Navigation

Search

Account

Wishlist

Cart

---

## Hero Banner

Largest visual element.

Contains

Headline

Supporting text

Primary CTA

Secondary CTA

Lifestyle imagery

---

## Trust Strip

Immediately below Hero.

Three trust messages.

Compact.

---

## Sport Cards

Exactly three.

Tennis

Padel

Squash

Primary homepage navigation.

---

## Category Cards

Simple.

Visual.

Image-first.

Clickable.

---

## Product Cards

Contains

Product image

Brand

Name

Price

Stock badge

Add to Cart

Future badge area

Hover lift

---

## Brand Strip

Official supplier logos.

Desktop

Single row.

Mobile

Scrollable.

Hover

Grayscale to colour.

---

## Feature Cards

Used throughout the application.

Icon

Title

Description

Subtle background.

---

## Newsletter

Rounded container.

Minimal fields.

Primary CTA.

---

## Footer

Four-column layout.

Shop

Customer Service

Company

Legal

Bottom row

Copyright

Social icons

---

# Buttons

## Primary

Gold

Black text

Rounded

Hover lift

---

## Secondary

White

Dark border

Gold hover

---

## Icon Buttons

Circular

Minimal

Used in navigation.

---

# Forms

Inputs

Rounded

Consistent height

Visible focus state

Inline validation

Accessible labels

---

# Icons

Consistent icon family.

Consistent stroke width.

Icons should support:

Navigation

Features

Categories

Status

---

# Imagery

Photography should reflect:

Performance

Movement

Competition

Quality

Authenticity

Avoid stock imagery where possible.

Use supplier-provided assets whenever available.

---

# Product Photography

Preferred

Clean background

High resolution

Consistent aspect ratio

No watermarks.

---

# Responsiveness

Desktop

Full experience.

Tablet

Reduced columns.

Mobile

Touch-first.

Large tap targets.

Readable typography.

---

# Accessibility

WCAG compliant.

Keyboard navigation.

Visible focus.

Semantic HTML.

Reduced motion support.

Colour contrast compliance.

---

# Performance

Optimised images.

Lazy loading.

Minimal JavaScript.

Minimal layout shift.

Responsive image sizes.

---

# UI Component Rules

Components must:

Be reusable.

Remain presentation-only.

Receive data via ViewModels.

Contain no business logic.

Remain independently testable.

---

# Naming Convention

Components

PascalCase

CSS

BEM-compatible utility naming.

JavaScript

Module based.

Animations

Reusable.

---

# Future Expansion

The design system should support future modules including:

- Catalogue
- Product Detail
- Shopping Cart
- Checkout
- Customer Account
- Wishlist
- Order History
- Supplier Portal
- Administration

without requiring a redesign.

---

# Guiding Principle

Every page should reinforce that Pro Court Sports is South Africa's trusted specialist for premium Tennis, Padel and Squash equipment.

If a new design decision does not strengthen that identity, it should be reconsidered.

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0 | Initial | Storefront Design System established following MVP-003A |
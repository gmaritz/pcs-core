# PCS Core Implementation Specification

Module:
Storefront

Milestone:
MVP-003A

Iteration:
02

Title:
Homepage Visual Refinement

Version:
1.0

Status:
Ready for Implementation

---

# Objective

Transform the homepage from a functional ecommerce homepage into a premium
court sports storefront.

No new business functionality should be introduced during this iteration.

Focus exclusively on:

- Visual hierarchy
- Typography
- Colour
- Imagery
- Micro interactions
- Animation
- Premium presentation
- Trust
- User experience

This iteration should make visitors immediately recognise Pro Court Sports as a premium specialist.

---

# Design Philosophy

Every visual decision should support one message.

> South Africa's Court Sports Specialists.

The homepage should feel closer to a premium Apple, Nike or Wilson experience than a discount ecommerce store.

Avoid visual clutter.

Embrace whitespace.

---

# Hero Section

Increase the overall visual impact.

## Height

Increase hero height by approximately 25%.

Desktop should feel immersive.

---

## Layout

Increase spacing between

Headline

↓

Supporting Text

↓

Buttons

---

## Headline

Current

Performance Equipment
for Tennis, Padel & Squash

Increase font size.

Increase line height.

Increase font weight.

This should become the strongest visual element on the page.

---

## Hero Image

Increase image size.

Allow image to breathe.

Use subtle rounded corners.

Apply a very soft shadow.

Future images should support responsive loading.

---

## Buttons

Primary button

Gold background

Black text

Hover

Slight lift

Soft shadow

Transition

200ms

Secondary button

White

Dark border

Hover

Gold border

---

# Trust Strip

Insert immediately below the Hero.

Do not create a new section.

Use a slim horizontal bar.

Display three trust items.

✓ Premium Brands

✓ Court Sports Specialists

✓ Nationwide Delivery

Desktop

Horizontal layout

Mobile

Vertical stack

---

# Shop by Sport

This is the most important section after the Hero.

Increase card height.

Increase image size.

Increase title size.

Increase spacing.

Cards should feel clickable.

---

## Hover Effect

Card lift

6px

Soft shadow

Image zoom

2%

Transition

250ms

Button

Gold underline animation.

---

# Section Headings

Increase hierarchy.

Heading

Larger

Bold

More bottom spacing.

Section label

Uppercase

Letter spacing

Smaller

Muted colour

Example

FEATURED PRODUCTS

Premium Equipment Picked for Match-Ready Players

---

# Featured Categories

Increase card height.

Icons should become larger.

Use cleaner typography.

Future icon replacement should require no code changes.

---

# Product Cards

These become one of the most important visual elements.

Increase card height.

Increase product image size.

Price should become visually dominant.

Brand slightly muted.

Product title stronger.

---

## Add To Cart

Full width button.

Gold background.

Rounded.

Hover lift.

Transition.

---

## Stock

Replace plain text.

Use pill badge.

Examples

In Stock

Limited Stock

Out of Stock

---

## Future Badge Area

Reserve space for

New

Best Seller

Staff Pick

Sale

No implementation required yet.

Only reserve layout.

---

# Featured Brands

Increase overall height.

Increase spacing between logos.

Use official SVG logos.

Desktop

7 logos in one row.

Tablet

Responsive wrap.

Mobile

Horizontal scrolling carousel.

Hover

Logo changes from grayscale to colour.

Opacity transition.

---

# Why Pro Court Sports

Replace simple cards with premium feature blocks.

Each card contains

Icon

↓

Title

↓

Short Description

Example

Premium Brands

Official performance equipment from the world's leading manufacturers.

Court Sports Specialists

Focused exclusively on Tennis, Padel and Squash.

Nationwide Delivery

Fast delivery across South Africa.

Secure Checkout

Safe encrypted online payments.

Increase spacing.

Use subtle background.

---

# Newsletter

Increase visual importance.

Background

Very light grey.

Rounded container.

Larger heading.

Better spacing.

Input

Rounded.

Button

Gold.

---

# Footer

Increase spacing.

Improve typography.

Increase social icon size.

Improve link hover effects.

Better visual separation between columns.

---

# Navigation

Improve hover animations.

Menu items

Underline animation.

Icons

Subtle scale on hover.

Header transition

Transparent over hero.

Solid white after scrolling.

Smooth transition.

---

# Search

Hover animation.

Future expandable search architecture should remain compatible.

No implementation yet.

---

# Animations

Use subtle motion only.

Avoid excessive movement.

Implement

Fade in

Section reveal

Hover lift

Button transitions

Image zoom

Navigation transition

All animations between

150ms

and

300ms

---

# Colour Usage

Primary Gold

Reserved for

Buttons

Links

Highlights

Hover states

Primary actions

Avoid overusing gold.

White should remain dominant.

---

# Spacing

Increase vertical spacing between all homepage sections.

The homepage should feel open.

Not compressed.

---

# Imagery

Replace placeholder images wherever possible.

Use

Professional

Lifestyle

Action photography

Consistent aspect ratios.

MediaService remains responsible for image resolution.

---

# Responsive Refinements

Desktop

Maximum content width.

Tablet

Balanced spacing.

Mobile

Large tap targets.

Readable typography.

Maintain premium appearance.

---

# Accessibility

Maintain WCAG compliance.

Visible keyboard focus.

Proper colour contrast.

Respect reduced-motion preferences where possible.

---

# Performance

Maintain Lighthouse-friendly performance.

Lazy loading.

Responsive images.

Minimal layout shift.

Avoid unnecessary JavaScript.

---

# Validation

Verify

Homepage renders.

Hover effects function.

Animations perform smoothly.

Responsive layouts preserved.

No regressions.

Workflow tests continue passing.

---

# Acceptance Criteria

- Premium visual presentation achieved.
- Hero visually dominates the page.
- Three sports become stronger focal points.
- Product cards improved.
- Brand section polished.
- Trust section enhanced.
- Navigation refined.
- Footer refined.
- Responsive behaviour maintained.
- Existing architecture unchanged.
- No business logic introduced into views.

---

# Commit Message

```
style(storefront): refine homepage visual experience
```

---

# Future Work

After completion of MVP-003A Iteration 2, the homepage should be considered production-ready.

Subsequent milestones will focus on expanding the shopping experience rather than redesigning the homepage.

The homepage should become the visual standard for all future storefront pages.

---

# End Specification
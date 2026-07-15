# PCS Core Workflow Specification

Workflow:
WF-010E

Title:
Shopping Experience

Version:
2.0

Status:
Ready for Implementation

Sprint:
Sprint 35

Module:
Storefront

Author:
ChatGPT

---

# Objective

Complete the end-to-end customer shopping journey by integrating the existing Cart, Authentication, Checkout and Order Processing workflows into the Storefront.

Introduce the Notification Service as the centralized notification abstraction for all customer shopping events.

The Shopping Experience remains a presentation layer.

Business logic remains inside existing commerce services.

No duplicate business logic may be implemented.

---

# References

WF-003 Checkout

WF-004 Order Processing

WF-010A Storefront Foundation

WF-010B Dynamic Home Page

WF-010C Product Catalogue

WF-010D Product Detail Experience

Maintain the existing Storefront architecture.

---

# Existing Modules Used

Authentication

Authorization

Cart

Checkout

Order Processing

Pricing

Inventory

Recommendation

Media

Content

Notification

Storefront

---

# Architecture

```
Customer

↓

ShoppingController

↓

ShoppingFacade

↓

Authentication Service

↓

Cart Service

↓

Checkout Service

↓

Order Processing

↓

NotificationService

↓

StorefrontPresentationService

↓

Shopping View Models

↓

EJS
```

---

# Folder Structure

## Storefront

```
src/modules/storefront/

    facades/

        ShoppingFacade.ts

    view-models/

        CartViewModel.ts

        CheckoutViewModel.ts

        OrderConfirmationViewModel.ts

        CustomerAccountViewModel.ts

        ShoppingPageViewModel.ts
```

---

## Notification Module

Create

```
src/modules/notification/

    services/

        NotificationService.ts

    types/

        Notification.ts

        NotificationResult.ts

        NotificationChannel.ts

    index.ts
```

---

# NotificationService

The Notification Service is responsible for all customer-facing notifications.

The Storefront must never generate notification content directly.

Initial MVP notifications

- Product added to cart
- Product removed from cart
- Cart updated
- Login successful
- Registration successful
- Checkout successful
- Order placed successfully
- Order confirmation available

Delivery

For MVP

Return notification models for presentation.

No email sending.

No SMS.

No external integrations.

Future delivery channels

- Email
- SMS
- WhatsApp
- Push Notifications
- Supplier Notifications
- Administration Notifications

Future notification types

- Shipping Updates
- Delivery Updates
- Low Stock Alerts
- Back-in-stock Notifications
- Wishlist Alerts
- Promotional Messages

The Storefront must not change when new notification channels are introduced.

---

# ShoppingController

Responsibilities

Render

- Cart
- Checkout
- Order Confirmation
- Customer Account

Receive notification models from ShoppingFacade.

No business logic.

No Prisma.

---

# ShoppingFacade

Responsibilities

Coordinate

Authentication

↓

Cart

↓

Pricing

↓

Inventory

↓

Checkout

↓

Order Processing

↓

NotificationService

↓

Build presentation-ready View Models

↓

Return

---

# Shopping Journey

The Storefront must support

```
Home

↓

Catalogue

↓

Product Detail

↓

Add To Cart

↓

Cart

↓

Checkout

↓

Order Processing

↓

Notification

↓

Order Confirmation

↓

Customer Account
```

---

# Product Detail

Enhance

Add To Cart button.

Display

- Quantity selector
- Continue Shopping
- View Cart

Generate

Product Added notification.

---

# Cart

Display

- Product image
- Product name
- SKU
- Quantity
- Unit Price
- Line Total
- Remove item
- Update quantity
- Cart Total

Generate

- Item Added
- Item Removed
- Cart Updated

notifications.

Reuse existing Cart workflow.

---

# Checkout

Reuse existing Checkout workflow.

Display

- Customer Details
- Shipping Address
- Billing Address
- Order Summary
- Total
- Place Order

Generate

Checkout Successful notification.

---

# Authentication

Anonymous users

↓

Redirect to Login.

Authenticated users

↓

Proceed.

Generate

Login Successful notification.

---

# Order Confirmation

Display

- Order Number
- Date
- Customer
- Items
- Totals
- Order Status

Generate

Order Successfully Placed notification.

Include

Continue Shopping button.

---

# Customer Account

Display

- Customer Profile
- Order History
- Current Orders
- Previous Orders

Future

- Wishlist
- Reviews
- Returns
- Addresses

---

# Shopping View Models

Create

```
CartViewModel

CheckoutViewModel

OrderConfirmationViewModel

CustomerAccountViewModel

ShoppingPageViewModel

NotificationViewModel
```

Presentation-ready only.

---

# Page Metadata

Generate metadata for

- Cart
- Checkout
- Order Confirmation
- Customer Account

Use

PageMetadataService.

---

# Business Rules

No duplicate business logic.

Reuse Cart workflow.

Reuse Checkout workflow.

Reuse Order Processing workflow.

Pricing from Pricing Service.

Inventory from Inventory Service.

Notifications from NotificationService.

Metadata from PageMetadataService.

No Prisma inside Storefront.

No calculations inside EJS.

---

# Acceptance Criteria

ShoppingFacade implemented.

NotificationService implemented.

Cart integrated.

Checkout integrated.

Authentication integrated.

Order Confirmation implemented.

Customer Account implemented.

NotificationViewModel implemented.

Metadata generated.

Project compiles.

No TypeScript errors.

---

# Verification

## Compile

```
npm run build
```

Passes.

---

## Integration Tests

Create

```
wf-010e-shopping.integration.ts
```

Verify

- Cart rendering
- Checkout rendering
- Authentication redirect
- Order Confirmation
- Customer Account
- Notification generation

---

## Business Tests

### Test 1

Anonymous Checkout.

Expected

Redirect to Login.

---

### Test 2

Authenticated Checkout.

Expected

Checkout displayed.

---

### Test 3

Add Product.

Expected

Cart updated.

Notification generated.

---

### Test 4

Update Quantity.

Expected

Totals updated.

Notification generated.

---

### Test 5

Complete Order.

Expected

Order created.

Notification generated.

Confirmation displayed.

---

### Test 6

Customer Account.

Expected

Order visible.

---

### Test 7

Inventory Reduction.

Expected

Inventory updated.

---

### Test 8

Inspect page source.

Verify

- Title
- Meta Description
- Canonical

Generated correctly.

---

# Completion Checklist

☐ ShoppingFacade implemented

☐ NotificationService implemented

☐ NotificationViewModel implemented

☐ Cart integrated

☐ Checkout integrated

☐ Authentication integrated

☐ Order Confirmation implemented

☐ Customer Account implemented

☐ Metadata implemented

☐ Integration tests passing

☐ Project compiles

☐ Commit completed

---

# Commit Message

```
feat(storefront): implement shopping experience
```

---

# Notes

WF-010E completes the customer shopping experience for PCS Core.

The Storefront remains exclusively a presentation layer.

Business logic remains within the existing Authentication, Cart, Checkout, Pricing, Inventory and Order Processing services.

ShoppingFacade orchestrates the customer shopping journey into presentation-ready View Models.

NotificationService centralizes all customer notifications and establishes the reusable notification architecture for future email, SMS, WhatsApp, push notification and supplier notification integrations.

PageMetadataService provides SEO metadata for shopping pages.

StorefrontPresentationService prepares presentation-ready View Models.

Completion of WF-010E marks the completion of the customer-facing MVP architecture.

The next project phase is MVP Hardening.

---

# End Workflow
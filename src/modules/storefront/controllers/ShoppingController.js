"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoppingController = exports.ShoppingController = void 0;
const facades_1 = require("../facades");
const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Sports', href: '/sports' },
    { label: 'Brands', href: '/brands' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Login', href: '/login' },
    { label: 'Cart', href: '/cart' },
];
const NOTIFICATION_EVENTS = [
    'product-added',
    'product-removed',
    'cart-updated',
    'login-successful',
    'registration-successful',
    'checkout-successful',
    'order-placed-successfully',
    'order-confirmation-available',
];
class ShoppingController {
    async renderCart(req, res) {
        const customerId = this.requireCustomerId(req, res);
        if (!customerId) {
            return;
        }
        const notificationEvent = this.resolveNotificationEvent(req);
        const page = await facades_1.shoppingFacade.buildCartPageViewModel({
            customerId,
            notificationEvent,
        });
        this.renderShoppingPage(req, res, {
            view: 'storefront/cart',
            pageTitle: page.metadata.title,
            heading: page.heading,
            description: page.description,
            breadcrumbs: page.breadcrumbs,
            metadata: page.metadata,
            customerId,
            cart: page.page,
            notification: page.notification,
        });
    }
    async addToCart(req, res) {
        const customerId = this.requireCustomerId(req, res);
        if (!customerId) {
            return;
        }
        const productVariantId = typeof req.body.productVariantId === 'string'
            ? req.body.productVariantId
            : '';
        const quantity = typeof req.body.quantity === 'string'
            ? Number(req.body.quantity)
            : 1;
        await facades_1.shoppingFacade.addToCart({
            customerId,
            productVariantId,
            quantity,
        });
        res.redirect(`/cart?customerId=${encodeURIComponent(customerId)}&notification=product-added`);
    }
    async updateCartItem(req, res) {
        const customerId = this.requireCustomerId(req, res);
        if (!customerId) {
            return;
        }
        const cartItemId = typeof req.body.cartItemId === 'string'
            ? req.body.cartItemId
            : '';
        const quantity = typeof req.body.quantity === 'string'
            ? Number(req.body.quantity)
            : 1;
        await facades_1.shoppingFacade.updateCartItemQuantity({
            customerId,
            cartItemId,
            quantity,
        });
        res.redirect(`/cart?customerId=${encodeURIComponent(customerId)}&notification=cart-updated`);
    }
    async removeCartItem(req, res) {
        const customerId = this.requireCustomerId(req, res);
        if (!customerId) {
            return;
        }
        const cartItemId = typeof req.body.cartItemId === 'string'
            ? req.body.cartItemId
            : '';
        await facades_1.shoppingFacade.removeCartItem({
            customerId,
            cartItemId,
        });
        res.redirect(`/cart?customerId=${encodeURIComponent(customerId)}&notification=product-removed`);
    }
    async renderCheckout(req, res) {
        const customerId = this.requireCustomerId(req, res);
        if (!customerId) {
            return;
        }
        const notificationEvent = this.resolveNotificationEvent(req);
        const page = await facades_1.shoppingFacade.buildCheckoutPageViewModel({
            customerId,
            notificationEvent,
        });
        this.renderShoppingPage(req, res, {
            view: 'storefront/checkout',
            pageTitle: page.metadata.title,
            heading: page.heading,
            description: page.description,
            breadcrumbs: page.breadcrumbs,
            metadata: page.metadata,
            customerId,
            checkout: page.page,
            notification: page.notification,
        });
    }
    async placeOrder(req, res) {
        const customerId = this.requireCustomerId(req, res);
        if (!customerId) {
            return;
        }
        const billingAddressId = typeof req.body.billingAddressId === 'string'
            ? req.body.billingAddressId
            : undefined;
        const shippingAddressId = typeof req.body.shippingAddressId === 'string'
            ? req.body.shippingAddressId
            : undefined;
        const notes = typeof req.body.notes === 'string'
            ? req.body.notes
            : undefined;
        const placedOrder = await facades_1.shoppingFacade.placeOrder({
            customerId,
            billingAddressId,
            shippingAddressId,
            notes,
        });
        res.redirect(`/order-confirmation/${encodeURIComponent(placedOrder.orderId)}?customerId=${encodeURIComponent(customerId)}&notification=order-placed-successfully`);
    }
    async renderOrderConfirmation(req, res) {
        const customerId = this.requireCustomerId(req, res);
        if (!customerId) {
            return;
        }
        const orderId = Array.isArray(req.params.orderId)
            ? req.params.orderId[0]
            : req.params.orderId;
        const notificationEvent = this.resolveNotificationEvent(req) ?? 'order-confirmation-available';
        const page = await facades_1.shoppingFacade.buildOrderConfirmationPageViewModel({
            customerId,
            orderId,
            notificationEvent,
        });
        if (!page) {
            res.status(404).render('storefront/error', {
                pageTitle: 'Pro Court Sports | Order Not Found',
                heading: 'Order Not Found',
                description: 'The requested order confirmation is not available.',
                breadcrumbs: [
                    {
                        label: 'Home',
                        href: '/',
                    },
                    {
                        label: 'Order Confirmation',
                    },
                ],
                navItems: NAV_ITEMS,
                currentPath: req.path,
                currentYear: new Date().getFullYear(),
                layout: 'layouts/main',
            });
            return;
        }
        this.renderShoppingPage(req, res, {
            view: 'storefront/orders',
            pageTitle: page.metadata.title,
            heading: page.heading,
            description: page.description,
            breadcrumbs: page.breadcrumbs,
            metadata: page.metadata,
            customerId,
            orderConfirmation: page.page,
            notification: page.notification,
        });
    }
    async renderAccount(req, res) {
        const customerId = this.requireCustomerId(req, res);
        if (!customerId) {
            return;
        }
        const notificationEvent = this.resolveNotificationEvent(req);
        const page = await facades_1.shoppingFacade.buildCustomerAccountPageViewModel({
            customerId,
            notificationEvent,
        });
        this.renderShoppingPage(req, res, {
            view: 'storefront/account',
            pageTitle: page.metadata.title,
            heading: page.heading,
            description: page.description,
            breadcrumbs: page.breadcrumbs,
            metadata: page.metadata,
            customerId,
            account: page.page,
            notification: page.notification,
        });
    }
    requireCustomerId(req, res) {
        const customerId = typeof req.query.customerId === 'string'
            ? req.query.customerId.trim()
            : '';
        if (customerId) {
            return customerId;
        }
        const returnTo = encodeURIComponent(req.originalUrl || req.path);
        res.redirect(`/login?redirect=${returnTo}`);
        return undefined;
    }
    resolveNotificationEvent(req) {
        const rawEvent = typeof req.query.notification === 'string'
            ? req.query.notification.trim()
            : '';
        if (!rawEvent) {
            return undefined;
        }
        if (NOTIFICATION_EVENTS.includes(rawEvent)) {
            return rawEvent;
        }
        return undefined;
    }
    renderShoppingPage(req, res, options) {
        res.render(options.view, {
            pageTitle: options.pageTitle,
            heading: options.heading,
            description: options.description,
            breadcrumbs: options.breadcrumbs,
            navItems: NAV_ITEMS,
            currentPath: req.path,
            currentYear: new Date().getFullYear(),
            layout: 'layouts/main',
            metadata: options.metadata,
            shoppingCustomerId: options.customerId,
            notification: options.notification,
            cart: options.cart,
            checkout: options.checkout,
            orderConfirmation: options.orderConfirmation,
            account: options.account,
        });
    }
}
exports.ShoppingController = ShoppingController;
exports.shoppingController = new ShoppingController();

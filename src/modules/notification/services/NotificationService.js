"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
class NotificationService {
    create(event) {
        return {
            notifications: [
                this.resolveNotification(event),
            ],
        };
    }
    fromEvents(events) {
        return {
            notifications: events.map((event) => this.resolveNotification(event)),
        };
    }
    resolveNotification(event) {
        switch (event) {
            case 'product-added':
                return {
                    event,
                    title: 'Added to Cart',
                    message: 'Product added to your cart.',
                    severity: 'success',
                    channel: 'in-app',
                };
            case 'product-removed':
                return {
                    event,
                    title: 'Item Removed',
                    message: 'Product removed from your cart.',
                    severity: 'info',
                    channel: 'in-app',
                };
            case 'cart-updated':
                return {
                    event,
                    title: 'Cart Updated',
                    message: 'Your cart quantities were updated.',
                    severity: 'success',
                    channel: 'in-app',
                };
            case 'login-successful':
                return {
                    event,
                    title: 'Login Successful',
                    message: 'Welcome back. You are now signed in.',
                    severity: 'success',
                    channel: 'in-app',
                };
            case 'registration-successful':
                return {
                    event,
                    title: 'Registration Successful',
                    message: 'Your account was created successfully.',
                    severity: 'success',
                    channel: 'in-app',
                };
            case 'checkout-successful':
                return {
                    event,
                    title: 'Checkout Successful',
                    message: 'Your checkout details were captured successfully.',
                    severity: 'success',
                    channel: 'in-app',
                };
            case 'order-placed-successfully':
                return {
                    event,
                    title: 'Order Placed',
                    message: 'Your order was placed successfully.',
                    severity: 'success',
                    channel: 'in-app',
                };
            case 'order-confirmation-available':
            default:
                return {
                    event: 'order-confirmation-available',
                    title: 'Order Confirmation Available',
                    message: 'Your order confirmation is ready to view.',
                    severity: 'info',
                    channel: 'in-app',
                };
        }
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();

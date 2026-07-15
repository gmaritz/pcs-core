import {
  NotificationChannel,
} from './NotificationChannel';

export type NotificationSeverity =
  | 'success'
  | 'info'
  | 'warning';

export type NotificationEvent =
  | 'product-added'
  | 'product-removed'
  | 'cart-updated'
  | 'login-successful'
  | 'registration-successful'
  | 'checkout-successful'
  | 'order-placed-successfully'
  | 'order-confirmation-available';

export interface Notification {
  event: NotificationEvent;
  title: string;
  message: string;
  severity: NotificationSeverity;
  channel: NotificationChannel;
}

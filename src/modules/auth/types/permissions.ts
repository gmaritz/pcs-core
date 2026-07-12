export const Permissions = {

  USERS_READ: 'users.read',

  USERS_WRITE: 'users.write',

  PRODUCTS_READ: 'products.read',

  PRODUCTS_WRITE: 'products.write',

  ORDERS_READ: 'orders.read',

  ORDERS_WRITE: 'orders.write',

  CUSTOMERS_READ: 'customers.read',

  CUSTOMERS_WRITE: 'customers.write',

  INVENTORY_READ: 'inventory.read',

  INVENTORY_WRITE: 'inventory.write',

  SUPPLIERS_READ: 'suppliers.read',

  SUPPLIERS_WRITE: 'suppliers.write',

  PAYMENTS_READ: 'payments.read',

  PAYMENTS_WRITE: 'payments.write',

  SETTINGS_MANAGE: 'settings.manage',

} as const;

export type PermissionCode =
  typeof Permissions[
    keyof typeof Permissions
  ];

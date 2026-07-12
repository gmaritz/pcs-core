// ==========================================================
// Imports
// ==========================================================

import { BaseService } from '../../shared/services/BaseService';

import {
  Permissions,
  type PermissionCode,
} from '../types/permissions';
import {
  Roles,
  type RoleName,
} from '../types/roles';

// ==========================================================
// Authorization Service
// ==========================================================

export class AuthorizationService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  async hasPermission(
    userId: string,
    permission: PermissionCode,
  ): Promise<boolean> {

    const user = await this.db.user.findUnique({

      where: { id: userId },

      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },

    });

    if (!user?.role) {
      return false;
    }

    return user.role.permissions.some(
      (rolePermission) =>
        rolePermission.permission.code === permission,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async seedAuthorizationData(): Promise<void> {

    const roleDefinitions: Array<{
      name: RoleName;
      description: string;
    }> = [
      {
        name: Roles.ADMINISTRATOR,
        description: 'System administrator role.',
      },
      {
        name: Roles.MANAGER,
        description: 'Management role.',
      },
      {
        name: Roles.SALES,
        description: 'Sales role.',
      },
      {
        name: Roles.CUSTOMER,
        description: 'Customer role.',
      },
    ];

    for (const role of roleDefinitions) {

      await this.db.role.upsert({

        where: {
          name: role.name,
        },

        update: {
          description: role.description,
        },

        create: {
          name: role.name,
          description: role.description,
        },

      });

    }

    const permissionDefinitions: Array<{
      code: PermissionCode;
      name: string;
      description: string;
    }> = [
      {
        code: Permissions.USERS_READ,
        name: 'Users Read',
        description: 'Read users.',
      },
      {
        code: Permissions.USERS_WRITE,
        name: 'Users Write',
        description: 'Create, update and delete users.',
      },
      {
        code: Permissions.PRODUCTS_READ,
        name: 'Products Read',
        description: 'Read products.',
      },
      {
        code: Permissions.PRODUCTS_WRITE,
        name: 'Products Write',
        description: 'Create, update and delete products.',
      },
      {
        code: Permissions.ORDERS_READ,
        name: 'Orders Read',
        description: 'Read orders.',
      },
      {
        code: Permissions.ORDERS_WRITE,
        name: 'Orders Write',
        description: 'Create, update and delete orders.',
      },
      {
        code: Permissions.CUSTOMERS_READ,
        name: 'Customers Read',
        description: 'Read customers.',
      },
      {
        code: Permissions.CUSTOMERS_WRITE,
        name: 'Customers Write',
        description: 'Create, update and delete customers.',
      },
      {
        code: Permissions.INVENTORY_READ,
        name: 'Inventory Read',
        description: 'Read inventory.',
      },
      {
        code: Permissions.INVENTORY_WRITE,
        name: 'Inventory Write',
        description: 'Create, update and delete inventory.',
      },
      {
        code: Permissions.SUPPLIERS_READ,
        name: 'Suppliers Read',
        description: 'Read suppliers.',
      },
      {
        code: Permissions.SUPPLIERS_WRITE,
        name: 'Suppliers Write',
        description: 'Create, update and delete suppliers.',
      },
      {
        code: Permissions.PAYMENTS_READ,
        name: 'Payments Read',
        description: 'Read payments.',
      },
      {
        code: Permissions.PAYMENTS_WRITE,
        name: 'Payments Write',
        description: 'Create, update and delete payments.',
      },
      {
        code: Permissions.SETTINGS_MANAGE,
        name: 'Settings Manage',
        description: 'Manage platform settings.',
      },
    ];

    for (const permission of permissionDefinitions) {

      await this.db.permission.upsert({

        where: {
          code: permission.code,
        },

        update: {
          name: permission.name,
          description: permission.description,
        },

        create: {
          code: permission.code,
          name: permission.name,
          description: permission.description,
        },

      });

    }

    const administratorRole =
      await this.db.role.findUnique({

        where: {
          name: Roles.ADMINISTRATOR,
        },

      });

    if (!administratorRole) {
      return;
    }

    const allPermissions =
      await this.db.permission.findMany();

    for (const permission of allPermissions) {

      await this.db.rolePermission.upsert({

        where: {
          roleId_permissionId: {
            roleId: administratorRole.id,
            permissionId: permission.id,
          },
        },

        update: {},

        create: {
          roleId: administratorRole.id,
          permissionId: permission.id,
        },

      });

    }

    await this.db.user.updateMany({

      where: {
        email: 'admin@procourtsports.co.za',
      },

      data: {
        roleId: administratorRole.id,
      },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const authorizationService =
  new AuthorizationService();

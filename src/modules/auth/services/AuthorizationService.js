"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationService = exports.AuthorizationService = void 0;
const BaseService_1 = require("../../shared/services/BaseService");
const permissions_1 = require("../types/permissions");
const roles_1 = require("../types/roles");
// ==========================================================
// Authorization Service
// ==========================================================
class AuthorizationService extends BaseService_1.BaseService {
    // ========================================================
    // Queries
    // ========================================================
    async hasPermission(userId, permission) {
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
        return user.role.permissions.some((rolePermission) => rolePermission.permission.code === permission);
    }
    // ========================================================
    // Commands
    // ========================================================
    async seedAuthorizationData() {
        const roleDefinitions = [
            {
                name: roles_1.Roles.ADMINISTRATOR,
                description: 'System administrator role.',
            },
            {
                name: roles_1.Roles.MANAGER,
                description: 'Management role.',
            },
            {
                name: roles_1.Roles.SALES,
                description: 'Sales role.',
            },
            {
                name: roles_1.Roles.CUSTOMER,
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
        const permissionDefinitions = [
            {
                code: permissions_1.Permissions.USERS_READ,
                name: 'Users Read',
                description: 'Read users.',
            },
            {
                code: permissions_1.Permissions.USERS_WRITE,
                name: 'Users Write',
                description: 'Create, update and delete users.',
            },
            {
                code: permissions_1.Permissions.PRODUCTS_READ,
                name: 'Products Read',
                description: 'Read products.',
            },
            {
                code: permissions_1.Permissions.PRODUCTS_WRITE,
                name: 'Products Write',
                description: 'Create, update and delete products.',
            },
            {
                code: permissions_1.Permissions.ORDERS_READ,
                name: 'Orders Read',
                description: 'Read orders.',
            },
            {
                code: permissions_1.Permissions.ORDERS_WRITE,
                name: 'Orders Write',
                description: 'Create, update and delete orders.',
            },
            {
                code: permissions_1.Permissions.CUSTOMERS_READ,
                name: 'Customers Read',
                description: 'Read customers.',
            },
            {
                code: permissions_1.Permissions.CUSTOMERS_WRITE,
                name: 'Customers Write',
                description: 'Create, update and delete customers.',
            },
            {
                code: permissions_1.Permissions.INVENTORY_READ,
                name: 'Inventory Read',
                description: 'Read inventory.',
            },
            {
                code: permissions_1.Permissions.INVENTORY_WRITE,
                name: 'Inventory Write',
                description: 'Create, update and delete inventory.',
            },
            {
                code: permissions_1.Permissions.SUPPLIERS_READ,
                name: 'Suppliers Read',
                description: 'Read suppliers.',
            },
            {
                code: permissions_1.Permissions.SUPPLIERS_WRITE,
                name: 'Suppliers Write',
                description: 'Create, update and delete suppliers.',
            },
            {
                code: permissions_1.Permissions.PAYMENTS_READ,
                name: 'Payments Read',
                description: 'Read payments.',
            },
            {
                code: permissions_1.Permissions.PAYMENTS_WRITE,
                name: 'Payments Write',
                description: 'Create, update and delete payments.',
            },
            {
                code: permissions_1.Permissions.SETTINGS_MANAGE,
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
        const administratorRole = await this.db.role.findUnique({
            where: {
                name: roles_1.Roles.ADMINISTRATOR,
            },
        });
        if (!administratorRole) {
            return;
        }
        const allPermissions = await this.db.permission.findMany();
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
exports.AuthorizationService = AuthorizationService;
// ==========================================================
// Service Instance
// ==========================================================
exports.authorizationService = new AuthorizationService();

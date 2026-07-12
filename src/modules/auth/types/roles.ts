export const Roles = {

  ADMINISTRATOR: 'Administrator',

  MANAGER: 'Manager',

  SALES: 'Sales',

  CUSTOMER: 'Customer',

} as const;

export type RoleName =
  typeof Roles[
    keyof typeof Roles
  ];

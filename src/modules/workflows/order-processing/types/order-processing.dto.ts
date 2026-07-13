// ==========================================================
// Order Processing DTOs
// ==========================================================

import {
  Inventory,
  InventoryMovement,
  Order,
} from '@prisma/client';

export interface ProcessOrderDto {

  orderId: string;

}

export interface ProcessOrderResultDto {

  order: Order;

  inventoryMovements: InventoryMovement[];

  inventory: Inventory[];

}

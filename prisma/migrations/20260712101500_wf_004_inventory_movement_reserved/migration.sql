-- Add RESERVED movement type for WF-004 order processing reservations.
ALTER TYPE "InventoryMovementType"
ADD VALUE IF NOT EXISTS 'RESERVED';

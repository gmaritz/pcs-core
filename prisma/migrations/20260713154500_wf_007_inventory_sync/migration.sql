-- Add SYNC movement type for WF-007 inventory synchronisation.
ALTER TYPE "InventoryMovementType"
ADD VALUE IF NOT EXISTS 'SYNC';

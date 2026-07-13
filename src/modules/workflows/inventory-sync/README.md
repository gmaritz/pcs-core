# WF-007 Inventory Synchronisation

This workflow synchronises supplier inventory quantities into PCS Core inventory and records an audit trail through inventory movements.

## Endpoint

POST /api/v1/inventory/sync

## Request body

{
  "supplierId": "<supplier-id>",
  "products": [
    {
      "supplierSku": "WR125001",
      "quantity": 18
    }
  ]
}

## Notes

- The request body can later be replaced by normalized supplier data from WF-006.
- Inventory updates and inventory movements run in a single transaction.
- Unchanged quantities are skipped without database writes.

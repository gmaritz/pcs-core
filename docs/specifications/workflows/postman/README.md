# WF-007 Postman Assets

Import the collection and environment below into Postman:

- WF-007-Inventory-Synchronisation.postman_collection.json
- WF-007-Inventory-Synchronisation.postman_environment.json

Set `accessToken` and `supplierId`, then run the requests in this order:

1. 200 - Synchronise inventory successfully
2. 400 - Validation failure
3. 404 - Supplier not found
4. 404 - Supplier SKU not found
5. 500 - Forced rollback verification

The malformed JSON request is included for manual testing of parser failures.

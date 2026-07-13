"use strict";
// ==========================================================
// Supplier Adapter Factory
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierAdapterFactory = exports.SupplierAdapterFactory = void 0;
const adapters_1 = require("../adapters");
const types_1 = require("../types");
class SupplierAdapterFactory {
    create(feedType) {
        switch (feedType) {
            case types_1.SupplierFeedType.JSON:
                return adapters_1.jsonSupplierAdapter;
            default:
                throw new Error(`Unsupported supplier feed type: ${feedType}.`);
        }
    }
}
exports.SupplierAdapterFactory = SupplierAdapterFactory;
exports.supplierAdapterFactory = new SupplierAdapterFactory();

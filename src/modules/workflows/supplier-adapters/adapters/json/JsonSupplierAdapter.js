"use strict";
// ==========================================================
// JSON Supplier Adapter
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonSupplierAdapter = exports.JsonSupplierAdapter = void 0;
const normalizers_1 = require("../../../supplier-feed-import/normalizers");
class JsonSupplierAdapter {
    async parse(source) {
        const parsed = JSON.parse(source);
        if (!Array.isArray(parsed)) {
            throw new Error('Invalid JSON import payload. Expected an array.');
        }
        const records = parsed;
        return Promise.all(records.map((record) => normalizers_1.supplierProductNormalizer.normalize(record)));
    }
}
exports.JsonSupplierAdapter = JsonSupplierAdapter;
exports.jsonSupplierAdapter = new JsonSupplierAdapter();

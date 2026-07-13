"use strict";
// ==========================================================
// Supplier JSON Parser
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierJsonParser = exports.SupplierJsonParser = void 0;
const normalizers_1 = require("../normalizers");
class SupplierJsonParser {
    async parse(input) {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed)) {
            throw new Error('Invalid JSON import payload. Expected an array.');
        }
        const records = parsed;
        return Promise.all(records.map((record) => normalizers_1.supplierProductNormalizer.normalize(record)));
    }
}
exports.SupplierJsonParser = SupplierJsonParser;
exports.supplierJsonParser = new SupplierJsonParser();

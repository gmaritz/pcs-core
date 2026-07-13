"use strict";
// ==========================================================
// Supplier JSON Parser
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierJsonParser = exports.SupplierJsonParser = void 0;
class SupplierJsonParser {
    parse(input) {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed)) {
            throw new Error('Invalid JSON import payload. Expected an array.');
        }
        return parsed;
    }
}
exports.SupplierJsonParser = SupplierJsonParser;
exports.supplierJsonParser = new SupplierJsonParser();

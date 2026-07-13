"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSearchWorkflowService = exports.ProductSearchWorkflowService = void 0;
const search_1 = require("../../../search");
// ==========================================================
// Product Search Workflow Service
// ==========================================================
class ProductSearchWorkflowService {
    async search(query) {
        return search_1.productSearchController.search(query);
    }
}
exports.ProductSearchWorkflowService = ProductSearchWorkflowService;
exports.productSearchWorkflowService = new ProductSearchWorkflowService();

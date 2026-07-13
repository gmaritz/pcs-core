"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSearchController = exports.ProductSearchController = void 0;
const services_1 = require("../services");
// ==========================================================
// Product Search Controller
// ==========================================================
class ProductSearchController {
    async search(request) {
        return services_1.productSearchService.search(request);
    }
}
exports.ProductSearchController = ProductSearchController;
exports.productSearchController = new ProductSearchController();

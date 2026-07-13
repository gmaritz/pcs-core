"use strict";
// ==========================================================
// Imports
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierAdapterService = exports.SupplierAdapterService = exports.SupplierAdapterServiceError = void 0;
const import_1 = require("../../../../shared/import");
const services_1 = require("../../supplier-feed-import/services");
const factories_1 = require("../factories");
const types_1 = require("../types");
// ==========================================================
// Errors
// ==========================================================
class SupplierAdapterServiceError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.name = 'SupplierAdapterServiceError';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
exports.SupplierAdapterServiceError = SupplierAdapterServiceError;
// ==========================================================
// Supplier Adapter Service
// ==========================================================
class SupplierAdapterService {
    async importJson(dto) {
        const source = await this.loadSource(dto.file);
        const adapter = factories_1.supplierAdapterFactory.create(types_1.SupplierFeedType.JSON);
        const products = await this.parseJson(adapter, source);
        const framework = new import_1.ImportFramework(new import_1.ImportPipeline({
            import: (normalizedProducts) => services_1.supplierImportService.importNormalizedProducts(dto.supplierId, normalizedProducts),
        }));
        const result = await framework.run(products);
        return result.summary;
    }
    async loadSource(file) {
        try {
            return await services_1.supplierImportService.loadSample(file);
        }
        catch (error) {
            if (error instanceof services_1.SupplierImportServiceError) {
                throw error;
            }
            throw new SupplierAdapterServiceError('Sample file not found.', 400);
        }
    }
    async parseJson(adapter, source) {
        try {
            return await adapter.parse(source);
        }
        catch {
            throw new SupplierAdapterServiceError('Invalid JSON.', 400);
        }
    }
}
exports.SupplierAdapterService = SupplierAdapterService;
exports.supplierAdapterService = new SupplierAdapterService();

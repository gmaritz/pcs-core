"use strict";
// ==========================================================
// Imports
// ==========================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierImportService = exports.SupplierImportService = exports.SupplierImportServiceError = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const BaseService_1 = require("../../../shared/services/BaseService");
const parsers_1 = require("../parsers");
const importers_1 = require("../importers");
const validators_1 = require("../validators");
// ==========================================================
// Errors
// ==========================================================
class SupplierImportServiceError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.name = 'SupplierImportServiceError';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
exports.SupplierImportServiceError = SupplierImportServiceError;
// ==========================================================
// Supplier Import Service
// ==========================================================
class SupplierImportService extends BaseService_1.BaseService {
    async importProducts(dto) {
        const sample = await this.loadSample(dto.file);
        const products = await this.parse(sample);
        return this.importNormalizedProducts(dto.supplierId, products);
    }
    async importNormalizedProducts(supplierId, products) {
        const supplier = await this.db.supplier.findUnique({
            where: {
                id: supplierId,
            },
        });
        if (!supplier) {
            throw new SupplierImportServiceError('Supplier not found.', 404);
        }
        const references = await this.loadReferenceData();
        await this.validate(products);
        return this.import(supplierId, products, references);
    }
    async loadSample(file) {
        const baseName = node_path_1.default.basename(file);
        const samplePath = node_path_1.default.resolve(process.cwd(), 'src/modules/workflows/supplier-feed-import/sample-data', baseName);
        try {
            return await (0, promises_1.readFile)(samplePath, 'utf8');
        }
        catch {
            throw new SupplierImportServiceError('Sample file not found.', 400);
        }
    }
    async parse(content) {
        try {
            return await parsers_1.supplierJsonParser.parse(content);
        }
        catch {
            throw new SupplierImportServiceError('Invalid JSON.', 400);
        }
    }
    async validate(products) {
        const validationResults = await Promise.all(products.map((product) => validators_1.supplierImportValidator.validate(product)));
        const errors = validationResults.flatMap((result, index) => (result.valid
            ? []
            : result.errors.map((error) => `Row ${index + 1}: ${error}`)));
        if (errors.length > 0) {
            throw new SupplierImportServiceError('Validation failed.', 400, errors);
        }
    }
    async import(supplierId, products, references) {
        return this.db.$transaction(async (tx) => {
            const importer = new importers_1.SupplierProductImporter(tx, supplierId, references);
            return importer.import(products);
        });
    }
    async loadReferenceData() {
        const [brands, categories, sports] = await Promise.all([
            this.db.brand.findMany(),
            this.db.category.findMany(),
            this.db.sport.findMany(),
        ]);
        const brandsByName = new Map(brands.map((brand) => [
            brand.name.trim().toLowerCase(),
            brand,
        ]));
        const categoriesByName = new Map(categories.map((category) => [
            category.name.trim().toLowerCase(),
            category,
        ]));
        const sportsByName = new Map(sports.map((sport) => [
            sport.name.trim().toLowerCase(),
            sport,
        ]));
        return {
            brandsByName,
            categoriesByName,
            sportsByName,
        };
    }
}
exports.SupplierImportService = SupplierImportService;
// ==========================================================
// Service Instance
// ==========================================================
exports.supplierImportService = new SupplierImportService();

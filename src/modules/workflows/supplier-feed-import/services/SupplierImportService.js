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
const normalizers_1 = require("../normalizers");
const validators_1 = require("../validators");
const importers_1 = require("../importers");
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
        const supplier = await this.db.supplier.findUnique({
            where: {
                id: dto.supplierId,
            },
        });
        if (!supplier) {
            throw new SupplierImportServiceError('Supplier not found.', 404);
        }
        const sample = await this.loadSample(dto.file);
        const parsed = this.parse(sample);
        const normalized = this.normalize(parsed);
        const references = await this.loadReferenceData();
        this.validate(normalized, references);
        return this.import(dto.supplierId, normalized, references);
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
    parse(content) {
        try {
            return parsers_1.supplierJsonParser.parse(content);
        }
        catch {
            throw new SupplierImportServiceError('Invalid JSON.', 400);
        }
    }
    normalize(records) {
        return normalizers_1.supplierProductNormalizer.normalize(records);
    }
    validate(records, references) {
        const errors = validators_1.supplierImportValidator.validate(records, references);
        if (errors.length > 0) {
            throw new SupplierImportServiceError('Validation failed.', 400, errors);
        }
    }
    async import(supplierId, records, references) {
        return this.db.$transaction(async (tx) => {
            const importer = new importers_1.SupplierProductImporter(tx, supplierId, references);
            const result = await importer.importRecords(records);
            return this.createSummary(records.length, result);
        });
    }
    createSummary(processed, values) {
        return {
            processed,
            ...values,
            errors: [],
        };
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

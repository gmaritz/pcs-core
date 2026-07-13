"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportPipeline = void 0;
class ImportPipeline {
    constructor(importer) {
        this.importer = importer;
    }
    async execute(products) {
        const summary = await this.importer.import(products);
        return {
            success: true,
            summary,
        };
    }
}
exports.ImportPipeline = ImportPipeline;

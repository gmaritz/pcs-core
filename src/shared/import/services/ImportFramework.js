"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportFramework = void 0;
class ImportFramework {
    constructor(pipeline) {
        this.pipeline = pipeline;
    }
    async run(products) {
        return this.pipeline.execute(products);
    }
}
exports.ImportFramework = ImportFramework;

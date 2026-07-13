"use strict";
// ==========================================================
// Default Markup Rule
// ==========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMarkupRule = exports.DefaultMarkupRule = void 0;
class DefaultMarkupRule {
    getMarkupPercentage() {
        return DefaultMarkupRule.DEFAULT_MARKUP_PERCENTAGE;
    }
}
exports.DefaultMarkupRule = DefaultMarkupRule;
DefaultMarkupRule.DEFAULT_MARKUP_PERCENTAGE = 35;
exports.defaultMarkupRule = new DefaultMarkupRule();

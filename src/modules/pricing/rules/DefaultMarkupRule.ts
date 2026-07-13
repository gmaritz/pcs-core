// ==========================================================
// Default Markup Rule
// ==========================================================

export class DefaultMarkupRule {

  private static readonly DEFAULT_MARKUP_PERCENTAGE = 35;

  getMarkupPercentage(): number {

    return DefaultMarkupRule.DEFAULT_MARKUP_PERCENTAGE;

  }

}

export const defaultMarkupRule =
  new DefaultMarkupRule();

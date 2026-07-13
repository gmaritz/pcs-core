// ==========================================================
// Price Calculator
// ==========================================================

export class PriceCalculator {

  calculateSellingPrice(
    supplierCost: number,
    markupPercentage: number,
  ): number {

    const sellingPrice =
      supplierCost * (1 + (markupPercentage / 100));

    return this.roundPrice(
      sellingPrice,
    );

  }

  calculateMarkup(
    supplierCost: number,
    sellingPrice: number,
  ): number {

    if (supplierCost <= 0) {
      return 0;
    }

    const markup =
      ((sellingPrice - supplierCost) / supplierCost) * 100;

    return this.roundPrice(
      markup,
    );

  }

  roundPrice(
    value: number,
  ): number {

    return Math.round((value + Number.EPSILON) * 100) / 100;

  }

}

export const priceCalculator =
  new PriceCalculator();

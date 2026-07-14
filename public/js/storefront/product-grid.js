(function () {
  function initProductGrid() {
    var cards = document.querySelectorAll('[data-product-grid] .product-card');

    cards.forEach(function (card, index) {
      if (index === 0) {
        card.classList.add('is-highlighted');
      }
    });
  }

  window.StorefrontProductGrid = {
    init: initProductGrid,
  };
})();

(function () {
  function safeInit(feature) {
    if (feature && typeof feature.init === 'function') {
      feature.init();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    safeInit(window.StorefrontNavigation);
    safeInit(window.StorefrontSearch);
    safeInit(window.StorefrontFilters);
    safeInit(window.StorefrontProductGrid);
    safeInit(window.StorefrontCatalogue);
  });
})();

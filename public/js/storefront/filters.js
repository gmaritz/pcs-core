(function () {
  function initFilters() {
    var filterElements = document.querySelectorAll('[data-storefront-filter]');

    filterElements.forEach(function (element) {
      element.addEventListener('change', function () {
        // WF-010A keeps filters static; this handler reserves extension points.
      });
    });
  }

  window.StorefrontFilters = {
    init: initFilters,
  };
})();

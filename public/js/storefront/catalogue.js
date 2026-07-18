(function () {
  function initCatalogue() {
    var toggle = document.querySelector('[data-catalogue-filter-toggle]');
    var drawer = document.querySelector('[data-catalogue-filter-drawer]');

    if (!toggle || !drawer) {
      return;
    }

    toggle.addEventListener('click', function () {
      var isOpen = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  window.StorefrontCatalogue = {
    init: initCatalogue,
  };
})();

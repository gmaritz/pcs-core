(function () {
  function initSearch() {
    var forms = document.querySelectorAll('[data-storefront-search]');

    forms.forEach(function (form) {
      form.addEventListener('submit', function () {
        var button = form.querySelector('button[type="submit"]');

        if (button instanceof HTMLButtonElement) {
          button.disabled = true;
          button.textContent = 'Searching...';
        }
      });
    });
  }

  window.StorefrontSearch = {
    init: initSearch,
  };
})();

(function () {
  function bindScrollHeader(header) {
    var syncHeader = function () {
      if (window.scrollY > 12) {
        header.classList.add('is-scrolled');
        return;
      }

      header.classList.remove('is-scrolled');
    };

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  function bindSectionReveal() {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    var sections = document.querySelectorAll('.hp-reveal');

    if (!sections.length) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initNavigation() {
    var toggle = document.querySelector('[data-home-nav-toggle]');
    var header = document.querySelector('[data-home-header]');

    if (!header) {
      return;
    }

    bindScrollHeader(header);
    bindSectionReveal();

    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  window.StorefrontNavigation = {
    init: initNavigation,
  };
})();

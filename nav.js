(function () {

  function loadCSS() {
    if (document.querySelector('link[data-shared-nav-css]')) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'nav.css';
    link.dataset.sharedNavCss = 'true';

    document.head.appendChild(link);
  }

  async function loadNavigation() {

    loadCSS();

    const container = document.getElementById('site-nav');

    if (!container) {
      return;
    }

    try {

      const response = await fetch('nav.html', {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to load nav.html');
      }

      container.innerHTML = await response.text();

      setupDropdowns();
      setupMobileMenu();
      loadInsights();

    } catch (error) {

      console.error(
        'Shared navigation error:',
        error
      );

    }
  }

  function setupDropdowns() {

    const buttons = document.querySelectorAll(
      '#site-nav .shared-dropdown-toggle'
    );

    buttons.forEach(function (button) {

      button.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          const item =
            button.closest('.shared-nav-item');

          document
            .querySelectorAll(
              '#site-nav .shared-nav-item.open'
            )
            .forEach(function (other) {

              if (other !== item) {
                other.classList.remove('open');
              }

            });

          item.classList.toggle('open');

        }
      );

    });

    document.addEventListener(
      'click',
      function (event) {

        if (
          !event.target.closest(
            '#site-nav .shared-nav-item'
          )
        ) {

          document
            .querySelectorAll(
              '#site-nav .shared-nav-item.open'
            )
            .forEach(function (item) {

              item.classList.remove('open');

            });

        }

      }
    );

  }

  function setupMobileMenu() {

    const toggle =
      document.getElementById(
        'mobile-menu-toggle'
      );

    const nav =
      document.getElementById(
        'main-nav'
      );

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener(
      'click',
      function () {

        nav.classList.toggle(
          'mobile-open'
        );

      }
    );

  }

  async function loadInsights() {

    const container =
      document.getElementById(
        'shared-insights-dropdown'
      );

    if (!container) {
      return;
    }

    const insightGroups = {

      'Vehicle Monitors': [
        'how-to-choose-vehicle-monitor.html',
        '1920x1080-vs-1024x600.html',
        'what-brightness-does-a-vehicle-monitor-need.html',
        'why-vehicle-monitor-has-emi-problems.html',
        'Why Is an Automotive Touchscreen Different from a Normal Tablet.html',
        'why-vehicle-monitors-use-m12-connectors.html',
        'bench-test-vs-installation.html'
      ],

      'SVM / AVM': [
        'monitor-as-hmi-in-svm-system.html',
        'svm-display-resolution-system-matching.html',
        'why-svm-avm-needs-proper-display-interface.html',
        'when-does-an-svm-monitor-need-touch.html',
        '5-things-to-check-when-connecting-svm-box-to-vehicle-monitor.html',
        'hdmi-vs-ahd-vehicle-camera-system.html'
      ],

      'Vehicle Safety': [
        'why-wiring-matters.html',
        'why-vehicle-camera-image-quality-changes-after-installation.html'
      ],

      'Wiring & Connectivity': [
        'why-cables-can-matter-more-than-power-supply.html'
      ]

    };

    try {

      const response =
        await fetch('articles.json', {
          cache: 'no-store'
        });

      if (!response.ok) {
        throw new Error(
          'Failed to load articles.json'
        );
      }

      const articles =
        await response.json();

      const articleMap = {};

      articles.forEach(function (article) {
        articleMap[article.file] = article;
      });

      container.innerHTML = '';

      Object.entries(
        insightGroups
      ).forEach(
        function ([groupName, files]) {

          const title =
            document.createElement('div');

          title.style.fontWeight = '700';
          title.style.padding = '8px 12px 5px';
          title.style.color = '#111827';
          title.style.fontSize = '12px';

          title.textContent = groupName;

          container.appendChild(title);

          files.forEach(function (fileName) {

            const article =
              articleMap[fileName];

            if (!article) {
              return;
            }

            const link =
              document.createElement('a');

            link.href = fileName;

            link.textContent =
              article.title || fileName;

            container.appendChild(link);

          });

        }
      );

    } catch (error) {

      console.error(
        'Failed to load shared INSIGHTS:',
        error
      );

      container.innerHTML =
        '<div class="shared-dropdown-loading">Unable to load articles.</div>';

    }

  }

  loadNavigation();

})();

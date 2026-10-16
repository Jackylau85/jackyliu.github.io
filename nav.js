
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
    if (!container) return;

    try {
      const response = await fetch('nav.html', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Failed to load nav.html');
      }

      container.innerHTML = await response.text();

      setupDropdowns();
      setupMobileMenu();
      loadInsights();
    } catch (error) {
      console.error('Shared navigation error:', error);
    }
  }

  function setupDropdowns() {
    const buttons = document.querySelectorAll(
      '#site-nav .shared-dropdown-toggle'
    );

    buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const item = button.closest('.shared-nav-item');
        if (!item) return;

        document
          .querySelectorAll('#site-nav .shared-nav-item.open')
          .forEach(function (other) {
            if (other !== item) {
              other.classList.remove('open');
            }
          });

        item.classList.toggle('open');
      });
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('#site-nav .shared-nav-item')) {
        document
          .querySelectorAll('#site-nav .shared-nav-item.open')
          .forEach(function (item) {
            item.classList.remove('open');
          });
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        document
          .querySelectorAll('#site-nav .shared-nav-item.open')
          .forEach(function (item) {
            item.classList.remove('open');
          });
      }
    });
  }

  function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('main-nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      nav.classList.toggle('mobile-open');
    });
  }

  function addInsightsStyles() {
    if (document.getElementById('shared-insights-styles')) return;

    const style = document.createElement('style');
    style.id = 'shared-insights-styles';

    style.textContent = `
      #shared-insights-dropdown .insight-category {
        border-bottom: 1px solid #e5e7eb;
      }

      #shared-insights-dropdown .insight-category:last-child {
        border-bottom: none;
      }

      #shared-insights-dropdown .insight-category-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 11px 14px;
        border: 0;
        background: transparent;
        color: #111827;
        font: inherit;
        font-size: 13px;
        font-weight: 600;
        text-align: left;
        cursor: pointer;
      }

      #shared-insights-dropdown .insight-category-toggle:hover {
        background: #f3f4f6;
      }

      #shared-insights-dropdown .insight-category-arrow {
        flex: 0 0 auto;
        font-size: 11px;
        transition: transform 0.18s ease;
      }

      #shared-insights-dropdown .insight-category.expanded
      .insight-category-arrow {
        transform: rotate(90deg);
      }

      #shared-insights-dropdown .insight-article-list {
        display: none;
        padding: 0 0 7px;
      }

      #shared-insights-dropdown .insight-category.expanded
      .insight-article-list {
        display: block;
      }

      #shared-insights-dropdown .insight-article-list a {
        display: block;
        padding: 8px 14px 8px 28px;
        color: #374151;
        font-size: 12px;
        line-height: 1.5;
        text-decoration: none;
        white-space: normal;
      }

      #shared-insights-dropdown .insight-article-list a:hover {
        background: #f3f4f6;
        color: #111827;
      }

      #shared-insights-dropdown .insight-empty {
        padding: 7px 28px 12px;
        color: #6b7280;
        font-size: 12px;
        line-height: 1.5;
      }
    `;

    document.head.appendChild(style);
  }

  async function loadInsights() {
    const container = document.getElementById(
      'shared-insights-dropdown'
    );

    if (!container) return;

    /*
     * Each article belongs to one category only.
     * Add new article filenames to the appropriate array below.
     */
    const insightGroups = [
      {
        name: 'International Logistics',
        files: []
      },
      {
        name: 'Wire & Cable',
        files: [
          'why-cables-can-matter-more-than-power-supply.html',
          'why-wiring-matters.html'
        ]
      },
      {
        name: 'Monitors',
        files: [
          'how-to-choose-vehicle-monitor.html',
          '1920x1080-vs-1024x600.html',
          'what-brightness-does-a-vehicle-monitor-need.html',
          'why-vehicle-monitor-has-emi-problems.html',
          'Why Is an Automotive Touchscreen Different from a Normal Tablet.html',
          'why-vehicle-monitors-use-m12-connectors.html',
          'bench-test-vs-installation.html',
          'when-does-an-svm-monitor-need-touch.html'
        ]
      },
      {
        name: 'Cameras',
        files: [
          'why-vehicle-camera-image-quality-changes-after-installation.html',
          'hdmi-vs-ahd-vehicle-camera-system.html'
        ]
      },
      {
        name: 'MDVR',
        files: []
      },
      {
        name: 'SVM / AVM',
        files: [
          'monitor-as-hmi-in-svm-system.html',
          'svm-display-resolution-system-matching.html',
          'why-svm-avm-needs-proper-display-interface.html',
          '5-things-to-check-when-connecting-svm-box-to-vehicle-monitor.html'
        ]
      }
    ];

    addInsightsStyles();

    try {
      const response = await fetch('articles.json', {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to load articles.json');
      }

      const articles = await response.json();
      const articleMap = {};

      articles.forEach(function (article) {
        if (article && article.file && article.file !== 'nav.html') {
          articleMap[article.file] = article;
        }
      });

      container.innerHTML = '';

      insightGroups.forEach(function (group, index) {
        const section = document.createElement('div');
        section.className = 'insight-category';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'insight-category-toggle';
        button.setAttribute('aria-expanded', 'false');

        const label = document.createElement('span');
        label.textContent = group.name;

        const arrow = document.createElement('span');
        arrow.className = 'insight-category-arrow';
        arrow.textContent = '▶';
        arrow.setAttribute('aria-hidden', 'true');

        button.appendChild(label);
        button.appendChild(arrow);

        const list = document.createElement('div');
        list.className = 'insight-article-list';
        list.id = 'insight-articles-' + index;

        button.setAttribute('aria-controls', list.id);

        button.addEventListener('click', function (event) {
          event.preventDefault();

          const willExpand = !section.classList.contains('expanded');

          section.classList.toggle('expanded', willExpand);
          button.setAttribute('aria-expanded', String(willExpand));
        });

        let articleCount = 0;

        group.files.forEach(function (fileName) {
          const article = articleMap[fileName];

          // Do not create broken links for articles not found in articles.json.
          if (!article) return;

          const link = document.createElement('a');
          link.href = fileName;
          link.textContent = article.title || fileName;
          list.appendChild(link);
          articleCount += 1;
        });

        if (articleCount === 0) {
          const empty = document.createElement('div');
          empty.className = 'insight-empty';
          empty.textContent = 'Articles coming soon.';
          list.appendChild(empty);
        }

        section.appendChild(button);
        section.appendChild(list);
        container.appendChild(section);
      });
    } catch (error) {
      console.error('Failed to load shared INSIGHTS:', error);

      container.innerHTML = '';

      const message = document.createElement('div');
      message.className = 'shared-dropdown-loading';
      message.textContent = 'Unable to load articles.';
      container.appendChild(message);
    }
  }

  loadNavigation();
})();

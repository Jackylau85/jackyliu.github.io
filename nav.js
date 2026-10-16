
(function () {
  "use strict";

  const ARTICLE_INDEX = "articles.json";
  const NAVIGATION_FILE = "nav.html";

  // Articles are grouped by their main topic.
  // Add new article filenames to the appropriate category.
  const INSIGHT_GROUPS = [
    {
      name: "International Logistics",
      articles: []
    },
    {
      name: "Wire & Cable",
      articles: [
        "why-cables-can-matter-more-than-power-supply.html",
        "why-wiring-matters.html"
      ]
    },
    {
      name: "Monitors",
      articles: [
        "how-to-choose-vehicle-monitor.html",
        "1920x1080-vs-1024x600.html",
        "what-brightness-does-a-vehicle-monitor-need.html",
        "why-vehicle-monitor-has-emi-problems.html",
        "Why Is an Automotive Touchscreen Different from a Normal Tablet.html",
        "why-vehicle-monitors-use-m12-connectors.html",
        "bench-test-vs-installation.html",
        "when-does-an-svm-monitor-need-touch.html"
      ]
    },
    {
      name: "Cameras",
      articles: [
        "why-vehicle-camera-image-quality-changes-after-installation.html",
        "hdmi-vs-ahd-vehicle-camera-system.html"
      ]
    },
    {
      name: "MDVR",
      articles: []
    },
    {
      name: "SVM / AVM",
      articles: [
        "monitor-as-hmi-in-svm-system.html",
        "svm-display-resolution-system-matching.html",
        "why-svm-avm-needs-proper-display-interface.html",
        "5-things-to-check-when-connecting-svm-box-to-vehicle-monitor.html"
      ]
    }
  ];

  function loadCSS() {
    if (document.querySelector("link[data-shared-nav-css]")) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "nav.css";
    link.dataset.sharedNavCss = "true";

    document.head.appendChild(link);
  }

  function addInsightsStyles() {
    if (document.getElementById("shared-insights-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "shared-insights-styles";

    style.textContent = `
      #shared-insights-dropdown .insight-category {
        margin: 0;
        padding: 0;
        border-bottom: 1px solid rgba(127, 127, 127, 0.16);
      }

      #shared-insights-dropdown .insight-category:last-child {
        border-bottom: none;
      }

      #shared-insights-dropdown .insight-category summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 11px 14px;
        color: inherit;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.5;
        list-style: none;
        cursor: pointer;
        user-select: none;
      }

      #shared-insights-dropdown .insight-category summary::-webkit-details-marker {
        display: none;
      }

      #shared-insights-dropdown .insight-category summary::after {
        content: "+";
        flex: 0 0 auto;
        font-size: 16px;
        font-weight: 400;
        opacity: 0.7;
      }

      #shared-insights-dropdown .insight-category[open] > summary::after {
        content: "−";
      }

      #shared-insights-dropdown .insight-category summary:hover {
        background: rgba(127, 127, 127, 0.08);
      }

      #shared-insights-dropdown .insight-articles {
        padding: 0 8px 8px 14px;
      }

      #shared-insights-dropdown .insight-articles a {
        display: block;
        padding: 8px 12px;
        border-radius: 5px;
        color: inherit;
        font-size: 12px;
        line-height: 1.55;
        white-space: normal;
        overflow-wrap: anywhere;
        text-decoration: none;
      }

      #shared-insights-dropdown .insight-articles a:hover {
        background: rgba(127, 127, 127, 0.09);
      }

      #shared-insights-dropdown .insight-empty {
        margin: 0;
        padding: 7px 12px 10px;
        color: #7b8490;
        font-size: 12px;
        line-height: 1.5;
      }

      #shared-insights-dropdown .insight-loading {
        padding: 12px;
        font-size: 13px;
      }
    `;

    document.head.appendChild(style);
  }

  async function loadNavigation() {
    loadCSS();
    addInsightsStyles();

    const container = document.getElementById("site-nav");

    if (!container) {
      return;
    }

    try {
      const response = await fetch(NAVIGATION_FILE, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Failed to load nav.html");
      }

      container.innerHTML = await response.text();

      setupDropdowns();
      setupMobileMenu();
      await loadInsights();

    } catch (error) {
      console.error("Shared navigation error:", error);
    }
  }

  function setupDropdowns() {
    const buttons = document.querySelectorAll(
      "#site-nav .shared-dropdown-toggle"
    );

    buttons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const item = button.closest(".shared-nav-item");

        if (!item) {
          return;
        }

        document
          .querySelectorAll("#site-nav .shared-nav-item.open")
          .forEach(function (other) {
            if (other !== item) {
              other.classList.remove("open");
            }
          });

        item.classList.toggle("open");
      });
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest("#site-nav .shared-nav-item")) {
        document
          .querySelectorAll("#site-nav .shared-nav-item.open")
          .forEach(function (item) {
            item.classList.remove("open");
          });
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        document
          .querySelectorAll("#site-nav .shared-nav-item.open")
          .forEach(function (item) {
            item.classList.remove("open");
          });
      }
    });
  }

  function setupMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const nav = document.getElementById("main-nav");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("mobile-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function createArticleLink(article) {
    const link = document.createElement("a");

    // Keep article links relative to the website root.
    link.href = article.file;
    link.textContent = article.title || article.file;

    return link;
  }

  function createCategory(group, articleMap) {
    const details = document.createElement("details");
    details.className = "insight-category";

    const summary = document.createElement("summary");
    summary.textContent = group.name;

    const articleList = document.createElement("div");
    articleList.className = "insight-articles";

    const matchingArticles = group.articles
      .map(function (fileName) {
        return articleMap[fileName];
      })
      .filter(Boolean);

    if (matchingArticles.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "insight-empty";
      emptyMessage.textContent = "Articles coming soon.";

      articleList.appendChild(emptyMessage);
    } else {
      matchingArticles.forEach(function (article) {
        articleList.appendChild(createArticleLink(article));
      });
    }

    details.appendChild(summary);
    details.appendChild(articleList);

    return details;
  }

  async function loadInsights() {
    const container = document.getElementById(
      "shared-insights-dropdown"
    );

    if (!container) {
      console.warn(
        "The shared-insights-dropdown element was not found in nav.html."
      );
      return;
    }

    container.replaceChildren();

    const loading = document.createElement("div");
    loading.className = "insight-loading";
    loading.textContent = "Loading article categories...";
    container.appendChild(loading);

    try {
      const response = await fetch(ARTICLE_INDEX, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Failed to load articles.json");
      }

      const articles = await response.json();

      if (!Array.isArray(articles)) {
        throw new Error("articles.json must contain an array.");
      }

      const articleMap = {};

      articles.forEach(function (article) {
        if (
          article &&
          typeof article.file === "string" &&
          article.file.trim() !== "" &&
          article.file.toLowerCase() !== "nav.html"
        ) {
          articleMap[article.file] = article;
        }
      });

      container.replaceChildren();

      INSIGHT_GROUPS.forEach(function (group) {
        container.appendChild(
          createCategory(group, articleMap)
        );
      });

    } catch (error) {
      console.error("Failed to load shared INSIGHTS:", error);

      container.replaceChildren();

      const message = document.createElement("div");
      message.className = "insight-loading";
      message.textContent = "Unable to load article categories.";

      container.appendChild(message);
    }
  }

  loadNavigation();

})();

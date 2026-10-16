```javascript
(function () {
  "use strict";

  /*
   * ============================================================
   * NAVIGATION DATA
   * ============================================================
   *
   * INSIGHTS = knowledge / technical articles
   * CASE     = real applications / customer cases
   * SOLUTION = application solutions
   *
   * Each category automatically gets a + / − button.
   *
   */

  const insightGroups = [
    {
      name: "International Logistics",
      files: []
    },
    {
      name: "Wire & Cable",
      files: [
        "why-cables-can-matter-more-than-power-supply.html",
        "why-wiring-matters.html"
      ]
    },
    {
      name: "Monitors",
      files: [
        "how-to-choose-vehicle-monitor.html",
        "1920x1080-vs-1024x600.html",
        "what-brightness-does-a-vehicle-monitor-need.html",
        "why-vehicle-monitor-has-emi-problems.html",
        "Why Is an Automotive Touchscreen Different from a Normal Tablet.html",
        "why-vehicle-monitors-use-m12-connectors.html",
        "bench-test-vs-installation.html"
      ]
    },
    {
      name: "Cameras",
      files: [
        "why-vehicle-camera-image-quality-changes-after-installation.html",
        "hdmi-vs-ahd-vehicle-camera-system.html"
      ]
    },
    {
      name: "MDVR",
      files: []
    },
    {
      name: "SVM / AVM",
      files: [
        "monitor-as-hmi-in-svm-system.html",
        "svm-display-resolution-system-matching.html",
        "why-svm-avm-needs-proper-display-interface.html",
        "when-does-an-svm-monitor-need-touch.html",
        "5-things-to-check-when-connecting-svm-box-to-vehicle-monitor.html"
      ]
    }
  ];


  const caseGroups = [
    {
      name: "Wire & Cable Applications",
      files: []
    },
    {
      name: "Forklift Safety Applications",
      files: []
    },
    {
      name: "Truck Safety Applications",
      files: []
    },
    {
      name: "Excavator Safety Applications",
      files: []
    },
    {
      name: "Bus Safety Applications",
      files: []
    },
    {
      name: "Mining Safety Applications",
      files: []
    },
    {
      name: "Marine Display Applications",
      files: []
    }
  ];


  const solutionGroups = [
    {
      name: "Forklift Safety Visualization",
      files: []
    },
    {
      name: "Truck Safety Visualization",
      files: []
    },
    {
      name: "Excavator Safety Visualization",
      files: []
    },
    {
      name: "Bus Safety Visualization",
      files: []
    },
    {
      name: "Mining Safety Visualization",
      files: []
    },
    {
      name: "Marine Display Solutions",
      files: []
    },
    {
      name: "Wire & Cable Solutions",
      files: []
    }
  ];


  /*
   * ============================================================
   * VERSION
   * ============================================================
   *
   * Change this number whenever nav.js is updated.
   * This prevents the browser from using an old cached copy.
   *
   */

  const NAV_VERSION = "20261016-02";


  /*
   * ============================================================
   * BASE URL
   * ============================================================
   */

  function getBaseUrl() {
    return new URL(
      ".",
      window.location.href
    );
  }


  /*
   * ============================================================
   * ARTICLE TITLE
   * ============================================================
   */

  function getArticleTitle(article, fileName) {

    if (
      article &&
      typeof article.title === "string" &&
      article.title.trim()
    ) {
      return article.title
        .replace(
          /\s*\|\s*Jacky Liu\s*$/i,
          ""
        )
        .trim();
    }

    return fileName
      .replace(
        /\.html$/i,
        ""
      )
      .replace(
        /[-_]+/g,
        " "
      )
      .replace(
        /\b\w/g,
        function (letter) {
          return letter.toUpperCase();
        }
      );
  }


  /*
   * ============================================================
   * MAIN NAVIGATION
   * ============================================================
   */

  function setupMainDropdowns(root) {

    const nav =
      root.querySelector(
        ".shared-nav"
      );

    const mobileToggle =
      root.querySelector(
        ".shared-mobile-toggle"
      );


    /*
     * Mobile menu
     */

    if (
      nav &&
      mobileToggle
    ) {

      mobileToggle.addEventListener(
        "click",
        function () {

          const isOpen =
            nav.classList.toggle(
              "mobile-open"
            );

          mobileToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
          );
        }
      );
    }


    /*
     * CASE / INSIGHTS / SOLUTION
     */

    root
      .querySelectorAll(
        ".shared-dropdown-trigger"
      )
      .forEach(
        function (button) {

          button.addEventListener(
            "click",
            function (event) {

              event.stopPropagation();


              const item =
                button.closest(
                  ".shared-nav-item"
                );


              if (!item) {
                return;
              }


              const wasOpen =
                item.classList.contains(
                  "open"
                );


              /*
               * Close other top-level menus.
               */

              root
                .querySelectorAll(
                  ".shared-nav-item.open"
                )
                .forEach(
                  function (openItem) {

                    openItem.classList.remove(
                      "open"
                    );


                    const trigger =
                      openItem.querySelector(
                        ".shared-dropdown-trigger"
                      );


                    if (trigger) {

                      trigger.setAttribute(
                        "aria-expanded",
                        "false"
                      );
                    }
                  }
                );


              /*
               * Open selected menu.
               */

              if (!wasOpen) {

                item.classList.add(
                  "open"
                );

                button.setAttribute(
                  "aria-expanded",
                  "true"
                );
              }
            }
          );
        }
      );


    /*
     * Close menus when clicking outside.
     */

    document.addEventListener(
      "click",
      function (event) {

        if (
          !root.contains(
            event.target
          )
        ) {

          root
            .querySelectorAll(
              ".shared-nav-item.open"
            )
            .forEach(
              function (item) {

                item.classList.remove(
                  "open"
                );


                const trigger =
                  item.querySelector(
                    ".shared-dropdown-trigger"
                  );


                if (trigger) {

                  trigger.setAttribute(
                    "aria-expanded",
                    "false"
                  );
                }
              }
            );
        }
      }
    );
  }


  /*
   * ============================================================
   * RENDER GROUPS
   * ============================================================
   *
   * This function creates:
   *
   * Category name                  +
   *
   * Clicking + changes it to:
   *
   * Category name                  −
   *     Article / Case / Solution
   *
   */

  function renderGroups(
    containerId,
    groups,
    articles,
    emptyMessage
  ) {

    const container =
      document.getElementById(
        containerId
      );


    if (!container) {

      console.warn(
        "Navigation container not found:",
        containerId
      );

      return;
    }


    container.innerHTML = "";


    /*
     * Create article lookup table.
     */

    const articleMap =
      new Map();


    if (
      Array.isArray(
        articles
      )
    ) {

      articles.forEach(
        function (article) {

          if (
            article &&
            typeof article.file === "string"
          ) {

            articleMap.set(
              article.file,
              article
            );
          }
        }
      );
    }


    /*
     * Build every category.
     */

    groups.forEach(
      function (group, index) {

        /*
         * Category wrapper
         */

        const section =
          document.createElement(
            "section"
          );

        section.className =
          "shared-insight-category";


        /*
         * Category button
         */

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "shared-insight-category-toggle";


        button.setAttribute(
          "aria-expanded",
          "false"
        );


        /*
         * Category text
         */

        const label =
          document.createElement(
            "span"
          );

        label.textContent =
          group.name;


        /*
         * + / − indicator
         */

        const indicator =
          document.createElement(
            "span"
          );

        indicator.className =
          "shared-insight-category-indicator";

        indicator.setAttribute(
          "aria-hidden",
          "true"
        );

        indicator.textContent =
          "+";


        /*
         * Put text + indicator into button.
         */

        button.appendChild(
          label
        );

        button.appendChild(
          indicator
        );


        /*
         * Article / case / solution list
         */

        const links =
          document.createElement(
            "div"
          );

        links.className =
          "shared-insight-category-links";


        links.id =
          containerId +
          "-links-" +
          index;


        links.hidden =
          true;


        button.setAttribute(
          "aria-controls",
          links.id
        );


        /*
         * Determine which files exist.
         */

        const availableFiles =
          Array.isArray(
            group.files
          )
            ? group.files.filter(
                function (fileName) {

                  return articleMap.has(
                    fileName
                  );
                }
              )
            : [];


        /*
         * No content yet.
         */

        if (
          availableFiles.length === 0
        ) {

          const empty =
            document.createElement(
              "div"
            );

          empty.className =
            "shared-insight-empty";

          empty.textContent =
            emptyMessage;

          links.appendChild(
            empty
          );

        } else {

          /*
           * Render actual articles.
           */

          availableFiles.forEach(
            function (fileName) {

              const article =
                articleMap.get(
                  fileName
                );


              const link =
                document.createElement(
                  "a"
                );


              link.className =
                "shared-insight-article";


              link.href =
                new URL(
                  fileName,
                  getBaseUrl()
                ).href;


              link.textContent =
                getArticleTitle(
                  article,
                  fileName
                );


              links.appendChild(
                link
              );
            }
          );
        }


        /*
         * + / − click behavior.
         */

        button.addEventListener(
          "click",
          function () {

            const expanded =
              button.getAttribute(
                "aria-expanded"
              ) === "true";


            button.setAttribute(
              "aria-expanded",
              String(!expanded)
            );


            links.hidden =
              expanded;


            indicator.textContent =
              expanded
                ? "+"
                : "−";
          }
        );


        /*
         * Assemble category.
         */

        section.appendChild(
          button
        );

        section.appendChild(
          links
        );

        container.appendChild(
          section
        );
      }
    );
  }


  /*
   * ============================================================
   * LOAD SHARED NAVIGATION
   * ============================================================
   */

  async function loadNavigation() {

    const mount =
      document.getElementById(
        "site-nav"
      );


    if (!mount) {

      console.warn(
        "site-nav mount not found."
      );

      return;
    }


    try {

      const baseUrl =
        getBaseUrl();


      /*
       * Load nav.html
       *
       * Add version parameter to prevent
       * browser cache problems.
       */

      const navUrl =
        new URL(
          "nav.html",
          baseUrl
        );


      navUrl.searchParams.set(
        "v",
        NAV_VERSION
      );


      const navResponse =
        await fetch(
          navUrl.href,
          {
            cache: "no-store"
          }
        );


      if (
        !navResponse.ok
      ) {

        throw new Error(
          "Could not load nav.html"
        );
      }


      mount.innerHTML =
        await navResponse.text();


      /*
       * Set up CASE / INSIGHTS / SOLUTION.
       */

      setupMainDropdowns(
        mount
      );


      /*
       * Load articles.json.
       */

      const articlesUrl =
        new URL(
          "articles.json",
          baseUrl
        );


      articlesUrl.searchParams.set(
        "v",
        NAV_VERSION
      );


      let articles = [];


      try {

        const articlesResponse =
          await fetch(
            articlesUrl.href,
            {
              cache: "no-store"
            }
          );


        if (
          articlesResponse.ok
        ) {

          articles =
            await articlesResponse.json();

        } else {

          console.warn(
            "articles.json could not be loaded."
          );
        }

      } catch (error) {

        console.warn(
          "Error loading articles.json:",
          error
        );
      }


      /*
       * ========================================================
       * INSIGHTS
       * ========================================================
       */

      renderGroups(
        "shared-insights-content",
        insightGroups,
        articles,
        "Articles coming soon."
      );


      /*
       * ========================================================
       * CASE
       * ========================================================
       */

      renderGroups(
        "shared-case-content",
        caseGroups,
        articles,
        "Cases coming soon."
      );


      /*
       * ========================================================
       * SOLUTION
       * ========================================================
       */

      renderGroups(
        "shared-solution-content",
        solutionGroups,
        articles,
        "Solutions coming soon."
      );


      /*
       * Finished.
       */

      console.log(
        "Shared navigation loaded:",
        NAV_VERSION
      );

    } catch (error) {

      console.error(
        "Could not load shared navigation:",
        error
      );
    }
  }


  /*
   * ============================================================
   * START
   * ============================================================
   */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      loadNavigation
    );

  } else {

    loadNavigation();
  }

})();
```

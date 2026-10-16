```javascript
(function () {
  "use strict";

  /*
   * ============================================================
   * INSIGHTS
   * ============================================================
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


  /*
   * ============================================================
   * CASE
   * ============================================================
   */

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


  /*
   * ============================================================
   * SOLUTION
   * ============================================================
   */

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
   * SITE BASE URL
   * ============================================================
   */

  function getSiteBaseUrl() {

    const script = document.querySelector(
      'script[src$="nav.js"], script[src*="/nav.js?"]'
    );

    if (script) {

      return new URL(
        ".",
        new URL(
          script.getAttribute("src"),
          window.location.href
        )
      );
    }

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

  function getArticleTitle(
    article,
    fileName
  ) {

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
   * MAIN NAVIGATION DROPDOWNS
   * ============================================================
   */

  function setupDropdowns(root) {

    const nav =
      root.querySelector(
        ".shared-nav"
      );

    const mobileToggle =
      root.querySelector(
        ".shared-mobile-toggle"
      );


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


    root
      .querySelectorAll(
        ".shared-nav a"
      )
      .forEach(
        function (link) {

          link.addEventListener(
            "click",
            function () {

              if (nav) {

                nav.classList.remove(
                  "mobile-open"
                );
              }


              if (mobileToggle) {

                mobileToggle.setAttribute(
                  "aria-expanded",
                  "false"
                );
              }
            }
          );
        }
      );
  }


  /*
   * ============================================================
   * RENDER CATEGORY GROUPS
   * ============================================================
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
      return;
    }


    container.replaceChildren();


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


    const siteBaseUrl =
      getSiteBaseUrl();


    groups.forEach(
      function (group, index) {

        const section =
          document.createElement(
            "section"
          );

        section.className =
          "shared-insight-category";


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


        button.setAttribute(
          "aria-controls",
          containerId +
          "-links-" +
          index
        );


        const label =
          document.createElement(
            "span"
          );


        label.textContent =
          group.name;


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


        button.appendChild(
          label
        );


        button.appendChild(
          indicator
        );


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
                  siteBaseUrl
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


        button.addEventListener(
          "click",
          function () {

            const isExpanded =
              button.getAttribute(
                "aria-expanded"
              ) === "true";


            button.setAttribute(
              "aria-expanded",
              String(!isExpanded)
            );


            links.hidden =
              isExpanded;


            indicator.textContent =
              isExpanded
                ? "+"
                : "−";
          }
        );


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
   * LOAD NAVIGATION
   * ============================================================
   */

  async function loadNavigation() {

    const mount =
      document.getElementById(
        "site-nav"
      );


    if (!mount) {
      return;
    }


    try {

      const script =
        document.querySelector(
          'script[src$="nav.js"], script[src*="/nav.js?"]'
        );


      const baseUrl =
        script
          ? new URL(
              ".",
              new URL(
                script.getAttribute("src"),
                window.location.href
              )
            )
          : new URL(
              ".",
              window.location.href
            );


      /*
       * Load nav.html
       */

      const navResponse =
        await fetch(
          new URL(
            "nav.html",
            baseUrl
          ).href
        );


      if (!navResponse.ok) {

        throw new Error(
          "Could not load nav.html"
        );
      }


      mount.innerHTML =
        await navResponse.text();


      setupDropdowns(
        mount
      );


      /*
       * Load articles.json
       */

      try {

        const articlesResponse =
          await fetch(
            new URL(
              "articles.json",
              baseUrl
            ).href
          );


        if (!articlesResponse.ok) {

          throw new Error(
            "Could not load articles.json"
          );
        }


        const articles =
          await articlesResponse.json();


        /*
         * INSIGHTS
         */

        renderGroups(
          "shared-insights-content",
          insightGroups,
          articles,
          "Articles coming soon."
        );


        /*
         * CASE
         */

        renderGroups(
          "shared-case-content",
          caseGroups,
          articles,
          "Cases coming soon."
        );


        /*
         * SOLUTION
         */

        renderGroups(
          "shared-solution-content",
          solutionGroups,
          articles,
          "Solutions coming soon."
        );

      } catch (error) {

        console.error(
          "Could not load the article list:",
          error
        );


        renderGroups(
          "shared-insights-content",
          insightGroups,
          [],
          "Articles coming soon."
        );


        renderGroups(
          "shared-case-content",
          caseGroups,
          [],
          "Cases coming soon."
        );


        renderGroups(
          "shared-solution-content",
          solutionGroups,
          [],
          "Solutions coming soon."
        );
      }

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

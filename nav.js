/* =========================================================
   SHARED NAVIGATION LOADER
   ========================================================= */

(async function () {

  const container = document.getElementById("site-nav");

  if (!container) {
    return;
  }


  /* -------------------------------------------------------
     Load shared CSS
     ------------------------------------------------------- */

  if (!document.getElementById("shared-nav-css")) {

    const link = document.createElement("link");

    link.id = "shared-nav-css";
    link.rel = "stylesheet";
    link.href = "nav.css";

    document.head.appendChild(link);
  }


  /* -------------------------------------------------------
     Load shared navigation HTML
     ------------------------------------------------------- */

  try {

    const response = await fetch("nav.html", {
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error("Unable to load nav.html");
    }

    const html = await response.text();

    container.innerHTML = html;

  } catch (error) {

    console.error(
      "Shared navigation failed:",
      error
    );

    return;
  }


  /* -------------------------------------------------------
     INSIGHTS
     ------------------------------------------------------- */

  const insightGroups = {

    "Vehicle Monitors": [
      "how-to-choose-vehicle-monitor.html",
      "what-brightness-does-a-vehicle-monitor-need.html",
      "bench-test-vs-installation.html",
      "1920x1080-vs-1024x600.html",
      "svm-display-resolution-system-matching.html",
      "Why Is an Automotive Touchscreen Different from a Normal Tablet.html"
    ],

    "SVM / AVM": [
      "monitor-as-hmi-in-svm-system.html",
      "5-things-to-check-when-connecting-svm-box-to-vehicle-monitor.html",
      "when-does-an-svm-monitor-need-touch.html",
      "why-svm-avm-needs-proper-display-interface.html",
      "hdmi-vs-ahd-vehicle-camera-system.html"
    ],

    "Vehicle Safety": [
      "why-vehicle-camera-image-quality-changes-after-installation.html",
      "why-vehicle-monitor-has-emi-problems.html"
    ],

    "Wiring & Connectivity": [
      "why-cables-can-matter-more-than-power-supply.html",
      "why-vehicle-monitors-use-m12-connectors.html",
      "why-wiring-matters.html"
    ]

  };


  const dropdown =
    document.getElementById(
      "shared-insights-dropdown"
    );


  if (dropdown) {

    dropdown.innerHTML = "";


    Object.entries(insightGroups).forEach(
      ([groupName, files]) => {

        const group =
          document.createElement("div");

        group.className =
          "shared-insights-group";


        const title =
          document.createElement("div");

        title.className =
          "shared-insights-title";

        title.textContent = groupName;


        group.appendChild(title);


        files.forEach((fileName) => {

          const link =
            document.createElement("a");

          link.className =
            "shared-insights-link";

          link.href = fileName;


          const article =
            fileName
              .replace(".html", "")
              .replace(/-/g, " ");


          link.textContent = article;


          group.appendChild(link);

        });


        dropdown.appendChild(group);

      }
    );


    const viewAll =
      document.createElement("a");

    viewAll.className =
      "shared-insights-link shared-view-all";

    viewAll.href =
      "index.html#insights";

    viewAll.textContent =
      "View All Insights →";


    dropdown.appendChild(viewAll);
  }


  /* -------------------------------------------------------
     MOBILE MENU
     ------------------------------------------------------- */

  const toggle =
    document.getElementById(
      "shared-mobile-toggle"
    );

  const mobileMenu =
    document.getElementById(
      "shared-mobile-menu"
    );


  if (toggle && mobileMenu) {

    toggle.addEventListener(
      "click",
      function () {

        const isOpen =
          mobileMenu.classList.toggle(
            "open"
          );

        toggle.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false"
        );

      }
    );


    mobileMenu
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          function () {

            mobileMenu.classList.remove(
              "open"
            );

            toggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      });

  }

})();

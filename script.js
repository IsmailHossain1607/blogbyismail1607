/* ==========================================================
   script.js: interactive features for the mathematics blog
   1. Dark / light mode toggle
   2. Highlight the current page in the menu
   3. Reading progress bar
   4. Back-to-top button
   5. Highlight a blog post when opened from a link
   6. "Math Fact" box on the home page
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  setupThemeToggle();
  highlightActiveMenu();
  setupProgressBar();
  setupBackToTop();
  setupPostHighlight();
  setupMathFacts();
});

/* ---------- 1. Dark / light mode ---------- */
function setupThemeToggle() {
  var nav = document.querySelector("nav");
  if (!nav) return;

  // Use the saved choice, otherwise follow the device setting
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}

  var prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = saved || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  var button = document.createElement("button");
  button.type = "button";
  button.className = "theme-toggle";
  button.setAttribute("aria-label", "Switch between dark and light mode");
  updateToggleLabel(button, theme);
  nav.appendChild(button);

  button.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    updateToggleLabel(button, next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function updateToggleLabel(button, theme) {
  button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

/* ---------- 2. Highlight the current page in the menu ---------- */
function highlightActiveMenu() {
  var page = window.location.pathname.split("/").pop();
  if (page === "") page = "index.html";

  var links = document.querySelectorAll(".nav-button");
  links.forEach(function (link) {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ---------- 3. Reading progress bar ---------- */
function setupProgressBar() {
  var bar = document.createElement("div");
  bar.className = "progress-bar";
  document.body.appendChild(bar);

  function update() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    var percent = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = percent + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* ---------- 4. Back-to-top button ---------- */
function setupBackToTop() {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.setAttribute("aria-label", "Back to top");
  button.textContent = "\u2191";
  document.body.appendChild(button);

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 400) {
        button.classList.add("visible");
      } else {
        button.classList.remove("visible");
      }
    },
    { passive: true }
  );

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 5. Highlight the post opened from a link ---------- */
function setupPostHighlight() {
  function highlight() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target || target.tagName !== "ARTICLE") return;

    target.classList.remove("highlight");
    // Force the browser to restart the animation
    void target.offsetWidth;
    target.classList.add("highlight");
  }

  highlight();
  window.addEventListener("hashchange", highlight);
}

/* ---------- 6. Math fact box (home page) ---------- */
function setupMathFacts() {
  var factText = document.getElementById("fact-text");
  var factButton = document.getElementById("new-fact");
  if (!factText || !factButton) return;

  var facts = [
    "There are infinitely many prime numbers. Euclid proved this more than 2,000 years ago.",
    "The decimal 0.999... (nines going on forever) is exactly equal to 1.",
    "Of all shapes with the same perimeter, the circle encloses the largest area.",
    "On a flat surface the angles of a triangle add up to 180\u00B0, but on a sphere they add up to more.",
    "A M\u00F6bius strip is a surface with only one side and one edge. You can make one with a strip of paper and a twist.",
    "The number \u03C0 is irrational: its decimal digits never end and never repeat into a pattern.",
    "Ratios of consecutive Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, ...) get closer and closer to the golden ratio, about 1.618.",
    "Euler's identity, e^(i\u03C0) + 1 = 0, links five of the most important numbers in mathematics in one equation.",
    "The Indian mathematician Brahmagupta wrote rules for doing arithmetic with zero in the 7th century.",
    "The word \"algebra\" comes from al-jabr, a term used in a book by the mathematician Al-Khwarizmi.",
    "According to a famous story, the young Gauss quickly added the numbers from 1 to 100 by noticing they make 50 pairs that each add up to 101, giving 5050."
  ];

  var last = -1;

  function showFact() {
    var index;
    do {
      index = Math.floor(Math.random() * facts.length);
    } while (index === last && facts.length > 1);
    last = index;
    factText.textContent = facts[index];
  }

  showFact();
  factButton.addEventListener("click", showFact);
}

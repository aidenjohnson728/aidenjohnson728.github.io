/* =========================================================
   Aiden Johnson — portfolio
   No jQuery, no Bootstrap, no plugins. Vanilla only.
   ========================================================= */
   (function () {
    "use strict";
  
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    /* -------------------------------------------------
       1. Mobile navigation
       ------------------------------------------------- */
    var toggle  = document.getElementById("navToggle");
    var sidebar = document.getElementById("sidebar");
  
    function closeNav() {
      sidebar.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  
    if (toggle && sidebar) {
      toggle.addEventListener("click", function () {
        var open = sidebar.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
  
      // close after tapping a link on small screens
      sidebar.addEventListener("click", function (e) {
        if (e.target.closest(".nav-link") && window.innerWidth <= 900) closeNav();
      });
  
      document.addEventListener("click", function (e) {
        if (window.innerWidth > 900) return;
        if (!sidebar.classList.contains("is-open")) return;
        if (e.target.closest("#sidebar") || e.target.closest("#navToggle")) return;
        closeNav();
      });
    }
  
    /* -------------------------------------------------
       2. Scrollspy — red pen circles the current section
       ------------------------------------------------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute("href")); })
      .filter(Boolean);
  
    function setCurrent(id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-current", link.getAttribute("href") === "#" + id);
      });
    }
  
    if ("IntersectionObserver" in window && sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  
      sections.forEach(function (s) { spy.observe(s); });
    }
  
    /* -------------------------------------------------
       3. Portfolio filtering
       ------------------------------------------------- */
    var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
    var cards   = Array.prototype.slice.call(document.querySelectorAll(".work-card"));
    var empty   = document.getElementById("emptyState");
  
    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.dataset.filter;
  
        filters.forEach(function (b) { b.classList.remove("is-active"); });
        button.classList.add("is-active");
  
        var shown = 0;
  
        cards.forEach(function (card) {
          var cats = (card.dataset.cat || "").split(/\s+/);
          var match = value === "all" || cats.indexOf(value) !== -1;
  
          card.classList.toggle("is-hidden", !match);
          if (match) shown++;
  
          // a hidden card should not stay expanded
          if (!match && card.classList.contains("is-open")) closeCard(card);
        });
  
        if (empty) empty.hidden = shown !== 0;
      });
    });
  
    /* -------------------------------------------------
       4. Case studies — open as a full panel beside the menu
       ------------------------------------------------- */
    var openedFrom = null;
  
    // Build the sticky header (title + close) once per panel
    function ensureBar(card, panel) {
      var existing = panel.querySelector(".case-bar");
      if (existing) return existing;
  
      var title = card.querySelector(".card-title").textContent.trim();
      var headingId = panel.id + "-heading";
  
      var bar = document.createElement("div");
      bar.className = "case-bar";
  
      var h = document.createElement("h2");
      h.id = headingId;
      h.textContent = title;
  
      var close = document.createElement("button");
      close.type = "button";
      close.className = "case-close";
      close.textContent = "Close";
      close.addEventListener("click", function () { closeCard(card); });
  
      bar.appendChild(h);
      bar.appendChild(close);
      panel.insertBefore(bar, panel.firstChild);
  
      // carry the project image into the panel, after the header
      var thumb = card.querySelector(".card-thumb img");
      if (thumb) {
        var fig = document.createElement("figure");
        fig.className = "case-hero";
        var img = document.createElement("img");
        img.src = thumb.getAttribute("src");
        img.alt = thumb.getAttribute("alt") || "";
        fig.appendChild(img);
        panel.insertBefore(fig, bar.nextSibling);
      }
  
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-labelledby", headingId);
  
      return bar;
    }
  
    function openCard(card) {
      var face = card.querySelector(".card-face");
      var panel = document.getElementById(face.getAttribute("aria-controls"));
      if (!panel) return;
  
      var bar = ensureBar(card, panel);
  
      // A transformed ancestor becomes the containing block for position:fixed,
      // and the card is transformed on hover/focus — so the panel has to live
      // on <body> to actually fill the viewport.
      if (panel.parentElement !== document.body) document.body.appendChild(panel);
  
      card.classList.add("is-open");
      face.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      panel.scrollTop = 0;
      document.body.classList.add("is-locked");
  
      openedFrom = face;
      bar.querySelector(".case-close").focus();
    }
  
    function closeCard(card) {
      var face = card.querySelector(".card-face");
      var panel = document.getElementById(face.getAttribute("aria-controls"));
      if (!panel) return;
  
      card.classList.remove("is-open");
      face.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      document.body.classList.remove("is-locked");
  
      if (openedFrom) { openedFrom.focus(); openedFrom = null; }
    }
  
    function closeAll(except) {
      cards.forEach(function (card) {
        if (card !== except && card.classList.contains("is-open")) closeCard(card);
      });
    }
  
    cards.forEach(function (card) {
      var face = card.querySelector(".card-face");
      if (!face) return;
  
      face.addEventListener("click", function () {
        if (card.classList.contains("is-open")) { closeCard(card); return; }
        closeAll(card);
        openCard(card);
      });
    });
  
    // Keep tab focus inside the panel while it's open
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var card = document.querySelector(".work-card.is-open");
      if (!card) return;
  
      var panel = document.getElementById(
        card.querySelector(".card-face").getAttribute("aria-controls"));
      var focusable = panel.querySelectorAll("a[href], button");
      if (!focusable.length) return;
  
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
  
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  
    // Escape closes the panel, then the mobile menu
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
  
      var open = document.querySelector(".work-card.is-open");
      if (open) { closeCard(open); return; }
      if (sidebar && sidebar.classList.contains("is-open")) closeNav();
    });
  
    // Jumping to a section should never leave a panel covering it
    if (sidebar) {
      sidebar.addEventListener("click", function (e) {
        if (!e.target.closest(".nav-link")) return;
        var open = document.querySelector(".work-card.is-open");
        if (open) closeCard(open);
      });
    }
  
    /* -------------------------------------------------
       5. Back to top
       ------------------------------------------------- */
    var toTop = document.getElementById("toTop");
  
    if (toTop) {
      window.addEventListener("scroll", function () {
        toTop.classList.toggle("is-visible", window.pageYOffset > 400);
      }, { passive: true });
  
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  
    /* -------------------------------------------------
       6. Scroll reveal
       ------------------------------------------------- */
    if ("IntersectionObserver" in window && !reduceMotion) {
      var targets = document.querySelectorAll(
        ".section-title, .about-grid, .filters, .work-card, .entry, .edu-card, .embed-frame, .contact-card"
      );
  
      var reveal = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
  
      targets.forEach(function (el) {
        el.classList.add("reveal");
        reveal.observe(el);
      });
    }
  })();
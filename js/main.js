(function () {
  "use strict";

  // ---- Page fade-in (guaranteed to run first, no matter what else fails) ----
  try { document.body.classList.add("page-ready"); } catch (e) {}

  var prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  // ---- Footer year ----
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Header scrolled state + scroll progress bar ----
  var header = document.getElementById("siteHeader");
  var toTop = document.getElementById("toTop");
  var progressBar = document.getElementById("scrollProgress");
  function onScroll() {
    if (header) {
      if (window.scrollY > 8) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    if (progressBar) {
      var docEl = document.documentElement;
      var scrollTop = docEl.scrollTop || document.body.scrollTop;
      var scrollHeight = docEl.scrollHeight - docEl.clientHeight;
      var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    }
    toggleToTop();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav toggle ----
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Staggered reveal-on-scroll ----
  document.querySelectorAll(".reveal-group").forEach(function (group) {
    var items = group.querySelectorAll(".reveal, .reveal-scale");
    items.forEach(function (el, i) {
      el.style.transitionDelay = prefersReducedMotion ? "0ms" : Math.min(i * 90, 540) + "ms";
    });
  });

  var revealEls = document.querySelectorAll(".reveal, .reveal-scale");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- Animated stat counters ----
  function formatCount(value, decimals, prefix, suffix) {
    var s = value.toFixed(decimals);
    var parts = s.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return prefix + parts.join(".") + suffix;
  }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1100;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(target * eased, decimals, prefix, suffix);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatCount(target, decimals, prefix, suffix);
    }
    requestAnimationFrame(step);
  }
  var countEls = document.querySelectorAll("[data-count]");
  if (countEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      // No count-up animation in this case, so jump straight to the correct
      // final value rather than leaving whatever static number sits in the
      // markup (reduced-motion and older-browser visitors must still see the
      // right figure, not a stale placeholder).
      countEls.forEach(function (el) {
        var target = parseFloat(el.getAttribute("data-count"));
        if (isNaN(target)) return;
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        el.textContent = formatCount(target, decimals, prefix, suffix);
      });
    } else {
      var cio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      countEls.forEach(function (el) { cio.observe(el); });
    }
  }

  // ---- Subtle mouse parallax on the home hero blob (desktop with a real pointer only) ----
  var heroSection = document.querySelector(".hero");
  var heroBlob = heroSection ? heroSection.querySelector(".hero-blob") : null;
  if (heroSection && heroBlob && !prefersReducedMotion && window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    heroBlob.style.transition = "transform 0.3s ease-out";
    heroSection.addEventListener("mousemove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      heroBlob.style.transform = "translate(" + (relX * 26) + "px," + (relY * 26) + "px)";
    });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    q.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (openItem) {
        if (openItem !== item) openItem.classList.remove("open");
      });
      item.classList.toggle("open", !wasOpen);
    });
  });

  // ---- Back to top ----
  function toggleToTop() {
    if (!toTop) return;
    if (window.scrollY > 500) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- Contact form (only present on contact.html) ----
  // No backend is wired up by default, so the form opens a pre-filled email as a
  // reliable fallback that works on any host. To collect submissions directly,
  // set FORM_ENDPOINT below to a Formspree (or similar) endpoint URL -- see README.md.
  var FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        interest: form.interest.value,
        message: form.message.value.trim(),
      };

      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then(function (res) {
            if (res.ok) {
              formNote.textContent = "Thanks! Your message has been sent, we'll be in touch within 24 hours.";
              form.reset();
            } else {
              throw new Error("send failed");
            }
          })
          .catch(function () {
            openMailto(data);
          });
      } else {
        openMailto(data);
      }
    });
  }

  function openMailto(data) {
    var subject = encodeURIComponent("Grow Smart SA enquiry: " + data.interest);
    var body = encodeURIComponent(
      "Name: " + data.name + "\nEmail: " + data.email + "\nInterested in: " + data.interest + "\n\nMessage:\n" + data.message
    );
    window.location.href = "mailto:tahriq.smith@gmail.com?subject=" + subject + "&body=" + body;
    if (formNote) formNote.textContent = "Opening your email client with this message pre-filled...";
  }
})();

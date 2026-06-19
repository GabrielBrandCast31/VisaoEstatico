/* Interações globais: reveal on scroll, FAQ, cookie banner, analytics, ano. */
(function () {
  const CFG = window.VISAO_CONFIG || {};

  // ---- Reveal on scroll (substitui framer-motion <Reveal/>) -------------
  function initReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-40px" }
    );
    els.forEach(function (el) {
      const delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.setProperty("--reveal-delay", delay + "s");
      io.observe(el);
    });
  }

  // ---- FAQ accordion ----------------------------------------------------
  function initFaq() {
    const items = document.querySelectorAll("[data-faq]");
    items.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const panel = btn.querySelector(".faq-panel");
        const icon = btn.querySelector("[data-faq-icon]");
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        document.querySelectorAll("[data-faq]").forEach(function (other) {
          if (other === btn) return;
          other.setAttribute("aria-expanded", "false");
          const p = other.querySelector(".faq-panel");
          const i = other.querySelector("[data-faq-icon]");
          if (p) p.classList.remove("open");
          if (i) {
            i.textContent = "+";
            i.className = i.getAttribute("data-base-class") + " bg-primary-100 text-primary-700";
          }
        });

        btn.setAttribute("aria-expanded", String(!isOpen));
        if (panel) panel.classList.toggle("open", !isOpen);
        if (icon) {
          icon.textContent = !isOpen ? "−" : "+";
          icon.className =
            icon.getAttribute("data-base-class") +
            (!isOpen
              ? " bg-primary text-white shadow-glow-purple"
              : " bg-primary-100 text-primary-700");
        }
      });
    });
  }

  // ---- Ano no rodapé ----------------------------------------------------
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // ---- Analytics --------------------------------------------------------
  function loadAnalytics() {
    if (CFG.GTM_ID) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        const f = d.getElementsByTagName(s)[0];
        const j = d.createElement(s);
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", CFG.GTM_ID);
    }
    if (CFG.META_PIXEL_ID) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", CFG.META_PIXEL_ID);
      window.fbq("track", "PageView");
    }
  }

  // ---- Cookie banner ----------------------------------------------------
  const STORAGE_KEY = "visao:cookie-consent";
  function readConsent() {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  }
  function initCookieBanner() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
    const consent = readConsent();
    if (consent === "accepted") loadAnalytics();
    if (consent !== null) return;

    banner.classList.remove("hidden");
    requestAnimationFrame(function () {
      banner.classList.remove("translate-y-24", "opacity-0");
    });

    function decide(value) {
      window.localStorage.setItem(STORAGE_KEY, value);
      banner.classList.add("translate-y-24", "opacity-0");
      setTimeout(function () { banner.classList.add("hidden"); }, 300);
      if (value === "accepted") loadAnalytics();
    }
    const accept = banner.querySelector("[data-cookie-accept]");
    const reject = banner.querySelector("[data-cookie-reject]");
    if (accept) accept.addEventListener("click", function () { decide("accepted"); });
    if (reject) reject.addEventListener("click", function () { decide("rejected"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initFaq();
    initYear();
    initCookieBanner();
  });
})();

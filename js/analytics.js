/* Google Analytics 4 — loaded on the homepage only (index.html).
 *
 * The Measurement ID lives here and NOWHERE else. To turn tracking on,
 * replace the placeholder below with your GA4 Measurement ID (looks like
 * G-XXXXXXXXXX — Admin → Data Streams → your web stream, top-right).
 * Until then this file is a harmless no-op: no network requests, no data.
 *
 * Besides the pageview, this records two custom events:
 *   • `app_launch`  — fired when a "Launch" button in the #apps grid is
 *      clicked, so you can see which tools get opened even though the app
 *      pages aren't tracked themselves.
 *   • `section_view` — fired the first time each homepage <section> scrolls
 *      into view, so you can see how far down the page visitors read. */
(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-M1TZ9PBJRG'; // ← replace with your GA4 Measurement ID

  // gtag stub is always defined so the click tracking below never errors,
  // even before (or without) a real Measurement ID.
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  var configured = MEASUREMENT_ID && MEASUREMENT_ID !== 'G-XXXXXXXXXX';

  if (configured) {
    var loader = document.createElement('script');
    loader.async = true;
    loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(loader);

    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID);
  } else {
    // Visible only in the browser console — a nudge, not an error.
    console.warn('[analytics] Set your GA4 Measurement ID in js/analytics.js to enable tracking.');
  }

  // Fire a GA4 event when an app "Launch" button is clicked. Runs whether or
  // not gtag is configured (it's a no-op if not), so wiring stays in one place.
  function trackAppClicks() {
    var apps = document.getElementById('apps');
    if (!apps) return;

    apps.querySelectorAll('a.btn[href]').forEach(function (link) {
      link.addEventListener('click', function () {
        var tile = link.closest('.tile');
        var heading = tile && tile.querySelector('h3');
        gtag('event', 'app_launch', {
          app_name: heading ? heading.textContent.trim() : link.textContent.trim(),
          link_url: link.href,
          outbound: link.hostname !== location.hostname
        });
      });
    });
  }

  // Fire a GA4 `section_view` event the first time each homepage section
  // scrolls into view. rootMargin trims the bottom 25% of the viewport so a
  // section counts only once it's meaningfully on screen, not at the first
  // sliver — and it works for sections taller than the viewport too.
  function trackSectionViews() {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target); // count each section once
        gtag('event', 'section_view', { section_name: entry.target.id });
      });
    }, { threshold: 0, rootMargin: '0px 0px -25% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function init() {
    trackAppClicks();
    trackSectionViews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

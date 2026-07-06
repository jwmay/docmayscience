/* Google Analytics 4 — loaded on the homepage only (index.html).
 *
 * The Measurement ID lives here and NOWHERE else. To turn tracking on,
 * replace the placeholder below with your GA4 Measurement ID (looks like
 * G-XXXXXXXXXX — Admin → Data Streams → your web stream, top-right).
 * Until then this file is a harmless no-op: no network requests, no data.
 *
 * Besides the pageview, this also records an `app_launch` event each time a
 * visitor clicks a "Launch" button in the #apps grid, so you can see which
 * tools get opened even though the app pages aren't tracked themselves. */
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackAppClicks);
  } else {
    trackAppClicks();
  }
})();

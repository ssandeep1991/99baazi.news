// Inject header & footer from /partials using Fetch (works on static hosting)
async function injectPartial(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return;
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    const html = await res.text();
    host.innerHTML = html;
  } catch (e) {
    console.error('Partial inject failed for', url, e);
  }
}

(async () => {
  await injectPartial('#site-header', '/partials/header.html');
  await injectPartial('#site-footer', '/partials/footer.html');

  // After injection, run any DOM-dependent hooks (year, CTA tracking)
  if (document.getElementById('year')) {
    document.getElementById('year').textContent = new Date().getFullYear();
  }
  // Rebind CTA tracking once header/footer exist
  if (window.bindCTATracking) window.bindCTATracking();
})();


// Dynamic year is handled after injection in include.js

// CTA click tracking for GA4 + Meta Pixel
window.bindCTATracking = function() {
  const ids = ['ctaTop','ctaHero','ctaMid','ctaBottom'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'click', {
          event_category: 'CTA',
          event_label: id,
          destination: 'https://99baazi.com/'
        });
      }
      if (typeof fbq === 'function') {
        fbq('trackCustom', 'CTAClick', { id, destination: 'https://99baazi.com/' });
      }
    });
  });
};

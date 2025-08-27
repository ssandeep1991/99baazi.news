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
  await injectPartial('#site-header', '/components/header.html');
  await injectPartial('#site-footer', '/components/footer.html');

  // After injection, run any DOM-dependent hooks (year, CTA tracking)
  if (document.getElementById('year')) {
    document.getElementById('year').textContent = new Date().getFullYear();
  }
  // Rebind CTA tracking once header/footer exist
  if (window.bindCTATracking) window.bindCTATracking();
})();

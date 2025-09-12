// Global cookie consent key for easy updates
window.COOKIE_CONSENT_KEY = 'cookie_consent-v2';

// Helper to inject the cookie consent modal if not present
window.injectCookieConsent = function(options = {}) {
  if (document.getElementById('cookie-modal')) return; // Already present

  // Allow custom privacy link and text via options
  const privacyLink = options.privacyLink || 'privacy-policy.html';
  const privacyText = options.privacyText || 'Learn more';

  // Modal HTML
  const modalHtml = `
    <div id="cookie-modal-backdrop" class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75" style="z-index:2000; display:none;"></div>
    <div id="cookie-modal" class="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg p-4" style="z-index:2001; min-width:320px; max-width:95vw; display:none;">
        <h5 class="mb-3">Cookie Preferences</h5>
        <p class="mb-3">We use cookies to improve your experience. Please select your preferences:</p>
        <form id="cookie-form">
            <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" id="cookie-essential" checked disabled>
                <label class="form-check-label" for="cookie-essential"><strong>Essential Cookies</strong> (always active)</label>
            </div>
            <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" id="cookie-analytics" checked>
                <label class="form-check-label" for="cookie-analytics">Analytics Cookies</label>
            </div>
            <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="cookie-marketing" checked>
                <label class="form-check-label" for="cookie-marketing">Marketing Cookies</label>
            </div>
            <div class="d-flex flex-column flex-md-row gap-2 justify-content-end">
                <button type="button" class="btn btn-secondary" id="cookie-reject">Reject All</button>
                <button type="button" class="btn btn-primary" id="cookie-accept">Accept Selected</button>
            </div>
            <div class="mt-3">
                <a href="${privacyLink}" class="text-decoration-underline">${privacyText}</a>
            </div>
        </form>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', modalHtml);
};

document.addEventListener('DOMContentLoaded', function() {
  // Inject modal if not present
  window.injectCookieConsent();

  var consent = localStorage.getItem(window.COOKIE_CONSENT_KEY);
  var modal = document.getElementById('cookie-modal');
  var backdrop = document.getElementById('cookie-modal-backdrop');
  var acceptBtn = document.getElementById('cookie-accept');
  var rejectBtn = document.getElementById('cookie-reject');
  var analyticsToggle = document.getElementById('cookie-analytics');
  var marketingToggle = document.getElementById('cookie-marketing');

  function showModal() {
    if (modal && backdrop) {
      modal.style.display = 'block';
      backdrop.style.display = 'block';
    }
  }
  function hideModal() {
    if (modal && backdrop) {
      modal.style.display = 'none';
      backdrop.style.display = 'none';
    }
  }

  if (!consent) {
    showModal();
  }

  if (acceptBtn) {
    acceptBtn.onclick = function() {
      var prefs = {
        essential: true,
        analytics: analyticsToggle && analyticsToggle.checked,
        marketing: marketingToggle && marketingToggle.checked
      };
      localStorage.setItem(window.COOKIE_CONSENT_KEY, JSON.stringify(prefs));
      hideModal();
    };
  }
  if (rejectBtn) {
    rejectBtn.onclick = function() {
      var prefs = {
        essential: true,
        analytics: false,
        marketing: false
      };
      if (analyticsToggle) analyticsToggle.checked = false;
      if (marketingToggle) marketingToggle.checked = false;
      localStorage.setItem(window.COOKIE_CONSENT_KEY, JSON.stringify(prefs));
      hideModal();
    };
  }
  if (backdrop) {
    backdrop.onclick = function() {
      // Optional: prevent closing by clicking backdrop, or allow if you want
    };
  }
});

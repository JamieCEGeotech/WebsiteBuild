// Set the cookie consent key globally so it can be reused/changed easily
window.COOKIE_CONSENT_KEY = 'cookie_consent_V1';

document.addEventListener('DOMContentLoaded', function() {
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

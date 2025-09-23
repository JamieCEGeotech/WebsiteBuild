// Mobile navigation helper
// - Injects a hamburger button into the header
// - Clones existing .header-nav links into a slide-in panel
// - Handles open/close, overlay click, ESC to close, and basic focus management

(function(){
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

  function init(){
    const headerInner = document.querySelector('.header-inner');
    if (!headerInner) return; // nothing to do

    // Avoid injecting twice
    if (document.querySelector('.hamburger-btn')) return;

    // Create hamburger button
    const btn = document.createElement('button');
    btn.className = 'hamburger-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label','Open site navigation');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-controls','mobile-nav-panel');
    btn.style.marginLeft = '0.5rem';

    const icon = document.createElement('span');
    icon.className = 'hamburger-icon';
    btn.appendChild(icon);

    // Insert button near logo (end of header-inner)
    headerInner.appendChild(btn);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.tabIndex = -1;
    document.body.appendChild(overlay);

    // Create panel
    const panel = document.createElement('nav');
    panel.className = 'mobile-nav-panel';
    panel.id = 'mobile-nav-panel';
    panel.setAttribute('aria-hidden','true');
    panel.setAttribute('aria-label','Mobile navigation');

    // Add close button inside panel for accessibility
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'hamburger-btn mobile-close';
    closeBtn.setAttribute('aria-label','Close navigation');
    closeBtn.style.alignSelf = 'flex-end';
    closeBtn.style.marginBottom = '0.75rem';

    const closeIcon = document.createElement('span');
    closeIcon.className = 'hamburger-icon';
    closeBtn.appendChild(closeIcon);
    panel.appendChild(closeBtn);

    // Clone the header-nav links
    const desktopNav = document.querySelector('.header-nav');
    if (desktopNav) {
      // Clone the nav but strip layout-only and header-specific classes so it
      // is visible inside the mobile panel (desktop .header-nav is hidden via CSS).
      const clone = desktopNav.cloneNode(true);
      clone.classList.remove('d-flex','gap-3','header-nav');

      // Normalize anchor styling and behaviour for mobile panel
      clone.querySelectorAll('a').forEach(a=>{
        a.classList.remove('px-2');
        a.setAttribute('tabindex','0');

        // Prevent bare '#' anchors from jumping the page on click. If the
        // element has an inline onclick handler that returns false, that
        // will still run; preventing default here prevents the '#' navigation.
        try {
          const href = a.getAttribute('href');
          if (href === '#') {
            a.addEventListener('click', function(e){ e.preventDefault(); });
          }
        } catch (e) {/* ignore malformed anchors */}
      });

      panel.appendChild(clone);

      // If there is a contact button inside the header nav, clone and append
      // it too (keeping it visible and full-width inside the panel).
      const contactBtn = desktopNav.querySelector('.header-contact-btn');
      if (contactBtn) {
        const contactClone = contactBtn.cloneNode(true);
        contactClone.classList.remove('me-5');
        contactClone.style.width = '100%';
        panel.appendChild(contactClone);
      }

      // If the cloned nav somehow contains no anchor elements (edge case where
      // the header nav is built dynamically), try to build a simple list from
      // any anchors inside the headerInner as a fallback.
      let panelLinks = panel.querySelectorAll('a');
      if (!panelLinks || panelLinks.length === 0) {
        // Fallback: explicitly use anchors from the desktop nav (if any)
        const fallbackLinks = desktopNav.querySelectorAll('a');
        fallbackLinks.forEach(a => {
          // skip logo/skip-link anchors and any anchors explicitly hidden
          const hrefVal = (a.getAttribute('href') || '').trim();
          if (a.classList.contains('visually-hidden-focusable') || hrefVal === '#main') return;
          const newA = document.createElement('a');
          newA.className = 'nav-link';
          newA.textContent = a.textContent.trim() || a.getAttribute('title') || 'Link';
          const href = hrefVal || '#';
          newA.setAttribute('href', href);
          // preserve onclick attribute so it can be invoked later
          const on = a.getAttribute('onclick');
          if (on) newA.setAttribute('data-onclick-attr', on);
          panel.appendChild(newA);
        });
        panelLinks = panel.querySelectorAll('a');
      }

      // Attach safe click handlers to every link inside the panel to avoid
      // bare '#' anchors causing jumps/locking. Also ensure the panel closes
      // and body overflow is restored when navigation happens.
      panel.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', function(e){
          const href = (a.getAttribute('href') || '').trim();

          // Allow skip-to-main links (#main) to behave normally; skip-link
          // anchors should not be included in the panel but guard here as well.
          if (href === '#main') return;

          // If it's a fragment-only or plain '#' anchor, prevent default and
          // attempt to invoke any inline handler; otherwise closing the panel
          // prevents the jump and restores scroll.
          if (href === '#' || (href && href.startsWith('#') && !document.getElementById(href.slice(1)))) {
            e.preventDefault();

            // Try calling a.onclick if available
            try {
              const fn = a.onclick;
              if (typeof fn === 'function') {
                fn.call(a, e);
              } else {
                // If onclick attribute exists as text, evaluate it in function
                const attr = a.getAttribute('data-onclick-attr') || a.getAttribute('onclick');
                if (attr) {
                  try { new Function(attr).call(a); } catch(err){ /* ignore */ }
                }
              }
            } catch (err) {
              console.error('mobile-nav: error invoking onclick', err);
            }

            closeNav();
            return;
          }

          // For other links (external or page navigation), close the panel
          // shortly after click so navigation proceeds and body state is clean.
          try { setTimeout(closeNav, 50); } catch(e){}
        });
      });
    }

    document.body.appendChild(panel);

    // Focusable elements for simple trap
    function getFocusable(container){
      return Array.from(container.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
    }

    // Toggle function with better scroll lock handling
    let savedScrollY = 0;
    function openNav(){
      if (panel.classList.contains('open')) return; // already open
      panel.classList.add('open');
      overlay.classList.add('open');
      panel.setAttribute('aria-hidden','false');
      btn.setAttribute('aria-expanded','true');
      // save previously focused element
      previousActive = document.activeElement;
      // focus first link
      const focusables = getFocusable(panel);
      if (focusables.length) focusables[0].focus();

      // Preserve scroll position and lock the body without changing layout
      // Only lock if not already locked to avoid clobbering any existing state
      if (document.body.style.position !== 'fixed') {
        savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
      }
    }
    function closeNav(){
      if (!panel.classList.contains('open')) return; // already closed
      panel.classList.remove('open');
      overlay.classList.remove('open');
      panel.setAttribute('aria-hidden','true');
      btn.setAttribute('aria-expanded','false');
      if (previousActive) previousActive.focus();

      // Restore scroll position and body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      try { window.scrollTo(0, savedScrollY || 0); } catch(e){}
    }

    let previousActive = null;

    // Events
    btn.addEventListener('click', function(){
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav(); else openNav();
    });
    closeBtn.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);

    // Close on ESC key
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (panel.classList.contains('open')) closeNav();
      }

      // Basic trap: if panel open and TAB pressed, keep focus inside
      if (panel.classList.contains('open') && e.key === 'Tab'){
        const focusables = getFocusable(panel);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length-1];
        if (e.shiftKey && document.activeElement === first){
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last){
          e.preventDefault(); first.focus();
        }
      }
    });

    // If viewport grows, ensure panel closed and desktop nav visible
    function restoreBodyScroll(){
      // Restore body style state and scroll position if needed
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      try { window.scrollTo(0, savedScrollY || 0); } catch(e){}
      savedScrollY = 0;
    }

    function handleResize(){
      if (window.innerWidth > 800){
        // If the panel was open, close it (closeNav will restore scroll from savedScrollY).
        if (panel.classList.contains('open')) {
          closeNav();
        } else {
          // Only restore body scroll if the body was locked or we have a saved position.
          // This avoids overriding the browser's native scroll restoration on page load.
          if (document.body.style.position === 'fixed' || savedScrollY) {
            restoreBodyScroll();
          }
        }
        // explicitly hide the hamburger on desktop
        try { btn.style.display = 'none'; } catch(e){}
      } else {
        // show the hamburger on small screens (inline style overrides are OK)
        try { btn.style.display = 'inline-flex'; } catch(e){}
      }
    }
    window.addEventListener('resize', handleResize);

    // Run once to ensure state is consistent on load
    handleResize();
  }
})();

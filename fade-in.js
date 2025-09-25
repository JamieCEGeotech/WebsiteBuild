(function(){
    // Shared setup to observe all .fade-in elements
    function setupFadeIn() {
        const faders = document.querySelectorAll('.fade-in');
        const appearOptions = { threshold: 0.15 };

        // Clean up existing observer if any
        if (window.__fadeInObserver) {
            try { window.__fadeInObserver.disconnect(); } catch(e){}
            window.__fadeInObserver = null;
        }

        const appearOnScroll = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });

        // store globally to allow later disconnect
        window.__fadeInObserver = appearOnScroll;

        // Observe DOM mutations so elements injected after initial load are observed
        if (!window.__fadeInMutation) {
            try {
                const mut = new MutationObserver(() => {
                    const added = document.querySelectorAll('.fade-in:not(.fade-observed)');
                    added.forEach(el => {
                        if (window.__fadeInObserver) window.__fadeInObserver.observe(el);
                        el.classList.add('fade-observed');
                    });
                });
                mut.observe(document.documentElement, { childList: true, subtree: true });
                window.__fadeInMutation = mut;
            } catch(e) {
                // MutationObserver not supported: fallback will still work for static pages
            }
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupFadeIn, {once:true});
    } else {
        setupFadeIn();
    }

    // Re-run setup when the page becomes visible via bfcache/back-forward (pageshow)
    window.addEventListener('pageshow', function(e){
        // If persisted, the page may have stale observers; re-setup to ensure fades run
        setupFadeIn();
        // Also trigger a manual check to reveal elements in view immediately
        if (window.__fadeInObserver) {
            // force each observed target to be re-evaluated by toggling a no-op
            document.querySelectorAll('.fade-in').forEach(el => {
                // reflow then let IntersectionObserver decide
                void el.offsetWidth;
            });
        }
    });

    // Also ensure elements are observed after full load (images/layout may change intersection)
    window.addEventListener('load', function(){
        if (!window.__fadeInObserver) setupFadeIn();
        // trigger a small reflow to prompt observer callbacks
        setTimeout(function(){ document.body.offsetHeight; }, 50);
    }, {once:true});

})();
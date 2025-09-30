// Intercept internal link clicks and fade out the page before navigating.
(function(){
  var FADE_DURATION = 260; // ms, keep in sync with page-transitions.css
  function isModifierKey(e){ return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey; }
  function isInternalLink(a){
    try{ var url = new URL(a.href, location.href); return url.origin === location.origin; }
    catch(err){ return false; }
  }
  document.addEventListener('click', function(ev){
    if (isModifierKey(ev)) return; // allow new-tab/new-window shortcuts
    var a = ev.target.closest && ev.target.closest('a');
    if (!a) return;
    if (a.target && a.target.toLowerCase() === '_blank') return;
    var href = a.getAttribute('href');
    if (!href) return;
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    if (href.startsWith('#')) return; // in-page anchor
    if (a.hasAttribute('download')) return;
    if (!isInternalLink(a)) return; // external links should behave normally
    ev.preventDefault();
    document.documentElement.classList.add('page-exiting');
    try { if (document.activeElement) document.activeElement.blur(); } catch(e){}
    setTimeout(function(){ window.location.href = a.href; }, FADE_DURATION);
  }, {capture: true});
  window.addEventListener('pageshow', function(){ document.documentElement.classList.remove('page-exiting'); });
})();

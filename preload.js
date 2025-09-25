// Swap .is-loading -> .is-loaded on full window load to avoid layout flashes
(function(){
  var docEl = document.documentElement;
  function setLoaded(){
    if(!docEl) return;
    docEl.classList.remove('is-loading');
    // force reflow then add is-loaded for smooth opacity transition
    void docEl.offsetWidth;
    docEl.classList.add('is-loaded');
  }

  if(document.readyState === 'complete'){
    setLoaded();
  } else {
    window.addEventListener('load', setLoaded, {once:true});
    // Fallback: if load doesn't fire within 5s, still reveal content
    setTimeout(function(){
      if(docEl.classList.contains('is-loading')) setLoaded();
    }, 5000);
  }
})();

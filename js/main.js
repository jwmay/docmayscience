(function(){
  // Respect users who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var stripes = Array.prototype.slice.call(document.querySelectorAll('.stripes'));
  var ticking = false;

  // Track the translation we applied so measurements stay stable
  els.forEach(function(el){ el._ty = 0; });

  function update(){
    var vh = window.innerHeight;
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      // Untransformed center = measured center minus what we already applied
      var center = r.top + r.height / 2 - el._ty;
      var offset = center - vh / 2;
      // Only bother while the element is anywhere near the viewport
      if (offset > vh * 1.5 || offset < -vh * 1.5) return;
      var ty = -offset * parseFloat(el.dataset.parallax);
      el._ty = ty;
      el.style.transform = 'translate3d(0,' + ty.toFixed(1) + 'px,0)';
    });
    // Stripe dividers slide sideways like a conveyor as you scroll
    stripes.forEach(function(s){
      s.style.backgroundPositionX = (window.scrollY * 0.35).toFixed(1) + 'px';
    });
    ticking = false;
  }

  function onScroll(){
    if (!ticking){
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

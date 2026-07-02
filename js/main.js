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

// Hero Bohr atom — draws a random element from the first 18 on every load,
// with correct shell filling (2 · 8 · 8). Click the atom or its caption to redraw.
(function(){
  var atom = document.getElementById('bohr-atom');
  var caption = document.getElementById('bohr-caption');
  var captionText = document.getElementById('bohr-caption-text');
  if (!atom || !caption || !captionText) return;

  var ELEMENTS = [
    ['H','Hydrogen'], ['He','Helium'], ['Li','Lithium'], ['Be','Beryllium'],
    ['B','Boron'], ['C','Carbon'], ['N','Nitrogen'], ['O','Oxygen'],
    ['F','Fluorine'], ['Ne','Neon'], ['Na','Sodium'], ['Mg','Magnesium'],
    ['Al','Aluminum'], ['Si','Silicon'], ['P','Phosphorus'], ['S','Sulfur'],
    ['Cl','Chlorine'], ['Ar','Argon']
  ];
  var SHELL_CAPACITY = [2, 8, 8];
  var SPIN_SECONDS = [9, 15, 22]; // matches .shell-1/2/3 durations in styles.css

  function render(z){
    var symbol = ELEMENTS[z - 1][0];
    var name = ELEMENTS[z - 1][1];

    // Fill shells inner-first: 2, then 8, then 8
    var shells = [];
    var remaining = z;
    SHELL_CAPACITY.forEach(function(capacity){
      if (remaining > 0){
        shells.push(Math.min(remaining, capacity));
        remaining -= capacity;
      }
    });

    atom.setAttribute('data-shells', shells.length);
    atom.textContent = '';
    shells.forEach(function(count, i){
      var orbit = document.createElement('div');
      orbit.className = 'orbit orbit-' + (i + 1);
      atom.appendChild(orbit);

      var shell = document.createElement('div');
      shell.className = 'shell shell-' + (i + 1);
      shell.setAttribute('data-count', count);
      // random start angle so shells never load in lockstep
      shell.style.animationDelay = '-' + (Math.random() * SPIN_SECONDS[i]).toFixed(2) + 's';
      for (var k = 0; k < count; k++){
        var arm = document.createElement('div');
        arm.className = 'e-arm';
        var electron = document.createElement('span');
        electron.className = 'electron';
        arm.appendChild(electron);
        shell.appendChild(arm);
      }
      atom.appendChild(shell);
    });

    var nucleus = document.createElement('div');
    nucleus.className = 'nucleus' + (symbol.length > 1 ? ' nucleus--wide' : '');
    nucleus.textContent = symbol;
    atom.appendChild(nucleus);

    captionText.textContent = '№ ' + z + ' · ' + name;
    caption.setAttribute('aria-label',
      'Bohr model of ' + name + ', element ' + z + '. Draw a new random element.');
  }

  var current = 0;
  function shuffle(){
    var z = 1 + Math.floor(Math.random() * ELEMENTS.length);
    if (z === current) z = (z % ELEMENTS.length) + 1; // never the same one twice in a row
    current = z;
    render(z);
  }

  atom.addEventListener('click', shuffle);
  caption.addEventListener('click', shuffle);
  shuffle();
})();

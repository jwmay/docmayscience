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
    var sy = window.scrollY;
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      // Untransformed center = measured center minus what we already applied
      var center = r.top + r.height / 2 - el._ty;
      var offset = center - vh / 2;
      // Only bother while the element is anywhere near the viewport
      if (offset > vh * 1.5 || offset < -vh * 1.5) return;
      // Above-the-fold layers (the hero's sunburst + atom) anchor to their
      // load position — zero shift at the top of the page, so stacked art
      // stays concentric at any window size. Deeper elements anchor to the
      // viewport center, aligning as you scroll them into view. Same drift
      // speed either way; only the resting point differs.
      var docTop = center - r.height / 2 + sy;
      var ty = (docTop < vh ? sy : -offset) * parseFloat(el.dataset.parallax);
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

// Periodic table modal — builds the 18-column table from js/elements.js,
// shows a detail card (mini Bohr model + key data) for the clicked element.
(function(){
  var data = window.PT_ELEMENTS;
  var cats = window.PT_CATEGORIES;
  var openBtn = document.getElementById('pt-open');
  var dialog = document.getElementById('pt-modal');
  var closeBtn = document.getElementById('pt-close');
  var grid = document.getElementById('pt-grid');
  var detail = document.getElementById('pt-detail');
  var legend = document.getElementById('pt-legend');
  if (!data || !cats || !openBtn || !dialog || !closeBtn || !grid || !detail || !legend
      || typeof dialog.showModal !== 'function') return;

  var catLabel = {};
  cats.forEach(function(c){ catLabel[c.k] = c.label; });

  var byNum = {}, byPos = {}, tileByNum = {};
  data.forEach(function(el){
    byNum[el.n] = el;
    byPos[el.x + ',' + el.y] = el;
  });

  // ---- table tiles ----
  data.forEach(function(el){
    var tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'pt-el cat-' + el.c;
    tile.style.gridColumn = el.x;
    tile.style.gridRow = el.y; // grid row 8 is a spacer before the La/Ac rows
    tile.dataset.n = el.n;
    tile.setAttribute('aria-label', el.name + ', element ' + el.n);
    var num = document.createElement('span');
    num.className = 'num';
    num.setAttribute('aria-hidden', 'true');
    num.textContent = el.n;
    tile.appendChild(num);
    tile.appendChild(document.createTextNode(el.s));
    tile.addEventListener('click', function(){ select(el); });
    tileByNum[el.n] = tile;
    grid.appendChild(tile);
  });

  // markers where the pulled-out lanthanide/actinide rows belong
  [['57–71', 6], ['89–103', 7]].forEach(function(gap){
    var m = document.createElement('div');
    m.className = 'pt-gap';
    m.setAttribute('aria-hidden', 'true');
    m.style.gridColumn = 3;
    m.style.gridRow = gap[1];
    m.textContent = gap[0];
    grid.appendChild(m);
  });

  // ---- legend (hovering a chip spotlights that category) ----
  cats.forEach(function(c){
    var li = document.createElement('li');
    var sw = document.createElement('span');
    sw.className = 'swatch cat-' + c.k;
    li.appendChild(sw);
    li.appendChild(document.createTextNode(c.label));
    li.addEventListener('mouseenter', function(){
      grid.classList.add('hl');
      data.forEach(function(el){
        tileByNum[el.n].classList.toggle('on', el.c === c.k);
      });
    });
    li.addEventListener('mouseleave', function(){ grid.classList.remove('hl'); });
    legend.appendChild(li);
  });

  // ---- detail card ----
  var BOHR_COLORS = ['#d9672d', '#e9a63a', '#7d8c3f', '#5b3790'];

  function bohrSvg(el){
    var C = 80, shells = el.sh;
    var s = '<svg viewBox="0 0 160 160" role="img" aria-label="Bohr model of ' +
            el.name + ': ' + shells.join(', ') + ' electrons per shell">';
    shells.forEach(function(count, i){
      var r = shells.length === 1 ? 50 : 28 + i * (72 - 28) / (shells.length - 1);
      s += '<circle cx="' + C + '" cy="' + C + '" r="' + r.toFixed(1) +
           '" fill="none" stroke="#2c1e42" stroke-width="1.75"' +
           (i % 2 ? ' stroke-dasharray="4 5"' : '') + '/>';
      s += '<g class="pt-shell" style="--dur:' + (10 + i * 5) + 's;' +
           (i % 2 ? 'animation-direction:reverse;' : '') + '">';
      var dot = count >= 24 ? 3 : 4;
      for (var k = 0; k < count; k++){
        var a = -Math.PI / 2 + k * 2 * Math.PI / count;
        s += '<circle cx="' + (C + r * Math.cos(a)).toFixed(1) +
             '" cy="' + (C + r * Math.sin(a)).toFixed(1) + '" r="' + dot +
             '" fill="' + BOHR_COLORS[i % 4] + '" stroke="#2c1e42" stroke-width="1.5"/>';
      }
      s += '</g>';
    });
    s += '<circle cx="' + C + '" cy="' + C + '" r="17" fill="#5b3790" stroke="#2c1e42" stroke-width="2.5"/>';
    s += '<text class="nucleus-sym" x="' + C + '" y="' + (C + 1) + '" text-anchor="middle" ' +
         'dominant-baseline="central" fill="#e9a63a" font-size="' +
         (el.s.length > 1 ? 12.5 : 15) + '">' + el.s + '</text>';
    return s + '</svg>';
  }

  function supConfig(ec){
    // the dataset stars predicted configs (superheavies); too cryptic to show
    return ec.replace(/^\*/, '').replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>');
  }
  function toC(k){
    return k == null ? '—' : Math.round(k - 273.15).toLocaleString('en-US') + ' °C';
  }
  function datum(label, value){
    return '<div><dt>' + label + '</dt><dd>' + value + '</dd></div>';
  }

  var selected = null;
  function select(el){
    if (selected) tileByNum[selected.n].classList.remove('is-selected');
    selected = el;
    tileByNum[el.n].classList.add('is-selected');
    try { localStorage.setItem('dms.pt.selected', el.n); } catch (e) {} // remember across visits

    detail.innerHTML =
      '<div class="pt-bohr">' + bohrSvg(el) + '</div>' +
      '<div class="pt-id">' +
        '<div class="pt-id-tile cat-' + el.c + '">' +
          '<span class="num">' + el.n + '</span>' +
          '<span class="sym">' + el.s + '</span>' +
          '<span class="mass">' + el.m + '</span>' +
        '</div>' +
        '<div class="pt-id-text">' +
          '<h3>' + el.name + '</h3>' +
          '<span class="pt-cat-chip cat-' + el.c + '">' + catLabel[el.c] + '</span>' +
          '<p class="pt-meta">' +
            (el.g ? 'Group ' + el.g + ' · ' : '') + 'Period ' + el.p +
            '<br>Atomic mass ' + el.m + ' u' +
            (el.d ? '<br>Discovery: ' + el.d : '') +
          '</p>' +
        '</div>' +
      '</div>' +
      '<dl class="pt-data">' +
        datum('Electron config', supConfig(el.ec)) +
        datum('Shells', el.sh.join(' · ')) +
        datum('Electronegativity', el.en != null ? el.en : '—') +
        datum('1st ionization', el.ie != null ? el.ie.toLocaleString('en-US') + ' kJ/mol' : '—') +
        datum('Melting point', toC(el.melt)) +
        datum('Boiling point', toC(el.boil)) +
        datum('Density', el.den != null ? el.den + (el.ph === 'Gas' ? ' g/L' : ' g/cm³') : '—') +
        datum('State (25 °C)', el.ph) +
      '</dl>';
  }

  // ---- arrow-key navigation across the table ----
  grid.addEventListener('keydown', function(e){
    var t = e.target.closest && e.target.closest('.pt-el');
    if (!t) return;
    var el = byNum[+t.dataset.n], next = null;
    if (e.key === 'ArrowRight') next = byNum[el.n + 1];
    else if (e.key === 'ArrowLeft') next = byNum[el.n - 1];
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){
      // hop over the spacer row and the 57–71 / 89–103 markers
      var dir = e.key === 'ArrowUp' ? -1 : 1;
      for (var dy = 1; dy <= 3 && !next; dy++){
        next = byPos[el.x + ',' + (el.y + dir * dy)];
      }
    } else return;
    if (next){
      e.preventDefault();
      tileByNum[next.n].focus();
    }
  });

  // ---- open / close ----
  function open(){
    dialog.showModal();
    // reopen on the user's last selection (saved in localStorage); with nothing
    // saved it falls back to gold (Au, 79) — data-complete, and its 6-shell Bohr
    // model shows off
    if (!selected){
      var saved;
      try { saved = parseInt(localStorage.getItem('dms.pt.selected'), 10); } catch (e) {}
      select(byNum[saved] || byNum[79]);
    }
  }
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', function(){ dialog.close(); });
  dialog.addEventListener('click', function(e){
    if (e.target === dialog) dialog.close(); // backdrop click
  });
  // #periodic-table deep-links straight into the modal
  if (location.hash === '#periodic-table') open();
})();

// Publications — collapse to the first three, with a "show all" toggle that
// expands the rest. The list ships fully expanded (works with no JS and for
// crawlers); the inline <script> in <head> adds the `js` class the CSS uses to
// collapse it before first paint. Under reduced motion the grid-rows transition
// is disabled globally, so the toggle just snaps.
(function(){
  var more = document.getElementById('pub-more');
  var toggle = document.getElementById('pub-toggle');
  if (!more || !toggle) return;
  var label = toggle.querySelector('.pub-toggle-label');

  function setOpen(open){
    more.classList.toggle('is-collapsed', !open);
    more.inert = !open; // keep the hidden cards out of tab order / off screen readers
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Show fewer' : 'Show all 10 publications';
  }

  setOpen(false); // start collapsed (CSS already collapsed it pre-paint)
  toggle.addEventListener('click', function(){
    setOpen(more.classList.contains('is-collapsed'));
  });
})();

// Footer copyright year — the markup ships a hardcoded year as a no-JS
// fallback; refresh it to the current year on load so it never goes stale.
// Single footer, so getElementById is enough. If a second page ever gets its
// own footer, switch to a [data-year] attribute selector so one script covers
// all of them (as chemlessons.xyz does).
(function(){
  var year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();
})();

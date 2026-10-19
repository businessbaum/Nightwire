/* NIGHTWIRE — engine/crt.js — the physical screen effects */
(function (NW) {
  'use strict';
  var U = NW.util;
  var cv, g, w, h, raf = null, frame = 0;

  function init() {
    cv = U.$('#noise');
    if (!cv) return;
    resize();
    window.addEventListener('resize', resize);
    loop();
    applySettings();
  }

  function resize() {
    if (!cv) return;
    w = Math.max(1, Math.floor(cv.clientWidth / 3));
    h = Math.max(1, Math.floor(cv.clientHeight / 3));
    cv.width = w; cv.height = h;
    g = cv.getContext('2d');
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    frame++;
    if (!g || frame % 3) return;
    var img = g.createImageData(w, h);
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = Math.random() * 255;
      d[i] = v; d[i + 1] = v * 0.75; d[i + 2] = v * 0.35; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }

  /* ══════════ PHOSPHOR ══════════
     The canvas programs cannot read CSS variables, so the theme is resolved
     once here and handed to them as numbers. */
  var THEMES = [
    { id: 'ice',   name: 'ICE',   sub: 'COLD MONOCHROME · THE INSTITUTIONAL MONITOR' },
    { id: 'bone',  name: 'BONE',  sub: 'WARM PAPER-WHITE · THE QUIET ONE' },
    { id: 'amber', name: 'AMBER', sub: 'P3 PHOSPHOR · THE ORIGINAL TUBE' },
    { id: 'green', name: 'P1',    sub: 'GREEN PHOSPHOR · THE OLD ONE' }
  ];
  var cache = {};

  function readVar(name) {
    if (cache[name] !== undefined) return cache[name];
    var v = window.getComputedStyle(document.body).getPropertyValue(name).trim();
    cache[name] = v;
    return v;
  }
  function css(name) { return readVar(name) || '#c8d8de'; }
  function rgb() {
    var parts = readVar('--phos-rgb').split(',').map(function (x) { return parseInt(x, 10); });
    return parts.length === 3 && !isNaN(parts[0]) ? parts : [200, 216, 222];
  }
  function applyTheme() {
    var id = NW.state.settings().theme || 'ice';
    if (!THEMES.some(function (t) { return t.id === id; })) id = 'ice';
    document.body.className = 'theme-' + id;
    cache = {};
    var lbl = NW.util.$('.bz-label');
    var t = THEMES.filter(function (x) { return x.id === id; })[0];
    if (lbl) lbl.textContent = 'CONSOLIDATED ELECTRIC · MODEL VT-880 · ' + t.name;
    NW.bus.emit('theme', id);
    // the canvas programs cache nothing about colour, but they only repaint on
    // demand — nudge whatever is open so the swap is immediate
    if (NW.win) NW.win.all().forEach(function (w) { NW.bus.emit('win:resize', w); });
    if (NW.apps) NW.apps.renderRail();
  }

  function applySettings() {
    var s = NW.state.settings();
    var r = document.documentElement;
    applyTheme();
    r.style.setProperty('--scan-op', s.scan);
    r.style.setProperty('--noise-op', s.noise);
    r.style.setProperty('--flick', s.flicker);
    r.style.setProperty('--curve', s.curve);
    NW.audio.setMaster(s.master);
    NW.audio.setSfx(s.sfx);
    NW.audio.setAmbient(s.ambient * 0.12);
    NW.audio.setInput(s.keys === undefined ? 0.7 : s.keys);
  }

  /** brief power-on ramp */
  function powerOn() {
    var scr = U.$('#screen');
    scr.style.transition = 'none';
    scr.style.filter = 'brightness(0)';
    U.$('#power-led').classList.add('on');
    setTimeout(function () {
      scr.style.transition = 'filter .9s cubic-bezier(.2,.9,.3,1)';
      scr.style.filter = 'brightness(1.6) contrast(2)';
      setTimeout(function () { scr.style.filter = 'none'; }, 500);
    }, 90);
  }

  NW.crt = { init: init, applySettings: applySettings, powerOn: powerOn };
  NW.theme = { list: THEMES, css: css, rgb: rgb, apply: applyTheme,
               current: function () { return NW.state.settings().theme || 'ice'; } };
})(window.NW);

/* NIGHTWIRE — apps/cartograph.js
   County map and cellular triangulation. Three ranges give a point; the point
   is a circle with a building in it. */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var MILES_PER_UNIT = 0.025;

  var TRACES = [
    {
      id: 'tr_mill', label: 'HANDSET 555-0288 · 11/04/98 23:07',
      requires: 'trace_mill',
      answer: { x: 372, y: 470 }, tol: 46,
      sites: [
        { t: 't_mrw',  err: 0.35 },
        { t: 't_ald1', err: 0.55 },
        { t: 't_rt9',  err: 1.10 }
      ],
      onSolve: {
        evidence: ['ev_triangulated'], flag: 'triangulated_mill',
        title: 'FIX ESTABLISHED',
        text: 'The 23:07 handset sat inside the footprint of the Marrow Street paper mill. ' +
              'Whoever said "he\'s in the deep end" was standing in a building that has been closed since 1994.'
      }
    },
    {
      id: 'tr_grieve', label: 'HANDSET 555-0100 · 11/07/98 01:52',
      requires: 'trace_grieve',
      answer: { x: 236, y: 168 }, tol: 52,
      sites: [
        { t: 't_mrw', err: 0.60 },
        { t: 't_ash', err: 0.95 },
        { t: 't_qry', err: 1.30 }
      ],
      onSolve: {
        evidence: ['ev_grieve_power'], flag: 'triangulated_grieve', place: 'pl_grieve',
        title: 'FIX ESTABLISHED — RIDGE',
        text: 'The Deputy Chief\'s car phone is on Grieve Hill at two o\'clock in the morning, ' +
              'eleven miles from his house, at a state hospital that has been shut since 1989.'
      }
    }
  ];

  function build(body) {
    var v = { z: 0.62, ox: 0, oy: 0, trace: null, plotted: false, fix: null, hover: null };

    var tools = el('div.toolbar');
    var stage = el('div.map-stage');
    var cv = NW.gfx.make(800, 560);
    var hud = el('div.map-hud');
    var legend = el('div.map-legend', { html:
      '<i style="background:#6dfba6"></i>TOWN&nbsp;&nbsp;<i style="background:#ffb63d"></i>SITE&nbsp;&nbsp;' +
      '<i style="background:#58d7de"></i>CELL&nbsp;&nbsp;<i style="background:#ff5340"></i>FIX' });
    var tri = el('div.tri-panel');
    stage.appendChild(cv); stage.appendChild(hud); stage.appendChild(legend);
    body.appendChild(el('div.app.map-app', null, [tools, stage, tri]));
    var g = cv.getContext('2d');

    function fit() {
      var r = stage.getBoundingClientRect();
      cv.width = Math.max(300, Math.floor(r.width));
      cv.height = Math.max(200, Math.floor(r.height));
      if (!v.userPanned) centre(); else draw();
    }
    NW.bus.on('win:resize', function (w) { if (w.id === 'cartograph') fit(); });

    function toScreen(p) {
      return { x: p.x * v.z + v.ox, y: p.y * v.z + v.oy };
    }
    function toWorld(sx, sy) {
      return { x: (sx - v.ox) / v.z, y: (sy - v.oy) / v.z };
    }

    function renderTools() {
      U.clear(tools);
      tools.appendChild(el('span.tb-title', { text: 'VANDERMEER COUNTY' }));
      var avail = TRACES.filter(function (t) { return NW.state.has(t.requires); });
      if (!avail.length) tools.appendChild(el('span', { class: 'dim', text: 'NO CELLULAR TRACE HELD' }));
      avail.forEach(function (t) {
        var b = el('button.btn', { text: t.id === 'tr_mill' ? 'TRACE 0288' : 'TRACE 0100', class: v.trace && v.trace.id === t.id ? 'on' : '', title: t.label });
        U.on(b, 'click', function () { v.trace = t; v.plotted = false; v.fix = null; NW.audio.play('disk'); renderTools(); renderTri(); draw(); });
        tools.appendChild(b);
      });
      var zi = el('button.btn', { text: '+', style: { marginLeft: 'auto' } });
      U.on(zi, 'click', function () { v.z = U.clamp(v.z * 1.25, 0.3, 3); draw(); });
      var zo = el('button.btn', { text: '−' });
      U.on(zo, 'click', function () { v.z = U.clamp(v.z / 1.25, 0.3, 3); draw(); });
      var ct = el('button.btn', { text: 'CENTRE' });
      U.on(ct, 'click', function () { centre(); });
      tools.appendChild(zi); tools.appendChild(zo); tools.appendChild(ct);
    }

    function centre() {
      v.z = Math.min(cv.width / 1050, cv.height / 1050);
      v.ox = (cv.width - 1000 * v.z) / 2;
      v.oy = (cv.height - 1000 * v.z) / 2;
      draw();
    }

    /* ── drawing ── */
    function draw() {
      g.fillStyle = '#06090a'; g.fillRect(0, 0, cv.width, cv.height);

      // grid
      g.strokeStyle = 'rgba(109,251,166,.07)'; g.lineWidth = 1;
      for (var i = 0; i <= 1000; i += 50) {
        var a = toScreen({ x: i, y: 0 }), b = toScreen({ x: i, y: 1000 });
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        var c = toScreen({ x: 0, y: i }), d = toScreen({ x: 1000, y: i });
        g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(d.x, d.y); g.stroke();
      }

      // water
      NW.places.water.forEach(function (w) {
        g.strokeStyle = w.kind === 'coast' ? 'rgba(88,215,222,.5)' : 'rgba(88,215,222,.32)';
        g.lineWidth = w.kind === 'coast' ? 2.5 : 1.6;
        g.beginPath();
        w.pts.forEach(function (p, i) {
          var s = toScreen({ x: p[0], y: p[1] });
          if (i) g.lineTo(s.x, s.y); else g.moveTo(s.x, s.y);
        });
        g.stroke();
        if (w.kind === 'coast') {
          g.fillStyle = 'rgba(20,50,60,.35)';
          g.lineTo(cv.width, cv.height); g.lineTo(0, cv.height); g.closePath(); g.fill();
        }
      });

      // roads
      NW.places.roads.forEach(function (r) {
        g.strokeStyle = 'rgba(109,251,166,.30)'; g.lineWidth = 1.4;
        g.beginPath();
        r.pts.forEach(function (p, i) {
          var s = toScreen({ x: p[0], y: p[1] });
          if (i) g.lineTo(s.x, s.y); else g.moveTo(s.x, s.y);
        });
        g.stroke();
        var mid = toScreen({ x: r.pts[Math.floor(r.pts.length / 2)][0], y: r.pts[Math.floor(r.pts.length / 2)][1] });
        g.fillStyle = 'rgba(109,251,166,.35)'; g.font = '8px "Consolas",monospace';
        g.fillText(r.name, mid.x + 4, mid.y - 4);
      });

      // trace rings
      if (v.trace && v.plotted) {
        v.trace.sites.forEach(function (site, k) {
          var tw = NW.places.towers.filter(function (t) { return t.id === site.t; })[0];
          var d = dist(tw, v.trace.answer);
          var s = toScreen(tw);
          var rIn = Math.max(0, d - site.err / MILES_PER_UNIT) * v.z;
          var rOut = (d + site.err / MILES_PER_UNIT) * v.z;
          g.strokeStyle = ['rgba(255,182,61,.55)', 'rgba(88,215,222,.5)', 'rgba(185,140,255,.5)'][k % 3];
          g.lineWidth = 1;
          g.beginPath(); g.arc(s.x, s.y, rIn, 0, 7); g.stroke();
          g.beginPath(); g.arc(s.x, s.y, rOut, 0, 7); g.stroke();
          g.globalAlpha = 0.05;
          g.fillStyle = g.strokeStyle;
          g.beginPath(); g.arc(s.x, s.y, rOut, 0, 7); g.arc(s.x, s.y, rIn, 0, 7, true); g.fill();
          g.globalAlpha = 1;
        });
      }

      // towers
      NW.places.towers.forEach(function (t) {
        var s = toScreen(t);
        g.strokeStyle = '#58d7de'; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(s.x - 5, s.y + 6); g.lineTo(s.x, s.y - 7); g.lineTo(s.x + 5, s.y + 6); g.stroke();
        g.beginPath(); g.arc(s.x, s.y - 7, 3, 0, 7); g.stroke();
        g.fillStyle = 'rgba(88,215,222,.6)'; g.font = '8px "Consolas",monospace';
        g.fillText(t.name.split('—')[1] || t.name, s.x + 8, s.y + 3);
      });

      // places
      NW.places.visible().forEach(function (p) {
        var s = toScreen(p);
        var col = p.kind === 'town' ? '#6dfba6' : p.kind === 'gov' ? '#b98cff' : '#ffb63d';
        g.fillStyle = col;
        if (p.kind === 'town') { g.beginPath(); g.arc(s.x, s.y, 4, 0, 7); g.fill(); }
        else { g.fillRect(s.x - 3, s.y - 3, 6, 6); }
        g.fillStyle = 'rgba(255,255,255,.8)'; g.font = (p.kind === 'town' ? 'bold ' : '') + '9px "Consolas",monospace';
        g.fillStyle = col;
        g.fillText(p.name, s.x + 7, s.y + 3);
        if (S().flags['pin_' + p.id]) {
          g.strokeStyle = '#ff5340'; g.lineWidth = 1.2;
          g.beginPath(); g.arc(s.x, s.y, 11, 0, 7); g.stroke();
        }
      });

      // fix
      if (v.fix) {
        var f = toScreen(v.fix);
        g.strokeStyle = '#ff5340'; g.lineWidth = 1.6;
        g.beginPath(); g.arc(f.x, f.y, 10, 0, 7); g.stroke();
        g.beginPath(); g.moveTo(f.x - 16, f.y); g.lineTo(f.x + 16, f.y);
        g.moveTo(f.x, f.y - 16); g.lineTo(f.x, f.y + 16); g.stroke();
      }

      hud.textContent = v.trace ? v.trace.label : 'NO TRACE · ' + NW.places.visible().length + ' LOCATIONS';
    }

    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

    /* ── panel ── */
    function renderTri() {
      U.clear(tri);
      if (!v.trace) {
        tri.appendChild(el('div', { class: 'dim', style: { fontSize: '11px' },
          text: 'No cellular trace loaded. Drag to pan, wheel to zoom.' }));
        return;
      }
      tri.appendChild(el('div', { style: { fontSize: '10px', letterSpacing: '.16em', color: 'var(--green)', marginBottom: '6px' },
        text: 'SITE REGISTRATIONS — ' + v.trace.label }));
      v.trace.sites.forEach(function (site) {
        var tw = NW.places.towers.filter(function (t) { return t.id === site.t; })[0];
        var d = dist(tw, v.trace.answer) * MILES_PER_UNIT;
        tri.appendChild(el('div.tri-row', null, [
          el('span.tr-name', { text: tw.name }),
          el('span.tr-val', { text: d.toFixed(1) + ' mi' }),
          el('span', { class: 'dim', text: '±' + site.err.toFixed(2) + ' mi' }),
          el('span', { class: 'dim', text: '· RSSI ' + Math.round(-40 - d * 5.5) + ' dBm' })
        ]));
      });
      var bar = el('div', { style: { display: 'flex', gap: '8px', marginTop: '8px' } });
      var plot = el('button.btn.good', { text: v.plotted ? '◇ RANGES PLOTTED' : '◇ PLOT RANGES' });
      U.on(plot, 'click', function () { v.plotted = true; NW.audio.play('scan'); renderTri(); draw(); });
      bar.appendChild(plot);
      var msg = el('span', { class: 'dim', style: { fontSize: '10px', alignSelf: 'center' },
        text: v.plotted ? 'Click the map where the three bands overlap.' : 'Plot the ranges first.' });
      bar.appendChild(msg);
      tri.appendChild(bar);
    }

    /* ── interaction ── */
    U.drag(cv, function () { stage.classList.add('grabbing'); }, function (dx, dy) {
      v.userPanned = true;
      v.ox += dx - (v._lx || 0); v.oy += dy - (v._ly || 0);
      v._lx = dx; v._ly = dy; draw();
    }, function (e, moved) {
      stage.classList.remove('grabbing'); v._lx = 0; v._ly = 0;
      if (!moved) click(e);
    });

    U.on(cv, 'wheel', function (e) {
      e.preventDefault();
      var r = cv.getBoundingClientRect();
      var mx = e.clientX - r.left, my = e.clientY - r.top;
      var w0 = toWorld(mx, my);
      v.z = U.clamp(v.z * (e.deltaY < 0 ? 1.15 : 1 / 1.15), 0.3, 3);
      v.ox = mx - w0.x * v.z; v.oy = my - w0.y * v.z;
      draw();
    }, { passive: false });

    function click(e) {
      var r = cv.getBoundingClientRect();
      var w = toWorld(e.clientX - r.left, e.clientY - r.top);

      // place click?
      var hit = NW.places.visible().filter(function (p) { return dist(p, w) < 16 / v.z; })[0];
      if (hit && !(v.trace && v.plotted)) {
        NW.audio.play('click');
        S().flags['pin_' + hit.id] = !S().flags['pin_' + hit.id];
        NW.notify.push({ head: hit.name, body: hit.sub, kind: 'info', ms: 3000 });
        draw();
        return;
      }

      if (v.trace && v.plotted && !NW.state.has(v.trace.onSolve.flag)) {
        v.fix = w;
        draw();
        var d = dist(w, v.trace.answer);
        if (d <= v.trace.tol) {
          NW.audio.play('good');
          var os = v.trace.onSolve;
          NW.state.flag(os.flag, true);
          if (os.place) NW.state.flag('place_' + os.place, true);
          (os.evidence || []).forEach(function (x) { NW.state.addEvidence(x); });
          NW.state.addFact('CARTOGRAPH', os.text);
          NW.notify.overlay({ title: os.title, sub: v.trace.label, body: [U.esc(os.text)], buttons: [{ label: 'LOG IT', value: 1 }] });
          draw();
        } else {
          NW.audio.play('bad');
          NW.notify.push({ head: 'OUTSIDE THE BANDS', body: 'That point does not satisfy all three ranges.', kind: 'bad', ms: 2600 });
        }
      }
    }

    renderTools(); renderTri();
    setTimeout(function () { fit(); centre(); }, 30);
  }

  NW.apps.define({
    id: 'cartograph', name: 'CARTOGRAPH', short: 'MAP', icon: 'cartograph',
    hint: 'county map & cellular triangulation',
    win: { w: 820, h: 620, min: [600, 460], tint: '#6dfba6' },
    build: build
  });
})(window.NW);

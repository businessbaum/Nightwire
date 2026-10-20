/* NIGHTWIRE — apps/imagelab.js
   Photo enhancement. Clues are drawn at very low contrast and only show once
   the operator pushes the image. */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var SRC_W = 1280, SRC_H = 820;
  var srcCache = {};

  function source(ph) {
    if (!srcCache[ph.id]) srcCache[ph.id] = NW.gfx.scene(ph.scene, ph.seed, SRC_W, SRC_H);
    return srcCache[ph.id];
  }

  function build(body, win, arg) {
    var v = { zoom: 1, cx: 0.5, cy: 0.5, bright: 0, contrast: 1, gamma: 1, invert: false, edge: false, ph: null };

    var tools = el('div.toolbar');
    var view = el('div.il-view');
    var ctrl = el('div.il-ctrl');
    var info = el('div', { class: 'pad dim', style: { fontSize: '11px', borderTop: '1px solid var(--phos-ghost)', minHeight: '46px', lineHeight: '1.6' } });
    body.appendChild(el('div.app', null, [tools, view, ctrl, info]));

    var cv = NW.gfx.make(640, 420);
    view.appendChild(cv);
    var hint = el('div.il-hint');
    view.appendChild(hint);
    var g = cv.getContext('2d');

    function fitCanvas() {
      var r = view.getBoundingClientRect();
      var w = Math.max(200, Math.floor(r.width) - 2), h = Math.max(150, Math.floor(r.height) - 2);
      var ar = SRC_W / SRC_H;
      if (w / h > ar) w = Math.floor(h * ar); else h = Math.floor(w / ar);
      cv.width = w; cv.height = h;
      draw();
    }
    win.listen('win:resize', function (wn) { if (wn.id === 'imagelab') fitCanvas(); });
    win.listen('flag', function (d) { if (/^photo_/.test(d.key)) renderTools(); });

    function renderTools() {
      U.clear(tools);
      tools.appendChild(el('span.tb-title', { text: 'EXHIBIT' }));
      var list = NW.media.availablePhotos();
      if (!list.length) tools.appendChild(el('span', { class: 'dim', text: 'NO EXHIBITS HELD' }));
      list.forEach(function (p) {
        var b = el('button.btn', { text: p.title.split('—')[0].trim(), class: v.ph && v.ph.id === p.id ? 'on' : '', title: p.title });
        U.on(b, 'click', function () { load(p.id); });
        tools.appendChild(b);
      });
    }

    function load(id) {
      var p = NW.media.photo(id);
      if (!p) return;
      v.ph = p; v.zoom = 1; v.cx = 0.5; v.cy = 0.5;
      NW.audio.play('shutter');
      renderTools();
      updateInfo();
      draw();
    }

    function updateInfo() {
      var p = v.ph;
      if (!p) { hint.classList.add('hidden'); return; }
      var found = p.finds.filter(function (f) { return S().flags['find_' + f.id]; }).length;
      var all = found >= p.finds.length;

      hint.classList.remove('hidden');
      hint.classList.toggle('done', all);
      hint.innerHTML = all
        ? '✓ EXHIBIT WORKED — ' + p.finds.length + ' OF ' + p.finds.length + ' MARKED'
        : '◎ <b>CLICK ON THE IMAGE</b> TO MARK WHAT YOU SEE &nbsp;·&nbsp; RAISE CONTRAST FIRST &nbsp;·&nbsp; ' +
          found + ' OF ' + p.finds.length + ' MARKED';
      info.innerHTML = '<span class="mono-hi">' + U.esc(p.title) + '</span> &nbsp;·&nbsp; ' + U.esc(p.cap) +
        '<br><span style="color:' + (all ? 'var(--green)' : 'var(--phos-dim)') + '">' +
        (all ? 'Everything this frame had to give has been recovered.'
             : 'Raise CONTRAST until the shadows separate, then <b>click directly on anything that appears</b>. ' +
               'The terminal will tell you when you are close.') +
        ' &nbsp;·&nbsp; ' + found + ' of ' + p.finds.length + ' detail(s) recovered.</span>';
    }

    function slider(label, key, min, max, step, fmt) {
      var val = el('span', { text: fmt(v[key]) });
      var inp = el('input', { type: 'range', min: min, max: max, step: step, value: v[key] });
      U.on(inp, 'input', function () { v[key] = parseFloat(inp.value); val.textContent = fmt(v[key]); draw(); });
      return el('div.slider-grp', null, [el('label', null, [el('span', { text: label }), val]), inp]);
    }

    ctrl.appendChild(slider('BRIGHTNESS', 'bright', -0.5, 0.5, 0.01, function (x) { return (x >= 0 ? '+' : '') + Math.round(x * 100); }));
    ctrl.appendChild(slider('CONTRAST', 'contrast', 0.4, 3, 0.05, function (x) { return x.toFixed(2) + '×'; }));
    ctrl.appendChild(slider('GAMMA', 'gamma', 0.4, 2, 0.05, function (x) { return x.toFixed(2); }));
    ctrl.appendChild(slider('ZOOM', 'zoom', 1, 8, 0.1, function (x) { return x.toFixed(1) + '×'; }));

    var btns = el('div', { style: { display: 'flex', gap: '6px', alignItems: 'flex-end' } });
    var bInv = el('button.btn', { text: 'INVERT' });
    U.on(bInv, 'click', function () { v.invert = !v.invert; bInv.classList.toggle('on', v.invert); draw(); });
    var bEdge = el('button.btn', { text: 'EDGE' });
    U.on(bEdge, 'click', function () { v.edge = !v.edge; bEdge.classList.toggle('on', v.edge); draw(); });
    var bRes = el('button.btn', { text: 'RESET' });
    U.on(bRes, 'click', function () {
      v.bright = 0; v.contrast = 1; v.gamma = 1; v.zoom = 1; v.cx = 0.5; v.cy = 0.5; v.invert = false; v.edge = false;
      bInv.classList.remove('on'); bEdge.classList.remove('on');
      U.$$('input[type=range]', ctrl).forEach(function (i, k) { i.value = [0, 1, 1, 1][k]; });
      U.$$('.slider-grp label span:last-child', ctrl).forEach(function (s, k) { s.textContent = ['+0', '1.00×', '1.00', '1.0×'][k]; });
      draw();
    });
    btns.appendChild(bInv); btns.appendChild(bEdge); btns.appendChild(bRes);
    ctrl.appendChild(btns);

    /* ── pan ── (util.drag reports the delta since drag start, so difference it) */
    var lastDx = 0, lastDy = 0;
    U.drag(cv, function () { lastDx = 0; lastDy = 0; cv.classList.add('grabbing'); }, function (dx, dy) {
      var ix = dx - lastDx, iy = dy - lastDy;
      lastDx = dx; lastDy = dy;
      v.cx = U.clamp(v.cx - ix / cv.width / v.zoom, 0, 1);
      v.cy = U.clamp(v.cy - iy / cv.height / v.zoom, 0, 1);
      draw();
    }, function (e, moved) {
      cv.classList.remove('grabbing');
      lastDx = 0; lastDy = 0;
      if (!moved) probe(e);
    });

    U.on(cv, 'wheel', function (e) {
      e.preventDefault();
      v.zoom = U.clamp(v.zoom * (e.deltaY < 0 ? 1.18 : 1 / 1.18), 1, 8);
      U.$$('input[type=range]', ctrl)[3].value = v.zoom;
      draw();
    }, { passive: false });

    /* ── the search ── */
    function probe(e) {
      if (!v.ph) return;
      var r = cv.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var sw = 1 / v.zoom, sh = 1 / v.zoom;
      var sx = U.clamp(v.cx - sw / 2, 0, 1 - sw), sy = U.clamp(v.cy - sh / 2, 0, 1 - sh);
      var u = sx + px * sw, w = sy + py * sh;

      var hit = null, near = null, warm = null;
      v.ph.finds.forEach(function (f) {
        // distance in image-width units, so the tolerance is a circle on screen
        var d = Math.hypot(u - f.x, (w - f.y) * (SRC_H / SRC_W));
        var lit = v.contrast >= f.minContrast;
        if (d < f.r) { if (lit) hit = hit || f; else near = near || f; }
        else if (d < f.r * 2.6) { if (lit) warm = warm || f; else near = near || f; }
      });

      // always show where the click landed
      v.ping ={ u: u, w: w, t: Date.now(), ok: !!hit };
      draw();
      setTimeout(function () { if (v.ping && Date.now() - v.ping.t > 900) { v.ping = null; draw(); } }, 1000);

      if (hit) {
        if (S().flags['find_' + hit.id]) {
          NW.notify.push({ head: 'ALREADY MARKED', body: hit.label, kind: 'info', ms: 2000 });
          return;
        }
        NW.state.flag('find_' + hit.id, true);
        NW.audio.play('good');
        if (hit.evidence) NW.state.addEvidence(hit.evidence);
        NW.state.addFact('IMAGE LAB', hit.label + ' — ' + v.ph.title);
        NW.notify.overlay({
          title: 'DETAIL RECOVERED', sub: v.ph.title,
          body: ['<b>' + U.esc(hit.label) + '</b>', U.esc(hit.note)],
          buttons: [{ label: 'LOG IT', value: 1 }]
        });
        updateInfo();
        draw();
      } else if (near) {
        NW.audio.play('bad');
        NW.notify.push({ head: 'UNDER-EXPOSED',
          body: 'There is something in this part of the frame and the exposure is hiding it. Push CONTRAST up.',
          kind: 'bad', ms: 4200 });
      } else if (warm) {
        NW.audio.play('beep');
        NW.notify.push({ head: 'CLOSE',
          body: 'Detail in this quadrant of the frame. Zoom in and mark it exactly.',
          kind: 'info', ms: 3200 });
      } else {
        NW.audio.play('click');
      }
    }

    /* ── render ── */
    var frame = { key: null, img: null };
    var LUT_N = 1024;

    function process(sx, sy, sw, sh) {
      g.imageSmoothingEnabled = v.zoom < 3;
      g.drawImage(source(v.ph), sx, sy, sw, sh, 0, 0, cv.width, cv.height);

      var TINT = NW.theme.rgb();
      var img = g.getImageData(0, 0, cv.width, cv.height);
      var d = img.data;
      var lum = new Float32Array(cv.width * cv.height);
      for (var i = 0, k = 0; i < d.length; i += 4, k++) {
        lum[k] = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255;
      }
      if (v.edge) {
        var out = new Float32Array(lum.length);
        var W = cv.width, H = cv.height;
        for (var y = 1; y < H - 1; y++) {
          for (var x = 1; x < W - 1; x++) {
            var o = y * W + x;
            var gx = -lum[o - W - 1] - 2 * lum[o - 1] - lum[o + W - 1] + lum[o - W + 1] + 2 * lum[o + 1] + lum[o + W + 1];
            var gy = -lum[o - W - 1] - 2 * lum[o - W] - lum[o - W + 1] + lum[o + W - 1] + 2 * lum[o + W] + lum[o + W + 1];
            out[o] = Math.min(1, Math.hypot(gx, gy));
          }
        }
        lum = out;
      }

      // brightness / contrast / gamma / invert as a lookup table over luminance.
      // Clues are bright marks on dark ground, so only blown highlights count as
      // clipping; crushing the blacks is how they are found.
      var lut = new Float32Array(LUT_N + 1), clipAt = new Uint8Array(LUT_N + 1);
      var invG = 1 / v.gamma;
      for (var q = 0; q <= LUT_N; q++) {
        var x2 = (q / LUT_N - 0.5) * v.contrast + 0.5 + v.bright;
        clipAt[q] = x2 >= 1 ? 1 : 0;
        x2 = Math.pow(x2 < 0 ? 0 : x2 > 1 ? 1 : x2, invG);
        lut[q] = v.invert ? 1 - x2 : x2;
      }
      var clipped = 0;
      for (var j = 0, m = 0; j < d.length; j += 4, m++) {
        var li = (lum[m] * LUT_N) | 0;
        var val = lut[li];
        clipped += clipAt[li];
        d[j] = val * TINT[0]; d[j + 1] = val * TINT[1]; d[j + 2] = val * TINT[2];
      }
      g.putImageData(img, 0, 0);
      frame.img = img;
      v.clip = clipped / Math.max(1, lum.length);
    }

    function draw() {
      if (!v.ph) {
        g.fillStyle = '#0a0805'; g.fillRect(0, 0, cv.width, cv.height);
        g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.4)'; g.font = '12px "Consolas",monospace'; g.textAlign = 'center';
        g.fillText('NO EXHIBIT LOADED', cv.width / 2, cv.height / 2);
        return;
      }
      var sw = SRC_W / v.zoom, sh = SRC_H / v.zoom;
      var sx = U.clamp(v.cx * SRC_W - sw / 2, 0, SRC_W - sw);
      var sy = U.clamp(v.cy * SRC_H - sh / 2, 0, SRC_H - sh);

      // the processed frame only changes with the view settings; marks and the
      // click ping are drawn on top of the cached copy
      var key = [v.ph.id, v.zoom, v.cx, v.cy, v.bright, v.contrast, v.gamma, v.invert, v.edge,
                 cv.width, cv.height, NW.theme.current()].join('|');
      if (frame.key === key) g.putImageData(frame.img, 0, 0);
      else { process(sx, sy, sw, sh); frame.key = key; }

      // marks
      v.ph.finds.forEach(function (f) {
        if (!S().flags['find_' + f.id]) return;
        var fx = (f.x * SRC_W - sx) / sw * cv.width;
        var fy = (f.y * SRC_H - sy) / sh * cv.height;
        var rr = f.r * SRC_W / sw * cv.width * 0.8;
        if (fx < -rr || fy < -rr || fx > cv.width + rr || fy > cv.height + rr) return;
        g.strokeStyle = '#6dfba6'; g.lineWidth = 1.4;
        g.strokeRect(fx - rr, fy - rr * 1.3, rr * 2, rr * 2.6);
        g.fillStyle = '#6dfba6'; g.font = 'bold 10px "Consolas",monospace'; g.textAlign = 'left';
        g.fillText('◈', fx - rr, fy - rr * 1.3 - 4);
      });

      // where the last click landed
      if (v.ping) {
        var pu = (v.ping.u * SRC_W - sx) / sw * cv.width;
        var pw = (v.ping.w * SRC_H - sy) / sh * cv.height;
        var age = Math.min(1, (Date.now() - v.ping.t) / 900);
        g.strokeStyle = v.ping.ok ? '#6dfba6' : '#ff5340';
        g.globalAlpha = 1 - age; g.lineWidth = 1.6;
        g.beginPath(); g.arc(pu, pw, 6 + age * 26, 0, 7); g.stroke();
        g.beginPath(); g.moveTo(pu - 9, pw); g.lineTo(pu + 9, pw);
        g.moveTo(pu, pw - 9); g.lineTo(pu, pw + 9); g.stroke();
        g.globalAlpha = 1;
        requestAnimationFrame(function () { if (v.ping) draw(); });
      }

      // reticle
      g.strokeStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.18)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(cv.width / 2, 0); g.lineTo(cv.width / 2, cv.height);
      g.moveTo(0, cv.height / 2); g.lineTo(cv.width, cv.height / 2); g.stroke();
      g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.55)'; g.font = '9px "Consolas",monospace'; g.textAlign = 'left';
      g.fillText('×' + v.zoom.toFixed(1) + '  C' + v.contrast.toFixed(2) + '  γ' + v.gamma.toFixed(2), 6, cv.height - 6);
      if (v.clip > 0.3) {
        g.fillStyle = '#ff5340';
        g.fillText('⚠ ' + Math.round(v.clip * 100) + '% OF THE FRAME IS BLOWN OUT — DETAIL IS BEING DESTROYED', 6, 14);
      }
    }

    win.showPhoto = function (id) {
      renderTools();
      if (id && NW.media.photo(id) && (!v.ph || v.ph.id !== id)) load(id);
    };

    renderTools();
    var first = (arg && NW.media.photo(arg)) ? arg : (NW.media.availablePhotos()[0] || {}).id;
    if (first) load(first);
    setTimeout(fitCanvas, 30);
  }

  NW.apps.define({
    id: 'imagelab', name: 'IMAGE LAB', short: 'IMAGE', icon: 'imagelab',
    hint: 'photographic enhancement',
    win: { w: 760, h: 640, min: [560, 460] },
    build: build,
    onFocus: function (win, arg) { if (win.showPhoto) win.showPhoto(arg); }
  });
})(window.NW);

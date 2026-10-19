/* NIGHTWIRE — engine/gfx.js
   Procedural graphics. There is not a single image file in this project:
   mugshots, fingerprints, crime-scene photographs, maps and microfilm frames
   are all generated from string seeds so they are stable across sessions. */
(function (NW) {
  'use strict';
  var Rng = NW.Rng;

  /** Live phosphor colour, so mugshots and film match the tube. */
  function themeTint() {
    return (NW.theme && NW.theme.rgb) ? NW.theme.rgb() : [255, 190, 100];
  }

  function make(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  /* ═══════════ post-processing ═══════════ */

  var BAYER8 = (function () {
    var m = [[0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],[12,44,4,36,14,46,6,38],
             [60,28,52,20,62,30,54,22],[3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],
             [15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]];
    return m;
  })();

  /** Convert canvas to dithered 1-bit-ish monochrome, then tint. */
  function dither(cv, opts) {
    opts = opts || {};
    var g = cv.getContext('2d');
    var w = cv.width, h = cv.height;
    var img = g.getImageData(0, 0, w, h);
    var d = img.data;
    var levels = opts.levels || 2;
    var amt = opts.amount === undefined ? 1 : opts.amount;
    var tint = opts.tint || [255, 182, 61];
    var gamma = opts.gamma || 1;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        var v = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255;
        v = Math.pow(v, gamma);
        var t = BAYER8[y & 7][x & 7] / 64 - 0.5;
        var q = Math.round(NW.util.clamp(v * (levels - 1) + t * amt, 0, levels - 1)) / (levels - 1);
        d[i] = q * tint[0]; d[i + 1] = q * tint[1]; d[i + 2] = q * tint[2];
      }
    }
    g.putImageData(img, 0, 0);
    return cv;
  }

  function grain(cv, amount, seed) {
    var g = cv.getContext('2d'), w = cv.width, h = cv.height;
    var img = g.getImageData(0, 0, w, h), d = img.data;
    var r = new Rng(seed || 'grain');
    for (var i = 0; i < d.length; i += 4) {
      var n = (r.f() - 0.5) * 255 * (amount || 0.1);
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    g.putImageData(img, 0, 0);
    return cv;
  }

  function vignette(g, w, h, strength) {
    var gr = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.75);
    gr.addColorStop(0, 'rgba(0,0,0,0)');
    gr.addColorStop(1, 'rgba(0,0,0,' + (strength === undefined ? 0.7 : strength) + ')');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }

  /* ═══════════ MUGSHOT / PORTRAIT ═══════════ */

  var SKIN = [[236,214,190],[222,192,160],[198,160,124],[166,124,90],[126,90,64],[92,64,46]];
  var HAIRC = [[28,22,18],[52,38,28],[96,70,42],[140,110,70],[186,164,120],[190,190,190],[120,120,120],[64,52,48]];

  /**
   * portrait(canvas, seed, opts)
   *  opts: {sex:'m'|'f', age:number, hair:'short'|'long'|'bald'|'buzz', beard:bool,
   *         glasses:bool, scar:bool, mood:'flat'|'grim'|'scared', tint:[r,g,b], dither:bool}
   */
  function portrait(cv, seed, opts) {
    opts = opts || {};
    var r = new Rng('face:' + seed);
    var w = cv.width, h = cv.height;
    var g = cv.getContext('2d');
    var off = make(w, h), o = off.getContext('2d');

    var sex = opts.sex || (r.chance(0.5) ? 'm' : 'f');
    var age = opts.age === undefined ? r.i(20, 66) : opts.age;
    var skin = SKIN[opts.skin === undefined ? r.i(0, SKIN.length - 1) : opts.skin];
    var hairIdx = opts.hairColor === undefined ? r.i(0, HAIRC.length - 1) : opts.hairColor;
    if (age > 55 && r.chance(0.55)) hairIdx = r.chance(0.5) ? 5 : 6;
    var hairc = HAIRC[hairIdx];
    var hair = opts.hair || (sex === 'm' ? (age > 45 && r.chance(0.35) ? 'bald' : r.pick(['short', 'short', 'buzz'])) : r.pick(['long', 'long', 'short']));
    var beard = opts.beard !== undefined ? opts.beard : (sex === 'm' && r.chance(0.34));

    // ── backdrop: height board
    var bg = r.f(0.30, 0.40);
    o.fillStyle = 'rgb(' + [bg * 255 | 0, bg * 255 | 0, (bg * 245) | 0] + ')';
    o.fillRect(0, 0, w, h);
    o.strokeStyle = 'rgba(255,255,255,.16)'; o.lineWidth = 1;
    for (var yy = h * 0.10; yy < h; yy += h * 0.085) {
      o.beginPath(); o.moveTo(0, yy); o.lineTo(w * 0.16, yy); o.stroke();
      o.beginPath(); o.moveTo(w * 0.84, yy); o.lineTo(w, yy); o.stroke();
    }

    var cx = w * 0.5, cy = h * 0.47;
    var fw = w * (sex === 'm' ? r.f(0.31, 0.36) : r.f(0.29, 0.33));
    var fh = h * r.f(0.29, 0.34);

    // ── neck + shoulders
    o.fillStyle = 'rgb(' + skin.map(function (c) { return (c * 0.86) | 0; }) + ')';
    o.fillRect(cx - fw * 0.42, cy + fh * 0.5, fw * 0.84, h);
    o.fillStyle = 'rgb(' + [40 + r.i(0, 60), 42 + r.i(0, 50), 48 + r.i(0, 50)] + ')';
    o.beginPath();
    o.moveTo(cx - w * 0.55, h);
    o.quadraticCurveTo(cx - fw * 0.9, cy + fh * 1.05, cx - fw * 0.5, cy + fh * 0.94);
    o.lineTo(cx + fw * 0.5, cy + fh * 0.94);
    o.quadraticCurveTo(cx + fw * 0.9, cy + fh * 1.05, cx + w * 0.55, h);
    o.closePath(); o.fill();

    // ── head
    function headPath() {
      o.beginPath();
      o.moveTo(cx, cy - fh);
      o.bezierCurveTo(cx + fw, cy - fh * 0.92, cx + fw * 1.02, cy + fh * 0.18, cx + fw * 0.62, cy + fh * 0.66);
      o.bezierCurveTo(cx + fw * 0.34, cy + fh * 1.02, cx - fw * 0.34, cy + fh * 1.02, cx - fw * 0.62, cy + fh * 0.66);
      o.bezierCurveTo(cx - fw * 1.02, cy + fh * 0.18, cx - fw, cy - fh * 0.92, cx, cy - fh);
      o.closePath();
    }
    o.fillStyle = 'rgb(' + skin + ')'; headPath(); o.fill();

    // shading
    var sg = o.createLinearGradient(cx - fw, 0, cx + fw, 0);
    sg.addColorStop(0, 'rgba(0,0,0,.34)'); sg.addColorStop(0.4, 'rgba(0,0,0,0)');
    sg.addColorStop(0.75, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,.24)');
    o.save(); headPath(); o.clip(); o.fillStyle = sg; o.fillRect(0, 0, w, h);

    // ears
    o.fillStyle = 'rgb(' + skin.map(function (c) { return (c * 0.94) | 0; }) + ')';
    [-1, 1].forEach(function (s) {
      o.beginPath(); o.ellipse(cx + s * fw * 0.96, cy + fh * 0.06, fw * 0.11, fh * 0.17, 0, 0, 7); o.fill();
    });

    // ── eyes
    var eyeY = cy - fh * 0.06, eyeDx = fw * 0.38, eyeW = fw * 0.20, eyeH = fh * 0.075;
    [-1, 1].forEach(function (s) {
      o.fillStyle = 'rgba(255,255,255,.92)';
      o.beginPath(); o.ellipse(cx + s * eyeDx, eyeY, eyeW, eyeH, 0, 0, 7); o.fill();
      o.fillStyle = 'rgb(' + [r.i(40, 110), r.i(50, 110), r.i(40, 120)] + ')';
      o.beginPath(); o.arc(cx + s * eyeDx, eyeY, eyeH * 0.86, 0, 7); o.fill();
      o.fillStyle = '#0d0d0f';
      o.beginPath(); o.arc(cx + s * eyeDx, eyeY, eyeH * 0.40, 0, 7); o.fill();
      o.fillStyle = 'rgba(255,255,255,.8)';
      o.beginPath(); o.arc(cx + s * eyeDx - eyeH * 0.3, eyeY - eyeH * 0.3, eyeH * 0.16, 0, 7); o.fill();
      // lid
      o.strokeStyle = 'rgba(0,0,0,.5)'; o.lineWidth = Math.max(1, fw * 0.022);
      o.beginPath(); o.ellipse(cx + s * eyeDx, eyeY, eyeW, eyeH, 0, Math.PI * 1.02, Math.PI * 1.98); o.stroke();
    });

    // brows
    var browY = eyeY - fh * 0.155, browTh = fh * (sex === 'm' ? 0.042 : 0.028);
    var browAngle = opts.mood === 'grim' ? 0.16 : opts.mood === 'scared' ? -0.18 : r.f(-0.06, 0.08);
    o.strokeStyle = 'rgb(' + hairc.map(function (c) { return (c * 0.8) | 0; }) + ')';
    o.lineWidth = browTh; o.lineCap = 'round';
    [-1, 1].forEach(function (s) {
      o.beginPath();
      o.moveTo(cx + s * (eyeDx - eyeW * 1.05), browY + s * browAngle * fh);
      o.quadraticCurveTo(cx + s * eyeDx, browY - fh * 0.045 + s * browAngle * fh * 0.4, cx + s * (eyeDx + eyeW * 1.0), browY + fh * 0.008);
      o.stroke();
    });

    // ── nose
    var noseY = cy + fh * 0.20, noseW = fw * r.f(0.15, 0.23);
    o.strokeStyle = 'rgba(0,0,0,.30)'; o.lineWidth = Math.max(1, fw * 0.03);
    o.beginPath();
    o.moveTo(cx - fw * 0.03, cy - fh * 0.02);
    o.lineTo(cx - noseW * 0.55, noseY);
    o.quadraticCurveTo(cx, noseY + fh * 0.055, cx + noseW * 0.55, noseY);
    o.stroke();
    o.fillStyle = 'rgba(0,0,0,.35)';
    [-1, 1].forEach(function (s) { o.beginPath(); o.ellipse(cx + s * noseW * 0.42, noseY + fh * 0.012, noseW * 0.13, fh * 0.016, 0, 0, 7); o.fill(); });

    // ── mouth
    var mY = cy + fh * 0.47, mW = fw * r.f(0.32, 0.44);
    var curve = opts.mood === 'grim' ? -0.02 : opts.mood === 'scared' ? 0.01 : r.f(-0.012, 0.012);
    o.strokeStyle = 'rgba(90,40,40,.75)'; o.lineWidth = Math.max(1.2, fh * 0.022);
    o.beginPath();
    o.moveTo(cx - mW, mY);
    o.quadraticCurveTo(cx, mY + curve * fh + fh * 0.02, cx + mW, mY);
    o.stroke();

    // ── facial hair
    if (beard) {
      o.fillStyle = 'rgba(' + hairc.join(',') + ',.72)';
      o.beginPath();
      o.moveTo(cx - fw * 0.66, cy + fh * 0.18);
      o.quadraticCurveTo(cx - fw * 0.6, cy + fh * 0.95, cx, cy + fh * 1.0);
      o.quadraticCurveTo(cx + fw * 0.6, cy + fh * 0.95, cx + fw * 0.66, cy + fh * 0.18);
      o.quadraticCurveTo(cx + fw * 0.34, cy + fh * 0.52, cx, cy + fh * 0.5);
      o.quadraticCurveTo(cx - fw * 0.34, cy + fh * 0.52, cx - fw * 0.66, cy + fh * 0.18);
      o.fill();
      // moustache
      o.beginPath(); o.ellipse(cx, mY - fh * 0.08, mW * 1.15, fh * 0.055, 0, 0, 7); o.fill();
    }

    // ── age lines
    if (age > 42) {
      o.strokeStyle = 'rgba(0,0,0,' + Math.min(0.3, (age - 40) / 90) + ')'; o.lineWidth = 1;
      for (var k = 0; k < 3; k++) {
        o.beginPath();
        o.moveTo(cx - fw * 0.4, cy - fh * (0.42 + k * 0.06));
        o.quadraticCurveTo(cx, cy - fh * (0.47 + k * 0.06), cx + fw * 0.4, cy - fh * (0.42 + k * 0.06));
        o.stroke();
      }
      [-1, 1].forEach(function (s) {
        o.beginPath();
        o.moveTo(cx + s * fw * 0.30, cy + fh * 0.30);
        o.quadraticCurveTo(cx + s * fw * 0.42, cy + fh * 0.5, cx + s * fw * 0.36, cy + fh * 0.66);
        o.stroke();
      });
    }
    if (opts.scar) {
      o.strokeStyle = 'rgba(150,70,60,.75)'; o.lineWidth = Math.max(1.4, fw * 0.022);
      o.beginPath(); o.moveTo(cx + fw * 0.30, cy - fh * 0.30); o.lineTo(cx + fw * 0.52, cy + fh * 0.16); o.stroke();
    }
    o.restore();

    // ── hair (outside clip)
    if (hair !== 'bald') {
      o.fillStyle = 'rgb(' + hairc + ')';
      o.beginPath();
      if (hair === 'long') {
        o.moveTo(cx - fw * 1.05, cy + fh * 0.9);
        o.bezierCurveTo(cx - fw * 1.16, cy - fh * 0.6, cx - fw * 0.7, cy - fh * 1.22, cx, cy - fh * 1.14);
        o.bezierCurveTo(cx + fw * 0.7, cy - fh * 1.22, cx + fw * 1.16, cy - fh * 0.6, cx + fw * 1.05, cy + fh * 0.9);
        o.lineTo(cx + fw * 0.72, cy + fh * 0.9);
        o.bezierCurveTo(cx + fw * 0.88, cy - fh * 0.2, cx + fw * 0.66, cy - fh * 0.62, cx, cy - fh * 0.62);
        o.bezierCurveTo(cx - fw * 0.66, cy - fh * 0.62, cx - fw * 0.88, cy - fh * 0.2, cx - fw * 0.72, cy + fh * 0.9);
      } else {
        var top = hair === 'buzz' ? 1.06 : 1.16;
        o.moveTo(cx - fw * 1.02, cy - fh * 0.12);
        o.bezierCurveTo(cx - fw * 1.05, cy - fh * top, cx + fw * 1.05, cy - fh * top, cx + fw * 1.02, cy - fh * 0.12);
        o.bezierCurveTo(cx + fw * 0.9, cy - fh * 0.5, cx + fw * 0.6, cy - fh * (hair === 'buzz' ? 0.66 : 0.74), cx + fw * 0.05, cy - fh * 0.70);
        o.bezierCurveTo(cx - fw * 0.55, cy - fh * 0.66, cx - fw * 0.88, cy - fh * 0.46, cx - fw * 1.02, cy - fh * 0.12);
      }
      o.closePath(); o.fill();
    } else if (r.chance(0.6)) {
      o.fillStyle = 'rgba(' + hairc.join(',') + ',.85)';
      o.beginPath();
      o.moveTo(cx - fw * 1.0, cy - fh * 0.18);
      o.quadraticCurveTo(cx - fw * 0.95, cy - fh * 0.62, cx - fw * 0.6, cy - fh * 0.68);
      o.lineTo(cx - fw * 0.72, cy - fh * 0.1);
      o.closePath(); o.fill();
      o.beginPath();
      o.moveTo(cx + fw * 1.0, cy - fh * 0.18);
      o.quadraticCurveTo(cx + fw * 0.95, cy - fh * 0.62, cx + fw * 0.6, cy - fh * 0.68);
      o.lineTo(cx + fw * 0.72, cy - fh * 0.1);
      o.closePath(); o.fill();
    }

    // ── glasses
    if (opts.glasses) {
      o.strokeStyle = 'rgba(20,20,24,.9)'; o.lineWidth = Math.max(1.4, fw * 0.028);
      [-1, 1].forEach(function (s) {
        o.beginPath(); o.roundRect
          ? o.roundRect(cx + s * eyeDx - eyeW * 1.35, eyeY - eyeH * 2.0, eyeW * 2.7, eyeH * 4.0, 3)
          : o.rect(cx + s * eyeDx - eyeW * 1.35, eyeY - eyeH * 2.0, eyeW * 2.7, eyeH * 4.0);
        o.stroke();
      });
      o.beginPath(); o.moveTo(cx - eyeDx + eyeW * 1.35, eyeY); o.lineTo(cx + eyeDx - eyeW * 1.35, eyeY); o.stroke();
    }

    // ── plate
    if (opts.plate) {
      var ph = h * 0.088;
      o.fillStyle = '#151515'; o.fillRect(w * 0.12, h - ph - h * 0.045, w * 0.76, ph);
      o.fillStyle = '#e8e8e8';
      o.font = 'bold ' + Math.floor(ph * 0.56) + 'px "Consolas",monospace';
      o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillText(opts.plate, w * 0.5, h - ph * 0.5 - h * 0.045);
    }

    grain(off, 0.13, 'g' + seed);
    vignette(o, w, h, 0.45);

    g.clearRect(0, 0, w, h);
    g.drawImage(off, 0, 0);
    if (opts.dither !== false) dither(cv, { levels: opts.levels || 4, amount: 0.75, tint: opts.tint || themeTint(), gamma: 0.95 });
    return cv;
  }

  /* ═══════════ FINGERPRINT ═══════════ */

  /**
   * Builds a fingerprint from a seed using an orientation field with a core
   * (+1/2 winding) and a delta (-1/2), then draws evenly-spaced streamlines.
   * Returns { draw(ctx,w,h), minutiae:[{x,y}] } in 0..1 normalised space.
   */
  function fingerprint(seed, opts) {
    opts = opts || {};
    var r = new Rng('print:' + seed);
    var pattern = opts.pattern || r.pick(['loop', 'loop', 'whorl', 'arch']);
    var core = { x: 0.5 + r.f(-0.05, 0.05), y: 0.44 + r.f(-0.05, 0.05) };
    var delta = { x: core.x + (r.chance(0.5) ? -1 : 1) * r.f(0.18, 0.26), y: core.y + r.f(0.18, 0.28) };
    var base = r.f(-0.18, 0.18);
    var warpA = r.f(0.02, 0.05), warpF = r.f(6, 11), warpP = r.f(0, 6.28);

    /* Ridge-orientation field. Loops and whorls use the classical singular-point
       model (a core contributes +1/2 winding, a delta -1/2); arches have no
       singularity and are a smooth transverse field that peaks at the apex. */
    var archA = r.f(0.95, 1.35), archS = r.f(0.26, 0.36), archK = r.f(3.4, 5.2);
    var whorlOff = r.f(0.035, 0.06);

    function theta(x, y) {
      var t;
      if (pattern === 'arch') {
        t = base * 0.35 + archA * Math.tanh((x - core.x) * archK) *
            Math.exp(-Math.pow((y - core.y) / archS, 2));
      } else if (pattern === 'whorl') {
        var c1 = Math.atan2(y - (core.y - whorlOff), x - core.x);
        var c2 = Math.atan2(y - (core.y + whorlOff), x - core.x);
        var d1 = Math.atan2(y - delta.y, x - delta.x);
        var d2 = Math.atan2(y - delta.y, x - (2 * core.x - delta.x));
        t = base + 0.5 * (c1 + c2) - 0.5 * (d1 + d2);
      } else {
        var b1 = Math.atan2(y - core.y, x - core.x);
        var b2 = Math.atan2(y - delta.y, x - delta.x);
        t = base + 0.5 * (b1 - b2);
      }
      t += Math.sin(x * warpF + warpP) * warpA + Math.cos(y * warpF * 0.8 + warpP * 1.7) * warpA;
      return t;
    }

    // evenly-spaced streamlines (simplified Jobard-Lefebvre)
    var D = opts.spacing || 0.0165;
    var GRID = Math.ceil(1 / D);
    var occ = [];
    for (var i = 0; i < GRID * GRID; i++) occ.push([]);
    function cellOf(x, y) {
      var cxx = NW.util.clamp(Math.floor(x / D), 0, GRID - 1);
      var cyy = NW.util.clamp(Math.floor(y / D), 0, GRID - 1);
      return cyy * GRID + cxx;
    }
    function tooClose(x, y, minD) {
      var cxx = Math.floor(x / D), cyy = Math.floor(y / D);
      for (var j = -1; j <= 1; j++) for (var k = -1; k <= 1; k++) {
        var gx = cxx + k, gy = cyy + j;
        if (gx < 0 || gy < 0 || gx >= GRID || gy >= GRID) continue;
        var arr = occ[gy * GRID + gx];
        for (var m = 0; m < arr.length; m++) {
          var dx = arr[m][0] - x, dy = arr[m][1] - y;
          if (dx * dx + dy * dy < minD * minD) return true;
        }
      }
      return false;
    }
    function inMask(x, y) {
      var dx = (x - 0.5) / 0.44, dy = (y - 0.5) / 0.49;
      return dx * dx + dy * dy < 1;
    }

    var lines = [];
    var ends = [];
    /* The orientation field is only defined modulo pi, so a streamline has to
       carry its own heading and pick whichever of theta / theta+pi continues it
       — otherwise every branch cut flips the trace back on itself. */
    function trace(sx, sy) {
      var pts = [];
      var stepLen = D * 0.5;
      var th0 = theta(sx, sy);
      [1, -1].forEach(function (dir) {
        var x = sx, y = sy, seg = [];
        var prev = dir === 1 ? th0 : th0 + Math.PI;
        for (var s = 0; s < 700; s++) {
          if (!inMask(x, y)) break;
          if (s > 1 && tooClose(x, y, D * 0.84)) break;
          seg.push([x, y]);
          var th = theta(x, y);
          if (Math.cos(th - prev) < 0) th += Math.PI;
          prev = th;
          x += Math.cos(th) * stepLen;
          y += Math.sin(th) * stepLen;
        }
        if (dir === 1) pts = seg; else pts = seg.reverse().concat(pts);
      });
      if (pts.length < 6) return null;
      pts.forEach(function (p) { occ[cellOf(p[0], p[1])].push(p); });
      lines.push(pts);
      ends.push(pts[0], pts[pts.length - 1]);
      return pts;
    }

    // seed from a jittered grid, ordered from the core outward for tidy flow
    var seeds = [];
    for (var sy = 0.04; sy < 0.98; sy += D * 0.75) {
      for (var sx = 0.04; sx < 0.98; sx += D * 0.75) {
        seeds.push([sx + r.f(-D * 0.3, D * 0.3), sy + r.f(-D * 0.3, D * 0.3)]);
      }
    }
    seeds.sort(function (a, b) {
      var da = (a[0] - core.x) * (a[0] - core.x) + (a[1] - core.y) * (a[1] - core.y);
      var db = (b[0] - core.x) * (b[0] - core.x) + (b[1] - core.y) * (b[1] - core.y);
      return da - db;
    });
    for (var si = 0; si < seeds.length; si++) {
      var p = seeds[si];
      if (!inMask(p[0], p[1])) continue;
      if (tooClose(p[0], p[1], D * 0.9)) continue;
      trace(p[0], p[1]);
    }

    // minutiae = a stable subset of ridge terminations, well spread out
    var cand = ends.filter(function (p) {
      var dx = (p[0] - 0.5) / 0.40, dy = (p[1] - 0.5) / 0.45;
      return dx * dx + dy * dy < 0.86;
    });
    var minutiae = [];
    var mr = new Rng('min:' + seed);
    var shuffled = mr.shuffle(cand);
    for (var ci = 0; ci < shuffled.length && minutiae.length < (opts.minutiae || 12); ci++) {
      var q = shuffled[ci];
      var ok = minutiae.every(function (m) {
        var dx = m.x - q[0], dy = m.y - q[1];
        return dx * dx + dy * dy > 0.014;
      });
      if (ok) minutiae.push({ x: q[0], y: q[1], type: mr.chance(0.5) ? 'end' : 'bif' });
    }

    function draw(g, w, h, dopt) {
      dopt = dopt || {};
      var t = dopt.transform || { rot: 0, sc: 1, dx: 0, dy: 0 };
      g.save();
      g.translate(w / 2 + t.dx * w, h / 2 + t.dy * h);
      g.rotate(t.rot);
      g.scale(t.sc, t.sc);
      g.translate(-w / 2, -h / 2);
      g.lineCap = 'round'; g.lineJoin = 'round';
      g.strokeStyle = dopt.color || '#ffb63d';
      g.lineWidth = Math.max(1, (dopt.width || 1.55) * (w / 320));
      g.globalAlpha = dopt.alpha === undefined ? 0.95 : dopt.alpha;
      lines.forEach(function (pts) {
        g.beginPath();
        g.moveTo(pts[0][0] * w, pts[0][1] * h);
        for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0] * w, pts[i][1] * h);
        g.stroke();
      });
      g.restore();
      g.globalAlpha = 1;
    }

    return { draw: draw, minutiae: minutiae, pattern: pattern, core: core, delta: delta, lines: lines };
  }

  /** Apply a partial-latent mask + smudge to a print canvas. */
  function latentDamage(cv, seed, severity) {
    var r = new Rng('dmg:' + seed);
    var g = cv.getContext('2d'), w = cv.width, h = cv.height;
    g.globalCompositeOperation = 'destination-out';
    var n = 4 + Math.floor(severity * 6);
    for (var i = 0; i < n; i++) {
      // bias the erasure toward the edges so the centre keeps enough ridge
      // context for the operator to actually work the comparison
      var x = w * (r.chance(0.5) ? r.f(-0.05, 0.26) : r.f(0.74, 1.05));
      var y = h * (r.chance(0.5) ? r.f(-0.05, 0.26) : r.f(0.74, 1.05));
      if (r.chance(0.25)) { x = r.f(0, w); y = r.f(0, h); }
      var rad = r.f(w * 0.10, w * 0.26);
      var gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, 'rgba(0,0,0,' + r.f(0.5, 1) + ')');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
    }
    g.globalCompositeOperation = 'source-over';
    // smudge streaks
    g.strokeStyle = 'rgba(255,182,61,.10)'; g.lineWidth = w * 0.02;
    for (var k = 0; k < 5; k++) {
      g.beginPath();
      g.moveTo(r.f(0, w), r.f(0, h));
      g.quadraticCurveTo(r.f(0, w), r.f(0, h), r.f(0, w), r.f(0, h));
      g.stroke();
    }
    return cv;
  }

  /* ═══════════ EVIDENCE PHOTOGRAPHS ═══════════ */

  /** Draw a monochrome night scene. Hidden details are drawn at very low
      contrast so they only surface once the player pushes contrast/gamma. */
  var SCENES = {};

  function scene(name, seed, w, h) {
    var cv = make(w, h);
    var g = cv.getContext('2d');
    var r = new Rng('scene:' + name + ':' + seed);
    var fn = SCENES[name] || SCENES._default;
    fn(g, w, h, r, seed);
    grain(cv, 0.12, 'sg' + seed);
    vignette(g, w, h, 0.55);
    return cv;
  }

  function sky(g, w, h, r, top, bot) {
    var gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, top); gr.addColorStop(1, bot);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (var i = 0; i < 90; i++) {
      var x = r.f(0, w), y = r.f(0, h * 0.5);
      g.fillStyle = 'rgba(255,255,255,' + r.f(0.05, 0.35) + ')';
      g.fillRect(x, y, 1, 1);
    }
  }

  function treeline(g, w, h, r, baseY, height, col) {
    g.fillStyle = col;
    g.beginPath(); g.moveTo(0, h);
    g.lineTo(0, baseY);
    for (var x = 0; x <= w; x += 8) {
      var yy = baseY - height * (0.5 + 0.5 * Math.sin(x * 0.031 + r.f(0, 0.2))) - r.f(0, height * 0.5);
      g.lineTo(x, yy);
    }
    g.lineTo(w, baseY); g.lineTo(w, h); g.closePath(); g.fill();
  }

  SCENES._default = function (g, w, h, r) {
    sky(g, w, h, r, '#1a1e24', '#0a0c0e');
    treeline(g, w, h, r, h * 0.6, h * 0.18, '#080a0b');
  };

  SCENES.quarry = function (g, w, h, r, seed) {
    sky(g, w, h, r, '#171c22', '#0c0f13');
    // moon
    g.fillStyle = 'rgba(230,235,245,.55)';
    g.beginPath(); g.arc(w * 0.78, h * 0.14, h * 0.045, 0, 7); g.fill();
    treeline(g, w, h, r, h * 0.42, h * 0.10, '#0a0d10');
    // quarry walls
    g.fillStyle = '#22262b';
    g.beginPath(); g.moveTo(0, h * 0.44);
    for (var x = 0; x <= w; x += 14) g.lineTo(x, h * (0.44 + 0.05 * Math.sin(x * 0.012) + r.f(-0.01, 0.01)));
    g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill();
    // water
    var wg = g.createLinearGradient(0, h * 0.6, 0, h);
    wg.addColorStop(0, '#12171d'); wg.addColorStop(1, '#080b0f');
    g.fillStyle = wg; g.fillRect(0, h * 0.62, w, h * 0.38);
    g.strokeStyle = 'rgba(200,220,255,.06)'; g.lineWidth = 1;
    for (var i = 0; i < 40; i++) {
      var yy = h * (0.63 + r.f(0, 0.36));
      g.beginPath(); g.moveTo(r.f(0, w * 0.6), yy); g.lineTo(r.f(w * 0.3, w), yy); g.stroke();
    }
    // floodlights + police tape
    for (var L = 0; L < 3; L++) {
      var lx = w * (0.18 + L * 0.28);
      var lg = g.createRadialGradient(lx, h * 0.48, 0, lx, h * 0.48, w * 0.16);
      lg.addColorStop(0, 'rgba(255,245,220,.22)'); lg.addColorStop(1, 'rgba(255,245,220,0)');
      g.fillStyle = lg; g.fillRect(lx - w * 0.16, h * 0.32, w * 0.32, h * 0.32);
      g.fillStyle = '#3a3f45'; g.fillRect(lx - 2, h * 0.44, 4, h * 0.14);
      g.fillStyle = 'rgba(255,250,235,.8)'; g.fillRect(lx - 7, h * 0.425, 14, 7);
    }
    // body bag on the shore
    g.fillStyle = '#4b4f55';
    g.beginPath(); g.ellipse(w * 0.42, h * 0.70, w * 0.075, h * 0.028, 0.08, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(w * 0.35, h * 0.70); g.lineTo(w * 0.49, h * 0.70); g.stroke();
    // markers
    ['1', '2', '3'].forEach(function (n, i) {
      var mx = w * (0.30 + i * 0.09), my = h * (0.755 + i * 0.02);
      g.fillStyle = '#c9cdd3'; g.fillRect(mx, my, 11, 13);
      g.fillStyle = '#15181c'; g.font = 'bold 9px monospace'; g.fillText(n, mx + 3, my + 10);
    });
    // ── HIDDEN: tyre tracks leading to the water (low contrast)
    g.strokeStyle = 'rgba(255,255,255,.17)'; g.lineWidth = 5;
    [0, 1].forEach(function (t) {
      g.beginPath();
      g.moveTo(w * (0.62 + t * 0.03), h * 0.52);
      g.quadraticCurveTo(w * (0.60 + t * 0.03), h * 0.62, w * (0.55 + t * 0.03), h * 0.68);
      g.stroke();
    });
  };

  SCENES.mill = function (g, w, h, r) {
    sky(g, w, h, r, '#1c1f26', '#0e1114');
    treeline(g, w, h, r, h * 0.55, h * 0.09, '#0a0c0f');
    // mill body
    g.fillStyle = '#1b1f24'; g.fillRect(w * 0.08, h * 0.32, w * 0.66, h * 0.44);
    g.fillStyle = '#141a1e';
    for (var i = 0; i < 7; i++) g.fillRect(w * (0.11 + i * 0.09), h * 0.38, w * 0.055, h * 0.10);
    // one lit window
    g.fillStyle = 'rgba(255,225,160,.55)'; g.fillRect(w * (0.11 + 3 * 0.09), h * 0.38, w * 0.055, h * 0.10);
    // smokestack
    g.fillStyle = '#20252b'; g.fillRect(w * 0.79, h * 0.10, w * 0.055, h * 0.66);
    g.fillStyle = '#191d22'; g.fillRect(w * 0.78, h * 0.10, w * 0.075, h * 0.02);
    // fence + gate
    g.strokeStyle = 'rgba(190,200,210,.22)'; g.lineWidth = 1;
    for (var fx = 0; fx < w; fx += 11) { g.beginPath(); g.moveTo(fx, h * 0.78); g.lineTo(fx, h * 0.92); g.stroke(); }
    g.beginPath(); g.moveTo(0, h * 0.80); g.lineTo(w, h * 0.80); g.stroke();
    // parked sedan
    g.fillStyle = '#2b3036';
    g.beginPath();
    g.moveTo(w * 0.14, h * 0.90); g.lineTo(w * 0.17, h * 0.845); g.lineTo(w * 0.27, h * 0.842);
    g.lineTo(w * 0.30, h * 0.90); g.closePath(); g.fill();
    g.fillStyle = '#0d0f12';
    g.beginPath(); g.arc(w * 0.175, h * 0.905, w * 0.011, 0, 7); g.fill();
    g.beginPath(); g.arc(w * 0.278, h * 0.905, w * 0.011, 0, 7); g.fill();
    // ── HIDDEN: figure in the doorway
    g.fillStyle = 'rgba(255,255,255,.135)';
    g.beginPath(); g.ellipse(w * 0.415, h * 0.60, w * 0.008, h * 0.014, 0, 0, 7); g.fill();
    g.fillRect(w * 0.408, h * 0.615, w * 0.016, h * 0.075);
  };

  SCENES.motel = function (g, w, h, r) {
    sky(g, w, h, r, '#1d1a20', '#0d0b10');
    g.fillStyle = '#1a181c'; g.fillRect(0, h * 0.46, w, h * 0.54);
    // motel block
    g.fillStyle = '#232025'; g.fillRect(w * 0.06, h * 0.40, w * 0.88, h * 0.34);
    for (var i = 0; i < 6; i++) {
      var dx = w * (0.10 + i * 0.145);
      g.fillStyle = i === 3 ? 'rgba(255,220,150,.4)' : '#141216';
      g.fillRect(dx, h * 0.50, w * 0.075, h * 0.20);
      g.fillStyle = '#c9c3b6'; g.font = 'bold 9px monospace';
      g.fillText('1' + (i + 1), dx + 4, h * 0.485);
    }
    // neon sign
    g.fillStyle = 'rgba(255,120,90,.32)'; g.fillRect(w * 0.72, h * 0.10, w * 0.20, h * 0.20);
    g.fillStyle = 'rgba(255,160,120,.75)'; g.font = 'bold 15px monospace';
    g.fillText('VACANCY', w * 0.735, h * 0.22);
    // wet asphalt reflections
    g.fillStyle = 'rgba(255,160,120,.05)'; g.fillRect(w * 0.70, h * 0.76, w * 0.24, h * 0.2);
    // ── HIDDEN: licence plate on parked car
    g.fillStyle = '#26292e';
    g.beginPath(); g.moveTo(w * 0.52, h * 0.92); g.lineTo(w * 0.55, h * 0.80); g.lineTo(w * 0.68, h * 0.798);
    g.lineTo(w * 0.71, h * 0.92); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.24)'; g.fillRect(w * 0.585, h * 0.885, w * 0.055, h * 0.022);
    g.fillStyle = 'rgba(0,0,0,.62)'; g.font = 'bold 8px "Consolas",monospace';
    g.fillText('KTV-418', w * 0.588, h * 0.902);
  };

  SCENES.dock = function (g, w, h, r) {
    sky(g, w, h, r, '#141a20', '#080c10');
    g.fillStyle = '#0b1016'; g.fillRect(0, h * 0.55, w, h * 0.45);
    // cranes
    g.strokeStyle = '#232a31'; g.lineWidth = 4;
    [0.18, 0.52, 0.84].forEach(function (cx) {
      g.beginPath(); g.moveTo(w * cx, h * 0.55); g.lineTo(w * cx, h * 0.18);
      g.lineTo(w * (cx + 0.14), h * 0.24); g.stroke();
    });
    // containers
    for (var i = 0; i < 14; i++) {
      g.fillStyle = 'rgb(' + [r.i(24, 52), r.i(26, 54), r.i(30, 58)].join(',') + ')';
      g.fillRect(r.f(0, w), h * (0.58 + r.f(0, 0.2)), w * 0.09, h * 0.05);
    }
    // water shimmer
    g.strokeStyle = 'rgba(180,210,255,.05)';
    for (var k = 0; k < 50; k++) {
      var yy = h * (0.80 + r.f(0, 0.19));
      g.beginPath(); g.moveTo(r.f(0, w), yy); g.lineTo(r.f(0, w), yy); g.stroke();
    }
  };

  SCENES.house = function (g, w, h, r) {
    g.fillStyle = '#151310'; g.fillRect(0, 0, w, h);
    // interior room, overturned furniture
    g.fillStyle = '#1d1a15'; g.fillRect(0, h * 0.62, w, h * 0.38);
    g.fillStyle = '#22201a'; g.fillRect(w * 0.05, h * 0.12, w * 0.90, h * 0.52);
    // window with blinds
    g.fillStyle = '#2c2a22'; g.fillRect(w * 0.62, h * 0.20, w * 0.24, h * 0.26);
    g.fillStyle = 'rgba(160,180,210,.13)'; g.fillRect(w * 0.635, h * 0.215, w * 0.21, h * 0.23);
    g.strokeStyle = 'rgba(0,0,0,.5)';
    for (var yy = h * 0.22; yy < h * 0.44; yy += 5) { g.beginPath(); g.moveTo(w * 0.635, yy); g.lineTo(w * 0.845, yy); g.stroke(); }
    // toppled chair
    g.strokeStyle = '#3a352b'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(w * 0.20, h * 0.80); g.lineTo(w * 0.34, h * 0.72);
    g.lineTo(w * 0.30, h * 0.62); g.stroke();
    // scattered papers
    for (var p = 0; p < 18; p++) {
      g.save();
      g.translate(r.f(w * 0.08, w * 0.9), r.f(h * 0.66, h * 0.96));
      g.rotate(r.f(0, 6.28));
      g.fillStyle = 'rgba(200,192,172,.35)'; g.fillRect(-9, -6, 18, 12);
      g.restore();
    }
    // ── HIDDEN: handprint on the wall
    g.fillStyle = 'rgba(255,255,255,.12)';
    g.beginPath(); g.ellipse(w * 0.44, h * 0.42, w * 0.022, h * 0.036, 0.2, 0, 7); g.fill();
    for (var f = 0; f < 4; f++) {
      g.beginPath();
      g.ellipse(w * (0.418 + f * 0.014), h * 0.375, w * 0.005, h * 0.016, 0.1 * f, 0, 7); g.fill();
    }
  };

  SCENES.lot = function (g, w, h, r) {
    sky(g, w, h, r, '#191c21', '#0c0e11');
    g.fillStyle = '#111417'; g.fillRect(0, h * 0.52, w, h * 0.48);
    // parking lines
    g.strokeStyle = 'rgba(220,220,210,.18)'; g.lineWidth = 2;
    for (var i = 0; i < 9; i++) {
      var x0 = w * (-0.1 + i * 0.15);
      g.beginPath(); g.moveTo(x0, h); g.lineTo(x0 + w * 0.10, h * 0.58); g.stroke();
    }
    // lamp post + cone of light
    var lx = w * 0.24;
    var lg = g.createRadialGradient(lx, h * 0.30, 0, lx, h * 0.9, h * 0.62);
    lg.addColorStop(0, 'rgba(255,235,190,.24)'); lg.addColorStop(1, 'rgba(255,235,190,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(lx, h * 0.30); g.lineTo(lx - w * 0.16, h); g.lineTo(lx + w * 0.16, h); g.closePath(); g.fill();
    g.fillStyle = '#2b3036'; g.fillRect(lx - 2, h * 0.28, 4, h * 0.62);
    // van
    g.fillStyle = '#282d33'; g.fillRect(w * 0.56, h * 0.60, w * 0.26, h * 0.17);
    g.fillStyle = '#171b1f'; g.fillRect(w * 0.585, h * 0.625, w * 0.07, h * 0.055);
    g.fillStyle = '#0d0f12';
    g.beginPath(); g.arc(w * 0.60, h * 0.775, w * 0.017, 0, 7); g.fill();
    g.beginPath(); g.arc(w * 0.78, h * 0.775, w * 0.017, 0, 7); g.fill();
    // ── HIDDEN: reflection of a second person in the van window
    g.fillStyle = 'rgba(255,255,255,.135)';
    g.beginPath(); g.ellipse(w * 0.615, h * 0.645, w * 0.008, h * 0.011, 0, 0, 7); g.fill();
    g.fillRect(w * 0.609, h * 0.657, w * 0.013, h * 0.018);
  };

  SCENES.ward = function (g, w, h, r) {
    g.fillStyle = '#12100d'; g.fillRect(0, 0, w, h);
    // corridor perspective
    g.fillStyle = '#1b1815';
    g.beginPath(); g.moveTo(0, 0); g.lineTo(w * 0.32, h * 0.30); g.lineTo(w * 0.32, h * 0.72); g.lineTo(0, h); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(w, 0); g.lineTo(w * 0.68, h * 0.30); g.lineTo(w * 0.68, h * 0.72); g.lineTo(w, h); g.closePath(); g.fill();
    g.fillStyle = '#0d0b09'; g.fillRect(w * 0.32, h * 0.30, w * 0.36, h * 0.42);
    // flickering light at the end
    var lg = g.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, w * 0.20);
    lg.addColorStop(0, 'rgba(220,230,255,.20)'); lg.addColorStop(1, 'rgba(220,230,255,0)');
    g.fillStyle = lg; g.fillRect(w * 0.30, h * 0.22, w * 0.40, h * 0.5);
    // doors
    [0.36, 0.44, 0.56, 0.64].forEach(function (dx, i) {
      g.fillStyle = i % 2 ? '#191612' : '#1e1a15';
      g.fillRect(w * dx, h * (0.40 + Math.abs(dx - 0.5) * 0.25), w * 0.045, h * 0.26);
    });
    // debris
    for (var p = 0; p < 26; p++) {
      g.fillStyle = 'rgba(190,180,160,.14)';
      g.fillRect(r.f(w * 0.3, w * 0.7), r.f(h * 0.68, h * 0.98), r.f(2, 10), r.f(2, 5));
    }
    // ── HIDDEN: number stencilled over the far door
    g.fillStyle = 'rgba(255,255,255,.125)'; g.font = 'bold ' + Math.floor(h * 0.05) + 'px "Consolas",monospace';
    g.fillText('B-17', w * 0.455, h * 0.36);
  };

  /* ═══════════ MISC ═══════════ */

  /** Amber-tinted static block, used for "signal lost" panes. */
  function staticFill(g, w, h, seed, tint) {
    var r = new Rng(seed || 'static');
    var img = g.createImageData(w, h);
    var d = img.data;
    tint = tint || themeTint();
    for (var i = 0; i < d.length; i += 4) {
      var v = r.f() > 0.5 ? r.f(0.15, 1) : r.f(0, 0.25);
      d[i] = v * tint[0]; d[i + 1] = v * tint[1]; d[i + 2] = v * tint[2]; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }

  /** Simple SVG glyph set for the program rail. */
  var ICONS = {
    wire: '<path d="M3 6h20v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3 6l10 7 10-7" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    registry: '<rect x="4" y="3" width="18" height="20" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 19c1.5-3 8.5-3 10 0" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    archive: '<path d="M3 4h20v5H3z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5 9v13h16V9" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 13h6" stroke="currentColor" stroke-width="1.4"/>',
    daktylo: '<path d="M13 3c5 0 8 4 8 8" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M13 6c3.4 0 5 2.6 5 5.6 0 4-1 6.4-2 9.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M13 9c1.8 0 2.4 1.4 2.4 3.2 0 3.4-.8 6-1.8 8.8" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9.6 21c1.4-3 2-5.6 2-9 0-1.6-.4-3-1.6-3" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5 11c0-4 3-8 8-8" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M7 19c1.2-2.4 1.6-5 1.6-7.6" fill="none" stroke="currentColor" stroke-width="1.3"/>',
    imagelab: '<rect x="2" y="6" width="22" height="15" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="13.5" r="4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 6l2-3h6l2 3" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    audiolab: '<path d="M3 13h3M8 8v10M13 4v18M18 9v8M23 12h-3" stroke="currentColor" stroke-width="1.5" fill="none"/>',
    cartograph: '<path d="M2 5l7-2 8 3 7-3v18l-7 3-8-3-7 2z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9 3v18M17 6v18" stroke="currentColor" stroke-width="1.1"/>',
    cipher: '<rect x="4" y="11" width="18" height="12" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 11V7a5 5 0 0110 0v4" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="17" r="1.6" fill="currentColor"/>',
    casebook: '<rect x="2" y="4" width="22" height="18" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="9" r="2" fill="currentColor"/><circle cx="18" cy="8" r="2" fill="currentColor"/><circle cx="12" cy="17" r="2" fill="currentColor"/><path d="M8 9l10-1M18 8l-6 9M8 9l4 8" stroke="currentColor" stroke-width="1"/>',
    timeline: '<path d="M2 13h22" stroke="currentColor" stroke-width="1.4"/><circle cx="6" cy="13" r="2.4" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="13" r="2.4" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="20" cy="13" r="2.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 8V4M13 22v-4M20 8V4" stroke="currentColor" stroke-width="1.1"/>',
    switchboard: '<path d="M4 4h5l2 5-3 2c1 3 3 5 6 6l2-3 5 2v5c0 1-1 2-2 2C9 23 3 17 3 6c0-1 1-2 1-2z" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    shell: '<rect x="2" y="4" width="22" height="18" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 10l4 3-4 3M12 16h7" stroke="currentColor" stroke-width="1.5" fill="none"/>',
    microfilm: '<circle cx="8" cy="13" r="5" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="18" cy="13" r="5" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="13" r="1.4" fill="currentColor"/><circle cx="18" cy="13" r="1.4" fill="currentColor"/><path d="M8 8h10M8 18h10" stroke="currentColor" stroke-width="1.2"/>',
    ballistics: '<path d="M6 10h9l5 3-5 3H6z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 7v12" stroke="currentColor" stroke-width="1.4"/><path d="M9 13h7" stroke="currentColor" stroke-width="1"/>',
    notepad: '<rect x="5" y="3" width="16" height="20" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9 8h8M9 12h8M9 16h5" stroke="currentColor" stroke-width="1.3"/>',
    manual: '<path d="M4 4h8a3 3 0 013 3v15a3 3 0 00-3-3H4z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M22 4h-8a3 3 0 00-3 3v15a3 3 0 013-3h8z" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    settings: '<circle cx="13" cy="13" r="7.4" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
              '<circle cx="13" cy="13" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
              '<g stroke="currentColor" stroke-width="2.8" stroke-linecap="butt">' +
              '<path d="M13 2.6v3.1M13 20.3v3.1M2.6 13h3.1M20.3 13h3.1"/>' +
              '<path d="M5.6 5.6l2.2 2.2M18.2 18.2l2.2 2.2M20.4 5.6l-2.2 2.2M7.8 18.2l-2.2 2.2"/>' +
              '</g>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">' + (ICONS[name] || ICONS.notepad) + '</svg>';
  }

  NW.gfx = {
    make: make, dither: dither, grain: grain, vignette: vignette,
    portrait: portrait, fingerprint: fingerprint, latentDamage: latentDamage,
    scene: scene, scenes: SCENES, staticFill: staticFill, icon: icon, ICONS: ICONS
  };
})(window.NW);

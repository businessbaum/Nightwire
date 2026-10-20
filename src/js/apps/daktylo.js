/* NIGHTWIRE — apps/daktylo.js
   Ridge comparison. The latent and the true candidate are the same print,
   rotated and shifted; the operator pairs the points by eye. */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var CW = 300, CH = 360;
  function TH() { return NW.theme.css('--phos-hi'); }

  var COMPARISONS = {
    cmp_quarry: {
      id: 'cmp_quarry', label: 'L-1 · QUARRY DECEDENT · R. THUMB',
      latentSeed: 'vance-1979', damage: 0.55,
      candidates: ['p_lindqvist', 'p_vance', 'p_darrow', 'p_okafor'],
      correct: 'p_vance',
      onIdent: 'print_ident_quarry',
      evidence: 'ev_printmatch'
    },
    cmp_mill: {
      id: 'cmp_mill', label: 'M-4 · MILL OFFICE DOOR PLATE · L. INDEX',
      latentSeed: 'ansel-1981', damage: 0.40,
      candidates: ['p_gault', 'p_fearn_o', 'p_ansel', 'p_darrow'],
      correct: 'p_ansel',
      onIdent: 'print_ident_mill'
    }
  };
  var NEED = 6;   // pairs required for an identification

  var cache = {};
  function print(seed) {
    if (!cache[seed]) cache[seed] = NW.gfx.fingerprint(seed, { minutiae: 12, spacing: 0.0165 });
    return cache[seed];
  }

  function transformFor(seed) {
    var r = new NW.Rng('xf:' + seed);
    return { rot: r.f(-0.55, 0.55), sc: r.f(0.86, 1.12), dx: r.f(-0.05, 0.05), dy: r.f(-0.05, 0.05) };
  }
  function applyT(p, w, h, t) {
    var x = p.x * w - w / 2, y = p.y * h - h / 2;
    var c = Math.cos(t.rot), s = Math.sin(t.rot);
    return {
      x: (x * c - y * s) * t.sc + w / 2 + t.dx * w,
      y: (x * s + y * c) * t.sc + h / 2 + t.dy * h
    };
  }

  function build(body, win, arg) {
    var state = {
      cmp: null, candidate: null,
      pairs: [], selLeft: null, bad: 0, done: false, overlay: false
    };

    var tools = el('div.toolbar');
    var stage = el('div.dk-stage');
    var score = el('div.dk-score');
    body.appendChild(el('div.app', null, [tools, stage, score]));

    var leftCv = NW.gfx.make(CW, CH), rightCv = NW.gfx.make(CW, CH);
    var leftWrap = el('div.dk-canvas-wrap'), rightWrap = el('div.dk-canvas-wrap');
    var leftHead = el('div.dkc-h'), rightHead = el('div.dkc-h');
    leftWrap.appendChild(leftCv); rightWrap.appendChild(rightCv);
    stage.appendChild(el('div.dk-card', null, [leftHead, leftWrap]));
    stage.appendChild(el('div.dk-card', null, [rightHead, rightWrap]));

    var mag = el('canvas', { width: 120, height: 120, style: {
      position: 'absolute', border: '1px solid var(--phos)', pointerEvents: 'none',
      display: 'none', zIndex: '20', background: '#050403', boxShadow: '0 0 16px rgba(0,0,0,.8)' } });
    stage.appendChild(mag);
    stage.style.position = 'relative';

    function setComparison(cid) {
      state.cmp = COMPARISONS[cid];
      state.candidate = null; state.pairs = []; state.selLeft = null; state.bad = 0; state.done = false;
      renderTools(); renderAll();
    }

    function renderTools() {
      U.clear(tools);
      tools.appendChild(el('span.tb-title', { text: 'LATENT' }));
      Object.keys(COMPARISONS).forEach(function (k) {
        if (!S().flags['latent_' + k]) return;
        var c = COMPARISONS[k];
        var b = el('button.btn', { text: c.id === 'cmp_quarry' ? 'L-1 QUARRY' : 'M-4 MILL', class: state.cmp && state.cmp.id === k ? 'on' : '' });
        U.on(b, 'click', function () { NW.audio.play('click'); setComparison(k); });
        tools.appendChild(b);
      });
      if (!state.cmp) return;
      tools.appendChild(el('span.tb-title', { text: '· CANDIDATE' }));
      state.cmp.candidates.forEach(function (pid) {
        var p = NW.people.get(pid);
        var b = el('button.btn', { text: p.name.split(',')[0], class: state.candidate === pid ? 'on' : '' });
        U.on(b, 'click', function () {
          NW.audio.play('disk');
          state.candidate = pid; state.pairs = []; state.selLeft = null; state.bad = 0; state.done = false;
          renderTools(); renderAll();
        });
        tools.appendChild(b);
      });
      var ov = el('button.btn', { text: '◇ OVERLAY', class: state.overlay ? 'on' : '', style: { marginLeft: 'auto' } });
      ov.disabled = state.pairs.length < 1;
      U.on(ov, 'click', function () { state.overlay = !state.overlay; renderTools(); renderAll(); });
      tools.appendChild(ov);
    }

    function renderAll() {
      if (!state.cmp) {
        leftHead.textContent = ''; rightHead.textContent = '';
        var g0 = leftCv.getContext('2d'); g0.clearRect(0, 0, CW, CH);
        var g1 = rightCv.getContext('2d'); g1.clearRect(0, 0, CW, CH);
        U.clear(score);
        score.appendChild(el('div.empty', { text: 'NO LATENT LOADED' }));
        return;
      }
      drawLatent(); drawCandidate(); renderScore();
    }

    function latentPrint() { return print(state.cmp.latentSeed); }
    function candPrint() {
      var p = NW.people.get(state.candidate);
      return print(p.printSeed || ('x' + state.candidate));
    }
    function isTrue() {
      var p = NW.people.get(state.candidate);
      return p && p.printSeed === state.cmp.latentSeed;
    }

    function drawLatent() {
      var g = leftCv.getContext('2d');
      g.clearRect(0, 0, CW, CH);
      g.fillStyle = '#080604'; g.fillRect(0, 0, CW, CH);
      var pr = latentPrint();
      pr.draw(g, CW, CH, { color: TH(), width: 1.5 });
      // damage
      var tmp = NW.gfx.make(CW, CH);
      var tg = tmp.getContext('2d');
      tg.drawImage(leftCv, 0, 0);
      NW.gfx.latentDamage(tmp, state.cmp.latentSeed, state.cmp.damage);
      g.clearRect(0, 0, CW, CH);
      g.fillStyle = '#080604'; g.fillRect(0, 0, CW, CH);
      g.drawImage(tmp, 0, 0);

      leftHead.innerHTML = '<span>' + U.esc(state.cmp.label) + '</span><span>' + pr.pattern.toUpperCase() + '</span>';
      // markers
      pr.minutiae.forEach(function (m, i) {
        var paired = state.pairs.some(function (p) { return p.i === i; });
        marker(g, m.x * CW, m.y * CH, String(i + 1), paired ? '#6dfba6' : (state.selLeft === i ? NW.theme.css('--phos-hi') : '#ff5340'));
      });
      if (state.overlay && state.pairs.length >= 1) {
        var t = transformFor(state.candidate);
        g.globalAlpha = 0.35;
        candPrint().draw(g, CW, CH, { color: NW.theme.css('--cyan'), width: 1.2, transform: invert(t) });
        g.globalAlpha = 1;
      }
    }

    function invert(t) {
      return { rot: -t.rot, sc: 1 / t.sc, dx: -t.dx, dy: -t.dy };
    }

    function drawCandidate() {
      var g = rightCv.getContext('2d');
      g.clearRect(0, 0, CW, CH);
      g.fillStyle = '#080604'; g.fillRect(0, 0, CW, CH);
      if (!state.candidate) {
        rightHead.innerHTML = '<span>NO CANDIDATE</span>';
        g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.35)'; g.font = '11px monospace'; g.textAlign = 'center';
        g.fillText('SELECT A CANDIDATE CARD', CW / 2, CH / 2);
        return;
      }
      var p = NW.people.get(state.candidate);
      var pr = candPrint();
      var t = transformFor(state.candidate);
      pr.draw(g, CW, CH, { color: TH(), width: 1.5, transform: t });
      rightHead.innerHTML = '<span>' + U.esc(p.name) + '</span><span>' + pr.pattern.toUpperCase() + '</span>';

      // after two pairs the alignment is known, so predict where the selected point lands
      if (state.selLeft !== null && state.pairs.length >= 2) {
        var lm = latentPrint().minutiae[state.selLeft];
        if (lm) {
          var q0 = applyT(lm, CW, CH, t);
          g.save();
          g.strokeStyle = '#6dfba6'; g.lineWidth = 1.2; g.setLineDash([4, 4]);
          g.beginPath(); g.arc(q0.x, q0.y, 30, 0, 7); g.stroke();
          g.restore();
          g.fillStyle = 'rgba(109,251,166,.8)'; g.font = '9px "Consolas",monospace'; g.textAlign = 'center';
          g.fillText('PREDICTED', q0.x, q0.y - 36);
        }
      }

      var order = displayOrder();
      order.forEach(function (mi) {
        var m = pr.minutiae[mi];
        var q = applyT(m, CW, CH, t);
        var pair = state.pairs.filter(function (x) { return x.j === mi; })[0];
        marker(g, q.x, q.y, '', pair ? '#6dfba6' : NW.theme.css('--cyan'));
      });
    }

    function displayOrder() {
      var pr = candPrint();
      var r = new NW.Rng('ord:' + state.candidate);
      return r.shuffle(pr.minutiae.map(function (_, i) { return i; }));
    }

    function marker(g, x, y, label, color) {
      g.strokeStyle = color; g.lineWidth = 1.4;
      g.beginPath(); g.arc(x, y, 8, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(x - 12, y); g.lineTo(x - 8, y); g.stroke();
      g.beginPath(); g.moveTo(x + 8, y); g.lineTo(x + 12, y); g.stroke();
      if (label) {
        g.fillStyle = color; g.font = 'bold 10px "Consolas",monospace'; g.textAlign = 'center';
        g.fillText(label, x, y - 12);
      }
    }

    /* ── interaction ── */
    function hitTest(cv, pr, t, e) {
      var r = cv.getBoundingClientRect();
      var mx = (e.clientX - r.left) * (CW / r.width);
      var my = (e.clientY - r.top) * (CH / r.height);
      var best = -1, bd = 18 * 18;
      pr.minutiae.forEach(function (m, i) {
        var q = t ? applyT(m, CW, CH, t) : { x: m.x * CW, y: m.y * CH };
        var d = (q.x - mx) * (q.x - mx) + (q.y - my) * (q.y - my);
        if (d < bd) { bd = d; best = i; }
      });
      return { idx: best, mx: mx, my: my };
    }

    U.on(leftCv, 'click', function (e) {
      if (!state.cmp || state.done) return;
      var h = hitTest(leftCv, latentPrint(), null, e);
      if (h.idx < 0) return;
      if (state.pairs.some(function (p) { return p.i === h.idx; })) return;
      state.selLeft = h.idx;
      NW.audio.play('click');
      drawLatent();
    });

    U.on(rightCv, 'click', function (e) {
      if (!state.cmp || !state.candidate || state.done) return;
      if (state.selLeft === null) {
        NW.notify.push({ head: 'SELECT A LATENT FEATURE FIRST', body: 'Click a numbered point on the latent.', kind: 'bad', ms: 2200 });
        return;
      }
      var t = transformFor(state.candidate);
      var h = hitTest(rightCv, candPrint(), t, e);
      if (h.idx < 0) return;
      if (state.pairs.some(function (p) { return p.j === h.idx; })) return;

      var ok = isTrue() && h.idx === state.selLeft;
      if (ok) {
        state.pairs.push({ i: state.selLeft, j: h.idx });
        NW.audio.play('ok');
      } else {
        state.bad++;
        NW.audio.play('bad');
        NW.notify.push({ head: 'INCONSISTENT', body: 'Ridge flow does not agree at that point.', kind: 'bad', ms: 1800 });
      }
      state.selLeft = null;
      renderTools(); renderAll();
    });

    function showMag(cv, pr, t, e) {
      var h = hitTest(cv, pr, t, e);
      if (h.idx < 0) { mag.style.display = 'none'; return; }
      var m = pr.minutiae[h.idx];
      var q = t ? applyT(m, CW, CH, t) : { x: m.x * CW, y: m.y * CH };
      var g = mag.getContext('2d');
      g.fillStyle = '#050403'; g.fillRect(0, 0, 120, 120);
      g.save();
      g.beginPath(); g.arc(60, 60, 58, 0, 7); g.clip();
      g.translate(60, 60); g.scale(3.4, 3.4); g.translate(-q.x, -q.y);
      g.drawImage(cv, 0, 0);
      g.restore();
      g.strokeStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.5)'; g.lineWidth = 1;
      g.beginPath(); g.arc(60, 60, 58, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(60, 46); g.lineTo(60, 74); g.moveTo(46, 60); g.lineTo(74, 60); g.stroke();
      var sr = stage.getBoundingClientRect();
      mag.style.left = U.clamp(e.clientX - sr.left + 18, 0, sr.width - 124) + 'px';
      mag.style.top = U.clamp(e.clientY - sr.top - 130, 0, sr.height - 124) + 'px';
      mag.style.display = 'block';
    }
    U.on(leftCv, 'mousemove', function (e) { if (state.cmp) showMag(leftCv, latentPrint(), null, e); });
    U.on(rightCv, 'mousemove', function (e) { if (state.candidate) showMag(rightCv, candPrint(), transformFor(state.candidate), e); });
    U.on(stage, 'mouseleave', function () { mag.style.display = 'none'; });

    function renderScore() {
      U.clear(score);
      if (!state.cmp) return;
      var n = state.pairs.length;
      var total = state.candidate ? Math.min(latentPrint().minutiae.length, candPrint().minutiae.length) : 12;
      var pct = Math.min(100, Math.round(n / NEED * 100));
      var cls = n >= NEED ? 'good' : state.bad >= 3 ? 'bad' : '';
      score.appendChild(el('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '7px' } }, [
        el('span', { class: 'dim', style: { fontSize: '9px', letterSpacing: '.2em', width: '128px' }, text: 'CORRESPONDING POINTS' }),
        el('div.meter', { class: cls, style: { flex: '1' } }, [
          el('i', { style: { width: pct + '%' } }),
          el('span', { text: n + ' OF ' + NEED + ' REQUIRED   ·   ' + total + ' AVAILABLE   ·   ' + (state.bad ? state.bad + ' INCONSISTENT' : 'NO CONFLICTS') })
        ])
      ]));

      var msg = el('div', { class: 'dim', style: { fontSize: '11px', marginBottom: '8px' } });
      if (!state.candidate) msg.textContent = 'Select a candidate card. Check the pattern class in the top right of each panel first — it eliminates half the set before you touch a point.';
      else if (n >= NEED) msg.innerHTML = '<span style="color:var(--green)">SUFFICIENT FOR IDENTIFICATION.</span> Record it, then transmit.';
      else if (state.bad >= 3) msg.innerHTML = '<span style="color:var(--red)">THE POINTS WILL NOT GO TOGETHER.</span> Exclusion is a real and useful answer.';
      else if (n >= 2) msg.innerHTML = 'Alignment established. Selecting a latent point now marks <span style="color:var(--green)">PREDICTED</span> on the candidate — confirm the ridge detail matches and click it.';
      else msg.textContent = 'Click a numbered point on the latent, then the same ridge feature on the candidate. Hover either panel to magnify. Two pairs unlock the alignment aid.';
      score.appendChild(msg);

      var bar = el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } });
      var ident = el('button.btn.good', { text: state.done ? '✓ IDENTIFICATION RECORDED' : '▣ RECORD IDENTIFICATION' });
      ident.disabled = n < NEED || state.done;
      U.on(ident, 'click', function () { conclude(true); });
      var excl = el('button.btn.danger', { text: '▢ RECORD EXCLUSION' });
      excl.disabled = state.bad < 3 && n < 1;
      U.on(excl, 'click', function () { conclude(false); });
      var clr = el('button.btn', { text: 'CLEAR PAIRS' });
      U.on(clr, 'click', function () { state.pairs = []; state.bad = 0; state.selLeft = null; renderTools(); renderAll(); });
      bar.appendChild(ident); bar.appendChild(excl); bar.appendChild(clr);

      if (n >= NEED && NW.request.wants('person')) {
        var tx = el('button.btn.good', { text: '▸ TRANSMIT SUBJECT' });
        U.on(tx, 'click', function () {
          var p = NW.people.get(state.candidate);
          NW.request.transmit('person', p.id, p.name);
        });
        bar.appendChild(tx);
      }
      score.appendChild(bar);
    }

    function conclude(identified) {
      var p = NW.people.get(state.candidate);
      var truth = isTrue();
      state.done = true;
      if (identified && truth) {
        NW.audio.play('good');
        NW.state.unlock('records', p.id, true);
        if (state.cmp.evidence) NW.state.addEvidence(state.cmp.evidence);
        NW.state.addFact('DAKTYLO', 'Latent ' + state.cmp.label.split('·')[0].trim() + ' identifies to ' + p.name + ' — ' + state.pairs.length + ' corresponding points.');
        NW.state.flag(state.cmp.onIdent, p.id);
        NW.notify.push({ head: 'IDENTIFICATION', body: p.name, kind: 'good', ms: 6000 });
        NW.notify.overlay({
          title: 'IDENTIFICATION',
          sub: state.cmp.label,
          body: ['<b>' + U.esc(p.name) + '</b> — ' + state.pairs.length + ' corresponding ridge characteristics, no unexplained differences.',
                 'The index record is now open on your terminal.'],
          buttons: [{ label: 'OPEN RECORD', value: 'open' }, { label: 'CLOSE', value: null }]
        }).then(function (v) { if (v === 'open') NW.apps.open('registry', p.id); });
      } else if (!identified && !truth) {
        NW.audio.play('ok');
        NW.state.addFact('DAKTYLO', p.name + ' excluded as the source of ' + state.cmp.label.split('·')[0].trim() + '.');
        NW.notify.push({ head: 'EXCLUDED', body: p.name, kind: 'info' });
        state.done = false;
      } else {
        NW.audio.play('error');
        NW.state.s.stats.wrong++;
        NW.notify.push({ head: 'EXAMINATION ERROR', body: identified ? 'You cannot identify on inconsistent points.' : 'You have excluded a card that agrees on six points.', kind: 'bad', ms: 6000 });
        state.done = false;
      }
      renderScore();
    }

    /** Load a candidate card sent from the registry, switching latent if needed. */
    function loadCandidate(pid) {
      if (!state.cmp || state.cmp.candidates.indexOf(pid) === -1) {
        var k = Object.keys(COMPARISONS).filter(function (id) {
          return S().flags['latent_' + id] && COMPARISONS[id].candidates.indexOf(pid) !== -1;
        }).pop();
        if (!k) {
          NW.notify.push({ head: 'NOT A CANDIDATE', body: 'That card is not in the candidate set for any latent on this terminal.', kind: 'info' });
          return;
        }
        setComparison(k);
      }
      state.candidate = pid; state.pairs = []; state.selLeft = null; state.bad = 0; state.done = false;
      renderTools(); renderAll();
    }

    // a new latent can arrive while the program is open; requests change the buttons
    win.listen('flag', function (d) {
      if (!/^latent_/.test(d.key)) return;
      if (!state.cmp) setComparison(d.key.slice(7)); else renderTools();
    });
    win.listen('request:open', function () { if (state.cmp) renderScore(); });
    win.listen('request:close', function () { if (state.cmp) renderScore(); });
    win.loadCandidate = loadCandidate;

    // pick a comparison
    var want = (arg && arg.cmp) || null;
    var avail = Object.keys(COMPARISONS).filter(function (k) { return S().flags['latent_' + k]; });
    if (want && S().flags['latent_' + want]) setComparison(want);
    else if (avail.length) setComparison(avail[avail.length - 1]);
    else { renderTools(); renderAll(); }

    if (arg && arg.candidate) loadCandidate(arg.candidate);
  }

  NW.apps.define({
    id: 'daktylo', name: 'DAKTYLO', short: 'PRINTS', icon: 'daktylo',
    hint: 'latent ridge comparison',
    win: { w: 700, h: 620, min: [660, 540], resizable: false },
    build: build,
    onFocus: function (win, arg) { if (arg && arg.candidate && win.loadCandidate) win.loadCandidate(arg.candidate); }
  });
})(window.NW);

/* NIGHTWIRE — apps/ballistics.js — comparison microscope, split field */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var REFS = [
    { id: 'R-114', label: 'R-114 · .38 SPL RH-44120 — REG. C. R. ANSEL', seed: 'ref-ansel' },
    { id: 'R-201', label: 'R-201 · .38 SPL — VC SHERIFF SURPLUS LOT',   seed: 'ref-sheriff' },
    { id: 'R-330', label: 'R-330 · .38 SPL — NCIB INVENTORY 8841-D',    seed: 'evidence-m1' },
    { id: 'R-407', label: 'R-407 · .38 SPL — STATE POLICE TRAINING',    seed: 'ref-training' }
  ];
  var EVIDENCE_SEED = 'evidence-m1';

  function striae(seed) {
    var r = new NW.Rng('str:' + seed);
    var out = [];
    for (var i = 0; i < 26; i++) {
      out.push({ y: r.f(0.04, 0.96), w: r.f(0.8, 3.2), a: r.f(0.25, 1) });
    }
    return out.sort(function (a, b) { return a.y - b.y; });
  }

  function build(body) {
    var v = { ref: null, offset: 0, done: {} };
    var W = 460, H = 460;

    var tools = el('div.toolbar');
    var stage = el('div.bl-stage');
    var ctrl = el('div.bl-ctrl');
    var cv = NW.gfx.make(W, H);
    stage.appendChild(cv);
    body.appendChild(el('div.app', null, [tools, stage, ctrl]));
    var g = cv.getContext('2d');

    function renderTools() {
      U.clear(tools);
      tools.appendChild(el('span.tb-title', { text: 'EXHIBIT M-1 vs.' }));
      REFS.forEach(function (r) {
        var b = el('button.btn', { text: r.id, class: v.ref === r.id ? 'on' : '', title: r.label });
        U.on(b, 'click', function () { v.ref = r.id; v.offset = 0; slide.value = 0; NW.audio.play('disk'); renderTools(); draw(); renderCtrl(); });
        tools.appendChild(b);
      });
    }

    function currentRef() { return REFS.filter(function (r) { return r.id === v.ref; })[0]; }
    function isMatch() { var r = currentRef(); return r && r.seed === EVIDENCE_SEED; }

    /** True offset for a matching reference (mounting difference). */
    function trueOffset() { return 0.17; }

    function score() {
      if (!v.ref) return 0;
      var A = striae(EVIDENCE_SEED);
      var B = striae(currentRef().seed);
      var hits = 0;
      A.forEach(function (a) {
        var best = 1;
        B.forEach(function (b) {
          var d = Math.abs((b.y - (isMatch() ? trueOffset() : 0) + v.offset) - a.y);
          if (d < best) best = d;
        });
        if (best < 0.012) hits++;
      });
      return hits;
    }

    function draw() {
      g.fillStyle = '#050403'; g.fillRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 12;

      g.save();
      g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip();
      g.fillStyle = '#161208'; g.fillRect(0, 0, W, H);

      // left half — evidence
      g.save();
      g.beginPath(); g.rect(0, 0, cx, H); g.clip();
      drawStriae(striae(EVIDENCE_SEED), 0, NW.theme.css('--phos-hi'));
      g.restore();

      // right half — reference
      if (v.ref) {
        g.save();
        g.beginPath(); g.rect(cx, 0, cx, H); g.clip();
        drawStriae(striae(currentRef().seed), -(isMatch() ? trueOffset() : 0) + v.offset, NW.theme.css('--phos-hi'));
        g.restore();
      } else {
        g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.3)'; g.font = '12px "Consolas",monospace'; g.textAlign = 'center';
        g.fillText('NO REFERENCE MOUNTED', cx + cx / 2, cy);
      }
      g.restore();

      // seam
      g.strokeStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.6)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(cx, cy - R); g.lineTo(cx, cy + R); g.stroke();
      // field
      g.strokeStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.45)'; g.lineWidth = 2;
      g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
      g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.65)'; g.font = '9px "Consolas",monospace';
      g.textAlign = 'left'; g.fillText('M-1 (QUESTIONED)', 14, 20);
      g.textAlign = 'right'; g.fillText(v.ref ? v.ref + ' (KNOWN)' : '—', W - 14, 20);
    }

    function drawStriae(list, off, color) {
      var R = Math.min(W, H) / 2 - 12;
      list.forEach(function (s) {
        var y = (s.y + off) * H;
        g.strokeStyle = color;
        g.globalAlpha = s.a * 0.85;
        g.lineWidth = s.w;
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
      });
      g.globalAlpha = 1;
      // surface texture
      var r = new NW.Rng('tex' + off);
      g.globalAlpha = 0.12;
      for (var i = 0; i < 260; i++) {
        g.fillStyle = NW.theme.css('--phos-hi');
        g.fillRect(r.f(0, W), r.f(0, H), r.f(1, 3), 1);
      }
      g.globalAlpha = 1;
    }

    var slide = el('input', { type: 'range', min: -0.4, max: 0.4, step: 0.002, value: 0, style: { flex: '1' } });
    U.on(slide, 'input', function () { v.offset = parseFloat(slide.value); draw(); renderCtrl(); });

    var readout = el('div');
    function renderCtrl() {
      U.clear(ctrl);
      ctrl.appendChild(el('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' } }, [
        el('span', { class: 'dim', style: { fontSize: '9px', letterSpacing: '.18em', width: '118px' }, text: 'STAGE TRAVERSE' }),
        slide,
        el('span', { class: 'dim', style: { width: '60px', textAlign: 'right', fontSize: '10px' }, text: (v.offset * 1000).toFixed(0) + ' µm' })
      ]));
      var n = score();
      var pct = Math.min(100, Math.round(n / 18 * 100));
      ctrl.appendChild(el('div', { style: { display: 'flex', gap: '12px', alignItems: 'center' } }, [
        el('span', { class: 'dim', style: { fontSize: '9px', letterSpacing: '.18em', width: '118px' }, text: 'STRIAE IN AGREEMENT' }),
        el('div.meter', { class: n >= 14 ? 'good' : n < 6 ? 'bad' : '', style: { flex: '1' } }, [
          el('i', { style: { width: pct + '%' } }), el('span', { text: n + ' CONSECUTIVE' })
        ])
      ]));
      var msg = el('div', { class: 'dim', style: { fontSize: '11px', margin: '8px 0' } });
      if (!v.ref) msg.textContent = 'Mount a known reference, then traverse the stage until the striae run through the seam.';
      else if (n >= 14) msg.innerHTML = '<span style="color:var(--green)">SUFFICIENT AGREEMENT — IDENTIFICATION.</span>';
      else msg.textContent = 'Traverse slowly. When the lines cross the seam unbroken, you are on it.';
      ctrl.appendChild(msg);

      var bar = el('div', { style: { display: 'flex', gap: '8px' } });
      var id = el('button.btn.good', { text: '▣ RECORD IDENTIFICATION' });
      id.disabled = n < 14;
      U.on(id, 'click', conclude);
      bar.appendChild(id);
      var ex = el('button.btn.danger', { text: '▢ ELIMINATE' });
      ex.disabled = !v.ref;
      U.on(ex, 'click', function () {
        if (isMatch()) { NW.audio.play('error'); NW.notify.push({ head: 'ERROR', body: 'That reference agrees. Traverse the stage properly.', kind: 'bad' }); return; }
        NW.audio.play('ok');
        NW.state.addFact('BALLISTICS', currentRef().label + ' eliminated as the source of M-1.');
        NW.notify.push({ head: 'ELIMINATED', body: v.ref, kind: 'info' });
      });
      bar.appendChild(ex);
      ctrl.appendChild(bar);
    }

    function conclude() {
      NW.audio.play('good');
      NW.state.addEvidence('ev_weapon_agency');
      NW.state.addEvidence('ev_nc88');
      NW.state.unlock('docs', 'd_ballistics_98', true);
      NW.state.unlock('docs', 'd_nc88_lease', true);
      NW.state.flag('ballistics_done', true);
      NW.state.addFact('BALLISTICS', 'M-1 identifies to reference R-330 — NCIB inventory 8841-D, furnaced 1994.');
      NW.notify.overlay({
        title: 'IDENTIFICATION', sub: 'EXHIBIT M-1 → REFERENCE R-330',
        body: ['Eighteen consecutive matching striae. The cartridge case recovered from the loading bay at Marrow Street was fired by <b>NCIB inventory weapon 8841-D</b>.',
               'Form NC-88, Q4 1994, Lot 12 records that weapon as destroyed in the furnace. It is the only line on the schedule with no witnessing initials.',
               'The schedule is signed by the Deputy Chief.'],
        buttons: [{ label: 'OPEN THE SCHEDULE', value: 'doc' }, { label: 'LOG IT', value: null }]
      }).then(function (x) { if (x === 'doc') NW.apps.open('archive', 'd_nc88_lease'); });
    }

    renderTools(); draw(); renderCtrl();
  }

  NW.apps.define({
    id: 'ballistics', name: 'BALLISTICS', short: 'BALL.', icon: 'ballistics',
    hint: 'comparison microscope',
    win: { w: 520, h: 660, min: [500, 600], resizable: false },
    build: build
  });
})(window.NW);

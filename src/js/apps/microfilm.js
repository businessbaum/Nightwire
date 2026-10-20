/* NIGHTWIRE — apps/microfilm.js
   County reel reader: wind to a frame, find focus, copy what matters. */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var REELS = [
    {
      id: 'reel_ledger87', label: 'PORT ALDEN LEDGER — AUG/SEP 1987', frames: 60,
      targets: [
        { f: 14, title: 'QUARRY ACCOUNTANT DIES IN ROUTE FIRE', doc: 'd_ledger_1',
          note: 'The 13 August front page. Adair\'s byline, and the dispatch discrepancy in the fifth paragraph.' },
        { f: 43, title: 'HALLORAN INQUIRY CLOSED; NO CHARGES', doc: 'd_ledger_2',
          note: 'Six weeks later. Two columns, page eleven, and a one-line note that Adair has been reassigned.' },
        { f: 27, title: 'FRAMES 26–29 REMOVED', spliced: true, evidence: 'ev_adair_press',
          note: 'A splice. Four frames cut out of a county reel and the ends taped back together by somebody in a hurry. The index card for this reel lists 60 frames. There are 56.' }
      ]
    },
    {
      id: 'reel_county94', label: 'VC SURPLUS PROPERTY BOARD — 1994', frames: 48,
      requires: 'ch5',
      targets: [
        { f: 31, title: 'LEASE — GRIEVE HILL BLDGS B & C', doc: 'd_lease_grieve', evidence: 'ev_grieve_power',
          note: 'Twenty-five years at a dollar a year to a company incorporated eleven days earlier.' },
        { f: 9, title: 'ARTICLES — ALDEN CIVIC HOLDINGS LLC', doc: 'd_llc_alden',
          note: 'Registered agent: Howard K. Bellamy, 1 Harbour Crest, Ashvale. Members not disclosed.' }
      ]
    }
  ];

  var HEADS = ['COUNTY BOARD DEFERS VOTE ON HARBOUR LEVY', 'CANNERY LAYOFFS TO CONTINUE INTO AUTUMN',
    'ASHVALE MAN, 71, WINS THIRD MARROW ST DERBY', 'SCHOOL BOND MEASURE FAILS BY ELEVEN VOTES',
    'RAIN DELAYS RESURFACING OF ROUTE 9 NORTH', 'FERRY SERVICE TO RESUME SATURDAY',
    'STATE CLOSES GRIEVE HILL WARDS C AND D', 'PAPER MILL SEEKS TAX ABATEMENT',
    'QUARRY BLASTING SCHEDULE POSTED FOR MONTH', 'OBITUARIES', 'CLASSIFIED — HELP WANTED',
    'LEGAL NOTICES', 'CHURCH SUPPER RAISES $412', 'HARBOUR DREDGING BID AWARDED'];

  function build(body, win) {
    var v = { reel: null, frame: 1, focus: 0.55 };
    var W = 620, H = 430;

    var tools = el('div.toolbar');
    var view = el('div.mf-view');
    var ctrl = el('div.mf-ctrl');
    var cv = NW.gfx.make(W, H);
    view.appendChild(cv);
    body.appendChild(el('div.app', null, [tools, view, ctrl]));
    var g = cv.getContext('2d');
    var frameCache = {};

    function renderTools() {
      U.clear(tools);
      tools.appendChild(el('span.tb-title', { text: 'REEL' }));
      REELS.forEach(function (r) {
        if (r.requires && !NW.state.has(r.requires)) return;
        var b = el('button.btn', { text: r.label.split('—')[0].trim(), class: v.reel && v.reel.id === r.id ? 'on' : '', title: r.label });
        U.on(b, 'click', function () { mount(r); });
        tools.appendChild(b);
      });
    }

    function mount(r) {
      v.reel = r; v.frame = 1; v.focus = 0.5;
      NW.audio.play('disk');
      reelSlider.max = r.frames; reelSlider.value = 1;
      focusSlider.value = v.focus;
      renderTools(); draw(); renderInfo();
    }

    function targetAt(f) {
      if (!v.reel) return null;
      return v.reel.targets.filter(function (t) { return t.f === f; })[0] || null;
    }

    function frameCanvas(reelId, f) {
      var key = reelId + ':' + f;
      if (frameCache[key]) return frameCache[key];
      var c = NW.gfx.make(W, H);
      var x = c.getContext('2d');
      var r = new NW.Rng(key);
      var t = targetAt(f);

      x.fillStyle = '#1a1712'; x.fillRect(0, 0, W, H);
      if (t && t.spliced) {
        NW.gfx.staticFill(x, W, H, key, [255, 182, 61]);
        x.fillStyle = 'rgba(0,0,0,.6)'; x.fillRect(0, H / 2 - 34, W, 68);
        x.fillStyle = NW.theme.css('--phos'); x.font = 'bold 15px "Consolas",monospace'; x.textAlign = 'center';
        x.fillText('◤ SPLICE ◢', W / 2, H / 2 - 8);
        x.font = '11px "Consolas",monospace';
        x.fillText('FRAMES 26–29 ABSENT FROM THIS REEL', W / 2, H / 2 + 14);
        frameCache[key] = c; return c;
      }

      // newsprint page
      var pad = 26;
      x.fillStyle = '#d6cdb6'; x.fillRect(pad, 14, W - pad * 2, H - 28);
      x.fillStyle = '#221d13';
      x.font = 'bold 13px "Times New Roman",serif'; x.textAlign = 'center';
      x.fillText('THE PORT ALDEN LEDGER', W / 2, 34);
      x.fillRect(pad + 8, 40, W - pad * 2 - 16, 2);
      x.font = '8px "Consolas",monospace'; x.textAlign = 'left';
      x.fillText('FRAME ' + U.pad(f, 3) + '   ·   REEL ' + reelId.toUpperCase(), pad + 10, 54);

      var head = t ? t.title : r.pick(HEADS);
      x.font = 'bold ' + (t ? 17 : 14) + 'px "Times New Roman",serif';
      x.textAlign = 'left';
      wrap(x, head, pad + 10, 78, W - pad * 2 - 20, 20);

      // columns of grey text
      var colW = (W - pad * 2 - 30) / 3;
      for (var c2 = 0; c2 < 3; c2++) {
        var cx0 = pad + 10 + c2 * (colW + 8);
        for (var line = 0; line < 26; line++) {
          var yy = 120 + line * 10;
          if (yy > H - 26) break;
          x.fillStyle = 'rgba(34,29,19,' + r.f(0.35, 0.72) + ')';
          x.fillRect(cx0, yy, colW * r.f(0.6, 1), 3);
        }
      }
      if (t) {
        x.fillStyle = 'rgba(34,29,19,.9)';
        x.font = 'italic 10px "Times New Roman",serif';
        x.fillText('By SIMONE ADAIR, Staff Writer', pad + 10, 112);
      }
      // film base
      x.fillStyle = 'rgba(0,0,0,.5)';
      x.fillRect(0, 0, pad - 8, H); x.fillRect(W - pad + 8, 0, pad, H);
      for (var s = 4; s < H; s += 22) {
        x.fillStyle = '#0d0b08'; x.fillRect(4, s, 9, 12); x.fillRect(W - 13, s, 9, 12);
      }
      NW.gfx.grain(c, 0.10, key);
      frameCache[key] = c;
      return c;
    }

    function wrap(x, text, px, py, maxW, lh) {
      var words = text.split(' '), line = '', yy = py;
      words.forEach(function (w) {
        var test = line + w + ' ';
        if (x.measureText(test).width > maxW && line) { x.fillText(line, px, yy); line = w + ' '; yy += lh; }
        else line = test;
      });
      x.fillText(line, px, yy);
    }

    function draw() {
      g.fillStyle = '#0d0b08'; g.fillRect(0, 0, W, H);
      if (!v.reel) {
        g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.4)'; g.font = '12px "Consolas",monospace'; g.textAlign = 'center';
        g.fillText('NO REEL MOUNTED', W / 2, H / 2);
        return;
      }
      var blur = Math.abs(v.focus - 0.5) * 16;
      g.save();
      g.filter = 'blur(' + blur.toFixed(2) + 'px) sepia(.35) brightness(' + (1.05 - blur * 0.02) + ')';
      g.drawImage(frameCanvas(v.reel.id, v.frame), 0, 0);
      g.restore();
      g.filter = 'none';
      // amber tint
      g.globalCompositeOperation = 'multiply';
      g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.55)'; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.6)'; g.font = '9px "Consolas",monospace'; g.textAlign = 'left';
      g.fillText('FOCUS ' + (blur < 0.6 ? 'SHARP' : blur < 3 ? 'SOFT' : 'OUT'), 8, H - 8);
    }

    // sliders are built once; only the frame number and info box change
    var reelSlider = el('input', { type: 'range', min: 1, max: 60, step: 1, value: 1 });
    U.on(reelSlider, 'input', function () {
      v.frame = parseInt(reelSlider.value, 10);
      NW.audio.play('type');
      draw(); renderInfo();
    });
    var focusSlider = el('input', { type: 'range', min: 0, max: 1, step: 0.01, value: 0.55 });
    U.on(focusSlider, 'input', function () { v.focus = parseFloat(focusSlider.value); draw(); });
    var frameNo = el('span.mf-frameno');
    var box = el('div', { style: { minHeight: '44px', marginTop: '6px', fontSize: '11px' } });
    ctrl.appendChild(el('div.mf-reel', null, [el('span.mfr-lbl', { text: 'ADVANCE' }), reelSlider, frameNo]));
    ctrl.appendChild(el('div.mf-reel', null, [el('span.mfr-lbl', { text: 'FOCUS' }), focusSlider, el('span.mf-frameno')]));
    ctrl.appendChild(box);

    // keyboard: left/right winds one frame
    win.wind = function (d) {
      if (!v.reel) return;
      v.frame = U.clamp(v.frame + d, 1, v.reel.frames);
      reelSlider.value = v.frame;
      NW.audio.play('type');
      draw(); renderInfo();
    };

    function renderInfo() {
      frameNo.textContent = 'FRAME ' + U.pad(v.frame, 3) + ' / ' + (v.reel ? v.reel.frames : '—');
      U.clear(box);
      var t = targetAt(v.frame);
      if (!v.reel) box.innerHTML = '<span class="dim">Mount a reel.</span>';
      else if (!t) box.innerHTML = '<span class="dim">Ordinary page. Keep winding.</span>';
      else {
        box.appendChild(el('div', { class: 'mono-hi', text: t.title }));
        box.appendChild(el('div', { class: 'dim', style: { marginTop: '3px' }, text: t.note }));
        var b = el('button.btn.good', { text: t.spliced ? '▣ LOG THE SPLICE' : '▣ COPY FRAME TO ARCHIVE', style: { marginTop: '6px' } });
        if (S().flags['mf_' + v.reel.id + '_' + v.frame]) { b.disabled = true; b.textContent = '✓ RECORDED'; }
        U.on(b, 'click', function () {
          S().flags['mf_' + v.reel.id + '_' + v.frame] = true;
          NW.audio.play('good');
          if (t.doc) { NW.state.unlock('docs', t.doc, true); NW.notify.push({ head: 'COPIED TO ARCHIVE', body: t.title, kind: 'good' }); }
          if (t.evidence) NW.state.addEvidence(t.evidence);
          NW.state.addFact('MICROFILM', t.title + ' — ' + t.note);
          renderInfo();
        });
        box.appendChild(b);
      }
    }

    // the 1994 reel arrives in chapter five
    win.listen('chapter', renderTools);
    win.listen('theme', draw);

    renderTools();
    var first = REELS.filter(function (r) { return !r.requires || NW.state.has(r.requires); })[0];
    if (first) mount(first); else { draw(); renderInfo(); }
  }

  NW.apps.define({
    id: 'microfilm', name: 'MICROFILM', short: 'FILM', icon: 'microfilm',
    hint: 'county reel reader',
    win: { w: 680, h: 620, min: [660, 580], resizable: false },
    build: build,
    onKey: function (e, win) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { win.wind(e.key === 'ArrowLeft' ? -1 : 1); return true; }
      return false;
    }
  });
})(window.NW);

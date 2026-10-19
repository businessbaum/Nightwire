/* NIGHTWIRE — apps/cipher.js — the decoder desk */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function caesar(t, k) {
    return t.replace(/[a-zA-Z]/g, function (c) {
      var up = c === c.toUpperCase();
      var i = A.indexOf(c.toUpperCase());
      return (up ? A : A.toLowerCase())[(i + k % 26 + 26) % 26];
    });
  }
  function vigenere(t, key, dir) {
    key = String(key).toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) return t;
    var ki = 0;
    return t.replace(/[a-zA-Z]/g, function (c) {
      var i = A.indexOf(c.toUpperCase());
      var k = A.indexOf(key[ki % key.length]); ki++;
      return A[(i + (dir < 0 ? -k + 26 : k)) % 26];
    });
  }
  function freq(t) {
    var f = {}, n = 0;
    t.toUpperCase().replace(/[A-Z]/g, function (c) { f[c] = (f[c] || 0) + 1; n++; return c; });
    return { f: f, n: n };
  }

  var INTERCEPTS = [
    {
      id: 'cy_train', label: 'TRAINING EXERCISE 9-A', requires: 'ch0',
      mode: 'caesar',
      plain: 'OPERATOR THE FIRST QUESTION IN ANY FILE IS WHO PAID FOR IT AND THE SECOND IS WHO SIGNED',
      shift: 7,
      hint: 'A simple shift. Run the shift dial until English falls out.',
      onSolve: { flag: 'cipher_train_done' }
    },
    {
      id: 'cy_vance', label: 'ITEM Q-3 · SLIP OF PAPER, DECEDENT\'S SHOE', requires: 'have_cy_vance',
      mode: 'vigenere', key: 'MAULE',
      plain: 'SHOT FIRING SHED LOCKER ELEVEN AT THE QUARRY BOTH KEYS FIT THE SAME LOCK IF I DO NOT COME BACK TELL CLAIRE IT WAS NEVER ABOUT THE MONEY',
      hint: 'Header on the slip reads: K = THE NAME I USED. He used one name for eleven years and it was not his own.',
      onSolve: { evidence: ['ev_locker_hint'], flag: 'cy_vance_done',
        fact: { c: 'CIPHER', t: 'Vance\'s slip: locker eleven, shot-firing shed, Halloran Quarry. Both keys fit the same lock.' } }
    },
    {
      id: 'cy_book', label: 'NIGHTWIRE RELAY · LAST.ENC ADDENDUM', requires: 'have_cy_book',
      mode: 'reference',
      hint: 'Page · line · word. Section 9.3 of the manual describes the method. You already have the book — you are sitting at Copy 04.',
      onSolve: { evidence: ['ev_bookcipher', 'ev_b17'], flag: 'cy_book_done',
        fact: { c: 'CIPHER', t: 'Voss\'s reference cipher decodes to: GRIEVE HILL WARD SEVENTEEN SHE IS ALIVE.' } }
    }
  ];

  function build(body, win, arg) {
    var v = { sel: null, mode: 'caesar', shift: 0, key: '', sub: {}, input: '' };

    var tools = el('div.toolbar');
    var side = el('div.sidebar.scroll');
    var main = el('div.grow.col.scroll');
    body.appendChild(el('div.app', null, [tools, el('div.app-row', null, [side, main])]));

    function available() {
      return INTERCEPTS.filter(function (c) { return NW.state.has(c.requires) || c.requires === 'ch0'; });
    }

    function cipherText(c) {
      if (c.mode === 'caesar') return caesar(c.plain, c.shift);
      if (c.mode === 'vigenere') return vigenere(c.plain, c.key, 1);
      if (c.mode === 'reference') return NW.manual.encodeBook(NW.manual.SECRET).join('  ');
      return c.plain;
    }

    function renderSide() {
      U.clear(side);
      side.appendChild(el('div.sec-h', { text: 'INTERCEPTS' }));
      var list = available();
      if (!list.length) side.appendChild(el('div.empty', { text: 'NOTHING TO WORK ON' }));
      list.forEach(function (c) {
        var done = NW.state.has(c.onSolve.flag);
        var row = el('div.lrow', { class: v.sel === c.id ? 'sel' : '' }, [
          el('div.lr-t', { text: (done ? '✓ ' : '') + c.label }),
          el('div.lr-s', { text: c.mode.toUpperCase() })
        ]);
        U.on(row, 'click', function () { select(c.id); });
        side.appendChild(row);
      });
      side.appendChild(el('div.sec-h', { text: 'FREE TEXT' }));
      var ta = el('textarea.input', { style: { width: 'calc(100% - 16px)', margin: '8px', height: '70px', fontSize: '11px' }, placeholder: 'paste anything…' });
      U.on(ta, 'input', function () { v.sel = null; v.input = ta.value; renderMain(); });
      side.appendChild(ta);
    }

    function select(id) {
      v.sel = id;
      var c = INTERCEPTS.filter(function (x) { return x.id === id; })[0];
      v.mode = c.mode === 'reference' ? 'reference' : c.mode;
      v.input = cipherText(c);
      v.shift = 0; v.key = ''; v.sub = {};
      NW.audio.play('open');
      renderSide(); renderTools(); renderMain();
    }

    function renderTools() {
      U.clear(tools);
      tools.appendChild(el('span.tb-title', { text: 'METHOD' }));
      [['caesar', 'SHIFT'], ['vigenere', 'RUNNING KEY'], ['sub', 'SUBSTITUTION'], ['reference', 'REFERENCE (P·L·W)']].forEach(function (m) {
        var b = el('button.btn', { text: m[1], class: v.mode === m[0] ? 'on' : '' });
        U.on(b, 'click', function () { v.mode = m[0]; NW.audio.play('click'); renderTools(); renderMain(); });
        tools.appendChild(b);
      });
    }

    function output() {
      var t = v.input || '';
      if (v.mode === 'caesar') return caesar(t, -v.shift);
      if (v.mode === 'vigenere') return vigenere(t, v.key, -1);
      if (v.mode === 'sub') {
        return t.replace(/[a-zA-Z]/g, function (c) { return v.sub[c.toUpperCase()] || '·'; });
      }
      if (v.mode === 'reference') {
        var out = [];
        (t.match(/\d+\s*[.\-·]\s*\d+\s*[.\-·]\s*\d+/g) || []).forEach(function (tr) {
          var p = tr.split(/[.\-·]/).map(function (x) { return parseInt(x.trim(), 10); });
          var w = NW.manual.decodeTriple(p[0], p[1], p[2]);
          out.push(w ? w.toUpperCase() : '‹?›');
        });
        return out.join(' ');
      }
      return t;
    }

    function renderMain() {
      U.clear(main);
      var c = v.sel ? INTERCEPTS.filter(function (x) { return x.id === v.sel; })[0] : null;

      if (c) {
        main.appendChild(el('div', { class: 'pad', style: { borderBottom: '1px solid var(--phos-ghost)' } }, [
          el('div', { class: 'mono-hi', style: { fontSize: '12px' }, text: c.label }),
          el('div', { class: 'dim', style: { fontSize: '11px', marginTop: '4px', lineHeight: '1.6' }, text: c.hint })
        ]));
      }

      var io = el('div.cy-io');
      io.appendChild(el('div.cy-lbl', { text: 'CIPHERTEXT' }));
      io.appendChild(el('div.cy-box', { text: v.input || '(nothing loaded)' }));

      // controls
      var ctl = el('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } });
      if (v.mode === 'caesar') {
        var sl = el('input', { type: 'range', min: 0, max: 25, step: 1, value: v.shift, style: { width: '190px' } });
        var lab = el('span', { class: 'mono-hi', style: { width: '84px' }, text: 'SHIFT ' + v.shift });
        U.on(sl, 'input', function () { v.shift = parseInt(sl.value, 10); lab.textContent = 'SHIFT ' + v.shift; NW.audio.play('type'); renderOut(); });
        ctl.appendChild(el('span', { class: 'dim', text: 'DIAL' })); ctl.appendChild(sl); ctl.appendChild(lab);
        var auto = el('button.btn', { text: 'SCAN ALL 25' });
        U.on(auto, 'click', function () { scanAll(); });
        ctl.appendChild(auto);
      } else if (v.mode === 'vigenere') {
        var ki = el('input.input', { placeholder: 'KEY WORD', value: v.key, style: { width: '190px' } });
        U.on(ki, 'input', function () { v.key = ki.value; NW.audio.play('key'); renderOut(); });
        ctl.appendChild(el('span', { class: 'dim', text: 'KEY' })); ctl.appendChild(ki);
      } else if (v.mode === 'reference') {
        ctl.appendChild(el('span', { class: 'dim', style: { fontSize: '11px' },
          text: 'BOOK: NCIB ANALYSIS OPERATOR MANUAL, 4TH ED., COPY 04 — resolved automatically.' }));
      }
      io.appendChild(ctl);

      io.appendChild(el('div.cy-lbl', { style: { marginTop: '8px' }, text: 'PLAINTEXT' }));
      var outBox = el('div.cy-box.out', { text: output() });
      io.appendChild(outBox);
      main.appendChild(io);

      function renderOut() { outBox.textContent = output(); checkSolved(outBox); }

      if (v.mode === 'sub') main.appendChild(subGrid(renderOut));
      main.appendChild(freqChart());

      var bar = el('div', { class: 'pad', style: { display: 'flex', gap: '8px' } });
      var acc = el('button.btn.good', { text: '▣ ACCEPT PLAINTEXT' });
      U.on(acc, 'click', function () { accept(outBox.textContent); });
      bar.appendChild(acc);
      main.appendChild(bar);

      checkSolved(outBox);
    }

    function scanAll() {
      var lines = [];
      for (var k = 0; k < 26; k++) {
        lines.push({ t: U.pad(k) + '  ' + caesar(v.input, -k).slice(0, 68), c: '' });
      }
      NW.notify.overlay({
        title: 'SHIFT SCAN', sub: 'ALL 25 ROTATIONS',
        html: '<h2>SHIFT SCAN</h2><div class="ov-sub">ALL 26 ROTATIONS — ONE OF THEM IS ENGLISH</div>' +
              '<pre style="font-size:11px;line-height:1.5;max-height:340px;overflow:auto">' +
              lines.map(function (l) { return U.esc(l.t); }).join('\n') + '</pre>',
        buttons: [{ label: 'CLOSE', value: 1 }]
      });
    }

    function subGrid(onChange) {
      var grid = el('div.sub-grid');
      A.split('').forEach(function (c) {
        var cell = el('div.sub-cell', null, [el('div.sc-a', { text: c })]);
        var inp = el('input', { maxlength: 1, value: v.sub[c] || '' });
        U.on(inp, 'input', function () { v.sub[c] = inp.value.toUpperCase(); onChange(); });
        cell.appendChild(inp);
        grid.appendChild(cell);
      });
      return grid;
    }

    function freqChart() {
      var wrap = el('div');
      wrap.appendChild(el('div.cy-lbl', { style: { padding: '0 12px' }, text: 'LETTER FREQUENCY — CIPHERTEXT' }));
      var f = freq(v.input || '');
      var max = 1;
      A.split('').forEach(function (c) { max = Math.max(max, f.f[c] || 0); });
      var chart = el('div.freq-chart');
      A.split('').forEach(function (c) {
        var h = (f.f[c] || 0) / max * 100;
        var bar = el('div.freq-bar', { class: h > 62 ? 'hi' : '', style: { height: Math.max(1, h) + '%' } }, [el('span', { text: c })]);
        bar.title = c + ': ' + (f.f[c] || 0);
        chart.appendChild(bar);
      });
      wrap.appendChild(chart);
      wrap.appendChild(el('div', { class: 'dim', style: { padding: '14px 12px 6px', fontSize: '10px' },
        text: 'English runs E T A O I N S H R. A flat chart means a running key. A chart with one spike means a shift.' }));
      return wrap;
    }

    function normalise(s) { return String(s).toUpperCase().replace(/[^A-Z]/g, ''); }

    function checkSolved(box) {
      var c = v.sel ? INTERCEPTS.filter(function (x) { return x.id === v.sel; })[0] : null;
      if (!c) return;
      var target = c.mode === 'reference' ? NW.manual.SECRET : c.plain;
      if (normalise(box.textContent) === normalise(target)) {
        box.style.borderColor = 'var(--green)';
      }
    }

    function accept(text) {
      var c = v.sel ? INTERCEPTS.filter(function (x) { return x.id === v.sel; })[0] : null;
      if (!c) { NW.notify.push({ head: 'NO INTERCEPT', body: 'Free text is not scored.', kind: 'info' }); return; }
      var target = c.mode === 'reference' ? NW.manual.SECRET : c.plain;
      if (normalise(text) !== normalise(target)) {
        NW.audio.play('bad');
        NW.notify.push({ head: 'NOT PLAIN ENGLISH', body: 'The output is still gibberish. Keep working.', kind: 'bad' });
        return;
      }
      if (NW.state.has(c.onSolve.flag)) return;
      NW.audio.play('unlock');
      S().stats.decrypts++;
      NW.state.flag(c.onSolve.flag, true);
      (c.onSolve.evidence || []).forEach(function (e) { NW.state.addEvidence(e); });
      if (c.onSolve.fact) NW.state.addFact(c.onSolve.fact.c, c.onSolve.fact.t);
      NW.notify.overlay({
        title: 'DECIPHERED', sub: c.label,
        body: ['<span style="color:var(--green)">' + U.esc(target) + '</span>'],
        buttons: [{ label: 'LOG IT', value: 1 }]
      });
      renderSide();
    }

    renderSide(); renderTools(); renderMain();
    if (arg && INTERCEPTS.some(function (c) { return c.id === arg; })) select(arg);
    else {
      var avail = available().filter(function (c) { return !NW.state.has(c.onSolve.flag); });
      if (avail.length) select(avail[0].id);
    }
  }

  NW.apps.define({
    id: 'cipher', name: 'CIPHER DESK', short: 'CIPHER', icon: 'cipher',
    hint: 'shift, running key, substitution, reference',
    win: { w: 780, h: 620, min: [620, 460] },
    build: build,
    onFocus: function () {}
  });

  NW.cipher = { caesar: caesar, vigenere: vigenere };
})(window.NW);

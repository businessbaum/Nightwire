/* NIGHTWIRE — apps/settings.js — display, audio, saves */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;

  function row(label, control, valueNode) {
    return el('div.set-row', null, [
      el('div.sr-l', { text: label }),
      el('div.sr-c', null, control),
      valueNode || null
    ]);
  }

  function slider(key, min, max, step, fmt) {
    var s = NW.state.settings();
    var val = el('span.sr-v', { text: fmt ? fmt(s[key]) : s[key] });
    var inp = el('input', { type: 'range', min: min, max: max, step: step, value: s[key], style: { flex: '1' } });
    U.on(inp, 'input', function () {
      s[key] = parseFloat(inp.value);
      val.textContent = fmt ? fmt(s[key]) : s[key];
      NW.crt.applySettings();
      NW.state.saveSettings();
    });
    return { inp: inp, val: val };
  }

  function build(body) {
    var tools = el('div.toolbar', null, [el('span.tb-title', { text: 'TERMINAL CONFIGURATION' })]);
    var pane = el('div.grow.scroll');
    body.appendChild(el('div.app', null, [tools, pane]));

    pane.appendChild(el('div.sec-h', { text: 'PHOSPHOR' }));
    var themeRow = el('div', { class: 'pad', style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } });
    function renderThemes() {
      U.clear(themeRow);
      NW.theme.list.forEach(function (t) {
        var on = NW.theme.current() === t.id;
        var b = el('button.btn' + (on ? '.on' : ''), { text: t.name, title: t.sub, style: { padding: '6px 16px' } });
        U.on(b, 'click', function () {
          NW.state.settings().theme = t.id;
          NW.state.saveSettings();
          NW.crt.applySettings();
          renderThemes();
          sub.textContent = t.sub;
        });
        themeRow.appendChild(b);
      });
    }
    var sub = el('div', { class: 'pad dim', style: { fontSize: '10px', letterSpacing: '.16em', paddingTop: '0' } });
    pane.appendChild(themeRow);
    pane.appendChild(sub);
    renderThemes();
    sub.textContent = (NW.theme.list.filter(function (t) { return t.id === NW.theme.current(); })[0] || {}).sub || '';

    pane.appendChild(el('div.sec-h', { text: 'PICTURE TUBE' }));
    var a = slider('scan', 0, 0.7, 0.01, function (v) { return Math.round(v * 100) + '%'; });
    pane.appendChild(row('SCAN LINES', a.inp, a.val));
    var b = slider('noise', 0, 0.15, 0.0015, function (v) { return Math.round(v / 0.15 * 100) + '%'; });
    pane.appendChild(row('TUBE NOISE', b.inp, b.val));
    var c = slider('flicker', 0, 1, 0.1, function (v) { return Math.round(v * 100) + '%'; });
    pane.appendChild(row('FLICKER', c.inp, c.val));
    var d = slider('curve', 0, 1, 0.1, function (v) { return Math.round(v * 100) + '%'; });
    pane.appendChild(row('BEZEL CURVATURE', d.inp, d.val));

    pane.appendChild(el('div.sec-h', { text: 'SOUND' }));
    var e = slider('master', 0, 1, 0.05, function (v) { return Math.round(v * 100) + '%'; });
    pane.appendChild(row('MASTER', e.inp, e.val));
    var f = slider('sfx', 0, 1, 0.05, function (v) { return Math.round(v * 100) + '%'; });
    pane.appendChild(row('EFFECTS', f.inp, f.val));
    var g = slider('ambient', 0, 1, 0.05, function (v) { return Math.round(v * 100) + '%'; });
    pane.appendChild(row('ROOM TONE', g.inp, g.val));
    var k = slider('keys', 0, 1.4, 0.05, function (v) { return Math.round(v * 71) + '%'; });
    pane.appendChild(row('KEYBOARD & MOUSE', k.inp, k.val));
    var demo = el('button.btn', { text: 'TEST' });
    U.on(demo, 'click', function () {
      var n = 0;
      var iv = setInterval(function () {
        NW.audio.keyDown(n === 4 ? ' ' : n === 7 ? 'Enter' : 'a');
        setTimeout(function () { NW.audio.keyUp('a'); }, 55);
        if (++n > 8) clearInterval(iv);
      }, 115);
    });
    pane.appendChild(row('', demo));

    pane.appendChild(el('div.sec-h', { text: 'TEXT' }));
    var w = slider('wireSpeed', 0.2, 3, 0.05, function (v) { return v >= 3 ? 'INSTANT' : v.toFixed(2) + '×'; });
    pane.appendChild(row('MESSAGE TYPING', w.inp, w.val));
    pane.appendChild(el('div', { class: 'pad dim', style: { fontSize: '10px', paddingTop: '0', lineHeight: '1.6' },
      html: 'How fast messages arrive on the WIRE. Lower is slower and more deliberate.<br>' +
            'A click anywhere in the message log lands the rest of a message at once.' }));
    var h = slider('textSpeed', 0.25, 4, 0.25, function (v) { return v >= 4 ? 'INSTANT' : v + '×'; });
    pane.appendChild(row('TELETYPE & PRINTER', h.inp, h.val));
    var chk = el('input', { type: 'checkbox' });
    chk.checked = NW.state.settings().autoOpen;
    U.on(chk, 'change', function () { NW.state.settings().autoOpen = chk.checked; NW.state.saveSettings(); });
    pane.appendChild(row('OPEN WIRE ON NEW TRAFFIC', chk));

    pane.appendChild(el('div.sec-h', { text: 'SHIFT RECORD' }));
    var status = el('div', { class: 'pad dim', style: { fontSize: '11px', lineHeight: '1.7' } });
    function refreshStatus() {
      var s = NW.state.s;
      status.innerHTML =
        'CHAPTER ' + s.chapter + ' · ' + U.fmtTime(s.clock) + ' · ' + U.fmtDate(s.date) + '<br>' +
        'EXHIBITS ' + Object.keys(s.evidence).length + ' · RECORDS ' + Object.keys(s.records).length +
        ' · DOCUMENTS ' + Object.keys(s.docs).length + '<br>' +
        'REPORTS CORRECT ' + s.stats.correct + ' · REJECTED ' + s.stats.wrong + ' · ASSISTS ' + s.stats.assists + '<br>' +
        (NW.state.storageOK() ? '' : '<span style="color:var(--red)">LOCAL STORAGE UNAVAILABLE — USE THE SHIFT CODE BELOW</span>');
    }
    refreshStatus();
    pane.appendChild(status);

    var btns = el('div', { class: 'pad', style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } });
    var save = el('button.btn.good', { text: 'SAVE SHIFT' });
    U.on(save, 'click', function () {
      if (NW.state.save()) NW.notify.push({ head: 'SAVED', body: 'Shift written to local store.', kind: 'good' });
      else NW.notify.push({ head: 'SAVE FAILED', body: 'Use the shift code instead.', kind: 'bad' });
      refreshStatus();
    });
    var load = el('button.btn', { text: 'RESTORE SHIFT' });
    U.on(load, 'click', function () {
      NW.notify.ask('RESTORE THE LAST SAVED SHIFT',
        ['Anything done since the last save will be lost.'], 'RESTORE').then(function (ok) {
        if (!ok) return;
        if (NW.state.load()) location.reload();
        else NW.notify.push({ head: 'NO SAVE', body: 'Nothing stored.', kind: 'bad' });
      });
    });
    var reset = el('button.btn.danger', { text: 'WIPE & RESTART' });
    U.on(reset, 'click', function () {
      NW.notify.ask('WIPE THE TERMINAL',
        ['The whole shift goes — evidence, records, the casebook, everything.',
         'The night starts again at 22:41.'], 'WIPE IT', true).then(function (ok) {
        if (!ok) return;
        NW.state.wipe(); location.reload();
      });
    });
    btns.appendChild(save); btns.appendChild(load); btns.appendChild(reset);
    pane.appendChild(btns);

    pane.appendChild(el('div.sec-h', { text: 'SHIFT CODE (PORTABLE SAVE)' }));
    var ta = el('textarea.input', { style: { width: 'calc(100% - 24px)', margin: '10px 12px', height: '90px', fontSize: '10px', resize: 'vertical' } });
    pane.appendChild(ta);
    var codeBtns = el('div', { class: 'pad', style: { display: 'flex', gap: '8px' } });
    var exp = el('button.btn', { text: 'EXPORT TO BOX' });
    U.on(exp, 'click', function () { ta.value = NW.state.exportCode(); ta.select(); NW.notify.push({ head: 'EXPORTED', body: 'Copy this text somewhere safe.', kind: 'info' }); });
    var imp = el('button.btn', { text: 'IMPORT FROM BOX' });
    U.on(imp, 'click', function () {
      if (!ta.value.trim()) return;
      if (NW.state.importCode(ta.value.trim())) { NW.state.save(); location.reload(); }
      else NW.notify.push({ head: 'BAD CODE', body: 'That is not a shift code.', kind: 'bad' });
    });
    codeBtns.appendChild(exp); codeBtns.appendChild(imp);
    pane.appendChild(codeBtns);

    pane.appendChild(el('div.sec-h', { text: 'ABOUT' }));
    pane.appendChild(el('div', { class: 'pad dim', style: { fontSize: '11px', lineHeight: '1.8' }, html:
      'NIGHTWIRE — a night on the analysis desk.<br>' +
      'Vandermeer County is fictional. So is everybody in it.<br><br>' +
      'Every image, every fingerprint, every face and every sound in this<br>' +
      'program is generated at run time from a text seed. There are no<br>' +
      'asset files. Break the network cable; it will not notice.' }));
  }

  NW.apps.define({
    id: 'settings', name: 'CONFIG', short: 'CONFIG', icon: 'settings', always: true,
    hint: 'display, sound, saves',
    win: { w: 620, h: 520, min: [460, 340] },
    build: build
  });
})(window.NW);

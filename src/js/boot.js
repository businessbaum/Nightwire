/* NIGHTWIRE — boot.js — power-on self test and sign-on */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;

  var POST = [
    { t: 'CONSOLIDATED ELECTRIC VT-880 · AMBER · REV C', c: 'hl' },
    { t: 'BIOS 4.11 (C) 1993 · 640K BASE · 15360K EXTENDED' },
    { t: '' },
    { t: 'MEMORY TEST : 16384K OK', c: 'ok' },
    { t: 'FIXED DISK 0 : TERM04  204MB', c: 'ok' },
    { t: 'SERIAL 1 : 2400 BAUD  MODEM PRESENT', c: 'ok' },
    { t: 'SERIAL 2 : LINE PRINTER  READY', c: 'ok' },
    { t: '' },
    { t: 'STARTING NCIB TERMINAL SHELL 3.11' },
    { t: 'LOADHIGH C:\\NCIB\\WIREDRV.SYS ......... OK', c: 'ok' },
    { t: 'MOUNT REGISTRY /RO .................... OK', c: 'ok' },
    { t: 'MOUNT ARCHIVE  /RO .................... OK', c: 'ok' },
    { t: 'MOUNT CASE     /RW .................... OK', c: 'ok' },
    { t: 'MOUNT USR      /RW /HIDDEN ............ OK', c: 'ok' },
    { t: '' },
    { t: 'WARNING: PREVIOUS SESSION NOT CLOSED CLEANLY', c: 'warn' },
    { t: '  OWNER  : VOSS,M   (3312)', c: 'warn' },
    { t: '  OPENED : 03/16/98 03:58', c: 'warn' },
    { t: '  CLOSED : —', c: 'warn' },
    { t: '' },
    { t: 'DIALLING RELAY NCIB-VC-04 …' }
  ];

  function start() {
    var layer = U.$('#boot-layer');
    U.clear(layer);
    layer.classList.remove('hidden');

    var press = el('div', { style: { position: 'absolute', inset: '0', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', cursor: 'pointer' } }, [
      el('div', { style: { fontSize: '11px', letterSpacing: '.4em', color: 'var(--phos-dim)' }, text: 'CONSOLIDATED ELECTRIC VT-880' }),
      el('div', { style: { fontSize: '30px', letterSpacing: '.5em', color: 'var(--phos-hi)', textShadow: '0 0 24px rgba(255,182,61,.45)' }, text: 'NIGHTWIRE' }),
      el('div', { class: 'blink', style: { fontSize: '12px', letterSpacing: '.3em', marginTop: '30px' }, text: '— PRESS ANY KEY —' }),
      el('div', { style: { fontSize: '9px', letterSpacing: '.2em', color: 'var(--phos-ghost)', marginTop: '40px', textAlign: 'center', lineHeight: '2' },
        html: 'HEADPHONES RECOMMENDED · 1024×620 MINIMUM<br>VANDERMEER COUNTY IS FICTIONAL AND SO IS EVERYBODY IN IT' })
    ]);
    layer.appendChild(press);

    function go() {
      document.removeEventListener('keydown', go);
      press.removeEventListener('click', go);
      NW.audio.resume();
      NW.audio.startAmbient();
      NW.crt.powerOn();
      U.clear(layer);
      runPost(layer);
    }
    document.addEventListener('keydown', go);
    press.addEventListener('click', go);
  }

  function runPost(layer) {
    NW.audio.play('thunk');
    NW.typer.lines(layer, POST, { cps: 900, delay: 70, sound: true }).then(function () {
      var dur = NW.audio.modem() || 4;
      var dots = el('div.bline');
      layer.appendChild(dots);
      var n = 0;
      var iv = setInterval(function () {
        n++;
        dots.textContent = '  ' + new Array(n % 30 + 1).join('▪');
      }, 90);
      setTimeout(function () {
        clearInterval(iv);
        dots.innerHTML = '  CONNECT 2400/ARQ  <span class="ok">RELAY OPEN</span>';
        setTimeout(function () { signOn(layer); }, 500);
      }, dur * 900);
    });
  }

  function signOn(layer) {
    U.clear(layer);
    var name = el('div.field', { text: '' });
    var badge = el('div.field', { text: '4471' });
    var pass = el('div.field', { text: '' });
    var cur = el('span.blink', { text: '█' });
    name.appendChild(cur);

    var box = el('div.login-box', null, [
      el('h1', { text: 'N C I B  ·  SIGN ON' }),
      el('div.sub', { text: 'REGIONAL ANALYSIS CENTER · PORT ALDEN · TERMINAL 04' }),
      el('div.login-row', null, [el('label', { text: 'SURNAME' }), name]),
      el('div.login-row', null, [el('label', { text: 'BADGE' }), badge]),
      el('div.login-row', null, [el('label', { text: 'PASSPHRASE' }), pass]),
      el('div.login-note', { html:
        'Enter your surname. It will appear on every query you make tonight,<br>' +
        'on the log, and — if this goes the way these things go — in a transcript.<br>' +
        '<span style="color:var(--phos-ghost)">The passphrase field is not checked. It never was.</span>' }),
      el('div.login-cta', null, [el('span.blink', { text: '▶ TYPE, THEN PRESS ENTER' })])
    ]);
    layer.appendChild(box);

    var field = 0, vals = ['', '4471', ''];
    function render() {
      [name, badge, pass].forEach(function (n, i) {
        n.textContent = i === 2 ? new Array(vals[2].length + 1).join('•') : vals[i];
        if (i === field) n.appendChild(cur);
      });
    }
    render();

    function onKey(e) {
      if (e.key === 'Enter') {
        if (field < 2) { field++; render(); NW.audio.play('beep'); return; }
        if (!vals[0].trim()) { vals[0] = 'HARROW'; }
        document.removeEventListener('keydown', onKey);
        finish(layer, vals[0].trim().toUpperCase(), (vals[1] || '4471').trim());
        return;
      }
      if (e.key === 'Tab') { e.preventDefault(); field = (field + 1) % 3; render(); return; }
      if (e.key === 'Backspace') { vals[field] = vals[field].slice(0, -1); render(); NW.audio.play('key'); return; }
      if (e.key.length === 1 && vals[field].length < 18) {
        vals[field] += e.key.toUpperCase();
        render(); NW.audio.play('key');
      }
    }
    document.addEventListener('keydown', onKey);
  }

  function finish(layer, surname, badge) {
    var s = NW.state.s;
    s.operator.name = surname + ', ' + (surname[0] || 'X') + '.';
    s.operator.surname = surname;
    s.operator.badge = badge;
    s.stats.startedAt = Date.now();

    U.clear(layer);
    NW.typer.lines(layer, [
      { t: '' },
      { t: 'AUTHENTICATING …' },
      { t: '  BADGE ' + badge + ' — ' + surname, c: 'ok' },
      { t: '  CLEARANCE 1 — ANALYSIS OPERATOR', c: 'ok' },
      { t: '  ROSTER: NIGHT WATCH, SUB-LEVEL 2', c: 'ok' },
      { t: '' },
      { t: '  NOTE: TERMINAL 04 WAS SCHEDULED FOR REIMAGE 03/20/98.', c: 'warn' },
      { t: '  WORK ORDER 98-2214 CLOSED "COMPLETE" BY REQUESTOR.', c: 'warn' },
      { t: '' },
      { t: 'LOADING DESKTOP …' }
    ], { cps: 700, delay: 140 }).then(function () {
      return U.wait(700);
    }).then(function () {
      NW.audio.play('disk');
      layer.classList.add('hidden');
      U.$('#desktop-layer').classList.remove('hidden');
      NW.apps.renderRail();
      NW.clock.start();
      U.$('#tb-user').textContent = surname + ' · ' + badge;
      U.$('#tb-net').classList.add('act');
      NW.notify.ticker('Night watch. Sub-level two. Terminal 04.');
      NW.apps.open('wire');
      setTimeout(function () { NW.director.start('ch0'); }, 900);
    });
  }

  function resume() {
    var s = NW.state.s;
    U.$('#boot-layer').classList.add('hidden');
    U.$('#desktop-layer').classList.remove('hidden');
    NW.audio.resume(); NW.audio.startAmbient();
    NW.apps.renderRail();
    NW.clock.start();
    U.$('#tb-user').textContent = (s.operator.surname || 'HARROW') + ' · ' + s.operator.badge;
    U.$('#tb-net').classList.add('act');
    NW.notify.objective(s.flags.__objective || 'Resumed.');
    NW.apps.open('wire');
    NW.notify.push({ head: 'SHIFT RESTORED', body: 'Chapter ' + s.chapter + ' · ' + U.fmtTime(s.clock), kind: 'info' });
    setTimeout(function () {
      // pick the night back up exactly where it was interrupted
      if (!NW.director.resume()) NW.director.evalTriggers();
    }, 1200);
  }

  NW.boot = { start: start, resume: resume };
})(window.NW);

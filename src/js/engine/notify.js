/* NIGHTWIRE — engine/notify.js — toasts, ticker, overlays, objective line */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var MAX_TOASTS = 5;

  function push(o) {
    var host = U.$('#toasts');
    if (!host) return;
    var t = el('div.toast', { class: o.kind || '' }, [
      el('div.t-h', { text: o.head || 'SYSTEM' }),
      el('div.t-b', { text: o.body || '' })
    ]);
    host.appendChild(t);
    while (host.children.length > MAX_TOASTS) host.removeChild(host.firstChild);
    NW.audio.play(o.kind === 'bad' ? 'error' : o.kind === 'good' ? 'ok' : 'beep');
    setTimeout(function () {
      t.classList.add('out');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 320);
    }, o.ms || 4200);
  }

  var tickerQueue = [];
  var tickerBusy = false;
  function ticker(text) {
    tickerQueue.push(text);
    if (!tickerBusy) nextTicker();
  }
  function nextTicker() {
    var node = U.$('#sb-ticker');
    if (!node) return;
    var t = tickerQueue.shift();
    if (!t) { tickerBusy = false; node.textContent = ''; return; }
    tickerBusy = true;
    node.textContent = '';
    NW.typer.type(node, '» ' + t, { cps: 90, cursor: false, sound: false }).then(function () {
      setTimeout(nextTicker, 2600);
    });
  }

  function objective(text, done) {
    var n = U.$('#sb-objective');
    if (!n) return;
    n.textContent = text || '—';
    n.classList.toggle('done', !!done);
  }

  function caseLabel(text, urgent) {
    var n = U.$('#tb-case');
    if (!n) return;
    n.textContent = text || '';
    n.classList.toggle('urgent', !!urgent);
  }

  /* ── modal overlays: one on screen, the rest wait their turn ── */
  var queue = [];
  var current = null;

  /** overlay({title, sub, body:[html], html, cls, buttons:[{label, value, cls}]}) → Promise(value)
      Enter picks the first button (unless it is a danger button), Escape the last. */
  function overlay(spec) {
    return new Promise(function (resolve) {
      queue.push({ spec: spec, resolve: resolve });
      if (!current) showNext();
    });
  }

  function showNext() {
    var item = queue.shift();
    if (!item) { current = null; return; }
    var spec = item.spec;
    var layer = U.$('#overlay-layer');
    var me = {};
    current = me;
    U.clear(layer);
    layer.classList.remove('hidden');

    var card = el('div.ov-card' + (spec.cls ? '.' + spec.cls : ''));
    if (spec.html) card.innerHTML = spec.html;
    else {
      if (spec.title) card.appendChild(el('h2', { text: spec.title }));
      if (spec.sub) card.appendChild(el('div.ov-sub', { text: spec.sub }));
      (spec.body || []).forEach(function (p) { card.appendChild(el('p', { html: p })); });
    }

    function finish(value) {
      if (current !== me) return;
      document.removeEventListener('keydown', onKey, true);
      NW.audio.play('click');
      layer.classList.add('hidden');
      U.clear(layer);
      current = null;
      item.resolve(value);
      showNext();
    }

    var buttons = spec.buttons || [{ label: 'CONTINUE', value: true }];
    var acts = el('div.ov-actions');
    buttons.forEach(function (b) {
      var btn = el('button.ov-btn', { text: b.label, class: b.cls || '' });
      U.on(btn, 'click', function () { finish(b.value); });
      acts.appendChild(btn);
    });
    card.appendChild(acts);
    layer.appendChild(card);

    // the overlay is modal, so it takes the keyboard while it is up
    function onKey(e) {
      var pick;
      if (e.key === 'Enter' || e.key === ' ') pick = buttons[0].cls === 'danger' ? null : buttons[0];
      else if (e.key === 'Escape') pick = buttons[buttons.length - 1];
      else return;
      e.preventDefault(); e.stopPropagation();
      if (pick && !e.repeat) finish(pick.value);
    }
    document.addEventListener('keydown', onKey, true);
  }

  /** In-terminal confirmation (never the browser's own dialog). */
  function ask(title, body, okLabel, danger) {
    NW.audio.play('beep');
    return overlay({
      title: title, sub: 'CONFIRM',
      body: [].concat(body || []),
      buttons: [
        { label: okLabel || 'CONFIRM', value: true, cls: danger ? 'danger' : '' },
        { label: 'CANCEL', value: false }
      ]
    });
  }

  /** Full-screen chapter title card. */
  function chapterCard(num, title, desc) {
    NW.audio.play('thunk');
    return overlay({
      cls: 'chapter-card',
      html: '<div class="cc-num">' + U.esc(num) + '</div>' +
            '<div class="cc-title">' + U.esc(title) + '</div>' +
            '<div class="cc-line"></div>' +
            '<div class="cc-desc">' + desc + '</div>',
      buttons: [{ label: 'BEGIN', value: true }]
    });
  }

  function flashScreen(kind) {
    var s = U.$('#screen');
    if (!s) return;
    if (kind === 'shake') { s.classList.add('shake'); setTimeout(function () { s.classList.remove('shake'); }, 700); }
    if (kind === 'desync') {
      var d = U.$('#desktop-layer');
      d.classList.add('desync');
      NW.audio.play('glitch');
      setTimeout(function () { d.classList.remove('desync'); }, 460);
    }
  }

  function overlayOpen() { return !!current; }

  NW.notify = { push: push, ticker: ticker, objective: objective, caseLabel: caseLabel,
                overlay: overlay, ask: ask, chapterCard: chapterCard, flash: flashScreen,
                overlayOpen: overlayOpen };
})(window.NW);

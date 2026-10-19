/* NIGHTWIRE — apps/timeline.js — reconstruct the order of a night */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  function build(body) {
    var v = { tl: null, placed: {}, dragging: null, checked: false };

    var tools = el('div.toolbar');
    var wrap = el('div.tl-wrap');
    var pool = el('div.tl-pool');
    var track = el('div.tl-track');
    var footer = el('div', { class: 'pad', style: { borderTop: '1px solid var(--phos-ghost)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } });
    wrap.appendChild(pool); wrap.appendChild(track);
    body.appendChild(el('div.app', null, [tools, wrap, footer]));

    function available() {
      return NW.evidence.timelines.filter(function (t) { return S().chapter >= t.chapter; });
    }

    function renderTools() {
      U.clear(tools);
      tools.appendChild(el('span.tb-title', { text: 'RECONSTRUCTION' }));
      var list = available();
      if (!list.length) tools.appendChild(el('span', { class: 'dim', text: 'NOTHING TO RECONSTRUCT YET' }));
      list.forEach(function (t) {
        var b = el('button.btn', { text: t.title, class: v.tl && v.tl.id === t.id ? 'on' : '' });
        U.on(b, 'click', function () { load(t); });
        tools.appendChild(b);
      });
    }

    function load(t) {
      v.tl = t;
      v.placed = S().timelineSolved[t.id] ? autoFill(t) : {};
      v.checked = !!S().timelineSolved[t.id];
      NW.audio.play('open');
      renderTools(); render();
    }
    function autoFill(t) {
      var o = {};
      t.slots.forEach(function (s, i) { o[i] = s.answer; });
      return o;
    }

    function render() {
      U.clear(pool); U.clear(track); U.clear(footer);
      if (!v.tl) { track.appendChild(el('div.empty', { text: 'SELECT A RECONSTRUCTION' })); return; }

      pool.appendChild(el('div.sec-h', { text: 'EVENTS ON FILE' }));
      var used = Object.keys(v.placed).map(function (k) { return v.placed[k]; });
      v.tl.cards.forEach(function (c) {
        if (used.indexOf(c.id) !== -1) return;
        var card = el('div.tl-card', { draggable: true, dataset: { id: c.id } }, [
          el('div', { text: c.t }),
          el('div.tc-src', { text: c.s })
        ]);
        card.addEventListener('dragstart', function (e) {
          v.dragging = c.id; card.classList.add('dragging');
          e.dataTransfer.setData('text/plain', c.id);
        });
        card.addEventListener('dragend', function () { card.classList.remove('dragging'); v.dragging = null; });
        U.on(card, 'click', function () {
          // click-to-place into first empty slot
          for (var i = 0; i < v.tl.slots.length; i++) {
            if (!v.placed[i]) { v.placed[i] = c.id; NW.audio.play('click'); v.checked = false; render(); return; }
          }
        });
        pool.appendChild(card);
      });
      if (pool.querySelectorAll('.tl-card').length === 0) {
        pool.appendChild(el('div.empty', { text: 'ALL EVENTS PLACED' }));
      }

      track.appendChild(el('div', { class: 'dim', style: { fontSize: '11px', marginBottom: '10px', lineHeight: '1.6' }, text: v.tl.intro }));
      var axis = el('div.tl-axis');
      v.tl.slots.forEach(function (s, i) {
        var placedId = v.placed[i];
        var card = placedId ? v.tl.cards.filter(function (c) { return c.id === placedId; })[0] : null;
        var slot = el('div.tl-slot', { class: (placedId ? 'filled ' : '') + (v.checked && placedId ? (placedId === s.answer ? 'correct' : 'wrong') : '') }, [
          el('div.tls-time', { text: s.time }),
          el('div', { text: card ? card.t : '— drop an event here —' }),
          card ? el('div.tc-src', { text: card.s }) : null
        ]);
        slot.addEventListener('dragover', function (e) { e.preventDefault(); slot.classList.add('over'); });
        slot.addEventListener('dragleave', function () { slot.classList.remove('over'); });
        slot.addEventListener('drop', function (e) {
          e.preventDefault(); slot.classList.remove('over');
          var id = e.dataTransfer.getData('text/plain') || v.dragging;
          if (!id) return;
          Object.keys(v.placed).forEach(function (k) { if (v.placed[k] === id) delete v.placed[k]; });
          v.placed[i] = id; v.checked = false;
          NW.audio.play('relay'); render();
        });
        U.on(slot, 'click', function () {
          if (v.placed[i] && !S().timelineSolved[v.tl.id]) { delete v.placed[i]; v.checked = false; NW.audio.play('close'); render(); }
        });
        axis.appendChild(slot);
      });
      track.appendChild(axis);

      var solved = !!S().timelineSolved[v.tl.id];
      var check = el('button.btn.good', { text: solved ? '✓ RECONSTRUCTED' : '▣ CHECK RECONSTRUCTION' });
      check.disabled = solved || Object.keys(v.placed).length < v.tl.slots.length;
      U.on(check, 'click', doCheck);
      footer.appendChild(check);
      var clr = el('button.btn', { text: 'CLEAR' });
      clr.disabled = solved;
      U.on(clr, 'click', function () { v.placed = {}; v.checked = false; render(); });
      footer.appendChild(clr);
      footer.appendChild(el('span', { class: 'dim', style: { fontSize: '10px' },
        text: Object.keys(v.placed).length + ' / ' + v.tl.slots.length + ' placed · two of the cards are false and belong nowhere' }));
    }

    function doCheck() {
      v.checked = true;
      var wrong = 0;
      v.tl.slots.forEach(function (s, i) { if (v.placed[i] !== s.answer) wrong++; });
      render();
      if (wrong) {
        NW.audio.play('bad');
        NW.notify.push({ head: 'INCONSISTENT', body: wrong + ' placement(s) contradict the record.', kind: 'bad' });
        return;
      }
      NW.audio.play('unlock');
      S().timelineSolved[v.tl.id] = true;
      var os = v.tl.onSolve || {};
      if (os.flag) NW.state.flag(os.flag, true);
      if (os.evidence) [].concat(os.evidence).forEach(function (e) { NW.state.addEvidence(e); });
      if (os.fact) NW.state.addFact(os.fact.c, os.fact.t);
      NW.notify.overlay({
        title: 'RECONSTRUCTED', sub: v.tl.title,
        body: [U.esc(os.fact ? os.fact.t : 'The sequence holds.')],
        buttons: [{ label: 'LOG IT', value: 1 }]
      });
      render();
    }

    renderTools();
    var a = available();
    if (a.length) load(a[a.length - 1]);
    else render();
  }

  NW.apps.define({
    id: 'timeline', name: 'TIMELINE', short: 'TIME', icon: 'timeline',
    hint: 'reconstruct the sequence of events',
    win: { w: 820, h: 580, min: [640, 440] },
    build: build
  });
})(window.NW);

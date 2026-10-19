/* NIGHTWIRE — engine/request.js
   Formal information requests from the field. The operator answers them by
   TRANSMITTING records, documents, places or vehicles out of the other
   programs, or by typing a value directly. */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;

  var active = null;     // { spec, filled:{slotId:{kind,id,label}} }
  var hintNode = null;

  /**
   * open(spec)
   *  id, title, prompt
   *  slots: [{id, label, accept:['person'|'doc'|'place'|'vehicle'|'evidence'],
   *           type:'slot'|'text'|'choice', options:[{v,l}], placeholder}]
   *  answer: { slotId: 'value' | ['a','b'] }        (case-insensitive for text)
   *  onCorrect(filled), onWrong(filled, wrongSlots), attempts
   */
  function open(spec) {
    active = { spec: spec, filled: {}, tries: 0 };
    NW.bus.emit('request:open', spec);
    showHint();
    return active;
  }

  function close() {
    active = null;
    hideHint();
    NW.bus.emit('request:close');
  }

  function current() { return active; }

  /** Does the open request want an item of this kind? */
  function wants(kind) {
    if (!active) return false;
    return active.spec.slots.some(function (s) {
      return (!s.type || s.type === 'slot') && s.accept.indexOf(kind) !== -1;
    });
  }

  /** Transmit an item into the first slot that accepts it (or a named slot). */
  function transmit(kind, id, label, slotId) {
    if (!active) {
      NW.notify.push({ head: 'NO OPEN REQUEST', body: 'Nothing is waiting on this terminal.', kind: 'bad' });
      return false;
    }
    var slots = active.spec.slots.filter(function (s) {
      return (!s.type || s.type === 'slot') && s.accept.indexOf(kind) !== -1 && (!slotId || s.id === slotId);
    });
    // prefer an empty one
    var target = slots.filter(function (s) { return !active.filled[s.id]; })[0] || slots[0];
    if (!target) {
      NW.notify.push({ head: 'REJECTED', body: 'This request does not accept that item type.', kind: 'bad' });
      return false;
    }
    active.filled[target.id] = { kind: kind, id: id, label: label };
    NW.audio.play('relay');
    NW.notify.push({ head: 'ATTACHED', body: target.label + ' ← ' + label, kind: 'info', ms: 2200 });
    // it went out over the wire, so it belongs in the log like anything else
    if (NW.wire) NW.wire.push({ sys: '▸ attached to ' + target.label + ' — ' + label, delay: 0 });
    NW.bus.emit('request:change');
    return true;
  }

  function setValue(slotId, value, label) {
    if (!active) return;
    if (value === null || value === '') delete active.filled[slotId];
    else active.filled[slotId] = { kind: 'value', id: value, label: label || value };
    NW.bus.emit('request:change');
  }

  function clearSlot(slotId) {
    if (!active) return;
    delete active.filled[slotId];
    NW.audio.play('click');
    NW.bus.emit('request:change');
  }

  function complete() {
    if (!active) return false;
    return active.spec.slots.every(function (s) { return s.optional || active.filled[s.id]; });
  }

  function norm(v) { return String(v === undefined || v === null ? '' : v).trim().toLowerCase().replace(/[\s.\-_/]+/g, ''); }

  function submit() {
    if (!active) return;
    var spec = active.spec;
    if (!complete()) {
      NW.notify.push({ head: 'INCOMPLETE', body: 'All required fields must be filled.', kind: 'bad' });
      return;
    }
    active.tries++;

    /* The report is a thing the operator sends, so it goes on the wire in
       their own hand, with whatever was attached to it. */
    var atts = [];
    var lines = spec.slots.map(function (s) {
      var g = active.filled[s.id];
      if (g && (g.kind === 'person' || g.kind === 'doc' || g.kind === 'vehicle')) {
        atts.push({ kind: g.kind, id: g.id, label: g.label });
      }
      return '   ' + s.label + ':  ' + (g ? g.label : '—');
    }).join('\n');
    if (NW.wire) {
      NW.wire.push({
        me: '▶ REPORT TRANSMITTED — ' + spec.title + '\n' + lines,
        atts: atts, delay: 0
      });
    }

    var wrong = [];
    Object.keys(spec.answer || {}).forEach(function (sid) {
      var want = spec.answer[sid];
      var got = active.filled[sid];
      var gv = got ? got.id : '';
      var okList = Array.isArray(want) ? want : [want];
      var ok = okList.some(function (w) { return norm(w) === norm(gv); });
      if (!ok) wrong.push(sid);
    });

    NW.audio.play('scan');
    var filled = active.filled;
    if (!wrong.length) {
      NW.state.s.stats.correct++;
      var onOk = spec.onCorrect;
      close();
      NW.audio.play('good');
      if (onOk) onOk(filled);
    } else {
      NW.state.s.stats.wrong++;
      NW.audio.play('bad');
      NW.notify.flash && NW.notify.flash('shake');
      NW.notify.push({ head: 'TRANSMISSION REJECTED', body: wrong.length + ' field(s) inconsistent with case data.', kind: 'bad' });
      if (spec.onWrong) spec.onWrong(filled, wrong, active.tries);
      NW.bus.emit('request:wrong', { wrong: wrong, tries: active.tries });
      // clear the wrong ones so the player can retry
      wrong.forEach(function (sid) { delete active.filled[sid]; });
      NW.bus.emit('request:change');
    }
  }

  /* ── the floating "transmit target" hint ── */
  function showHint() {
    hideHint();
    if (!active) return;
    hintNode = el('div.transmit-hint', { text: '▲ OPEN REQUEST — ' + active.spec.title + ' — USE ▸TRANSMIT ON A RECORD' });
    U.$('#screen').appendChild(hintNode);
    setTimeout(hideHint, 6000);
  }
  function hideHint() {
    if (hintNode && hintNode.parentNode) hintNode.parentNode.removeChild(hintNode);
    hintNode = null;
  }

  /** Renders the request form into a container (used by WIRE). */
  function render(host) {
    U.clear(host);
    if (!active) return;
    var spec = active.spec;
    var panel = el('div.req-panel');
    panel.appendChild(el('div.rq-h', { text: 'INFORMATION REQUEST · ' + (spec.ref || spec.id) }));
    panel.appendChild(el('div.rq-t', { text: spec.title }));
    if (spec.prompt) panel.appendChild(el('div', { class: 'dim', style: { fontSize: '11px', marginBottom: '8px' }, text: spec.prompt }));

    spec.slots.forEach(function (s, si) {
      var got = active.filled[s.id];

      /* ── a written answer ── */
      if (s.type === 'text') {
        var row = el('div.req-slot' + (got ? '.filled' : ''));
        row.appendChild(el('span.rs-l', { text: s.label }));
        var inp = el('input.input', { style: { flex: '1' }, placeholder: s.placeholder || '', value: got ? got.id : '' });
        U.on(inp, 'input', function () { setValueQuiet(s.id, inp.value); });
        U.on(inp, 'keydown', function (e) { if (e.key === 'Enter') submit(); });
        row.appendChild(inp);
        panel.appendChild(row);
        return;
      }

      /* ── pick one of several statements: written as replies, not as a form ── */
      if (s.type === 'choice') {
        var opts = (typeof s.options === 'function' ? s.options() : s.options) || [];
        var block = el('div.req-choice');
        block.appendChild(el('div.rc-l', { text: (spec.slots.length > 1 ? (si + 1) + '. ' : '') + s.label }));
        if (opts.length > 7) {
          // too many to read as buttons — a full-width list instead
          var sel = el('select.input.rc-select');
          sel.appendChild(el('option', { value: '', text: '— SELECT —' }));
          opts.forEach(function (o) {
            var op = el('option', { value: o.v, text: o.l });
            if (got && got.id === o.v) op.selected = true;
            sel.appendChild(op);
          });
          U.on(sel, 'change', function () {
            setValue(s.id, sel.value, sel.options[sel.selectedIndex].text);
          });
          block.appendChild(sel);
        } else {
          opts.forEach(function (o, i) {
            var on = got && got.id === o.v;
            var b = el('button.reply-opt' + (on ? '.on' : ''), null, [
              el('span.ro-n', { text: on ? '▣' : '▢' }),
              el('span', { text: o.l })
            ]);
            U.on(b, 'click', function () {
              if (on) setValue(s.id, null);
              else setValue(s.id, o.v, o.l);
            });
            block.appendChild(b);
          });
        }
        panel.appendChild(block);
        return;
      }

      /* ── an item transmitted out of another program ── */
      var row2 = el('div.req-slot' + (got ? '.filled' : ''));
      row2.appendChild(el('span.rs-l', { text: (spec.slots.length > 1 ? (si + 1) + '. ' : '') + s.label }));
      row2.appendChild(el('span', {
        class: 'rs-v' + (got ? '' : ' empty-v'),
        text: got ? got.label : '‹ open the ' + accepterName(s.accept) + ' and press ▸ TRANSMIT ›'
      }));
      if (got) {
        var x = el('span.rs-x', { text: '×', title: 'clear' });
        U.on(x, 'click', function () { clearSlot(s.id); });
        row2.appendChild(x);
      }
      panel.appendChild(row2);
    });

    var acts = el('div.req-actions');
    var send = el('button.btn.good', { text: '▶ TRANSMIT REPORT' });
    U.on(send, 'click', function () { submit(); });
    acts.appendChild(send);
    if (spec.cancellable) {
      var cn = el('button.btn', { text: 'DEFER' });
      U.on(cn, 'click', function () { close(); });
      acts.appendChild(cn);
    }
    panel.appendChild(acts);
    host.appendChild(panel);
  }

  function accepterName(accept) {
    var map = { person: 'REGISTRY', doc: 'ARCHIVE', vehicle: 'VEHICLE INDEX', place: 'MAP', evidence: 'CASEBOOK' };
    return accept.map(function (a) { return map[a] || a.toUpperCase(); }).join(' or ');
  }

  function setValueQuiet(slotId, value) {
    if (!active) return;
    if (value === '') delete active.filled[slotId];
    else active.filled[slotId] = { kind: 'value', id: value, label: value };
  }

  NW.request = {
    open: open, close: close, current: current, wants: wants, transmit: transmit,
    setValue: setValue, clearSlot: clearSlot, submit: submit, render: render, complete: complete
  };
})(window.NW);

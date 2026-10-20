/* NIGHTWIRE — apps/wire.js — the message bus; most of the story happens here */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var CONTACTS = {
    solt:      { name: 'SOLT, G.',      role: 'DUTY OFFICER · NIGHT WATCH',        always: true },
    reyes:     { name: 'REYES, A.',     role: 'SPECIAL AGENT · UNIT 11' },
    del:       { name: 'NKEMDIRIM, D.', role: 'SPECIAL AGENT · UNIT 11' },
    pryce:     { name: 'PRYCE, O.',     role: 'FORENSIC TECHNICIAN III · LAB' },
    finn:      { name: 'FINN, W.',      role: 'DEPUTY CHIEF · 4TH FLOOR', danger: true },
    dispatch:  { name: 'VC DISPATCH',   role: 'COUNTY RELAY' },
    nightwire: { name: '‹ NIGHTWIRE ›', role: 'ORIGIN UNRESOLVED · RELAY 3312', ghost: true }
  };

  var currentThread = 'solt';
  var ui = null;              // { list, log, head, reply, typing }
  var pendingAsk = null;      // { spec, resolve, thread }
  var requestThread = null;   // channel the open request belongs to
  var activeType = null;      // id of the message being typed out
  var visibleOpts = [];       // reply options on screen, in key order

  /* Message ids must stay unique across a restored shift, because the typing
     animation finds its bubble by id. */
  function nextId() {
    var s = S();
    if (!s.msgSeq) {
      var max = 0;
      Object.keys(s.threads).forEach(function (k) {
        (s.threads[k].msgs || []).forEach(function (m) { if (m.id > max) max = m.id; });
      });
      s.msgSeq = max;
    }
    s.msgSeq++;
    return s.msgSeq;
  }

  function thread(id) {
    var t = S().threads[id];
    if (!t) t = S().threads[id] = { msgs: [], unread: 0 };
    return t;
  }

  function contactsVisible() {
    return Object.keys(CONTACTS).filter(function (k) {
      return CONTACTS[k].always || S().contacts[k];
    });
  }

  function totalUnread() {
    return contactsVisible().reduce(function (n, k) { return n + (thread(k).unread || 0); }, 0);
  }

  /* ══════════ API used by the director ══════════ */

  /* After a restore the director re-runs the step it was parked on. If that
     message already landed, don't send it twice (checked once, on the next push). */
  var resumeDedupe = false;
  function armDedupe() { resumeDedupe = true; }

  function push(step) {
    var who = step.msg || step.thread || currentThread;
    var isMe = step.me !== undefined;
    var isSys = step.sys !== undefined;
    var text = isMe ? step.me : isSys ? step.sys : step.text;
    var tid = isMe || isSys ? (step.thread || currentThread) : who;
    var contact = CONTACTS[who];

    if (!isMe && !isSys) {
      // a channel waiting on the operator keeps the screen; others just go unread
      if (awaitingThread() !== currentThread) currentThread = who;
      if (!S().contacts[who] && !(contact && contact.always)) S().contacts[who] = true;
    }

    var m = {
      id: nextId(),
      from: isMe ? 'me' : isSys ? 'sys' : who,
      text: text,
      cls: step.cls || (contact && contact.ghost ? 'ghost' : ''),
      at: U.fmtTime(S().clock),
      att: step.att || null,
      atts: step.atts && step.atts.length ? step.atts : null
    };

    if (resumeDedupe) {
      resumeDedupe = false;
      var prev = thread(tid).msgs[thread(tid).msgs.length - 1];
      if (prev && prev.from === m.from && prev.text === m.text) {
        render();
        return U.wait(0);
      }
    }

    var pre = step.delay === undefined ? (isMe || isSys ? 200 : 500) : step.delay;
    // "…is transmitting" before the words start arriving
    var thinkMs = isMe || isSys ? 0 : Math.min(1100, 320 + String(text).length * 4);

    return U.wait(pre).then(function () {
      if (!isMe && !isSys) showTyping(tid, who);
      return U.wait(thinkMs);
    }).then(function () {
      hideTyping();
      thread(tid).msgs.push(m);
      if (tid !== currentThread || !NW.win.isOpen('wire')) {
        thread(tid).unread = (thread(tid).unread || 0) + 1;
      }
      if (!isMe && !isSys) {
        NW.audio.play(m.cls === 'alert' ? 'alert' : 'msg');
        if (contact && contact.ghost) NW.audio.play('glitch');
      }
      NW.bus.emit('wire:msg', m);
      if (NW.state.settings().autoOpen && !NW.win.isOpen('wire') && !isMe && !isSys) {
        NW.apps.open('wire');
      }
      updateBadge();
      return typeMessage(m, tid);
    }).then(function () {
      return U.wait(step.after === undefined ? 140 : step.after);
    });
  }

  /* ── messages type themselves out ── */
  function typeMessage(m, tid) {
    return new Promise(function (resolve) {
      var st = NW.state.settings();
      var speed = st.wireSpeed === undefined ? 0.7 : st.wireSpeed;
      var text = String(m.text);
      if (speed >= 3 || !text.length) { render(); return resolve(); }

      var cps = (m.from === 'me' ? 85 : m.from === 'sys' ? 120 : 55) * speed;
      var perFrame = cps / 30;
      var i = 0, frame = 0;
      m.typing = true; m._shown = '';
      activeType = m.id;
      render();

      var iv = setInterval(function () {
        // another message started (or the log was clicked): land this one whole
        if (activeType !== m.id) {
          clearInterval(iv);
          m.typing = false; m._shown = null;
          render();
          return resolve();
        }
        frame++;
        i += perFrame;
        var done = i >= text.length;
        m._shown = text.slice(0, Math.floor(i));
        var node = ui && ui.log && ui.log.querySelector('[data-mid="' + m.id + '"] .m-body');
        if (node) { node.textContent = done ? text : m._shown; scroll(); }
        if (!done && frame % 4 === 0 && tid === currentThread) NW.audio.play('type');
        if (done) {
          clearInterval(iv);
          m.typing = false; m._shown = null; activeType = null;
          if (!node) render();
          resolve();
        }
      }, 1000 / 30);
    });
  }

  /** Finish whatever is typing right now (the operator clicked the log). */
  function flushTyping() {
    if (activeType === null) return false;
    activeType = null;
    thread(currentThread).msgs.forEach(function (m) { m.typing = false; m._shown = null; });
    render();
    return true;
  }

  /** ask({prompt, timer, options:[{label, reply, steps, flag, set, choice, value, evidence, when}], timeoutOption}) → Promise */
  function ask(spec) {
    return new Promise(function (resolve) {
      pendingAsk = { spec: spec, resolve: resolve, thread: currentThread };
      if (!NW.win.isOpen('wire')) NW.apps.open('wire');
      // a timed decision counts down whether or not its channel is on screen
      if (spec.timer) startTimer(spec);
      render(); updateBadge();
      NW.audio.play('beep');
    });
  }

  /** Which channel is waiting on the operator, if any. */
  function awaitingThread() {
    if (pendingAsk) return pendingAsk.thread;
    if (NW.request.current()) return requestThread;
    return null;
  }

  function chooseOption(opt) {
    var p = pendingAsk;
    if (!p) return;             // already answered (timer and click can race)
    pendingAsk = null;
    stopTimer();
    NW.audio.play('click');
    var steps = [];
    // the reply goes to whoever asked, not to the channel on screen
    if (opt.reply !== false) steps.push({ me: opt.reply || opt.label, thread: p.thread, delay: 100 });
    if (opt.flag) NW.state.flag(opt.flag, true);
    if (opt.set) Object.keys(opt.set).forEach(function (k) { NW.state.flag(k, opt.set[k]); });
    if (opt.choice) S().choices[opt.choice] = opt.value === undefined ? true : opt.value;
    if (opt.evidence) [].concat(opt.evidence).forEach(function (e) { NW.state.addEvidence(e); });
    render();
    // the director runs the reply and the branch
    p.resolve({ steps: steps.concat(opt.steps || []) });
  }

  function showTyping(tid, who) {
    if (!ui || tid !== currentThread) return;
    ui.typing.textContent = (CONTACTS[who] ? CONTACTS[who].name : who) + ' IS TRANSMITTING…';
    ui.typing.classList.remove('hidden');
    scroll();
  }
  function hideTyping() { if (ui) ui.typing.classList.add('hidden'); }

  function updateBadge() {
    var n = totalUnread();
    if (!n && awaitingThread()) n = 1;      // a waiting reply counts as unread
    NW.apps.badge('wire', n);
  }

  function switchTo(k) {
    currentThread = k; thread(k).unread = 0;
    NW.audio.play('click'); render(); updateBadge();
  }

  /* ══════════ rendering ══════════ */

  function scroll() {
    if (ui && ui.log) ui.log.scrollTop = ui.log.scrollHeight;
  }
  // the reply panel changes height as it fills; re-pin once layout settles
  function scrollSoon() {
    scroll();
    requestAnimationFrame(function () { scroll(); requestAnimationFrame(scroll); });
  }

  function render() {
    if (!ui || !NW.win.isOpen('wire')) return;
    renderList();
    renderThread();
    renderReply();
    scrollSoon();
  }

  function renderList() {
    U.clear(ui.list);
    ui.list.appendChild(el('div.sec-h', { text: 'CHANNELS' }));
    var waiting = awaitingThread();
    contactsVisible().forEach(function (k) {
      var c = CONTACTS[k], t = thread(k);
      var row = el('div.lrow', {
        class: (k === currentThread ? 'sel ' : '') + (t.unread ? 'unread ' : '') + (k === waiting ? 'awaiting' : '')
      }, [
        el('div.lr-t', { text: c.name }),
        el('div.lr-s', { text: k === waiting ? '▶ AWAITING YOUR REPLY' : c.role })
      ]);
      if (c.ghost) row.style.color = 'var(--violet)';
      if (c.danger) row.style.borderLeft = '2px solid var(--red-dim)';
      U.on(row, 'click', function () { switchTo(k); });
      ui.list.appendChild(row);
    });
    ui.list.appendChild(el('div.sec-h', { text: 'LINK' }));
    ui.list.appendChild(el('div', { class: 'pad dim', style: { fontSize: '10px', lineHeight: '1.7' },
      html: 'RELAY&nbsp;&nbsp;NCIB-VC-04<br>MODE&nbsp;&nbsp;&nbsp;ASYNC 2400<br>ENCR&nbsp;&nbsp;&nbsp;<span style="color:var(--red)">NONE</span>' }));
  }

  function renderThread() {
    var c = CONTACTS[currentThread] || { name: currentThread, role: '' };
    U.clear(ui.head);
    ui.head.appendChild(el('div.wh-n', { text: c.name }));
    ui.head.appendChild(el('div.wh-r', { text: c.role }));

    U.clear(ui.log);
    var msgs = thread(currentThread).msgs;
    if (!msgs.length) {
      ui.log.appendChild(el('div.empty', { text: 'NO TRAFFIC ON THIS CHANNEL' }));
    }
    msgs.forEach(function (m) {
      var kind = m.from === 'me' ? 'me' : m.from === 'sys' ? 'sys' : '';
      // a message left mid-type by a reload is simply finished
      var typing = m.typing && activeType === m.id;
      if (m.typing && !typing) { m.typing = false; m._shown = null; }
      var node = el('div.msg', { class: kind + ' ' + (m.cls || '') + (typing ? ' typing' : ''),
                                 dataset: { mid: m.id || 0 } });
      if (m.from !== 'sys') {
        node.appendChild(el('div.m-meta', {
          text: (m.from === 'me' ? 'TERMINAL 04' : (CONTACTS[m.from] ? CONTACTS[m.from].name : m.from)) + '  ·  ' + m.at
        }));
      }
      node.appendChild(el('div.m-body', { text: typing ? (m._shown || '') : m.text }));
      if (!typing) {
        [].concat(m.att || [], m.atts || []).forEach(function (att) {
          node.appendChild(attachmentCard(att));
        });
      }
      ui.log.appendChild(node);
    });
    ui.log.appendChild(ui.typing);
    scroll();
  }

  var ATT_KIND = {
    doc:    { ico: '▤', k: 'DOCUMENT',  go: 'OPEN IN ARCHIVE' },
    photo:  { ico: '▣', k: 'EXHIBIT — PHOTOGRAPH', go: 'OPEN IN IMAGE LAB' },
    audio:  { ico: '◍', k: 'EXHIBIT — TAPE', go: 'OPEN IN AUDIO LAB' },
    person: { ico: '☖', k: 'INDEX RECORD', go: 'OPEN IN REGISTRY' },
    print:  { ico: '◈', k: 'LATENT',     go: 'OPEN IN DAKTYLO' },
    app:    { ico: '▸', k: 'PROGRAM',    go: 'OPEN' },
    vehicle:{ ico: '⬒', k: 'VEHICLE',    go: 'OPEN IN REGISTRY' }
  };

  function attachmentCard(att) {
    var k = ATT_KIND[att.kind] || ATT_KIND.doc;
    var seen = S().flags['att_seen_' + att.kind + '_' + att.id];
    var card = el('div.m-att' + (seen ? '' : '.fresh'), null, [
      el('span.ma-ico', { text: k.ico }),
      el('div.ma-t', null, [
        el('div.ma-k', { text: k.k }),
        el('div.ma-n', { text: att.label || att.id })
      ]),
      el('span.ma-go', { text: k.go + ' ▸' })
    ]);
    U.on(card, 'click', function () {
      NW.state.flag('att_seen_' + att.kind + '_' + att.id, true);
      card.classList.remove('fresh');
      openAttachment(att);
    });
    return card;
  }

  function openAttachment(att) {
    NW.audio.play('click');
    if (att.kind === 'doc') { NW.state.unlock('docs', att.id, true); NW.apps.open('archive', att.id); }
    else if (att.kind === 'photo') { NW.state.flag('photo_' + att.id, true); NW.apps.open('imagelab', att.id); }
    else if (att.kind === 'audio') { NW.state.flag('audio_' + att.id, true); NW.apps.open('audiolab', att.id); }
    else if (att.kind === 'person') { NW.state.unlock('records', att.id, true); NW.apps.open('registry', att.id); }
    else if (att.kind === 'vehicle') { NW.apps.open('registry', att.id); }
    else if (att.kind === 'print') { NW.apps.open('daktylo', att.id); }
    else if (att.kind === 'app') { NW.apps.open(att.id); }
  }

  function renderReply() {
    U.clear(ui.reply);
    visibleOpts = [];

    var waiting = awaitingThread();
    // a reply belongs to one channel; elsewhere, offer to jump to it
    if (waiting && waiting !== currentThread) {
      var who = CONTACTS[waiting] ? CONTACTS[waiting].name : waiting;
      var jump = el('button.reply-opt.awaiting-jump', null, [
        el('span.ro-n', { text: '▶' }),
        el('span', { text: who + ' IS WAITING ON YOUR REPLY — SWITCH TO THAT CHANNEL  ' }),
        el('span.aj-t', { style: { color: 'var(--red)', fontWeight: 'bold' }, text: '' })
      ]);
      U.on(jump, 'click', function () { switchTo(waiting); });
      ui.reply.appendChild(jump);
      paintTimer();
      return;
    }

    if (NW.request.current() && requestThread === currentThread) NW.request.render(ui.reply);

    if (pendingAsk && pendingAsk.thread === currentThread) {
      var spec = pendingAsk.spec;
      if (spec.timer && timerState) {
        ui.reply.appendChild(el('div.timer-lbl', { text: 'RESPONSE WINDOW' }));
        ui.reply.appendChild(el('div.timer-bar', null, [el('i', { style: { width: '100%' } })]));
        paintTimer();
      }
      if (spec.prompt) ui.reply.appendChild(el('div', { class: 'dim', style: { fontSize: '10px', letterSpacing: '.16em', marginBottom: '6px', textTransform: 'uppercase' }, text: spec.prompt }));
      spec.options.forEach(function (o) {
        if (o.when && !NW.state.test(o.when)) return;
        visibleOpts.push(o);
        var b = el('button.reply-opt', null, [
          el('span.ro-n', { text: visibleOpts.length + '.' }),
          el('span', { text: o.label })
        ]);
        U.on(b, 'click', function () { chooseOption(o); });
        ui.reply.appendChild(b);
      });
    }
    if (!waiting) {
      ui.reply.appendChild(el('div', { class: 'dim', style: { fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase' },
        text: '— NO REPLY REQUIRED —' }));
    }
  }

  /* number keys pick a reply; Enter sends a single-option reply */
  function onKey(e) {
    if (!pendingAsk || !visibleOpts.length) return false;
    var n = /^[1-9]$/.test(e.key) ? parseInt(e.key, 10) : (e.key === 'Enter' && visibleOpts.length === 1 ? 1 : 0);
    var opt = visibleOpts[n - 1];
    if (!opt) return false;
    chooseOption(opt);
    return true;
  }

  /* ── timed choices ── */
  var timer = null, timerState = null;
  function startTimer(spec) {
    stopTimer();
    var total = spec.timer * 1000;
    timerState = { total: total, t0: Date.now(), left: total };
    timer = setInterval(function () {
      timerState.left = total - (Date.now() - timerState.t0);
      paintTimer();
      if (timerState.left <= 0) {
        stopTimer();
        NW.notify.push({ head: 'WINDOW CLOSED', body: 'The field acted without you.', kind: 'bad' });
        if (spec.timeoutOption) { chooseOption(spec.timeoutOption); return; }
        var dflt = spec.options.filter(function (o) { return o.onTimeout; })[0] || spec.options[spec.options.length - 1];
        chooseOption(Object.assign({}, dflt, { reply: dflt.reply || '(no response sent)' }));
      }
    }, 100);
  }
  function paintTimer() {
    if (!ui || !timerState) return;
    var fill = ui.reply.querySelector('.timer-bar i');
    var lbl = ui.reply.querySelector('.timer-lbl');
    var secs = Math.max(0, Math.ceil(timerState.left / 1000));
    if (fill) fill.style.width = Math.max(0, timerState.left / timerState.total * 100) + '%';
    if (lbl) lbl.textContent = 'RESPONSE WINDOW — ' + secs + 's';
    var jump = ui.reply.querySelector('.awaiting-jump .aj-t');
    if (jump) jump.textContent = secs + 's';
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } timerState = null; }

  /* ══════════ app definition ══════════ */

  NW.apps.define({
    id: 'wire', name: 'WIRE', short: 'WIRE', icon: 'wire', always: true,
    hint: 'internal message bus',
    win: { w: 720, h: 470, x: 30, y: 40, min: [520, 300] },
    build: function (body) {
      var list = el('div.sidebar.wire-list.scroll');
      var head = el('div.wire-head');
      var log = el('div.wire-log');
      var reply = el('div.wire-reply');
      var typing = el('div.wire-typing.hidden');
      var thr = el('div.wire-thread', null, [head, log, reply]);
      body.appendChild(el('div.app', null, [el('div.app-row', null, [list, thr])]));
      U.on(log, 'click', function (e) {
        if (e.target.closest('.m-att')) return;
        flushTyping();
      });
      ui = { list: list, head: head, log: log, reply: reply, typing: typing };
      thread(currentThread).unread = 0;
      render(); updateBadge();
    },
    onFocus: function () { thread(currentThread).unread = 0; render(); updateBadge(); },
    onKey: onKey,
    onClose: function () { ui = null; visibleOpts = []; }
  });

  NW.bus.on('request:change', function () { if (ui) { renderReply(); scrollSoon(); } });
  NW.bus.on('request:open', function () {
    requestThread = currentThread;
    if (ui) { renderList(); renderReply(); scrollSoon(); }
    updateBadge();
  });
  NW.bus.on('request:close', function () {
    requestThread = null;
    if (ui) { renderList(); renderReply(); scrollSoon(); }
    updateBadge();
  });

  NW.wire = {
    push: push, ask: ask, contacts: CONTACTS, render: render, flush: flushTyping,
    armDedupe: armDedupe, awaiting: awaitingThread,
    open: function (id) { currentThread = id; thread(id).unread = 0; NW.apps.open('wire'); render(); },
    current: function () { return currentThread; }
  };
})(window.NW);

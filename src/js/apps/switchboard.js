/* NIGHTWIRE — apps/switchboard.js — the outside line */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var KEYS = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
              ['7', 'PRS'], ['8', 'TUV'], ['9', 'WXY'], ['*', ''], ['0', 'OPER'], ['#', '']];

  function topicKey(c, t) { return 'topic_' + c.number + '_' + t.id; }
  function openTopics(c) {
    return (c.topics || []).filter(function (t) {
      return (!t.requires || t.requires()) && !S().flags[topicKey(c, t)];
    });
  }
  /** Called before and has something new to ask about. */
  function hasNews(c) {
    return S().dialed[c.number] && !c.dead && (!c.requires || c.requires()) && openTopics(c).length > 0;
  }

  function build(body, win, arg) {
    // token changes on every dial and hang-up, so stale transcript lines stop
    var v = { num: '', call: null, stage: 'idle', ringTimer: null, token: 0 };

    var tools = el('div.toolbar', null, [el('span.tb-title', { text: 'OUTSIDE LINE · SUB-LEVEL 2 · EXT 04' })]);
    var wrap = el('div.sw-wrap');
    var dial = el('div.sw-dial');
    var logCol = el('div.grow.col');
    var status = el('div.call-status', { text: 'ON HOOK' });
    var log = el('div.sw-log.scroll');
    var topics = el('div', { class: 'pad', style: { borderTop: '1px solid var(--phos-ghost)', maxHeight: '38%', overflow: 'auto' } });
    logCol.appendChild(status); logCol.appendChild(log); logCol.appendChild(topics);
    wrap.appendChild(dial); wrap.appendChild(logCol);
    body.appendChild(el('div.app', null, [tools, wrap]));

    var display = el('div.sw-display', { text: '—' });
    dial.appendChild(display);
    var pad = el('div.keypad');
    KEYS.forEach(function (k) {
      var key = el('div.key', null, [document.createTextNode(k[0]), el('small', { text: k[1] })]);
      U.on(key, 'click', function () { press(k[0]); });
      pad.appendChild(key);
    });
    dial.appendChild(pad);
    var btns = el('div', { style: { display: 'flex', gap: '6px', marginTop: '10px' } });
    var callBtn = el('button.btn.good', { text: '☏ DIAL', style: { flex: '1' } });
    U.on(callBtn, 'click', place);
    var hangBtn = el('button.btn.danger', { text: 'HANG UP', style: { flex: '1' } });
    U.on(hangBtn, 'click', hang);
    btns.appendChild(callBtn); btns.appendChild(hangBtn);
    dial.appendChild(btns);

    dial.appendChild(el('div.sec-h', { style: { marginTop: '14px' }, text: 'NUMBERS ON FILE' }));
    var known = el('div', { style: { fontSize: '10px', lineHeight: '1.9' } });
    dial.appendChild(known);

    function renderKnown() {
      U.clear(known);
      NW.calls.known().forEach(function (c) {
        var news = hasNews(c);
        var row = el('div.xref.sw-num', {
          title: c.number + '  ' + (c.who || '') + (news ? '\nHas something new to talk about' : '') }, [
          el('span.sw-new', { text: news ? '●' : '' }),
          document.createTextNode(c.number + '  ' + (c.who || ''))
        ]);
        U.on(row, 'click', function () { setNumber(c.number); NW.audio.play('click'); });
        known.appendChild(row);
      });
    }

    function setNumber(n) {
      if (v.stage !== 'idle') return;
      v.num = String(n);
      display.textContent = v.num || '—';
    }

    function press(d) {
      if (v.stage !== 'idle') return;
      if (v.num.replace(/\D/g, '').length >= 7) return;
      v.num += d;
      if (v.num.replace(/\D/g, '').length === 3 && v.num.indexOf('-') === -1) v.num += '-';
      display.textContent = v.num;
      NW.audio.dtmf(d);
    }

    function backspace() {
      if (v.stage !== 'idle' || !v.num) return;
      v.num = v.num.slice(0, -1);
      if (/-$/.test(v.num)) v.num = v.num.slice(0, -1);
      display.textContent = v.num || '—';
    }

    function hang() {
      if (v.ringTimer) { clearTimeout(v.ringTimer); v.ringTimer = null; }
      v.token++;
      v.stage = 'idle'; v.call = null; v.num = '';
      display.textContent = '—';
      status.className = 'call-status'; status.textContent = 'ON HOOK';
      U.clear(topics);
      NW.audio.play('click');
      renderKnown();
    }

    function place() {
      var num = v.num;
      if (v.stage !== 'idle') return;
      if (num.replace(/\D/g, '').length < 7) {
        NW.notify.push({ head: 'INCOMPLETE', body: 'Seven digits.', kind: 'bad', ms: 1600 });
        return;
      }
      NW.audio.resume();
      var c = NW.calls.get(num);
      S().dialed[num] = true;
      S().stats.calls++;
      U.clear(log); U.clear(topics);
      v.token++;
      v.stage = 'ringing';
      status.className = 'call-status ring';
      status.textContent = 'RINGING…';
      NW.audio.play('dialtone');
      setTimeout(function () { NW.audio.play('ring'); }, 900);

      var ringMs = 1200 + ((c && c.ring) || 5) * 380;
      v.ringTimer = setTimeout(function () {
        v.ringTimer = null;
        if (!c || (c.requires && !c.requires())) return unavailable(c);
        if (c.dead) return deadLine(c);
        connect(c);
      }, ringMs);
    }

    function unavailable(c) {
      v.stage = 'idle';
      status.className = 'call-status dead';
      status.textContent = 'NO ANSWER';
      NW.audio.play('busy');
      addLine('SYS', c && c.who ? 'The line rings out. Nobody at ' + c.who + ' is expecting a call from this building tonight.' :
        'The number rings and rings. It is not a number that anybody answers.');
    }

    function deadLine(c) {
      v.stage = 'idle';
      status.className = 'call-status dead';
      status.textContent = 'LINE STATUS';
      NW.audio.play('busy');
      addLine('SYS', c.dead);
      if (c.onDial) c.onDial();
    }

    function connect(c) {
      v.stage = 'connected'; v.call = c;
      status.className = 'call-status';
      status.textContent = 'CONNECTED — ' + (c.who || c.number);
      NW.audio.play('relay');
      playLines(c.greeting, function () { renderTopics(); });
    }

    function addLine(spk, text) {
      var box = log.querySelector('.call-transcript') || (function () {
        var b = el('div.call-transcript'); log.appendChild(b); return b;
      })();
      var line = el('div.ct-line', null, [
        el('div.ct-spk', { text: spk }),
        el('div', { style: { color: spk === 'YOU' ? 'var(--phos-hi)' : spk === 'SYS' ? 'var(--phos-dim)' : 'var(--phos)' } })
      ]);
      box.appendChild(line);
      log.scrollTop = log.scrollHeight;
      return line.lastChild;
    }

    /** Type out lines one by one; done() only runs if the call is still the same call. */
    function playLines(lines, done) {
      var token = v.token;
      var i = 0;
      (function step() {
        if (token !== v.token) return;
        if (i >= lines.length) { if (done) done(); return; }
        var l = lines[i++];
        var node = addLine(l.s || '···', l.l);
        if (l.s && l.s !== 'YOU' && l.s !== 'SYS') NW.audio.garble(Math.min(1.2, l.l.length * 0.02));
        NW.typer.type(node, l.l, { cps: 140, cursor: false, sound: false }).then(function () {
          log.scrollTop = log.scrollHeight;
          setTimeout(step, 340);
        });
      })();
    }

    function renderTopics() {
      U.clear(topics);
      var c = v.call;
      if (!c || !c.topics) return;
      topics.appendChild(el('div', { class: 'dim', style: { fontSize: '9px', letterSpacing: '.2em', marginBottom: '6px' }, text: 'ASK ABOUT' }));
      var list = openTopics(c);
      list.forEach(function (t) {
        var b = el('button.reply-opt', { text: t.q });
        U.on(b, 'click', function () { runTopic(c, t); });
        topics.appendChild(b);
      });
      if (!list.length) {
        topics.appendChild(el('div', { class: 'dim', style: { fontSize: '11px' }, text: 'Nothing further to ask on this line tonight.' }));
      }
      var hu = el('button.btn', { text: 'END CALL', style: { marginTop: '6px' } });
      U.on(hu, 'click', hang);
      topics.appendChild(hu);
    }

    // a topic only counts as asked once the answer has finished, so hanging up
    // halfway leaves it open for the next call
    function runTopic(c, t) {
      U.clear(topics);
      playLines(t.a, function () {
        S().flags[topicKey(c, t)] = true;
        if (t.gives) {
          var g = t.gives;
          if (g.evidence) [].concat(g.evidence).forEach(function (e) { NW.state.addEvidence(e); });
          if (g.doc) { NW.state.unlock('docs', g.doc, true); NW.notify.push({ head: 'FILED TO ARCHIVE', body: NW.documents.get(g.doc).title, kind: 'good' }); }
          if (g.unlockRecord) NW.state.unlock('records', g.unlockRecord, true);
          if (g.flag) NW.state.flag(g.flag, true);
          if (g.fact) NW.state.addFact(g.fact.c, g.fact.t);
        }
        if (t.end) {
          v.stage = 'idle'; v.call = null;
          status.className = 'call-status dead';
          status.textContent = 'CALL ENDED';
          NW.audio.play('busy');
          U.clear(topics);
        } else renderTopics();
        renderKnown();
      });
    }

    win.setNumber = setNumber;
    win.keypad = function (e) {
      if (/^[0-9*#]$/.test(e.key)) { press(e.key); return true; }
      if (e.key === 'Backspace') { backspace(); return true; }
      if (e.key === 'Enter') { if (v.stage === 'idle') place(); return true; }
      return false;
    };
    win.onClose(function () { if (v.ringTimer) clearTimeout(v.ringTimer); v.token++; });

    // the list depends on records, documents and evidence held
    ['evidence', 'unlock', 'flag'].forEach(function (ev) { win.listen(ev, renderKnown); });
    renderKnown();
    if (arg) setNumber(arg);
  }

  NW.apps.define({
    id: 'switchboard', name: 'SWITCHBOARD', short: 'PHONE', icon: 'switchboard',
    hint: 'outside line',
    win: { w: 740, h: 580, min: [620, 440] },
    build: build,
    onFocus: function (win, arg) { if (arg && win.setNumber) win.setNumber(arg); },
    onKey: function (e, win) { return win.keypad ? win.keypad(e) : false; }
  });
})(window.NW);

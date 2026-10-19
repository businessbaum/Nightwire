/* NIGHTWIRE — apps/notepad.js — operator's own pad + auto-collected facts */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  function build(body) {
    var tools = el('div.toolbar');
    var area = el('textarea.np-area', { placeholder: 'Night desk notes…\n\nNothing typed here is transmitted anywhere.\nWhich, in this building, is the point.' });
    var auto = el('div.np-auto');

    tools.appendChild(el('span.tb-title', { text: 'PAD' }));
    var clr = el('button.btn', { text: 'CLEAR PAD' });
    U.on(clr, 'click', function () {
      if (!area.value) return;
      NW.notify.ask('CLEAR THE PAD',
        ['Everything you have typed on this pad will be gone.',
         'The established facts below are collected automatically and are not affected.'],
        'CLEAR IT', true).then(function (ok) {
        if (!ok) return;
        area.value = ''; S().notes = '';
        NW.audio.play('close');
      });
    });
    tools.appendChild(clr);
    var cnt = el('span', { class: 'dim', style: { marginLeft: 'auto', fontSize: '9px' } });
    tools.appendChild(cnt);

    body.appendChild(el('div.app', null, [tools, area, auto]));
    area.value = S().notes || '';

    U.on(area, 'input', function () { S().notes = area.value; NW.audio.play('key'); });

    function renderAuto() {
      U.clear(auto);
      auto.appendChild(el('div.sec-h', { text: 'ESTABLISHED FACTS — AUTOMATIC' }));
      var facts = S().autoFacts;
      if (!facts.length) auto.appendChild(el('div.empty', { text: 'NOTHING ESTABLISHED YET' }));
      facts.slice().reverse().forEach(function (f) {
        auto.appendChild(el('div.np-fact', null, [
          el('div.npf-c', { text: f.at + ' · ' + f.c }),
          el('div', { text: f.t })
        ]));
      });
      cnt.textContent = facts.length + ' FACTS · ' + NW.evidence.held().length + ' EXHIBITS';
    }

    NW.bus.on('fact', renderAuto);
    NW.bus.on('evidence', renderAuto);
    renderAuto();
  }

  NW.apps.define({
    id: 'notepad', name: 'NOTEPAD', short: 'PAD', icon: 'notepad', always: true,
    hint: 'your own notes; nothing leaves this window',
    win: { w: 520, h: 460, min: [360, 280] },
    build: build
  });
})(window.NW);

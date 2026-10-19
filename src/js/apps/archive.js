/* NIGHTWIRE — apps/archive.js — document archive, rendered as scanned paper */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var st = { q: '', sel: null };

  function reEsc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  /** Ring the terms a previous reader would have ringed. */
  function markTerms(root, terms) {
    if (!terms || !terms.length) return;
    var re = new RegExp('(' + terms.map(reEsc).join('|') + ')', 'gi');
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (!n.nodeValue || !n.parentNode || !n.parentNode.closest) return;
      if (n.parentNode.closest('mark, b, .stamp, .margin-note, .p-org, .p-form')) return;
      re.lastIndex = 0;
      if (!re.test(n.nodeValue)) return;
      re.lastIndex = 0;
      var span = document.createElement('span');
      span.innerHTML = NW.esc(n.nodeValue).replace(re, '<mark>$1</mark>');
      n.parentNode.replaceChild(span, n);
    });
  }

  function build(body, win, arg) {
    var tools = el('div.toolbar');
    var input = el('input.input', { placeholder: 'SEARCH ARCHIVE…', style: { flex: '1', minWidth: '120px' } });
    var list = el('div.arc-list.sidebar.col.scroll');
    var pane = el('div.doc-pane.grow');

    tools.appendChild(el('span.tb-title', { text: 'ARCHIVE' }));
    tools.appendChild(input);
    var pr = el('button.btn', { text: '⎙ PRINT' });
    U.on(pr, 'click', function () {
      NW.audio.play('print');
      NW.notify.push({ head: 'PRINT QUEUE', body: 'Job sent to the line printer on Sub-Level 2.', kind: 'info' });
    });
    tools.appendChild(pr);

    body.appendChild(el('div.app', null, [tools, el('div.app-row', null, [list, pane])]));

    function renderList() {
      U.clear(list);
      var docs = NW.documents.available().filter(function (d) {
        return U.matches([d.title, d.source, d.date, (d.tags || []).join(' ')].join(' '), st.q);
      });
      var groups = {};
      docs.forEach(function (d) {
        var y = (d.date.match(/(19\d\d)/) || ['', 'UNDATED'])[1];
        (groups[y] = groups[y] || []).push(d);
      });
      var years = Object.keys(groups).sort();
      if (!years.length) list.appendChild(el('div.empty', { text: st.q ? 'NO MATCH' : 'NO DOCUMENTS HELD' }));
      years.forEach(function (y) {
        list.appendChild(el('div.sec-h', { text: y }));
        groups[y].forEach(function (d) {
          var row = el('div.lrow', { class: st.sel === d.id ? 'sel' : '' }, [
            el('div.lr-t', { text: d.title }),
            el('div.lr-s', { text: d.date + ' · ' + d.source })
          ]);
          U.on(row, 'click', function () { show(d.id); });
          list.appendChild(row);
        });
      });
    }

    function show(id) {
      var d = NW.documents.get(id);
      if (!d) return;
      st.sel = id;
      NW.state.unlock('docs', id, true);
      NW.state.flag('read_' + id, true);
      NW.audio.play('page');
      U.clear(pane);
      var sheet = el('div.paper' + (d.paperClass ? '.' + d.paperClass : ''), { html: d.html() });
      if (d.paperClass === 'telex') {
        sheet.insertBefore(el('div.t-punch'), sheet.firstChild);
        sheet.appendChild(el('div.t-punch.r'));
      }
      markTerms(sheet, d.highlight);
      pane.appendChild(sheet);

      var bar = el('div', { style: { textAlign: 'center', marginTop: '14px' } });
      if (NW.request.wants('doc')) {
        var t = el('button.btn.good', { text: '▸ TRANSMIT DOCUMENT' });
        U.on(t, 'click', function () { NW.request.transmit('doc', d.id, d.title); });
        bar.appendChild(t);
      }
      var pin = el('button.btn', { text: '＋ PIN TO CASEBOOK' });
      U.on(pin, 'click', function () {
        NW.casebook.addCustom({ id: 'pin_' + d.id, kind: 'doc', title: d.title, desc: d.source + ' · ' + d.date });
        NW.notify.push({ head: 'PINNED', body: d.title, kind: 'info' });
      });
      bar.appendChild(pin);
      pane.appendChild(bar);
      pane.scrollTop = 0;
      renderList();
      NW.bus.emit('doc:read', d.id);
    }

    U.on(input, 'input', function () { st.q = input.value; renderList(); });
    win.showDoc = show;
    renderList();
    if (arg && NW.documents.get(arg)) show(arg);
    else pane.appendChild(el('div.empty', { html: 'CASE DOCUMENT ARCHIVE<br><br>SELECT A FILE FROM THE INDEX.' }));
  }

  NW.apps.define({
    id: 'archive', name: 'ARCHIVE', short: 'FILES', icon: 'archive',
    hint: 'case documents and correspondence',
    win: { w: 820, h: 580, min: [600, 380] },
    build: build,
    onFocus: function (win, arg) { if (arg && win.showDoc) win.showDoc(arg); }
  });
})(window.NW);

/* NIGHTWIRE — apps/casebook.js
   Cork, pins and string. Evidence arrives here automatically; the deductions
   are yours to make. */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var custom = {};

  function board() { return S().board; }

  function nodeSpec(id) {
    if (custom[id]) return custom[id];
    if (S().board.nodes[id] && S().board.nodes[id].custom) return S().board.nodes[id].custom;
    return NW.evidence.node(id);
  }

  function ensureNode(id, spec) {
    var b = board();
    if (b.nodes[id]) return b.nodes[id];
    var n = Object.keys(b.nodes).length;
    var cols = 5;
    b.nodes[id] = {
      x: 24 + (n % cols) * 150 + (Math.floor(n / cols) % 2) * 20,
      y: 22 + Math.floor(n / cols) * 96,
      custom: spec && spec.custom ? spec : null
    };
    if (spec && !NW.evidence.node(id)) { b.nodes[id].custom = spec; custom[id] = spec; }
    NW.bus.emit('casebook:change');
    return b.nodes[id];
  }

  function addNode(id) { ensureNode(id); }
  function addCustom(spec) { custom[spec.id] = spec; ensureNode(spec.id, spec); NW.bus.emit('casebook:change'); }

  NW.bus.on('evidence', function (d) {
    if (NW.evidence.def(d.id)) ensureNode(d.id);
  });

  function linkExists(a, b) {
    return board().links.some(function (l) {
      return (l.a === a && l.b === b) || (l.a === b && l.b === a);
    });
  }

  function checkTheories() {
    NW.evidence.theories.forEach(function (t) {
      if (S().flags['theory_' + t.id]) return;
      var ok = t.pairs.every(function (p) { return linkExists(p[0], p[1]); });
      if (!ok) return;
      S().flags['theory_' + t.id] = true;
      NW.audio.play('unlock');
      var os = t.onSolve || {};
      if (os.flag) NW.state.flag(os.flag, true);
      if (os.flag2) NW.state.flag(os.flag2, true);
      if (os.evidence) [].concat(os.evidence).forEach(function (e) { NW.state.addEvidence(e); });
      if (os.fact) NW.state.addFact(os.fact.c, os.fact.t);
      NW.notify.overlay({
        title: 'DEDUCTION', sub: t.title,
        body: [U.esc(os.fact ? os.fact.t : t.desc)],
        buttons: [{ label: 'LOG IT', value: 1 }]
      });
    });
  }

  function build(body) {
    var v = { sel: null, drag: null };

    var tools = el('div.toolbar');
    var boardEl = el('div.cb-board');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'cb-links');
    boardEl.appendChild(svg);
    boardEl.appendChild(el('div.cb-hint', { text: 'CLICK A CARD, THEN ANOTHER, TO RUN STRING BETWEEN THEM · DRAG TO MOVE · CLICK A STRING TO CUT IT' }));
    var theories = el('div.theory-panel.scroll');

    body.appendChild(el('div.app', null, [tools, el('div.app-row', null, [boardEl, theories])]));

    tools.appendChild(el('span.tb-title', { text: 'EVIDENCE BOARD' }));
    var tidy = el('button.btn', { text: 'TIDY' });
    U.on(tidy, 'click', function () {
      var ids = Object.keys(board().nodes);
      ids.forEach(function (id, i) {
        board().nodes[id].x = 24 + (i % 5) * 152;
        board().nodes[id].y = 22 + Math.floor(i / 5) * 98;
      });
      NW.audio.play('click'); render();
    });
    tools.appendChild(tidy);
    var count = el('span', { class: 'dim', style: { marginLeft: 'auto', fontSize: '9px' } });
    tools.appendChild(count);

    function render() {
      U.$$('.cb-node', boardEl).forEach(function (n) { n.remove(); });
      var b = board();
      Object.keys(b.nodes).forEach(function (id) {
        var spec = nodeSpec(id);
        if (!spec) return;
        var pos = b.nodes[id];
        var node = el('div.cb-node', {
          class: 'kind-' + (spec.kind || 'doc') + (v.sel === id ? ' sel' : ''),
          style: { left: pos.x + 'px', top: pos.y + 'px' },
          dataset: { id: id }, title: spec.desc || ''
        }, [
          el('div.cn-pin'),
          el('div.cn-k', { text: (spec.kind || 'item').toUpperCase() }),
          el('div.cn-t', { text: spec.title })
        ]);
        boardEl.appendChild(node);

        var moved = false;
        U.drag(node, function () { moved = false; v.drag = { id: id, x: pos.x, y: pos.y }; }, function (dx, dy) {
          moved = Math.abs(dx) + Math.abs(dy) > 3;
          pos.x = Math.max(0, v.drag.x + dx); pos.y = Math.max(0, v.drag.y + dy);
          node.style.left = pos.x + 'px'; node.style.top = pos.y + 'px';
          drawLinks();
        }, function () {
          v.drag = null;
          if (!moved) select(id);
        });
      });
      drawLinks();
      renderTheories();
      count.textContent = Object.keys(b.nodes).length + ' CARDS · ' + b.links.length + ' STRINGS';
    }

    function select(id) {
      if (v.sel === null) { v.sel = id; NW.audio.play('click'); render(); return; }
      if (v.sel === id) { v.sel = null; render(); return; }
      if (!linkExists(v.sel, id)) {
        board().links.push({ a: v.sel, b: id });
        NW.audio.play('relay');
        checkTheories();
      }
      v.sel = null;
      render();
    }

    function centreOf(id) {
      var p = board().nodes[id];
      return { x: p.x + 66, y: p.y + 26 };
    }

    var SVGNS = 'http://www.w3.org/2000/svg';

    function drawLinks() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.style.pointerEvents = 'none';
      board().links.forEach(function (l, i) {
        if (!board().nodes[l.a] || !board().nodes[l.b]) return;
        var a = centreOf(l.a), b2 = centreOf(l.b);

        var line = document.createElementNS(SVGNS, 'line');
        line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
        line.setAttribute('x2', b2.x); line.setAttribute('y2', b2.y);
        line.setAttribute('stroke', '#c0392b');
        line.setAttribute('stroke-width', '1.8');
        line.setAttribute('opacity', '.8');
        line.style.pointerEvents = 'none';
        svg.appendChild(line);

        /* A one-pixel line is not something anybody can hit with a mouse.
           An invisible fat stroke on top carries the pointer. */
        var hit = document.createElementNS(SVGNS, 'line');
        hit.setAttribute('x1', a.x); hit.setAttribute('y1', a.y);
        hit.setAttribute('x2', b2.x); hit.setAttribute('y2', b2.y);
        hit.setAttribute('stroke', 'transparent');
        hit.setAttribute('stroke-width', '20');
        hit.setAttribute('stroke-linecap', 'round');
        hit.style.pointerEvents = 'stroke';
        hit.style.cursor = 'pointer';
        var t = document.createElementNS(SVGNS, 'title');
        t.textContent = 'Click to cut this string';
        hit.appendChild(t);

        function cut(e) {
          e.preventDefault(); e.stopPropagation();
          var idx = board().links.indexOf(l);
          if (idx >= 0) board().links.splice(idx, 1);
          NW.audio.play('close');
          hideCut();
          render();
        }
        hit.addEventListener('mouseenter', function () {
          line.setAttribute('stroke', '#ff5340');
          line.setAttribute('stroke-width', '3.2');
          line.setAttribute('opacity', '1');
          showCut((a.x + b2.x) / 2, (a.y + b2.y) / 2);
        });
        hit.addEventListener('mouseleave', function () {
          line.setAttribute('stroke', '#c0392b');
          line.setAttribute('stroke-width', '1.8');
          line.setAttribute('opacity', '.8');
          hideCut();
        });
        hit.addEventListener('click', cut);
        hit.addEventListener('contextmenu', cut);
        svg.appendChild(hit);
      });
    }

    var cutTag = el('div.cb-cut', { text: '✂ CUT' });
    boardEl.appendChild(cutTag);
    function showCut(x, y) {
      cutTag.style.left = x + 'px'; cutTag.style.top = y + 'px';
      cutTag.classList.add('on');
    }
    function hideCut() { cutTag.classList.remove('on'); }

    function renderTheories() {
      U.clear(theories);
      theories.appendChild(el('div.sec-h', { text: 'WORKING THEORIES' }));
      var any = false;
      NW.evidence.theories.forEach(function (t) {
        if (t.chapter > S().chapter) return;
        any = true;
        var solved = S().flags['theory_' + t.id];
        theories.appendChild(el('div.theory', { class: solved ? 'solved' : '' }, [
          el('div.th-t', { text: (solved ? '✓ ' : '○ ') + t.title }),
          el('div.th-d', { text: solved ? (t.onSolve.fact ? t.onSolve.fact.t : t.desc) : t.desc })
        ]));
      });
      if (!any) theories.appendChild(el('div.empty', { text: 'NO THEORIES YET' }));
      theories.appendChild(el('div.sec-h', { text: 'HOW THIS WORKS' }));
      theories.appendChild(el('div', { class: 'pad dim', style: { fontSize: '10px', lineHeight: '1.7' }, html:
        'Evidence pins itself to the board as you find it.<br><br>' +
        'A theory resolves when the right cards are strung together. Wrong string costs you nothing but time — ' +
        'so try things.<br><br>' +
        'Hover a string and it lights up; click it to cut it.' }));
    }

    NW.bus.on('casebook:change', render);
    NW.bus.on('evidence', function () { setTimeout(render, 60); });
    render();
  }

  NW.apps.define({
    id: 'casebook', name: 'CASEBOOK', short: 'BOARD', icon: 'casebook',
    hint: 'evidence board — string the connections',
    win: { w: 900, h: 600, min: [700, 440] },
    build: build
  });

  NW.casebook = { addNode: addNode, addCustom: addCustom, check: checkTheories };
})(window.NW);

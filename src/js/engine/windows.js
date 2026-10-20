/* NIGHTWIRE — engine/windows.js — draggable, resizable windows */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;

  var root = null;
  var wins = {};          // id -> win object
  var z = 100;
  var cascade = 0;

  function init() {
    root = U.$('#windows');
    window.addEventListener('resize', keepOnScreen);
  }

  function bounds() {
    var ws = U.$('#workspace');
    return { w: ws.clientWidth, h: ws.clientHeight };
  }

  /** open({id, title, w, h, x, y, min:[w,h], resizable, small, tint, onClose, build(body, win)}) */
  function open(spec) {
    if (!root) init();
    var id = spec.id;
    if (wins[id]) { focus(id); return wins[id]; }

    var b = bounds();
    // at least the authored size or a good share of the desk, never off screen
    var wantW = spec.small ? (spec.w || 520) : Math.max(spec.w || 640, Math.round(b.w * 0.44));
    var wantH = spec.small ? (spec.h || 420) : Math.max(spec.h || 420, Math.round(b.h * 0.72));
    var w = Math.min(wantW, b.w - 24);
    var h = Math.min(wantH, b.h - 24);
    var x = spec.x !== undefined ? spec.x : Math.max(8, Math.round((b.w - w) / 2) + (cascade % 6) * 22 - 60);
    var y = spec.y !== undefined ? spec.y : Math.max(8, Math.round((b.h - h) / 2) + (cascade % 6) * 18 - 50);
    cascade++;

    var body = el('div.win-body');
    var titleName = el('span.wt-name', { text: spec.title || id });
    var btnMin = el('button.win-btn', { text: '_', title: 'Minimise' });
    var btnMax = el('button.win-btn', { text: '□', title: 'Maximise' });
    var btnX = el('button.win-btn.x', { text: '×', title: 'Close' });

    var titleBar = el('div.win-title', null, [
      el('span', { text: '▓' }),
      titleName,
      el('div.win-btns', null, [btnMin, spec.resizable === false ? null : btnMax, btnX])
    ]);

    var node = el('div.win.opening', {
      style: { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', zIndex: ++z }
    }, [titleBar, body]);

    if (spec.resizable !== false) node.appendChild(el('div.win-resize'));
    if (spec.tint) node.style.setProperty('--phos', spec.tint);

    var cleanups = [];
    var win = {
      id: id, node: node, body: body, spec: spec,
      minimised: false, maximised: false, prev: null,
      setTitle: function (t) { titleName.textContent = t; },
      close: function () { close(id); },
      focus: function () { focus(id); },
      /** Bus subscription that ends when the window closes. */
      listen: function (ev, fn) { cleanups.push(NW.bus.on(ev, fn)); },
      /** Run fn when the window closes. */
      onClose: function (fn) { cleanups.push(fn); },
      _cleanup: function () {
        cleanups.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
        cleanups = [];
      }
    };
    wins[id] = win;
    root.appendChild(node);

    // drag by the title bar
    var sx, sy;
    U.drag(titleBar, function (e) {
      if (e.target.closest('.win-btn')) return false;
      focus(id);
      sx = parseInt(node.style.left, 10); sy = parseInt(node.style.top, 10);
      if (win.maximised) return false;
    }, function (dx, dy) {
      var bb = bounds();
      node.style.left = U.clamp(sx + dx, -node.offsetWidth + 90, bb.w - 60) + 'px';
      node.style.top = U.clamp(sy + dy, 0, bb.h - 24) + 'px';
    });

    // resize from the corner
    var rz = node.querySelector('.win-resize');
    if (rz) {
      var sw, sh;
      U.drag(rz, function () {
        focus(id); sw = node.offsetWidth; sh = node.offsetHeight;
      }, function (dx, dy) {
        var mn = spec.min || [320, 180];
        node.style.width = Math.max(mn[0], sw + dx) + 'px';
        node.style.height = Math.max(mn[1], sh + dy) + 'px';
        NW.bus.emit('win:resize', win);
      });
    }

    U.on(node, 'mousedown', function () { focus(id); }, true);
    U.on(btnX, 'click', function (e) { e.stopPropagation(); close(id); });
    U.on(btnMin, 'click', function (e) { e.stopPropagation(); minimise(id); });
    U.on(btnMax, 'click', function (e) { e.stopPropagation(); toggleMax(id); });
    U.on(titleBar, 'dblclick', function () { toggleMax(id); });

    if (spec.build) spec.build(body, win);
    focus(id);
    NW.audio.play('open');
    setTimeout(function () { node.classList.remove('opening'); }, 180);
    NW.bus.emit('win:open', win);
    return win;
  }

  function focus(id) {
    var win = wins[id]; if (!win) return;
    if (win.minimised) { win.minimised = false; win.node.classList.remove('hidden'); }
    Object.keys(wins).forEach(function (k) { wins[k].node.classList.remove('focused'); });
    win.node.classList.add('focused');
    win.node.style.zIndex = ++z;
    NW.bus.emit('win:focus', win);
  }

  function close(id) {
    var win = wins[id]; if (!win) return;
    if (win.spec.onClose && win.spec.onClose(win) === false) return;
    win._cleanup();
    win.node.classList.add('closing');
    NW.audio.play('close');
    setTimeout(function () { if (win.node.parentNode) win.node.parentNode.removeChild(win.node); }, 130);
    delete wins[id];
    NW.bus.emit('win:close', { id: id });
    // hand focus to whatever is now on top
    var top = topmost();
    if (top) focus(top.id);
  }

  function minimise(id) {
    var win = wins[id]; if (!win) return;
    win.minimised = true;
    win.node.classList.add('hidden');
    win.node.classList.remove('focused');
    NW.bus.emit('win:min', win);
  }

  function toggleMax(id) {
    var win = wins[id]; if (!win) return;
    var n = win.node, b = bounds();
    if (win.maximised) {
      n.style.left = win.prev.x + 'px'; n.style.top = win.prev.y + 'px';
      n.style.width = win.prev.w + 'px'; n.style.height = win.prev.h + 'px';
      win.maximised = false;
    } else {
      win.prev = { x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight };
      n.style.left = '0px'; n.style.top = '0px';
      n.style.width = b.w + 'px'; n.style.height = b.h + 'px';
      win.maximised = true;
    }
    NW.bus.emit('win:resize', win);
  }

  /** Pull windows back into view after the browser window shrinks. */
  function keepOnScreen() {
    var b = bounds();
    all().forEach(function (win) {
      var n = win.node;
      if (win.maximised) {
        n.style.width = b.w + 'px'; n.style.height = b.h + 'px';
        NW.bus.emit('win:resize', win);
        return;
      }
      n.style.left = U.clamp(n.offsetLeft, -n.offsetWidth + 90, Math.max(0, b.w - 60)) + 'px';
      n.style.top = U.clamp(n.offsetTop, 0, Math.max(0, b.h - 24)) + 'px';
    });
  }

  function topmost() {
    var best = null;
    all().forEach(function (w) {
      if (w.minimised) return;
      if (!best || (+w.node.style.zIndex) > (+best.node.style.zIndex)) best = w;
    });
    return best;
  }

  function get(id) { return wins[id]; }
  function isOpen(id) { return !!wins[id]; }
  function all() { return Object.keys(wins).map(function (k) { return wins[k]; }); }
  function closeAll() { Object.keys(wins).forEach(close); }
  function focused() {
    return all().filter(function (w) { return w.node.classList.contains('focused'); })[0] || null;
  }

  NW.win = { init: init, open: open, close: close, focus: focus, minimise: minimise,
             toggleMax: toggleMax, get: get, isOpen: isOpen, all: all, closeAll: closeAll,
             focused: focused };
})(window.NW);

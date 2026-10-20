/* NIGHTWIRE — engine/apps.js — program registry + left rail */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el, S = function () { return NW.state.s; };

  var reg = {};      // id -> app def
  var order = [];
  var railEl = null;
  var badges = {};

  /** define({id, name, short, icon, win:{...}, build(body, win, arg), onOpen, onFocus(win, arg), onKey(e, win), onClose}) */
  function define(def) {
    reg[def.id] = def;
    if (order.indexOf(def.id) === -1) order.push(def.id);
  }

  function get(id) { return reg[id]; }

  function isUnlocked(id) {
    var d = reg[id];
    if (!d) return false;
    if (d.always) return true;
    return !!S().apps[id];
  }

  function unlock(id, opts) {
    opts = opts || {};
    if (!reg[id]) return;
    if (S().apps[id]) return;
    S().apps[id] = true;
    renderRail();
    var node = railEl && railEl.querySelector('[data-app="' + id + '"]');
    if (node) node.classList.add('fresh');
    if (!opts.quiet) {
      NW.audio.play('unlock');
      NW.notify.push({ head: 'PROGRAM AUTHORISED', body: reg[id].name, kind: 'good' });
    }
  }

  function open(id, arg) {
    var d = reg[id];
    if (!d) return null;
    if (!isUnlocked(id)) {
      NW.notify.push({ head: 'ACCESS DENIED', body: 'Program not authorised for your clearance.', kind: 'bad' });
      NW.audio.play('error');
      return null;
    }
    var node = railEl && railEl.querySelector('[data-app="' + id + '"]');
    if (node) node.classList.remove('fresh');
    clearBadge(id);

    if (NW.win.isOpen(id)) {
      NW.win.focus(id);
      if (d.onFocus) d.onFocus(NW.win.get(id), arg);
      return NW.win.get(id);
    }
    var spec = Object.assign({ id: id, title: d.name }, d.win || {});
    spec.build = function (body, win) {
      win.app = d;
      if (d.build) d.build(body, win, arg);
    };
    spec.onClose = d.onClose;
    var w = NW.win.open(spec);
    if (d.onOpen) d.onOpen(w, arg);
    renderRail();
    if (NW.tutorial) NW.tutorial.maybeShow(id);
    return w;
  }

  function badge(id, n) {
    badges[id] = n;
    renderRail();
  }
  function bumpBadge(id) { badges[id] = (badges[id] || 0) + 1; renderRail(); }
  function clearBadge(id) { if (badges[id]) { badges[id] = 0; renderRail(); } }

  function renderRail() {
    if (!railEl) railEl = U.$('#rail');
    if (!railEl) return;
    U.clear(railEl);
    order.forEach(function (id) {
      var d = reg[id];
      if (d.hidden && !isUnlocked(id)) return;
      var unlockedNow = isUnlocked(id);
      var isOpenNow = NW.win.isOpen(id);
      var item = el('button.rail-item', {
        dataset: { app: id },
        class: (unlockedNow ? '' : 'locked ') + (isOpenNow ? 'open ' : ''),
        title: d.name + (d.hint ? ' — ' + d.hint : '')
      }, [
        el('span.rail-ico', { html: NW.gfx.icon(d.icon || id) }),
        el('span.rail-lbl', { text: d.short || d.name })
      ]);
      if (badges[id]) item.appendChild(el('span.rail-badge', { text: badges[id] > 9 ? '9+' : badges[id] }));
      if (isOpenNow && NW.win.get(id) && NW.win.get(id).node.classList.contains('focused')) item.classList.add('active');
      U.on(item, 'click', function () { NW.audio.play('click'); open(id); });
      railEl.appendChild(item);
      if (d.dividerAfter) railEl.appendChild(el('div.rail-divider'));
    });
  }

  NW.bus.on('win:focus', renderRail);
  NW.bus.on('win:close', renderRail);
  NW.bus.on('win:open', renderRail);

  NW.apps = {
    define: define, get: get, open: open, unlock: unlock, isUnlocked: isUnlocked,
    renderRail: renderRail, badge: badge, bumpBadge: bumpBadge, clearBadge: clearBadge,
    all: function () { return order.map(function (i) { return reg[i]; }); }
  };
})(window.NW);

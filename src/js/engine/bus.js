/* NIGHTWIRE — engine/bus.js — pub/sub */
(function (NW) {
  'use strict';
  var map = {};

  NW.bus = {
    on: function (ev, fn) {
      (map[ev] = map[ev] || []).push(fn);
      return function () { NW.bus.off(ev, fn); };
    },
    once: function (ev, fn) {
      var off = NW.bus.on(ev, function (d) { off(); fn(d); });
      return off;
    },
    off: function (ev, fn) {
      if (!map[ev]) return;
      map[ev] = map[ev].filter(function (f) { return f !== fn; });
    },
    emit: function (ev, data) {
      (map[ev] || []).slice().forEach(function (f) {
        try { f(data, ev); } catch (e) { console.error('[bus] ' + ev, e); }
      });
      (map['*'] || []).slice().forEach(function (f) {
        try { f(data, ev); } catch (e) { console.error('[bus *]', e); }
      });
    },
    clear: function () { map = {}; }
  };
})(window.NW);

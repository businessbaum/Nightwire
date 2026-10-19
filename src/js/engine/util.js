/* NIGHTWIRE — engine/util.js
   Tiny DOM + helper layer. Everything hangs off the global NW namespace. */
window.NW = window.NW || {};

(function (NW) {
  'use strict';

  /** Create an element. tag may carry #id and .class shorthand: 'div.foo.bar#baz' */
  function el(tag, attrs, children) {
    var m = String(tag).match(/^([a-zA-Z0-9]+)?([^\s]*)$/);
    var name = (m && m[1]) || 'div';
    var node = document.createElement(name);
    var rest = (m && m[2]) || '';
    rest.replace(/([.#])([^.#]+)/g, function (_, sig, val) {
      if (sig === '.') node.classList.add(val);
      else node.id = val;
      return '';
    });
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') { String(v).split(/\s+/).forEach(function (c) { if (c) node.classList.add(c); }); }
        else if (k === 'style' && typeof v === 'object') { for (var s in v) node.style[s] = v[s]; }
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'dataset') { for (var d in v) node.dataset[d] = v[d]; }
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      }
    }
    append(node, children);
    return node;
  }

  function append(node, children) {
    if (children === null || children === undefined) return node;
    if (Array.isArray(children)) {
      children.forEach(function (c) { append(node, c); });
    } else if (children instanceof Node) {
      node.appendChild(children);
    } else {
      node.appendChild(document.createTextNode(String(children)));
    }
    return node;
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; }

  function on(node, ev, fn, opt) { node.addEventListener(ev, fn, opt); return function () { node.removeEventListener(ev, fn, opt); }; }

  function delegate(root, sel, ev, fn) {
    return on(root, ev, function (e) {
      var t = e.target.closest(sel);
      if (t && root.contains(t)) fn(e, t);
    });
  }

  /** Escape for innerHTML injection. */
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function pad(n, w) { n = String(n); while (n.length < (w || 2)) n = '0' + n; return n; }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /** Deterministic string hash → uint32 */
  function hash(str) {
    var h = 2166136261 >>> 0;
    str = String(str);
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function deepClone(o) {
    if (o === null || typeof o !== 'object') return o;
    if (Array.isArray(o)) return o.map(deepClone);
    var r = {};
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = deepClone(o[k]);
    return r;
  }

  /** Fuzzy-ish text match used across search fields. */
  function matches(haystack, needle) {
    if (!needle) return true;
    haystack = String(haystack || '').toLowerCase();
    var terms = String(needle).toLowerCase().split(/[\s,]+/).filter(Boolean);
    return terms.every(function (t) { return haystack.indexOf(t) !== -1; });
  }

  function fmtTime(mins) {
    mins = ((mins % 1440) + 1440) % 1440;
    return pad(Math.floor(mins / 60)) + ':' + pad(mins % 60);
  }

  /** MM/DD/YY from a {y,m,d} */
  function fmtDate(d) { return pad(d.m) + '/' + pad(d.d) + '/' + pad(d.y % 100); }

  /** Base64-ish save code encoding (unicode safe). */
  function encode(str) {
    try { return btoa(unescape(encodeURIComponent(str))); } catch (e) { return ''; }
  }
  function decode(b64) {
    try { return decodeURIComponent(escape(atob(b64))); } catch (e) { return ''; }
  }

  function id(prefix) { NW._idc = (NW._idc || 0) + 1; return (prefix || 'id') + '_' + NW._idc; }

  /** Make a node draggable by a handle; onMove(dx,dy,e) */
  function drag(handle, onStart, onMove, onEnd) {
    on(handle, 'mousedown', function (e) {
      if (e.button !== 0) return;
      var sx = e.clientX, sy = e.clientY, moved = false;
      if (onStart && onStart(e) === false) return;
      e.preventDefault();
      function mm(ev) {
        moved = true;
        if (onMove) onMove(ev.clientX - sx, ev.clientY - sy, ev);
      }
      function mu(ev) {
        document.removeEventListener('mousemove', mm);
        document.removeEventListener('mouseup', mu);
        if (onEnd) onEnd(ev, moved);
      }
      document.addEventListener('mousemove', mm);
      document.addEventListener('mouseup', mu);
    });
  }

  NW.util = {
    el: el, append: append, $: $, $$: $$, clear: clear, on: on, delegate: delegate,
    esc: esc, clamp: clamp, lerp: lerp, pad: pad, wait: wait, hash: hash,
    deepClone: deepClone, matches: matches, fmtTime: fmtTime, fmtDate: fmtDate,
    encode: encode, decode: decode, id: id, drag: drag
  };
  // convenience globals used everywhere inside the project
  NW.el = el; NW.$ = $; NW.$$ = $$; NW.clear = clear; NW.esc = esc;
})(window.NW);

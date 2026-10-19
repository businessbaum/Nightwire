/* NIGHTWIRE — engine/typer.js — teletype text reveal */
(function (NW) {
  'use strict';

  /**
   * type(node, text, opts) → Promise
   * opts: {cps, sound, cursor, chunk, onChar}
   */
  function type(node, text, opts) {
    opts = opts || {};
    var speed = NW.state.settings().textSpeed || 1;
    if (speed <= 0) { node.textContent = text; return Promise.resolve(); }
    var cps = (opts.cps || 55) * speed;
    var chunk = opts.chunk || 1;
    var i = 0;
    node.textContent = '';
    var cur = null;
    if (opts.cursor !== false) {
      cur = document.createElement('span');
      cur.className = 'blink';
      cur.textContent = '█';
      node.appendChild(cur);
    }
    var buf = '';
    return new Promise(function (resolve) {
      var interval = 1000 / cps * chunk;
      var timer = setInterval(function () {
        if (i >= text.length) {
          clearInterval(timer);
          if (cur && cur.parentNode) cur.parentNode.removeChild(cur);
          resolve();
          return;
        }
        buf += text.slice(i, i + chunk);
        i += chunk;
        node.textContent = buf;
        if (cur) node.appendChild(cur);
        if (opts.sound !== false && i % 3 === 0) NW.audio.play('type');
        if (opts.onChar) opts.onChar(buf);
      }, interval);
      node._typerStop = function () {
        clearInterval(timer);
        node.textContent = text;
        if (cur && cur.parentNode) cur.parentNode.removeChild(cur);
        resolve();
      };
    });
  }

  /** Print an array of lines into a container, one after another. */
  function lines(container, arr, opts) {
    opts = opts || {};
    var idx = 0;
    return new Promise(function (resolve) {
      (function step() {
        if (idx >= arr.length) return resolve();
        var spec = arr[idx++];
        var txt = typeof spec === 'string' ? spec : spec.t;
        var cls = typeof spec === 'string' ? '' : (spec.c || '');
        var delay = typeof spec === 'string' ? (opts.delay || 60) : (spec.d === undefined ? (opts.delay || 60) : spec.d);
        var node = document.createElement('div');
        node.className = 'bline ' + cls;
        container.appendChild(node);
        container.scrollTop = container.scrollHeight;
        var instant = (typeof spec === 'object' && spec.instant) || opts.instant;
        if (instant) {
          node.innerHTML = txt;
          setTimeout(step, delay);
        } else {
          type(node, txt, { cps: opts.cps || 220, cursor: false, sound: opts.sound !== false })
            .then(function () { setTimeout(step, delay); });
        }
      })();
    });
  }

  NW.typer = { type: type, lines: lines };
})(window.NW);

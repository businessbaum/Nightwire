/* NIGHTWIRE — engine/rng.js — seeded PRNG, so generated art is the same every run */
(function (NW) {
  'use strict';

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Rng('seed-string') → object with helpers. */
  function Rng(seed) {
    if (!(this instanceof Rng)) return new Rng(seed);
    this.next = mulberry32(typeof seed === 'number' ? seed : NW.util.hash(seed));
  }
  Rng.prototype.f = function (lo, hi) {
    if (lo === undefined) return this.next();
    if (hi === undefined) { hi = lo; lo = 0; }
    return lo + this.next() * (hi - lo);
  };
  Rng.prototype.i = function (lo, hi) {
    if (hi === undefined) { hi = lo; lo = 0; }
    return Math.floor(this.f(lo, hi + 1));
  };
  Rng.prototype.pick = function (arr) { return arr[this.i(0, arr.length - 1)]; };
  Rng.prototype.chance = function (p) { return this.next() < p; };
  Rng.prototype.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = this.i(0, i);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  /** Normally distributed sample (Box–Muller). */
  Rng.prototype.gauss = function (mu, sigma) {
    var u = 1 - this.next(), v = this.next();
    return (mu || 0) + (sigma === undefined ? 1 : sigma) * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  NW.Rng = Rng;
})(window.NW);

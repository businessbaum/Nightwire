/* NIGHTWIRE — engine/clock.js — in-game night clock */
(function (NW) {
  'use strict';
  var U = NW.util;
  var timer = null;
  var MS_PER_GAME_MIN = 9000;   // one shift-minute every 9 real seconds

  function render() {
    var s = NW.state.s;
    var c = U.$('#tb-clock'), d = U.$('#tb-date');
    if (c) c.textContent = U.fmtTime(s.clock);
    if (d) d.textContent = U.fmtDate(s.date);
  }

  function advance(mins) {
    var s = NW.state.s;
    var before = s.clock;
    s.clock += mins;
    if (Math.floor(s.clock / 60) !== Math.floor(before / 60)) NW.bus.emit('hour', Math.floor(s.clock / 60) % 24);
    if (s.clock >= 1440) { s.clock -= 1440; s.date.d += 1; }
    render();
    NW.bus.emit('tick', s.clock);
  }

  function start() {
    if (timer) return;
    render();
    timer = setInterval(function () { advance(1); }, MS_PER_GAME_MIN);
  }
  function stop() { clearInterval(timer); timer = null; }

  /** Jump the clock forward — used between story beats. */
  function skip(mins) { advance(mins); }

  NW.clock = { start: start, stop: stop, advance: advance, skip: skip, render: render };
})(window.NW);

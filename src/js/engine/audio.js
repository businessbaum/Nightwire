/* NIGHTWIRE — engine/audio.js — all sound is synthesised at runtime */
(function (NW) {
  'use strict';

  var ctx = null, master = null, ambientGain = null, sfxGain = null, inputGain = null;
  var started = false;
  var ambientNodes = [];
  var noiseBuf = null;   // shared white noise; bursts play random slices of it
  var NOISE_SECS = 4;

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.55; sfxGain.connect(master);
    ambientGain = ctx.createGain(); ambientGain.gain.value = 0.0; ambientGain.connect(master);
    inputGain = ctx.createGain(); inputGain.gain.value = 0.7; inputGain.connect(master);
    noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * NOISE_SECS), ctx.sampleRate);
    var nd = noiseBuf.getChannelData(0);
    for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return ctx;
  }

  function resume() {
    ensure();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    started = true;
    // the gain nodes only exist now, so push the stored volumes again
    if (NW.crt && NW.crt.applySettings) NW.crt.applySettings();
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  /* ── primitives ─────────────────────────────── */

  function tone(o) {
    if (!ensure()) return;
    o = o || {};
    var t0 = now() + (o.delay || 0);
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(o.f || 440, t0);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), t0 + (o.dur || 0.1));
    var vol = (o.vol === undefined ? 0.2 : o.vol);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + (o.atk || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (o.dur || 0.1));
    var dest = o.dest || sfxGain;
    if (o.filter) {
      var bq = ctx.createBiquadFilter();
      bq.type = o.filter; bq.frequency.value = o.fc || 1200; bq.Q.value = o.q || 1;
      osc.connect(g); g.connect(bq); bq.connect(dest);
    } else { osc.connect(g); g.connect(dest); }
    osc.start(t0); osc.stop(t0 + (o.dur || 0.1) + 0.03);
  }

  function noise(o) {
    if (!ensure()) return;
    o = o || {};
    var dur = Math.min(o.dur || 0.1, NOISE_SECS - 0.1);
    var t0 = now() + (o.delay || 0);
    var src = ctx.createBufferSource(); src.buffer = noiseBuf;
    var bq = ctx.createBiquadFilter();
    bq.type = o.filter || 'bandpass'; bq.frequency.value = o.fc || 2000; bq.Q.value = o.q || 1;
    var g = ctx.createGain();
    var vol = (o.vol === undefined ? 0.14 : o.vol);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bq); bq.connect(g); g.connect(o.dest || sfxGain);
    src.start(t0, Math.random() * (NOISE_SECS - dur - 0.05));
    src.stop(t0 + dur + 0.02);
  }

  /** Play a mono Float32Array. opts: {vol, highpass, lowpass, offset, rate}.
      The handle can retune its filters and volume while playing. */
  var bufferCache = typeof WeakMap === 'function' ? new WeakMap() : null;
  function playBuffer(data, sampleRate, opts) {
    if (!ensure()) return null;
    opts = opts || {};
    var rate = sampleRate || ctx.sampleRate;
    var buf = bufferCache && bufferCache.get(data);
    if (!buf || buf.sampleRate !== rate) {
      buf = ctx.createBuffer(1, data.length, rate);
      buf.getChannelData(0).set(data);
      if (bufferCache) bufferCache.set(data, buf);
    }
    var src = ctx.createBufferSource(); src.buffer = buf;
    var g = ctx.createGain(); g.gain.value = opts.vol === undefined ? 0.8 : opts.vol;
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass';
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    function setFilter(h, l) {
      hp.frequency.value = h || 10;
      lp.frequency.value = l || ctx.sampleRate / 2;
    }
    setFilter(opts.highpass, opts.lowpass);
    src.connect(g); g.connect(hp); hp.connect(lp); lp.connect(sfxGain);
    src.playbackRate.value = opts.rate || 1;
    src.start(0, opts.offset || 0);
    return {
      src: src, gain: g,
      setFilter: setFilter,
      setVolume: function (v) { g.gain.value = v; },
      stop: function () { try { src.stop(); } catch (e) {} },
      onended: function (fn) { src.onended = fn; }
    };
  }

  /* ── UI sound library ────────────────────────── */

  var lib = {
    key:      function () { keyDown('x'); },
    type:     function () { noise({ dur: 0.014, fc: 3400, q: 5, vol: 0.03 }); },
    click:    function () { mouseDown(); },
    open:     function () { tone({ f: 420, f2: 900, dur: 0.09, vol: 0.11, type: 'square' }); },
    close:    function () { tone({ f: 900, f2: 320, dur: 0.08, vol: 0.09, type: 'square' }); },
    beep:     function () { tone({ f: 1046, dur: 0.07, vol: 0.13, type: 'square' }); },
    ok:       function () { tone({ f: 784, dur: 0.07, vol: 0.13 }); tone({ f: 1175, dur: 0.12, vol: 0.12, delay: 0.07 }); },
    good:     function () { [659, 880, 1319].forEach(function (f, i) { tone({ f: f, dur: 0.13, vol: 0.13, delay: i * 0.075, type: 'triangle' }); }); },
    bad:      function () { tone({ f: 220, f2: 110, dur: 0.28, vol: 0.16, type: 'sawtooth' }); noise({ dur: 0.2, fc: 300, vol: 0.08 }); },
    error:    function () { tone({ f: 165, dur: 0.1, vol: 0.16, type: 'square' }); tone({ f: 155, dur: 0.16, vol: 0.16, type: 'square', delay: 0.12 }); },
    alert:    function () { for (var i = 0; i < 3; i++) tone({ f: 1200, dur: 0.09, vol: 0.14, delay: i * 0.16, type: 'square' }); },
    msg:      function () { tone({ f: 1568, dur: 0.05, vol: 0.11 }); tone({ f: 2093, dur: 0.06, vol: 0.09, delay: 0.06 }); },
    disk:     function () { for (var i = 0; i < 5; i++) noise({ dur: 0.03, fc: 900 + Math.random() * 1400, q: 6, vol: 0.05, delay: i * 0.045 }); },
    print:    function () { for (var i = 0; i < 14; i++) noise({ dur: 0.02, fc: 1800, q: 4, vol: 0.04, delay: i * 0.038 }); },
    relay:    function () { noise({ dur: 0.05, fc: 700, q: 2, vol: 0.1 }); },
    scan:     function () { tone({ f: 300, f2: 2400, dur: 0.5, vol: 0.06, type: 'sine' }); },
    unlock:   function () { [392, 523, 659, 784].forEach(function (f, i) { tone({ f: f, dur: 0.18, vol: 0.1, delay: i * 0.06, type: 'triangle' }); }); },
    lock:     function () { tone({ f: 300, f2: 90, dur: 0.35, vol: 0.13, type: 'sawtooth' }); },
    dialtone: function () { tone({ f: 350, dur: 1.2, vol: 0.05, type: 'sine' }); tone({ f: 440, dur: 1.2, vol: 0.05, type: 'sine' }); },
    busy:     function () { for (var i = 0; i < 4; i++) { tone({ f: 480, dur: 0.35, vol: 0.06, type: 'sine', delay: i * 0.7 }); tone({ f: 620, dur: 0.35, vol: 0.06, type: 'sine', delay: i * 0.7 }); } },
    ring:     function () { for (var i = 0; i < 2; i++) { tone({ f: 440, dur: 1.6, vol: 0.05, type: 'sine', delay: i * 5.5 }); tone({ f: 480, dur: 1.6, vol: 0.05, type: 'sine', delay: i * 5.5 }); } },
    glitch:   function () { noise({ dur: 0.18, fc: 4000, q: 0.6, vol: 0.13, filter: 'highpass' }); tone({ f: 60, f2: 900, dur: 0.12, vol: 0.1, type: 'sawtooth' }); },
    thunk:    function () { tone({ f: 90, f2: 40, dur: 0.22, vol: 0.2, type: 'sine' }); },
    page:     function () { noise({ dur: 0.14, fc: 5200, q: 0.8, vol: 0.05, filter: 'highpass' }); },
    shutter:  function () { noise({ dur: 0.03, fc: 3000, q: 3, vol: 0.12 }); noise({ dur: 0.05, fc: 1200, q: 3, vol: 0.08, delay: 0.05 }); }
  };

  /* ══════════ KEYBOARD AND MOUSE ══════════
     A key press is a few stacked layers (switch click, keycap, plate ring,
     desk thock), detuned per press so fast typing does not sound looped. */

  var lastInput = 0;
  function rnd(a, b) { return a + Math.random() * (b - a); }

  var BIG = { ' ': 1, 'Enter': 1, 'Backspace': 1, 'Tab': 1, 'Shift': 1,
              'CapsLock': 1, 'Control': 1, 'Alt': 1, 'Spacebar': 1 };

  function keyDown(key) {
    if (!started || !ensure()) return;
    lastInput = Date.now();
    var big = BIG[key] ? 1 : 0;
    var space = (key === ' ' || key === 'Spacebar');
    var d = rnd(0.94, 1.08);                       // per-press detune

    // 1. switch transient — the actual click of the contact
    noise({ dur: 0.006, filter: 'highpass', fc: 3600 * d, vol: 0.085, dest: inputGain });
    // 2. keycap bottoming out on the plate
    noise({ dur: 0.030 + big * 0.008, filter: 'bandpass',
            fc: (big ? 1080 : 1520) * d, q: 1.7, vol: 0.070, dest: inputGain });
    // 3. plate resonance
    tone({ f: (big ? 1500 : 2150) * d, f2: (big ? 1000 : 1450) * d,
           dur: 0.024, vol: 0.030, type: 'triangle', dest: inputGain });
    // 4. the thock through the desk
    tone({ f: (big ? 150 : 195) * d, f2: (big ? 82 : 112) * d,
           dur: 0.048 + big * 0.02, vol: 0.048, type: 'sine', dest: inputGain });
    // 5. spacebar stabiliser rattle
    if (space) noise({ dur: 0.05, filter: 'bandpass', fc: 620, q: 1.1, vol: 0.045, delay: 0.008, dest: inputGain });
  }

  function keyUp(key) {
    if (!started || !ensure()) return;
    lastInput = Date.now();
    var d = rnd(0.95, 1.10);
    noise({ dur: 0.004, filter: 'highpass', fc: 5000 * d, vol: 0.042, dest: inputGain });
    noise({ dur: 0.015, filter: 'bandpass', fc: 2400 * d, q: 2.2, vol: 0.030, dest: inputGain });
    tone({ f: 260 * d, f2: 170 * d, dur: 0.020, vol: 0.018, type: 'sine', dest: inputGain });
  }

  function mouseDown() {
    if (!started || !ensure()) return;
    lastInput = Date.now();
    var d = rnd(0.96, 1.06);
    noise({ dur: 0.004, filter: 'highpass', fc: 4400 * d, vol: 0.080, dest: inputGain });
    noise({ dur: 0.019, filter: 'bandpass', fc: 2050 * d, q: 2.3, vol: 0.055, dest: inputGain });
    tone({ f: 880 * d, f2: 500 * d, dur: 0.016, vol: 0.026, type: 'square', dest: inputGain });
    tone({ f: 165 * d, f2: 105 * d, dur: 0.030, vol: 0.024, type: 'sine', dest: inputGain });
  }

  function mouseUp() {
    if (!started || !ensure()) return;
    lastInput = Date.now();
    var d = rnd(0.96, 1.08);
    noise({ dur: 0.003, filter: 'highpass', fc: 5400 * d, vol: 0.040, dest: inputGain });
    noise({ dur: 0.012, filter: 'bandpass', fc: 2900 * d, q: 2.5, vol: 0.028, dest: inputGain });
  }

  /** DTMF for the switchboard */
  var DTMF = { '1': [697, 1209], '2': [697, 1336], '3': [697, 1477], '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
               '7': [852, 1209], '8': [852, 1336], '9': [852, 1477], '*': [941, 1209], '0': [941, 1336], '#': [941, 1477] };
  function dtmf(key) {
    var p = DTMF[key]; if (!p) return;
    tone({ f: p[0], dur: 0.13, vol: 0.07, type: 'sine' });
    tone({ f: p[1], dur: 0.13, vol: 0.07, type: 'sine' });
  }

  /** Modem handshake — the 1998 signature. ~4.5s */
  function modem() {
    if (!ensure()) return;
    var seq = [
      { f: 2100, d: 0.55, v: 0.05 }, { f: 1100, d: 0.3, v: 0.05 },
      { f: 2250, d: 0.25, v: 0.045 }, { f: 1650, d: 0.4, v: 0.045 }
    ];
    var t = 0;
    seq.forEach(function (s) { tone({ f: s.f, dur: s.d, vol: s.v, type: 'sine', delay: t }); t += s.d; });
    // scramble burst
    for (var i = 0; i < 30; i++) {
      noise({ dur: 0.06, fc: 400 + Math.random() * 2600, q: 2.4, vol: 0.035, delay: t + i * 0.055 });
    }
    t += 30 * 0.055;
    tone({ f: 1800, dur: 0.5, vol: 0.03, type: 'sine', delay: t });
    return t + 0.6;
  }

  /** Radio squelch garble used when field agents transmit. */
  function garble(len) {
    len = len || 0.6;
    noise({ dur: 0.05, fc: 3000, q: 1, vol: 0.07, filter: 'highpass' });
    var n = Math.max(2, Math.floor(len / 0.09));
    for (var i = 0; i < n; i++) {
      tone({ f: 160 + Math.random() * 340, dur: 0.06, vol: 0.028, type: 'sawtooth', delay: 0.05 + i * 0.09, filter: 'bandpass', fc: 900, q: 1.4 });
    }
    noise({ dur: 0.06, fc: 2600, q: 1, vol: 0.05, filter: 'highpass', delay: 0.05 + n * 0.09 });
  }

  /* ── ambience: room hum + monitor whine ──────── */
  function startAmbient() {
    if (!ensure() || ambientNodes.length) return;
    function osc(f, type, vol, detune) {
      var o = ctx.createOscillator(); o.type = type; o.frequency.value = f;
      if (detune) o.detune.value = detune;
      var g = ctx.createGain(); g.gain.value = vol;
      o.connect(g); g.connect(ambientGain); o.start();
      ambientNodes.push(o);
      return o;
    }
    osc(60, 'sine', 0.32);          // mains hum
    osc(120, 'sine', 0.10);
    osc(15734, 'sine', 0.012);      // CRT flyback whine
    // ventilation
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 340;
    var g2 = ctx.createGain(); g2.gain.value = 0.30;
    s.connect(f); f.connect(g2); g2.connect(ambientGain); s.start();
    ambientNodes.push(s);
  }

  function setAmbient(v) { if (ambientGain) ambientGain.gain.setTargetAtTime(v, now(), 0.4); }
  function setSfx(v) { if (sfxGain) sfxGain.gain.setTargetAtTime(v, now(), 0.1); }
  function setMaster(v) { if (master) master.gain.setTargetAtTime(v, now(), 0.1); }
  function setInput(v) { if (inputGain) inputGain.gain.setTargetAtTime(v, now(), 0.05); }

  function play(name) {
    if (!started) return;
    // real key/mouse presses already click (see main.js); don't double them
    if ((name === 'key' || name === 'click') && Date.now() - lastInput < 90) return;
    var f = lib[name];
    if (f) { try { f(); } catch (e) {} }
  }

  NW.audio = {
    resume: resume, play: play, tone: tone, noise: noise, dtmf: dtmf, modem: modem,
    garble: garble, playBuffer: playBuffer, startAmbient: startAmbient,
    keyDown: keyDown, keyUp: keyUp, mouseDown: mouseDown, mouseUp: mouseUp,
    setAmbient: setAmbient, setSfx: setSfx, setMaster: setMaster, setInput: setInput,
    get ctx() { return ctx; },
    get rate() { return ctx ? ctx.sampleRate : 44100; }
  };
})(window.NW);

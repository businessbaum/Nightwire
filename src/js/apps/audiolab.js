/* NIGHTWIRE — apps/audiolab.js
   Tape analysis. Every exhibit is synthesised from a layer list, so the things
   hiding behind the voice really are down there in the spectrum. */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var RATE = 16000;
  var bufCache = {}, specCache = {};

  /* ══════════ synthesis ══════════ */

  function synth(clip) {
    if (bufCache[clip.id]) return bufCache[clip.id];
    var n = Math.floor(clip.dur * RATE);
    var out = new Float32Array(n);
    var r = new NW.Rng('au:' + clip.id);
    clip.layers.forEach(function (L, li) {
      var lr = new NW.Rng('au:' + clip.id + ':' + li);
      var tmp = new Float32Array(n);
      (SYNTH[L.type] || SYNTH.hum)(tmp, L, lr, clip);
      var v = L.vol === undefined ? 0.2 : L.vol;
      for (var i = 0; i < n; i++) out[i] += tmp[i] * v;
    });
    // soft clip
    for (var i = 0; i < n; i++) out[i] = Math.tanh(out[i] * 1.05) * 0.9;
    bufCache[clip.id] = out;
    return out;
  }

  function lp(buf, cut) {
    var a = Math.exp(-2 * Math.PI * cut / RATE), y = 0;
    for (var i = 0; i < buf.length; i++) { y = a * y + (1 - a) * buf[i]; buf[i] = y; }
  }
  function hp(buf, cut) {
    var a = Math.exp(-2 * Math.PI * cut / RATE), y = 0, prev = 0;
    for (var i = 0; i < buf.length; i++) { y = a * (y + buf[i] - prev); prev = buf[i]; buf[i] = y; }
  }

  var SYNTH = {
    hum: function (b, L) {
      for (var i = 0; i < b.length; i++) {
        var t = i / RATE;
        b[i] = Math.sin(2 * Math.PI * 60 * t) + 0.4 * Math.sin(2 * Math.PI * 120 * t) + 0.15 * Math.sin(2 * Math.PI * 180 * t);
      }
    },
    phoneline: function (b, L, r) {
      for (var i = 0; i < b.length; i++) b[i] = r.f(-1, 1);
      hp(b, 280); lp(b, 3200);
      for (var j = 0; j < b.length; j++) b[j] *= 0.6 + 0.4 * Math.sin(j / RATE * 0.7);
    },
    tapehiss: function (b, L, r) {
      for (var i = 0; i < b.length; i++) b[i] = r.f(-1, 1);
      hp(b, 900); lp(b, 6000);
      // wow & flutter rumble
      for (var j = 0; j < b.length; j++) {
        var t = j / RATE;
        b[j] = b[j] * 0.7 + 0.25 * Math.sin(2 * Math.PI * 42 * t + Math.sin(t * 3) * 2);
      }
    },
    wind: function (b, L, r) {
      for (var i = 0; i < b.length; i++) b[i] = r.f(-1, 1);
      lp(b, 380);
      for (var j = 0; j < b.length; j++) b[j] *= 0.5 + 0.5 * Math.sin(j / RATE * 0.4 + 1.2);
    },
    voice: function (b, L, r, clip) {
      var f0 = L.f0 || 120;
      (L.words || []).forEach(function (w) {
        var start = Math.floor(w[0] * RATE), len = Math.floor(w[1] * RATE);
        var syl = 0;
        for (var i = 0; i < len; i++) {
          var idx = start + i;
          if (idx >= b.length) break;
          var t = i / RATE;
          // syllable envelope ~4.5 Hz with jitter
          var env = Math.max(0, Math.sin(2 * Math.PI * 4.3 * t + Math.sin(t * 2.1) * 0.8));
          env = Math.pow(env, 0.6);
          var jitter = 1 + 0.06 * Math.sin(2 * Math.PI * 5.7 * t);
          var f = f0 * jitter;
          var s = 0;
          for (var h = 1; h <= 12; h++) {
            var amp = 1 / h;
            // rough formants at 600 / 1200 / 2500
            var fh = f * h;
            var fmt = Math.exp(-Math.pow((fh - 620) / 380, 2)) + 0.7 * Math.exp(-Math.pow((fh - 1250) / 460, 2)) +
                      0.45 * Math.exp(-Math.pow((fh - 2500) / 800, 2));
            s += Math.sin(2 * Math.PI * fh * t) * amp * fmt;
          }
          s += r.f(-1, 1) * 0.25 * Math.max(0, Math.sin(2 * Math.PI * 9 * t)); // fricatives
          // overall word envelope
          var we = Math.min(1, i / (RATE * 0.05)) * Math.min(1, (len - i) / (RATE * 0.08));
          b[idx] += s * env * we * 0.22;
          syl++;
        }
      });
      if (L.band) { hp(b, L.band[0]); lp(b, L.band[1]); }
    },
    siren: function (b, L) {
      var at = L.at || [1, 5];
      at.forEach(function (start) {
        var len = Math.floor(1.9 * RATE), s0 = Math.floor(start * RATE);
        for (var i = 0; i < len; i++) {
          var idx = s0 + i; if (idx >= b.length) break;
          var t = i / RATE;
          var env = Math.min(1, t / 0.35) * Math.min(1, (1.9 - t) / 0.5);
          var f = 380 + 40 * Math.sin(2 * Math.PI * 1.6 * t);
          b[idx] += (Math.sin(2 * Math.PI * f * (i / RATE)) + 0.4 * Math.sin(2 * Math.PI * f * 2 * (i / RATE))) * env;
        }
      });
    },
    crossing: function (b, L) {
      var period = Math.floor(RATE / 1.35);
      for (var s0 = 0; s0 < b.length; s0 += period) {
        for (var i = 0; i < RATE * 0.5; i++) {
          var idx = s0 + i; if (idx >= b.length) break;
          var t = i / RATE;
          var env = Math.exp(-t * 7);
          b[idx] += (Math.sin(2 * Math.PI * 860 * t) + 0.6 * Math.sin(2 * Math.PI * 1035 * t) +
                     0.3 * Math.sin(2 * Math.PI * 1720 * t)) * env;
        }
      }
    },
    machine: function (b, L) {
      for (var i = 0; i < b.length; i++) {
        var t = i / RATE;
        var beat = 0.55 + 0.45 * Math.sin(2 * Math.PI * 3.2 * t);
        b[i] = (Math.sin(2 * Math.PI * 110 * t) + 0.5 * Math.sin(2 * Math.PI * 220 * t) +
                0.25 * Math.sin(2 * Math.PI * 55 * t)) * beat;
      }
    },
    ferry: function (b, L) {
      var s0 = Math.floor((L.at ? L.at[0] : 4) * RATE), len = Math.floor(2.6 * RATE);
      for (var i = 0; i < len; i++) {
        var idx = s0 + i; if (idx >= b.length) break;
        var t = i / RATE;
        var env = Math.min(1, t / 0.6) * Math.min(1, (2.6 - t) / 0.9);
        b[idx] += (Math.sin(2 * Math.PI * 88 * t) + 0.7 * Math.sin(2 * Math.PI * 133 * t) +
                   0.3 * Math.sin(2 * Math.PI * 176 * t)) * env;
      }
    },
    chime: function (b, L) {
      var notes = [1046, 880, 659];
      var s0 = Math.floor((L.at ? L.at[0] : 3) * RATE);
      notes.forEach(function (f, k) {
        var off = s0 + Math.floor(k * 0.42 * RATE);
        for (var i = 0; i < RATE * 1.4; i++) {
          var idx = off + i; if (idx >= b.length) break;
          var t = i / RATE;
          var env = Math.exp(-t * 2.6);
          b[idx] += (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 2.76 * t)) * env;
        }
      });
    },
    rotor: function (b, L, r) {
      var a = L.at || [0, 99];
      var s0 = Math.floor(a[0] * RATE), s1 = Math.min(b.length, Math.floor(a[1] * RATE));
      var noise = new Float32Array(s1 - s0);
      for (var i = 0; i < noise.length; i++) noise[i] = r.f(-1, 1);
      var y = 0, aa = Math.exp(-2 * Math.PI * 260 / RATE);
      for (var j = 0; j < noise.length; j++) { y = aa * y + (1 - aa) * noise[j]; noise[j] = y; }
      for (var k = 0; k < noise.length; k++) {
        var t = k / RATE;
        var thump = Math.pow(Math.max(0, Math.sin(2 * Math.PI * 12 * t)), 3);
        var fade = Math.min(1, t / 1.2) * Math.min(1, (noise.length / RATE - t) / 1.5);
        b[s0 + k] += (noise[k] * 6 * thump + 0.4 * Math.sin(2 * Math.PI * 48 * t) * thump) * fade;
      }
    }
  };

  /* ══════════ FFT + spectrogram ══════════ */

  function fft(re, im) {
    var n = re.length, i, j = 0, k, m, t;
    for (i = 1; i < n; i++) {
      var bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (var len = 2; len <= n; len <<= 1) {
      var ang = -2 * Math.PI / len;
      var wr = Math.cos(ang), wi = Math.sin(ang);
      for (i = 0; i < n; i += len) {
        var cr = 1, ci = 0;
        for (k = 0; k < len / 2; k++) {
          var ur = re[i + k], ui = im[i + k];
          var vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
          var vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
          re[i + k] = ur + vr; im[i + k] = ui + vi;
          re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
          var ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
        }
      }
    }
  }

  var NFFT = 512, BINS = NFFT / 2, COLS = 480;
  function spectrogram(clip) {
    if (specCache[clip.id]) return specCache[clip.id];
    var buf = synth(clip);
    var hop = Math.max(1, Math.floor((buf.length - NFFT) / COLS));
    var data = [];
    var win = new Float32Array(NFFT);
    for (var w = 0; w < NFFT; w++) win[w] = 0.5 - 0.5 * Math.cos(2 * Math.PI * w / (NFFT - 1));
    for (var c = 0; c < COLS; c++) {
      var off = c * hop;
      var re = new Float32Array(NFFT), im = new Float32Array(NFFT);
      for (var i = 0; i < NFFT; i++) re[i] = (buf[off + i] || 0) * win[i];
      fft(re, im);
      var col = new Float32Array(BINS);
      for (var b = 0; b < BINS; b++) {
        col[b] = Math.sqrt(re[b] * re[b] + im[b] * im[b]);
      }
      data.push(col);
    }
    // normalise to the loudest bin in the clip so the dB floor is meaningful
    var peak = 1e-9;
    data.forEach(function (c) { for (var b = 0; b < BINS; b++) if (c[b] > peak) peak = c[b]; });
    data.peak = peak;
    specCache[clip.id] = data;
    return data;
  }

  /* ══════════ UI ══════════ */

  function build(body, win, arg) {
    var v = { clip: null, hpf: 20, lpf: 8000, gain: 1, playing: null, t0: 0, found: {}, wrong: {} };

    var tools = el('div.toolbar');
    var spec = el('div.al-spec');
    var specCv = NW.gfx.make(900, 260);
    var playhead = el('div.al-playhead', { style: { display: 'none' } });
    spec.appendChild(specCv); spec.appendChild(playhead);
    var wave = el('div.al-wave');
    var waveCv = NW.gfx.make(900, 62);
    wave.appendChild(waveCv);
    var filters = el('div.al-filters');
    var ident = el('div.al-ident');
    var trans = el('div', { class: 'scroll', style: { maxHeight: '112px', borderTop: '1px solid var(--phos-ghost)', background: '#0c0906' } });

    body.appendChild(el('div.app', null, [tools, spec, wave, filters, trans, ident]));

    function renderTools() {
      U.clear(tools);
      tools.appendChild(el('span.tb-title', { text: 'EXHIBIT' }));
      var list = NW.media.availableAudio();
      if (!list.length) tools.appendChild(el('span', { class: 'dim', text: 'NO TAPES HELD' }));
      list.forEach(function (c) {
        var b = el('button.btn', { text: c.title.split('—')[0].trim(), class: v.clip && v.clip.id === c.id ? 'on' : '', title: c.title });
        U.on(b, 'click', function () { load(c.id); });
        tools.appendChild(b);
      });
      var play = el('button.btn.good', { text: '▶ PLAY', style: { marginLeft: 'auto' } });
      U.on(play, 'click', playClip);
      var stop = el('button.btn', { text: '■ STOP' });
      U.on(stop, 'click', stopClip);
      tools.appendChild(play); tools.appendChild(stop);
    }

    function load(id) {
      var c = NW.media.clip(id);
      if (!c) return;
      stopClip();
      v.clip = c;
      v.found = S().flags['aufound_' + id] || {};
      v.wrong = {};
      NW.audio.play('relay');
      renderTools(); drawSpec(); drawWave(); renderIdent(); renderTranscript(-1);
    }

    function slider(label, key, min, max, step, fmt, log) {
      var val = el('span', { text: fmt(v[key]) });
      var inp = el('input', { type: 'range', min: min, max: max, step: step, value: log ? Math.log(v[key]) : v[key] });
      U.on(inp, 'input', function () {
        v[key] = log ? Math.exp(parseFloat(inp.value)) : parseFloat(inp.value);
        val.textContent = fmt(v[key]); drawSpec(); drawWave(); applyLive();
      });
      return el('div.slider-grp', { style: { minWidth: '150px' } }, [el('label', null, [el('span', { text: label }), val]), inp]);
    }

    filters.appendChild(slider('HIGH-PASS', 'hpf', Math.log(20), Math.log(4000), 0.02, function (x) { return Math.round(x) + ' Hz'; }, true));
    filters.appendChild(slider('LOW-PASS', 'lpf', Math.log(200), Math.log(8000), 0.02, function (x) { return Math.round(x) + ' Hz'; }, true));
    filters.appendChild(slider('GAIN', 'gain', 0.2, 6, 0.1, function (x) { return x.toFixed(1) + '×'; }));
    var presets = el('div', { style: { display: 'flex', gap: '6px', alignItems: 'flex-end', flexWrap: 'wrap' } });
    [['VOICE BAND', 300, 3400], ['BELOW THE VOICE', 20, 260], ['ABOVE THE VOICE', 700, 8000], ['FLAT', 20, 8000]].forEach(function (p) {
      var b = el('button.btn', { text: p[0] });
      U.on(b, 'click', function () {
        v.hpf = p[1]; v.lpf = p[2];
        U.$$('input[type=range]', filters)[0].value = Math.log(v.hpf);
        U.$$('input[type=range]', filters)[1].value = Math.log(v.lpf);
        U.$$('.slider-grp label span:last-child', filters)[0].textContent = p[1] + ' Hz';
        U.$$('.slider-grp label span:last-child', filters)[1].textContent = p[2] + ' Hz';
        NW.audio.play('click'); drawSpec(); drawWave(); applyLive();
      });
      presets.appendChild(b);
    });
    filters.appendChild(presets);

    function binGain(b) {
      var f = b / BINS * (RATE / 2);
      var g = 1;
      if (f < v.hpf) g *= Math.pow(f / Math.max(1, v.hpf), 3);
      if (f > v.lpf) g *= Math.pow(v.lpf / f, 3);
      return g;
    }

    function drawSpec() {
      var g = specCv.getContext('2d');
      g.fillStyle = '#050403'; g.fillRect(0, 0, specCv.width, specCv.height);
      if (!v.clip) {
        g.fillStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.4)'; g.font = '12px "Consolas",monospace'; g.textAlign = 'center';
        g.fillText('NO TAPE LOADED', specCv.width / 2, specCv.height / 2);
        return;
      }
      var data = spectrogram(v.clip);
      var W = specCv.width, H = specCv.height;
      var TINT = NW.theme.rgb();
      var img = g.createImageData(W, H);
      var d = img.data;
      var colW = W / data.length;
      var peak = data.peak || 1;
      var FLOOR = -56;                      // dB below the clip peak that reads as black
      for (var x = 0; x < W; x++) {
        var col = data[Math.min(data.length - 1, Math.floor(x / colW))];
        for (var y = 0; y < H; y++) {
          // log frequency axis
          var frac = 1 - y / H;
          var bin = Math.floor(Math.pow(frac, 2.1) * (BINS - 1));
          var mag = col[bin] * binGain(bin) * v.gain / peak;
          var db = 20 * Math.log10(mag + 1e-9);
          var val = (db - FLOOR) / (0 - FLOOR);
          val = val < 0 ? 0 : val > 1 ? 1 : val;
          val = Math.pow(val, 2.3);
          var o = (y * W + x) * 4;
          d[o] = val * TINT[0];
          d[o + 1] = Math.pow(val, 1.2) * TINT[1];
          d[o + 2] = Math.pow(val, 1.6) * TINT[2];
          d[o + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
      // frequency guides
      g.strokeStyle = 'rgba(' + TINT.join(',') + ',.16)'; g.fillStyle = 'rgba(' + TINT.join(',') + ',.5)';
      g.font = '8px "Consolas",monospace'; g.textAlign = 'left'; g.lineWidth = 1;
      [100, 300, 1000, 3000, 6000].forEach(function (f) {
        var frac = Math.pow(f / (RATE / 2), 1 / 2.1);
        var y = H - frac * H;
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
        g.fillText(f + ' Hz', 4, y - 3);
      });
    }

    function drawWave() {
      var g = waveCv.getContext('2d');
      g.fillStyle = '#080605'; g.fillRect(0, 0, waveCv.width, waveCv.height);
      if (!v.clip) return;
      var buf = synth(v.clip);
      var W = waveCv.width, H = waveCv.height;
      var step = Math.floor(buf.length / W);
      g.strokeStyle = 'rgba(' + NW.theme.rgb().join(',') + ',.85)'; g.lineWidth = 1;
      g.beginPath();
      for (var x = 0; x < W; x++) {
        var mn = 1, mx = -1;
        for (var i = 0; i < step; i++) {
          var s = buf[x * step + i] || 0;
          if (s < mn) mn = s; if (s > mx) mx = s;
        }
        g.moveTo(x + 0.5, H / 2 - mx * H / 2 * v.gain);
        g.lineTo(x + 0.5, H / 2 - mn * H / 2 * v.gain);
      }
      g.stroke();
    }

    function playClip() {
      if (!v.clip) return;
      stopClip();
      NW.audio.resume();
      var buf = synth(v.clip);
      v.playing = NW.audio.playBuffer(buf, RATE, { vol: 0.85 * Math.min(2, v.gain), highpass: v.hpf > 25 ? v.hpf : 0, lowpass: v.lpf < 7900 ? v.lpf : 0 });
      v.t0 = Date.now();
      playhead.style.display = 'block';
      tick();
    }
    function applyLive() {
      if (v.playing) { playClip(); }
    }
    function stopClip() {
      if (v.playing) { v.playing.stop(); v.playing = null; }
      playhead.style.display = 'none';
      renderTranscript(-1);
    }
    function tick() {
      if (!v.playing) return;
      var t = (Date.now() - v.t0) / 1000;
      if (t > v.clip.dur) { stopClip(); return; }
      playhead.style.left = (t / v.clip.dur * 100) + '%';
      renderTranscript(t);
      requestAnimationFrame(tick);
    }

    function renderTranscript(t) {
      U.clear(trans);
      if (!v.clip) return;
      var box = el('div.call-transcript', { style: { padding: '8px 12px' } });
      v.clip.transcript.forEach(function (line) {
        var active = t >= 0 && t >= line.t && t < line.t + 3.4;
        box.appendChild(el('div.ct-line', { style: { opacity: t < 0 ? 1 : (active ? 1 : 0.35) } }, [
          el('span.ct-spk', { text: (line.s || '···') + '  ' }),
          el('span', { style: { color: active ? 'var(--phos-hi)' : 'var(--phos)' }, text: line.l })
        ]));
      });
      trans.appendChild(box);
    }

    function renderIdent() {
      U.clear(ident);
      if (!v.clip) return;
      ident.appendChild(el('div', { class: 'dim', style: { fontSize: '9px', letterSpacing: '.2em', marginBottom: '5px' },
        text: 'BACKGROUND CONTENT — MARK EVERYTHING YOU CAN HEAR' }));
      var row = el('div');
      v.clip.options.forEach(function (o) {
        var cls = v.found[o.id] ? 'found' : v.wrong[o.id] ? 'wrong' : '';
        var b = el('span.ident-opt', { class: cls, text: (v.found[o.id] ? '✓ ' : '') + o.l });
        U.on(b, 'click', function () { markOption(o); });
        row.appendChild(b);
      });
      ident.appendChild(row);
      var need = v.clip.options.filter(function (o) { return o.ok; }).length;
      var got = Object.keys(v.found).length;
      ident.appendChild(el('div', { class: 'dim', style: { fontSize: '10px', marginTop: '6px' },
        text: got + ' / ' + need + ' identified' }));
    }

    function markOption(o) {
      if (v.found[o.id] || v.wrong[o.id]) return;
      if (o.ok) {
        v.found[o.id] = true;
        S().flags['aufound_' + v.clip.id] = v.found;
        NW.audio.play('ok');
        NW.state.addFact('AUDIO LAB', o.l + ' — ' + o.note);
        NW.notify.push({ head: 'ISOLATED', body: o.l, kind: 'good', ms: 4200 });
        renderIdent();
        var need = v.clip.options.filter(function (x) { return x.ok; }).length;
        if (Object.keys(v.found).length >= need) finish();
      } else {
        v.wrong[o.id] = true;
        NW.audio.play('bad');
        NW.notify.push({ head: 'NOT PRESENT', body: 'Nothing in that band supports it.', kind: 'bad', ms: 2200 });
        renderIdent();
      }
    }

    function finish() {
      var c = v.clip.conclusion;
      if (!c || S().flags['auconc_' + v.clip.id]) return;
      S().flags['auconc_' + v.clip.id] = true;
      if (c.evidence) NW.state.addEvidence(c.evidence);
      if (c.fact) NW.state.addFact('AUDIO LAB', c.fact);
      setTimeout(function () {
        NW.notify.overlay({
          title: 'ACOUSTIC RECONSTRUCTION', sub: v.clip.title,
          body: [U.esc(c.text)],
          buttons: [{ label: 'LOG IT', value: 1 }]
        });
      }, 500);
    }

    U.on(spec, 'click', function (e) {
      if (!v.clip) return;
      var r = spec.getBoundingClientRect();
      var t = (e.clientX - r.left) / r.width * v.clip.dur;
      stopClip();
      NW.audio.resume();
      v.playing = NW.audio.playBuffer(synth(v.clip), RATE, { vol: 0.85 * Math.min(2, v.gain), offset: t,
        highpass: v.hpf > 25 ? v.hpf : 0, lowpass: v.lpf < 7900 ? v.lpf : 0 });
      v.t0 = Date.now() - t * 1000;
      playhead.style.display = 'block';
      tick();
    });

    renderTools();
    var first = (arg && NW.media.clip(arg)) ? arg : (NW.media.availableAudio()[0] || {}).id;
    if (first) load(first); else { drawSpec(); }
  }

  NW.apps.define({
    id: 'audiolab', name: 'AUDIO LAB', short: 'AUDIO', icon: 'audiolab',
    hint: 'tape analysis and spectrogram',
    win: { w: 820, h: 660, min: [640, 520] },
    build: build,
    onClose: function () { return true; }
  });
})(window.NW);

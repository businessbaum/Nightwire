/* NIGHTWIRE — engine/director.js
   Story runtime. A chapter is a flat list of steps run in order (the main
   track). Triggers react to what the player finds and run on a side track
   while the main track waits on the player. */
(function (NW) {
  'use strict';
  var S = function () { return NW.state.s; };

  var scenes = {};
  var triggers = [];
  var running = false;     // main track is active
  var parked = false;      // main track is waiting on the player
  var starting = false;    // main track is about to (re)start
  var side = null;         // promise of the trigger currently running
  var abort = false;

  function scene(id, steps) { scenes[id] = steps; }
  function trigger(t) { triggers.push(t); }

  function sideIdle() { return side || Promise.resolve(); }

  /* One trigger at a time, and never while the main track is talking. */
  function evalTriggers() {
    if (side || starting || (running && !parked)) return;
    for (var i = 0; i < triggers.length; i++) {
      var t = triggers[i];
      var key = t.id || ('trg' + i);
      if (S().story.done[key]) continue;
      if (!NW.state.test(t.when)) continue;
      fire(t, key);
      return;
    }
  }

  function fire(t, key) {
    side = exec(t.steps.slice(), { name: key, side: true })
      .catch(function (e) { console.error('[director] trigger ' + key, e); })
      .then(function () {
        S().story.done[key] = true;   // stored in the save, so it never fires twice
        side = null;
        evalTriggers();
      });
  }

  ['flag', 'evidence', 'unlock', 'fact', 'request:close', 'wire:msg', 'tick'].forEach(function (ev) {
    NW.bus.on(ev, evalTriggers);
  });
  setInterval(evalTriggers, 1200);

  function start(id, fromIndex) {
    if (!scenes[id]) { console.warn('[director] unknown scene', id); return Promise.resolve(); }
    if (running || starting) return Promise.resolve();
    starting = true;
    return sideIdle().then(function () {
      starting = false;
      running = true;
      abort = false;
      return runScene(id, fromIndex || 0);
    }).catch(function (e) {
      console.error('[director]', e);
    }).then(function () {
      running = false;
      evalTriggers();
    });
  }

  /** Pick a restored shift back up where it left off. */
  function resume() {
    var r = S().story.running;
    if (S().flags.game_over) return false;
    if (!r || !r.scene || !scenes[r.scene]) return false;
    if (NW.wire && NW.wire.armDedupe) NW.wire.armDedupe();
    start(r.scene, r.i || 0);
    return true;
  }

  function waitFor(cond, timeoutMs) {
    return new Promise(function (resolve) {
      if (NW.state.test(cond)) return resolve(true);
      var offs = [];
      var to = null;
      function done(v) {
        offs.forEach(function (o) { o(); });
        clearInterval(iv); if (to) clearTimeout(to);
        resolve(v);
      }
      var iv = setInterval(function () { if (NW.state.test(cond)) done(true); }, 300);
      ['flag', 'evidence', 'unlock', 'request:close', 'fact'].forEach(function (ev) {
        offs.push(NW.bus.on(ev, function () { if (NW.state.test(cond)) done(true); }));
      });
      if (timeoutMs) to = setTimeout(function () { done(false); }, timeoutMs);
    });
  }

  /** Main track waits on the player: triggers may run, and finish before the story moves on. */
  function hold(p, opts) {
    if (opts.side) return p;
    parked = true;
    evalTriggers();
    return p.then(function (v) {
      parked = false;
      return sideIdle().then(function () { return v; });
    });
  }

  /* A scene checkpoints after each finished step, so a restored shift re-enters
     on the step it was parked on (the open question comes back). */
  function runScene(name, from) {
    var list = scenes[name];
    if (!list) return Promise.resolve();
    var i = from || 0;
    S().story.running = { scene: name, i: i };

    function next() {
      if (abort) return Promise.resolve();
      if (i >= list.length) { S().story.running = null; return Promise.resolve(); }
      var idx = i; i++;
      var step = list[idx];
      if (step.goto) return runScene(step.goto, 0);          // chapter hand-off
      return doStep(step, { name: name }).then(function (jump) {
        S().story.running = { scene: name, i: idx + 1 };
        if (jump && jump.steps) {
          return exec(jump.steps.slice(), { name: name }).then(function (g) {
            if (g && g.goto) return runScene(g.goto, 0);
            return next();
          });
        }
        return next();
      });
    }
    return next();
  }

  /** Loose list (branches, triggers). Resolves to {goto} if it hits one. */
  function exec(list, opts) {
    if (!list.length || abort) return Promise.resolve();
    var step = list.shift();
    if (step.goto) return Promise.resolve({ goto: step.goto });
    return doStep(step, opts).then(function (jump) {
      if (jump && jump.steps) return exec(jump.steps.concat(list), opts);
      return exec(list, opts);
    });
  }

  function doStep(step, opts) {
    var st = S();
    var U = NW.util;

    /* ── control ── */
    if (step.pause !== undefined) return U.wait(step.pause);
    if (step.wait) return hold(waitFor(step.wait, step.timeout), opts);
    if (step.waitEvidence) return hold(waitFor({ evidence: [].concat(step.waitEvidence) }), opts);
    if (step.waitFlag) return hold(waitFor(step.waitFlag), opts);
    if (step.if) {
      if (NW.state.test(step.if)) return Promise.resolve({ steps: step.then || [] });
      return Promise.resolve({ steps: step.else || [] });
    }
    if (step.do) { var r = step.do(st); return Promise.resolve(r && r.steps ? r : undefined); }

    /* ── state ── */
    if (step.flag) { NW.state.flag(step.flag, step.value === undefined ? true : step.value); return Promise.resolve(); }
    if (step.set) { Object.keys(step.set).forEach(function (k) { NW.state.flag(k, step.set[k]); }); return Promise.resolve(); }
    if (step.chapterNum !== undefined) { st.chapter = step.chapterNum; NW.bus.emit('chapter', st.chapter); return Promise.resolve(); }
    if (step.clock) { NW.clock.skip(step.clock); return Promise.resolve(); }

    /* ── unlocks ── */
    if (step.unlockApp) {
      [].concat(step.unlockApp).forEach(function (a) { NW.apps.unlock(a, { quiet: step.quiet }); });
      return U.wait(step.quiet ? 0 : 500);
    }
    if (step.unlockRecord) { [].concat(step.unlockRecord).forEach(function (i) { NW.state.unlock('records', i, true); }); return Promise.resolve(); }
    if (step.unlockDoc) { [].concat(step.unlockDoc).forEach(function (i) { NW.state.unlock('docs', i, true); }); return Promise.resolve(); }
    if (step.unlockContact) { [].concat(step.unlockContact).forEach(function (i) { NW.state.unlock('contacts', i, true); }); NW.bus.emit('wire:contacts'); return Promise.resolve(); }
    if (step.evidence) { [].concat(step.evidence).forEach(function (i) { NW.state.addEvidence(i, step.quiet); }); return Promise.resolve(); }
    if (step.fact) { NW.state.addFact(step.fact.c || 'CASE', step.fact.t || step.fact); return Promise.resolve(); }
    if (step.node) { if (NW.casebook) NW.casebook.addNode(step.node); return Promise.resolve(); }

    /* ── presentation ── */
    if (step.objective !== undefined) { NW.notify.objective(step.objective, step.objDone); st.flags.__objective = step.objective; return Promise.resolve(); }
    if (step.caseLabel !== undefined) { NW.notify.caseLabel(step.caseLabel, step.urgent); return Promise.resolve(); }
    if (step.ticker) { NW.notify.ticker(step.ticker); return Promise.resolve(); }
    if (step.toast) { NW.notify.push(step.toast); return U.wait(400); }
    if (step.sfx) { NW.audio.play(step.sfx); return Promise.resolve(); }
    if (step.glitch) { NW.notify.flash('desync'); return U.wait(500); }
    if (step.shake) { NW.notify.flash('shake'); return U.wait(500); }
    if (step.chapter) return NW.notify.chapterCard(step.chapter.num, step.chapter.title, step.chapter.desc);
    if (step.overlay) return NW.notify.overlay(step.overlay);
    if (step.openApp) { NW.apps.open(step.openApp, step.arg); return U.wait(step.delay || 300); }
    if (step.ending) return NW.endings.play(step.ending);

    /* ── wire ── */
    if (step.msg !== undefined || step.sys !== undefined || step.me !== undefined) return NW.wire.push(step);
    if (step.ask) return NW.wire.ask(step.ask);
    // a gate is one message the operator has to send before anything moves on
    if (step.gate) {
      return NW.wire.ask({
        prompt: step.gatePrompt || 'SEND WHEN YOU HAVE READ THE TRAFFIC',
        options: [{ label: step.gate }]
      });
    }
    if (step.request) {
      NW.request.open(step.request);
      if (!NW.win.isOpen('wire')) NW.apps.open('wire');
      NW.bus.emit('wire:request');
      if (step.awaitAnswer === false) return Promise.resolve();
      return hold(waitFor(function () { return !NW.request.current(); }), opts);
    }

    console.warn('[director] unhandled step', step);
    return Promise.resolve();
  }

  NW.director = {
    scene: scene, start: start, trigger: trigger, resume: resume,
    waitFor: waitFor, evalTriggers: evalTriggers,
    isRunning: function () { return running; },
    scenes: scenes
  };
})(window.NW);

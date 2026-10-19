/* NIGHTWIRE — engine/director.js
   The story runtime. Chapters are authored as flat arrays of steps; the
   director interprets them, and a set of always-on triggers reacts to what
   the player discovers on their own. */
(function (NW) {
  'use strict';
  var S = function () { return NW.state.s; };

  var scenes = {};
  var triggers = [];
  var running = false;
  var queue = [];
  var abort = false;

  function scene(id, steps) { scenes[id] = steps; }

  function trigger(t) { triggers.push(t); }

  function evalTriggers() {
    for (var i = 0; i < triggers.length; i++) {
      var t = triggers[i];
      var key = t.id || ('trg' + i);
      // guard on the saved map, not a runtime field — otherwise every trigger
      // fires again the moment a shift is restored
      if (S().story.done[key] && t.once !== false) continue;
      if (!NW.state.test(t.when)) continue;
      t._fired = true;
      S().story.done[key] = true;
      run(t.steps, { name: key });
      break;                                   // one at a time; the rest re-check later
    }
  }

  ['flag', 'evidence', 'unlock', 'fact', 'request:close', 'wire:msg', 'tick', 'story:step'].forEach(function (ev) {
    NW.bus.on(ev, function () { if (!running) evalTriggers(); });
  });
  setInterval(function () { if (!running) evalTriggers(); }, 1200);

  function start(id, fromIndex) {
    if (!scenes[id]) { console.warn('[director] unknown scene', id); return Promise.resolve(); }
    return run(null, { scene: id, index: fromIndex || 0 });
  }

  /** Pick a restored shift back up wherever the night left off. */
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

  /**
   * run(steps, opts)
   *   opts.scene  — run a registered scene, checkpointing progress as it goes
   *   otherwise   — run a loose list (triggers, branches); not checkpointed
   */
  function run(steps, opts) {
    opts = opts || {};
    if (running) { queue.push([steps, opts]); return Promise.resolve(); }
    running = true;
    abort = false;
    var p = opts.scene ? runScene(opts.scene, opts.index || 0) : exec(steps.slice(), opts);
    return p.then(function () {
      running = false;
      NW.bus.emit('story:step');
      var nxt = queue.shift();
      if (nxt) run(nxt[0], nxt[1]);
      else evalTriggers();
    }).catch(function (e) {
      console.error('[director]', e);
      running = false;
      var nxt2 = queue.shift();
      if (nxt2) run(nxt2[0], nxt2[1]);
    });
  }

  /**
   * A scene records how far it has got after every step it completes. The
   * checkpoint is only advanced once a step has actually finished, so a shift
   * restored while the terminal was parked on a wait, a request or a reply
   * re-enters on that same step and puts the question back on the screen.
   */
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

  /** Loose list — branches, triggers. Returns {goto} if it hits one. */
  function exec(list, opts) {
    if (!list.length || abort) return Promise.resolve();
    var step = list.shift();
    if (step.goto) return Promise.resolve({ goto: step.goto });
    return doStep(step, opts).then(function (jump) {
      if (jump && jump.steps) {
        return exec(jump.steps.concat(list), opts);
      }
      return exec(list, opts);
    });
  }

  function delayFor(step) {
    if (step.delay !== undefined) return step.delay;
    return 0;
  }

  function doStep(step, opts) {
    var st = S();
    var U = NW.util;

    /* ── pure control ── */
    if (step.pause !== undefined) return U.wait(step.pause);
    if (step.wait) return NW.director.waitFor(step.wait, step.timeout);
    if (step.waitEvidence) return NW.director.waitFor({ evidence: [].concat(step.waitEvidence) });
    if (step.waitFlag) return NW.director.waitFor(step.waitFlag);
    if (step.if) {
      if (NW.state.test(step.if)) return Promise.resolve({ steps: step.then || [] });
      return Promise.resolve({ steps: step.else || [] });
    }
    if (step.do) { var r = step.do(st); return Promise.resolve(r && r.steps ? r : undefined); }
    if (step.goto) return Promise.resolve({ steps: scenes[step.goto] || [] });

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
    if (step.node) { NW.casebook && NW.casebook.addNode(step.node); return Promise.resolve(); }

    /* ── presentation ── */
    if (step.objective !== undefined) { NW.notify.objective(step.objective, step.objDone); st.flags.__objective = step.objective; return Promise.resolve(); }
    if (step.caseLabel !== undefined) { NW.notify.caseLabel(step.caseLabel, step.urgent); return Promise.resolve(); }
    if (step.ticker) { NW.notify.ticker(step.ticker); return Promise.resolve(); }
    if (step.toast) { NW.notify.push(step.toast); return U.wait(400); }
    if (step.sfx) { NW.audio.play(step.sfx); return Promise.resolve(); }
    if (step.glitch) { NW.notify.flash('desync'); return U.wait(500); }
    if (step.shake) { NW.notify.flash('shake'); return U.wait(500); }
    if (step.chapter) {
      return NW.notify.chapterCard(step.chapter.num, step.chapter.title, step.chapter.desc);
    }
    if (step.overlay) { return NW.notify.overlay(step.overlay); }
    if (step.openApp) { NW.apps.open(step.openApp, step.arg); return U.wait(step.delay || 300); }
    if (step.ending) { return NW.endings.play(step.ending); }

    /* ── wire messages ── */
    if (step.msg !== undefined || step.sys !== undefined || step.me !== undefined) {
      return NW.wire.push(step);
    }
    if (step.ask) { return NW.wire.ask(step.ask); }
    /* A gate is a single message the operator has to actually send. Nothing
       moves on until they do — so the traffic above it can be read at whatever
       pace they like. */
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
      return NW.director.waitFor(function () { return !NW.request.current(); });
    }

    console.warn('[director] unhandled step', step);
    return Promise.resolve();
  }

  NW.director = {
    scene: scene, start: start, run: run, trigger: trigger, resume: resume,
    waitFor: waitFor, evalTriggers: evalTriggers,
    isRunning: function () { return running; },
    scenes: scenes
  };
})(window.NW);

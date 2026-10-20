/* NIGHTWIRE — engine/state.js — all game state, plus save/load and settings */
(function (NW) {
  'use strict';
  var U = NW.util;
  var KEY = 'nightwire.save.v1';
  var SETTINGS_KEY = 'nightwire.settings.v1';

  function fresh() {
    return {
      v: 1,
      createdAt: null,
      operator: { name: 'CALLOWAY, R.', badge: '4471', clearance: 1 },
      chapter: 0,
      clock: 22 * 60 + 41,            // 22:41
      date: { y: 1998, m: 11, d: 6 },
      flags: {},
      counters: {},
      evidence: {},                   // id -> true
      records: {},                    // record id -> unlocked
      docs: {},                       // doc id -> read
      contacts: {},                   // wire contact id -> unlocked
      threads: {},                    // contact id -> { msgs:[], unread:n }
      msgSeq: 0,                      // message ids, unique across restores
      apps: {},                       // app id -> unlocked
      board: { nodes: {}, links: [] },
      timelineSolved: {},
      notes: '',
      autoFacts: [],
      dialed: {},
      shellCwd: '/',
      shellHistory: [],
      story: { beat: {}, done: {}, running: null },
      stats: { correct: 0, wrong: 0, assists: 0, calls: 0, decrypts: 0, startedAt: null, playMs: 0 },
      choices: {},
      endingScore: {}
    };
  }

  function freshSettings() {
    return { theme: 'ice', scan: 0.22, noise: 0.0105, flicker: 0.5, curve: 1,
             textSpeed: 1, wireSpeed: 0.7,
             master: 0.9, sfx: 0.55, ambient: 0.5, keys: 0.7, autoOpen: true };
  }

  var S = fresh();
  var settings = freshSettings();
  var storageOK = true;
  try { window.localStorage.setItem('__nw', '1'); window.localStorage.removeItem('__nw'); }
  catch (e) { storageOK = false; }

  /* ── flags ─────────────────────────────────── */
  function flag(k, v) {
    if (v === undefined) return S.flags[k];
    var old = S.flags[k];
    S.flags[k] = v;
    if (old !== v) NW.bus.emit('flag', { key: k, value: v, old: old });
    return v;
  }
  function has(k) { return !!S.flags[k]; }
  function bump(k, by) { S.counters[k] = (S.counters[k] || 0) + (by === undefined ? 1 : by); return S.counters[k]; }
  function count(k) { return S.counters[k] || 0; }

  /* ── unlockables ───────────────────────────── */
  function unlock(kind, id, quiet) {
    var pool = S[kind];
    if (!pool || pool[id]) return false;
    pool[id] = true;
    NW.bus.emit('unlock', { kind: kind, id: id, quiet: !!quiet });
    return true;
  }
  function unlocked(kind, id) { return !!(S[kind] && S[kind][id]); }

  function addEvidence(id, quiet) {
    if (S.evidence[id]) return false;
    S.evidence[id] = true;
    NW.bus.emit('evidence', { id: id, quiet: !!quiet });
    return true;
  }
  function hasEvidence(id) { return !!S.evidence[id]; }

  function addFact(cat, text) {
    var exists = S.autoFacts.some(function (f) { return f.t === text; });
    if (exists) return;
    S.autoFacts.push({ c: cat, t: text, at: NW.util.fmtTime(S.clock) });
    NW.bus.emit('fact', { cat: cat, text: text });
  }

  /* ── condition evaluation ──────────────────── */
  /** cond can be: undefined (true) | function | string flag | array (all) | {all:[],any:[],not:[]} */
  function test(cond) {
    if (cond === undefined || cond === null) return true;
    if (typeof cond === 'function') return !!cond(S);
    if (typeof cond === 'string') return !!S.flags[cond];
    if (Array.isArray(cond)) return cond.every(test);
    if (typeof cond === 'object') {
      if (cond.all && !cond.all.every(test)) return false;
      if (cond.any && !cond.any.some(test)) return false;
      if (cond.not && cond.not.some(test)) return false;
      if (cond.chapter !== undefined && S.chapter !== cond.chapter) return false;
      if (cond.minChapter !== undefined && S.chapter < cond.minChapter) return false;
      if (cond.evidence && !cond.evidence.every(hasEvidence)) return false;
      return true;
    }
    return !!cond;
  }

  /* ── persistence ───────────────────────────── */
  /** Don't write a message to disk half-typed. */
  function settle() {
    Object.keys(S.threads).forEach(function (k) {
      (S.threads[k].msgs || []).forEach(function (m) {
        if (m.typing) { m.typing = false; }
        if (m._shown !== undefined) delete m._shown;
      });
    });
  }
  function serialize() { settle(); return JSON.stringify(S); }

  function save(slot) {
    S.savedAt = new Date().toISOString();
    if (!storageOK) return false;
    try {
      window.localStorage.setItem(KEY + (slot ? '.' + slot : ''), serialize());
      return true;
    } catch (e) { return false; }
  }

  /** Replace the state with a parsed save. Missing keys fall back to fresh values. */
  function restore(json) {
    try {
      var o = JSON.parse(json);
      if (!o || o.v !== 1) return false;
      S = Object.assign(fresh(), o);
      return true;
    } catch (e) { return false; }
  }

  function load(slot) {
    if (!storageOK) return false;
    try {
      var raw = window.localStorage.getItem(KEY + (slot ? '.' + slot : ''));
      return !!raw && restore(raw);
    } catch (e) { return false; }
  }

  function hasSave(slot) {
    if (!storageOK) return false;
    try { return !!window.localStorage.getItem(KEY + (slot ? '.' + slot : '')); } catch (e) { return false; }
  }

  function wipe() {
    if (storageOK) { try { window.localStorage.removeItem(KEY); } catch (e) {} }
    S = fresh();
  }

  function exportCode() { return U.encode(serialize()); }
  function importCode(code) {
    var json = U.decode(String(code).replace(/\s+/g, ''));
    return !!json && restore(json);
  }

  function saveSettings() {
    if (!storageOK) return;
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
  }
  function loadSettings() {
    if (!storageOK) return;
    try {
      var raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) settings = Object.assign(freshSettings(), JSON.parse(raw));
    } catch (e) {}
  }

  NW.state = {
    get s() { return S; },
    set s(v) { S = v; },
    settings: function () { return settings; },
    fresh: function () { S = fresh(); return S; },
    flag: flag, has: has, bump: bump, count: count,
    unlock: unlock, unlocked: unlocked,
    addEvidence: addEvidence, hasEvidence: hasEvidence, addFact: addFact,
    test: test,
    save: save, load: load, hasSave: hasSave, wipe: wipe,
    exportCode: exportCode, importCode: importCode,
    saveSettings: saveSettings, loadSettings: loadSettings,
    storageOK: function () { return storageOK; }
  };
})(window.NW);

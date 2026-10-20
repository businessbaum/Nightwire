/* NIGHTWIRE — main.js — hints, status bar, input, autosave and start-up */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  /* ══════════ ASSIST (contextual hints, three levels each) ══════════ */
  var HINTS = [
    { when: { not: ['certified'] }, q: 'What am I supposed to be doing?',
      a: ['Solt is running you through three certification queries on the WIRE. Open REGISTRY from the left rail and answer them.',
          'Query 1: search the vehicle index for RXP-206, open the keeper\'s record, read the disposition column — he failed to appear in January, so there is a bench warrant.',
          'Query 2: search the civil index for the Cannery Walk address, then follow her plate into the vehicle index. Query 3: Dowd has a record but no warrant — the answer is "no ground to detain".'] },

    { when: { all: ['ch1'], not: ['print_ident_quarry'] }, q: 'How do I work the fingerprint comparison?',
      a: ['Open DAKTYLO. The latent is on the left with numbered points; a candidate card is on the right with unnumbered ones.',
          'Click a numbered point on the latent, then the matching ridge feature on the candidate. Hover over any point to magnify the ridge pattern around it — that is how you tell which is which.',
          'Check the pattern class first (top right of each panel) — it eliminates half the cards before you touch a point. The quarry latent is an ARCH; two of the four candidates are not, and can be dismissed on sight. Of the remaining two, one is Elias Vance. Eight pairs is enough.'] },

    { when: { all: ['ch1'], not: ['find_fd_tracks'] }, q: 'The photograph looks like nothing.',
      a: ['It is deliberately under-contrast. In IMAGE LAB, push CONTRAST well past 1.5 and lift GAMMA.',
          'Then zoom in on the ground between the access road and the waterline, right of centre.',
          'Click directly on what you find. If the exposure is too low the terminal will tell you something is there but you cannot see it yet — push contrast to about 1.6 and click again.'] },

    { when: { all: ['ch2'], not: ['fs_reveal', 'voss_partition_open'] }, q: 'I cannot find anything in the shell.',
      a: ['DIR only lists visible entries. The volume has hidden ones.',
          'Try DIR /A. Or FIND VOSS.',
          'CD \\USR\\VOSS then TYPE INDEX.WRI. She left the passphrase rule in it.'] },

    { when: { all: ['ch2', 'fs_reveal'], not: ['voss_partition_open'] }, q: 'What is the passphrase?',
      a: ['"The road, and the year." Both halves are in Chapter One.',
          'The road is the one the 1987 car burned on. The year is the year it burned.',
          'MERCER87. Use DECRYPT .WIRE\\NOTES.ENC inside C:\\USR\\VOSS.'] },

    { when: { all: ['ch2'], not: ['auconc_au_911_87'] }, q: 'I cannot hear anything behind the voice.',
      a: ['In AUDIO LAB the background is 18 dB under the voice on purpose. Use the filter presets.',
          '"BELOW THE VOICE" (20–260 Hz) and "ABOVE THE VOICE" (700 Hz+) strip the speech out. Watch the spectrogram, not just your ears.',
          'There are two things on the 1987 tape: a two-blast siren low in the spectrum, and a repeating bell around 900 Hz. Mark BLASTING SIREN and RAILROAD CROSSING BELL.'] },

    { when: { all: ['ch2'], not: ['tl_1987_done'] }, q: 'The timeline keeps coming back wrong.',
      a: ['Two of the nine cards are false and belong in no slot at all. Read the source line under each card.',
          'The dispatch log time (22:52) is real; the police report time (23:10) is what Brennick was told to write. Both go on the timeline, in that order.',
          'Order: Fearn last seen 21:40 · car driven from the quarry 22:15 · fuse set 22:44 · call 22:52 · ignition 23:04 · Brennick records the alarm 23:10 · fire suppressed 23:31.'] },

    { when: { all: ['ch3'], not: ['triangulated_mill'] }, q: 'How does triangulation work?',
      a: ['In CARTOGRAPH, load the trace, press PLOT RANGES, then click the map where all three bands overlap.',
          'Each site gives you an annulus — a ring with a tolerance. The answer is the only point inside all three rings.',
          'It is the Marrow Street paper mill, west of centre on the map, on the Marrow Street road.'] },

    { when: { all: ['ch3'], not: ['ch3_exit_right', 'ch3_exit_wrong'] }, q: 'What should I know about the mill before they go in?',
      a: ['The night watchman, Marcus Trevino, has been calling that building in for two years. His number is in the sheriff\'s dispatch log.',
          'Dial 555-0277 in SWITCHBOARD and ask him about the light in the old office.',
          'The open bay is covered; use the chained side door. If the man runs, he goes down the fire escape on the north gable.'] },

    { when: { all: ['ch4'], not: ['ballistics_done'] }, q: 'The comparison microscope will not agree.',
      a: ['Mount each reference in turn and drag the STAGE TRAVERSE slider slowly. When the striae run unbroken across the centre seam you are on it.',
          'Three of the four references will never agree at any offset. One will.',
          'It is R-330. Traverse to roughly +170 µm.'] },

    { when: { all: ['ch4'], not: ['clearance2'] }, q: 'I cannot read the personnel files.',
      a: ['You need clearance 2. A Technician III can sponsor an uplift.',
          'Open SWITCHBOARD and call the lab.',
          'Dial 555-0244 (Pryce) and choose "Ask her to sponsor a clearance uplift".'] },

    { when: { all: ['ch5'], not: ['cy_book_done'] }, q: 'What do I do with the column of numbers?',
      a: ['Section 9.3 of the MANUAL describes it: page · line · word.',
          'The book is the manual itself — Copy 04, the one on this desk. Open CIPHER DESK and choose the REFERENCE method.',
          'Load the NIGHTWIRE RELAY intercept in CIPHER DESK; the triples resolve automatically. Then press ACCEPT PLAINTEXT.'] },

    { when: { all: ['ch5'], not: ['ev_grieve_power'] }, q: 'How do I find who holds Grieve Hill?',
      a: ['County records keeps corporate filings and leases, and the deputy clerk answers the phone after hours.',
          'Dial 555-0122 in SWITCHBOARD.',
          'Ask for the Alden Civic Holdings filings first, then the Grieve Hill lease. Then ask who Bellamy is.'] },

    { when: { minChapter: 5, not: ['guided_well', 'guided_slow', 'guided_wait'] }, q: 'Where in Grieve Hill is ward seventeen?',
      a: ['The lease for Grieve Hill describes the buildings, and only one of them has power.',
          'Get the Grieve Hill lease abstract into the ARCHIVE — Patrice Moss at county records (555-0122) has it, and so does the 1994 reel in MICROFILM.',
          'Wards 11 to 18 are on the first floor of the north wing of Building B. Follow the lit windows.'] },

    { when: { minChapter: 1 }, q: 'How do I answer a request from the field?',
      a: ['An open request appears at the bottom of the WIRE window with empty slots.',
          'Find the right record in REGISTRY or ARCHIVE and press the ▸ TRANSMIT button on it. It drops into the matching slot.',
          'Fill every slot, then press ▶ TRANSMIT REPORT. A rejected report costs nothing but your reputation with the field.'] },

    { when: { minChapter: 1 }, q: 'What is the casebook for?',
      a: ['Evidence pins itself to the board as you find it. Click one card, then another, to run string between them.',
          'The panel on the right lists the working theories. Each resolves when the right cards are joined.',
          'Wrong string costs nothing — right-click a string to cut it. If a theory will not resolve, read its one-line description again; it tells you exactly which two ideas to connect.'] },

    { when: { minChapter: 2 }, q: 'Am I missing anything optional?',
      a: ['Almost certainly. Try an empty query in every REGISTRY index and read everybody.',
          'Every telephone number in the game is dialable. Records, documents and evidence all print numbers.',
          'Brennick, Sikes, Trevino, Pemberton, Moss, Abaroa, Adair, Osterholt, Pryce, Solt, Bellamy and Finn will all talk to you, and several of them only open up once you already hold a specific document.'] }
  ];

  function openAssist() {
    var applicable = HINTS.filter(function (h) { return NW.state.test(h.when); });
    if (!applicable.length) applicable = [HINTS[HINTS.length - 1]];

    NW.win.open({
      id: 'assist', title: 'ANALYTICAL ASSISTANCE', w: 620, h: 460,
      build: function (bodyEl) {
        var head = el('div', { class: 'pad dim', style: { fontSize: '11px', borderBottom: '1px solid var(--phos-ghost)', lineHeight: '1.7' },
          html: 'The night desk supervisor will answer a question, but each answer is logged.<br>Start with the first line. Only take the next one if you are actually stuck.' });
        bodyEl.appendChild(head);
        var list = el('div.scroll');
        applicable.forEach(function (h) {
          var item = el('div.assist-item');
          item.appendChild(el('div.ai-q', { text: '? ' + h.q }));
          var ans = el('div', { style: { display: 'none' } });
          var lvl = 0;
          var btns = el('div.assist-lvl');
          var more = el('button.btn', { text: 'ASK' });
          U.on(more, 'click', function () {
            if (lvl >= h.a.length) return;
            ans.appendChild(el('div.ai-a', { style: { marginBottom: '6px' }, text: h.a[lvl] }));
            ans.style.display = 'block';
            lvl++;
            S().stats.assists++;
            NW.audio.play('beep');
            more.textContent = lvl >= h.a.length ? 'NOTHING FURTHER' : 'PRESS ME HARDER';
            if (lvl >= h.a.length) more.disabled = true;
          });
          btns.appendChild(more);
          item.appendChild(ans);
          item.appendChild(btns);
          list.appendChild(item);
        });
        bodyEl.appendChild(list);
      }
    });
  }

  /* ══════════ status bar ══════════ */
  function wireStatus() {
    U.on(U.$('#sb-hint'), 'click', openAssist);
    U.on(U.$('#sb-save'), 'click', function () {
      var btn = U.$('#sb-save');
      if (NW.state.save()) {
        NW.notify.push({ head: 'SAVED', body: 'Shift written to local store.', kind: 'good' });
        btn.classList.add('flash');
        setTimeout(function () { btn.classList.remove('flash'); }, 1500);
      } else {
        NW.notify.push({ head: 'SAVE FAILED', body: 'Open CONFIG and use the shift code.', kind: 'bad' });
      }
    });
    setInterval(function () {
      var m = U.$('#sb-mem');
      if (m) m.textContent = 'MEM ' + (512 + Object.keys(S().evidence).length * 17 + Object.keys(S().docs).length * 9) + 'K';
    }, 4000);
  }

  /* disk LED flickers on activity */
  ['evidence', 'unlock', 'doc:read', 'registry:open', 'wire:msg'].forEach(function (ev) {
    NW.bus.on(ev, function () {
      var l = U.$('#tb-hdd');
      if (!l) return;
      l.classList.add('act');
      setTimeout(function () { l.classList.remove('act'); }, 260);
    });
  });

  /* autosave: at each chapter, every 45 s, and when the tab is hidden or closed.
     The timed saves skip chapter 0, so the blank state behind the resume
     prompt can never overwrite a real save. */
  function autosave() { if (S().chapter > 0 && !S().flags.game_over) NW.state.save(); }
  NW.bus.on('chapter', function () { NW.state.save(); });
  setInterval(autosave, 45000);
  window.addEventListener('pagehide', autosave);
  document.addEventListener('visibilitychange', function () { if (document.hidden) autosave(); });

  /* every key and mouse button clicks; capture phase so focus doesn't matter */
  document.addEventListener('keydown', function (e) {
    if (e.repeat) return;
    NW.audio.keyDown(e.key);
  }, true);
  document.addEventListener('keyup', function (e) { NW.audio.keyUp(e.key); }, true);
  document.addEventListener('mousedown', function () { NW.audio.mouseDown(); }, true);
  document.addEventListener('mouseup', function () { NW.audio.mouseUp(); }, true);

  /* keyboard: F1 help, Escape closes the front window, other keys go to the front program */
  document.addEventListener('keydown', function (e) {
    if (NW.notify.overlayOpen()) return;
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'F1') { e.preventDefault(); openAssist(); return; }
    var f = NW.win.focused();
    if (!f) return;
    if (e.key === 'Escape') { NW.win.close(f.id); return; }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (f.app && f.app.onKey && f.app.onKey(e, f)) e.preventDefault();
  });

  /* ══════════ start ══════════ */
  function init() {
    NW.state.loadSettings();
    NW.win.init();
    NW.crt.init();
    NW.apps.renderRail();
    wireStatus();

    // a shift is saved: offer to resume it
    if (NW.state.hasSave()) {
      var layer = U.$('#boot-layer');
      layer.classList.remove('hidden');
      U.clear(layer);
      var box = el('div.login-box', null, [
        el('h1', { text: 'SHIFT IN PROGRESS' }),
        el('div.sub', { text: 'A SESSION IS OPEN ON THIS TERMINAL' }),
        el('div', { class: 'login-note', style: { marginTop: '0' }, html: 'The terminal was not signed off cleanly.<br>Resume it, or start the night again.' }),
        el('div', { style: { display: 'flex', gap: '10px', marginTop: '26px', justifyContent: 'center' } }, [
          (function () {
            var b = el('button.ov-btn', { text: 'RESUME SHIFT' });
            U.on(b, 'click', function () {
              NW.audio.resume();
              if (NW.state.load()) { NW.boot.resume(); }
              else NW.boot.start();
            });
            return b;
          })(),
          (function () {
            var b = el('button.ov-btn', { text: 'START OVER' });
            U.on(b, 'click', function () { NW.state.wipe(); NW.boot.start(); });
            return b;
          })()
        ])
      ]);
      layer.appendChild(box);
    } else {
      NW.boot.start();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  NW.assist = openAssist;
})(window.NW);

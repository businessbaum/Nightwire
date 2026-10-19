/* NIGHTWIRE — apps/manual.js
   The NCIB Analysis Operator Manual, 4th edition. It is both the tutorial and
   the key text for the reference cipher in Chapter Five, so its pagination is
   load-bearing: do not renumber the pages. */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;

  /* Each page is an array of lines. Line 1 is the first line of body text. */
  var BOOK = [
    { p: 1, title: 'SECTION 1 — THE DESK', lines: [
      'You are an analysis operator. You do not carry a weapon and you',
      'do not make arrests. You sit at a terminal in a building on a',
      'hill above the harbour and you answer questions.',
      'The questions arrive from people standing in the dark.',
      'An operator who is wrong is worse than an operator who is slow.',
      'Say so when you do not know. Nobody has ever been shot because',
      'an operator said "stand by".'
    ] },
    { p: 2, title: 'SECTION 2 — THE WIRE', lines: [
      'Traffic arrives on the wire. Answer on the wire.',
      'A field agent is holding a handset in one hand and a torch in',
      'the other. Write short. Write plainly. Give the answer first',
      'and the reasoning second, if at all.',
      'Where a formal request is opened against your terminal, you',
      'must complete every field before transmitting the report.',
      'Attach records by transmitting them from the index.'
    ] },
    { p: 3, title: 'SECTION 3 — THE INDICES', lines: [
      'The criminal index holds persons with a disposition of record.',
      'The civil index holds persons known to the Bureau who have none.',
      'The personnel index holds our own people and is clearance two.',
      'The vehicle index is keyed on plate and on vehicle number.',
      'An empty query returns the whole index. This is deliberate.',
      'Read the whole index at least once. You will remember a name',
      'four hours later and be very glad that you did.'
    ] },
    { p: 4, title: 'SECTION 4 — RIDGE COMPARISON', lines: [
      'A latent print is compared to a candidate by pairing features.',
      'Pair a numbered feature on the latent with the corresponding',
      'feature on the candidate card. Eight consistent pairs support',
      'an identification. Twelve is a comfortable identification.',
      'Fewer than six is not an opinion, it is a wish.',
      'If the pairs will not go together, the answer is exclusion,',
      'and exclusion is a real and useful answer.'
    ] },
    { p: 5, title: 'SECTION 5 — IMAGE ENHANCEMENT', lines: [
      'A photograph holds more than the eye takes from it.',
      'Increase contrast until the shadows separate. Increase gamma',
      'until the mid tones lift. Then look at the corners, the glass,',
      'the ground, and anything reflective.',
      'Detail that survives enhancement is evidence.',
      'Detail that appears only at extreme settings is an artefact,',
      'and an artefact has hanged an innocent man before now.'
    ] },
    { p: 6, title: 'SECTION 6 — AUDIO', lines: [
      'A recording of a voice is also a recording of a room.',
      'Filter away the voice and listen to what is left behind it.',
      'A bell, a horn, a siren, a machine — each of these has a place',
      'and a timetable, and between them they will draw you a map.',
      'The spectrogram shows what the ear will not.',
      'Work downward from four thousand cycles and then upward from',
      'forty, and meet in the middle.'
    ] },
    { p: 7, title: 'SECTION 7 — THE MAP', lines: [
      'A cellular handset reports to three sites at once.',
      'Signal strength gives distance. Three distances give a point.',
      'The point is not exact. It is a circle with a building in it.',
      'A hill will lie to you. Water will lie to you more.',
      'Where the county is empty, one site may be all you have, and',
      'one site gives you a ring, not a place. Say so.'
    ] },
    { p: 8, title: 'SECTION 8 — RECORDS OF OUR OWN', lines: [
      'Personnel records are held to the same standard as any other.',
      'An operator who cannot read the file of a colleague cannot',
      'check the work of a colleague.',
      'A signature is a fact. Compare it as you would compare a print.',
      'Four documents in four years bearing one hand is a pattern,',
      'and a pattern is not a coincidence, whatever the hand says.'
    ] },
    { p: 9, title: 'SECTION 9 — SECURE CORRESPONDENCE', lines: [
      'The wire is not secure. Assume every word is read.',
      'A polyalphabetic cipher with a short key will not survive a',
      'frequency count. Assume it is broken before you send it.',
      'The reference cipher is stronger. Express the message as a',
      'series of triples: page, then line, then word.',
      'The recipient reads the words in order and needs only the book.',
      'Choose a book that both of you hold and nobody else considers.'
    ] },
    { p: 10, title: 'SECTION 10 — THE BUILDING', lines: [
      'The regional building has four floors and two sub-levels.',
      'Sub-level two is records, the night watch and this terminal.',
      'The fourth floor is the office of the Deputy Chief.',
      'A service exit on sub-level two opens without a badge from the',
      'inside. Facilities have been asked about this seventeen times.',
      'The building is old. Grieve Hill is older, and the state left',
      'it standing on the ridge because nobody wanted to pay to fall',
      'it down. You can see it from the fourth floor.'
    ] },
    { p: 11, title: 'SECTION 11 — WARD ROUNDS AND OTHER HABITS', lines: [
      'The night desk keeps a ward round: every open case is touched',
      'once a shift whether or not anything has moved.',
      'A case nobody touches is a case that quietly stops existing.',
      'Touch the cold ones first. They are the ones with somebody',
      'still alive at the end of them, waiting.',
      'Seventeen open cases is a normal night. Eleven is a good one.',
      'She is out there. Whoever your she is, she is out there.'
    ] },
    { p: 12, title: 'SECTION 12 — CONDUCT', lines: [
      'You will be asked to stop working on something.',
      'Sometimes that is resource management and sometimes it is not,',
      'and you will not be told which.',
      'Write down what you were asked, by whom, and at what time.',
      'Keep the note outside the building.',
      'The Bureau does not grieve its mistakes in public and it will',
      'not grieve yours. Grieve them yourself, on your own time, and',
      'then come back in and do the next one properly.'
    ] }
  ];

  /* ── reference cipher helpers ── */
  function words(line) {
    return line.split(/\s+/)
      .map(function (w) { return w.replace(/[^A-Za-z]/g, ''); })
      .filter(function (w) { return w.length; });
  }

  /** Find (page,line,word) for a word. */
  function locate(word) {
    word = word.toUpperCase();
    for (var i = 0; i < BOOK.length; i++) {
      for (var l = 0; l < BOOK[i].lines.length; l++) {
        var ws = words(BOOK[i].lines[l]);
        for (var w = 0; w < ws.length; w++) {
          if (ws[w].toUpperCase() === word) return [BOOK[i].p, l + 1, w + 1];
        }
      }
    }
    return null;
  }

  function encodeBook(message) {
    return String(message).split(/\s+/).map(function (w) {
      var t = locate(w);
      if (!t) { console.warn('[manual] word not in book:', w); return '??.??.??'; }
      return U.pad(t[0]) + '.' + U.pad(t[1]) + '.' + U.pad(t[2]);
    });
  }

  function decodeTriple(p, l, w) {
    var page = BOOK.filter(function (b) { return b.p === p; })[0];
    if (!page) return null;
    var line = page.lines[l - 1];
    if (!line) return null;
    var ws = words(line);
    return ws[w - 1] || null;
  }

  /* The Chapter 5 message. Every word below appears in the manual above. */
  var SECRET = 'GRIEVE HILL WARD SEVENTEEN SHE IS ALIVE';

  function build(body) {
    var tools = el('div.toolbar');
    var nav = el('div.sidebar.scroll');
    var pane = el('div.grow.scroll');
    tools.appendChild(el('span.tb-title', { text: 'NCIB ANALYSIS OPERATOR MANUAL · 4TH EDITION · COPY 04' }));
    body.appendChild(el('div.app', null, [tools, el('div.app-row', null, [nav, pane])]));

    function show(p) {
      var page = BOOK.filter(function (b) { return b.p === p; })[0];
      U.clear(pane);
      NW.audio.play('page');
      var box = el('div.man-body');
      box.appendChild(el('h3', { text: page.title }));
      var pre = el('div', { style: { fontSize: '12.5px', lineHeight: '2.0' } });
      page.lines.forEach(function (line, i) {
        pre.appendChild(el('div', { style: { display: 'flex', gap: '14px' } }, [
          el('span', { class: 'dim', style: { width: '20px', textAlign: 'right', flex: 'none', fontSize: '10px' }, text: (i + 1) }),
          el('span', { text: line })
        ]));
      });
      box.appendChild(pre);
      box.appendChild(el('div.hr'));
      box.appendChild(el('div', { class: 'dim', style: { fontSize: '10px', letterSpacing: '.2em' }, text: 'PAGE ' + U.pad(p) + ' OF ' + U.pad(BOOK.length) }));
      if (p === 1) {
        box.appendChild(el('div', { style: { marginTop: '20px', borderTop: '1px solid var(--phos-ghost)', paddingTop: '12px' } }, [
          el('div', { class: 'dim', style: { fontSize: '9px', letterSpacing: '.2em' }, text: 'INSIDE COVER — INK, TWO HANDS' }),
          el('div', { class: 'handwrite', style: { color: 'var(--phos-hi)', fontSize: '15px', marginTop: '6px' },
            text: '“Copy 04 lives at Terminal 04 and does not leave it.” — G.S. 1991' }),
          el('div', { class: 'handwrite', style: { color: 'var(--violet)', fontSize: '15px', marginTop: '4px' },
            text: '“Page · line · word. You already have the book. — M.V.”' })
        ]));
      }
      pane.appendChild(box);
      renderNav(p);
    }

    /* The practical notes are not part of the book — they are the cards each
       program shows on its first opening, kept here so they can be re-read. */
    var TUT_ORDER = ['wire', 'registry', 'archive', 'daktylo', 'imagelab', 'audiolab',
                     'cartograph', 'cipher', 'casebook', 'timeline', 'switchboard',
                     'shell', 'microfilm', 'ballistics', 'notepad', 'settings'];

    function showTut(id) {
      var c = NW.tutorial && NW.tutorial.cards[id];
      if (!c) return;
      U.clear(pane);
      NW.audio.play('page');
      var box = el('div.man-body');
      box.appendChild(el('h3', { text: c.title + ' — ' + c.sub }));
      c.body.forEach(function (line) { box.appendChild(el('p', { html: line })); });
      box.appendChild(el('div.hr'));
      var open = el('button.btn', { text: '▸ OPEN ' + c.title });
      U.on(open, 'click', function () { NW.apps.open(id); });
      box.appendChild(open);
      pane.appendChild(box);
      renderNav(null, id);
    }

    function renderNav(cur, tutCur) {
      U.clear(nav);
      nav.appendChild(el('div.sec-h', { text: 'HOW TO WORK THIS DESK' }));
      TUT_ORDER.forEach(function (id) {
        var c = NW.tutorial && NW.tutorial.cards[id];
        if (!c) return;
        var row = el('div.lrow', { class: tutCur === id ? 'sel' : '' }, [
          el('div.lr-t', { text: c.title }),
          el('div.lr-s', { text: c.sub })
        ]);
        U.on(row, 'click', function () { showTut(id); });
        nav.appendChild(row);
      });
      nav.appendChild(el('div.sec-h', { text: 'THE MANUAL ITSELF' }));
      BOOK.forEach(function (b) {
        var row = el('div.lrow', { class: b.p === cur ? 'sel' : '' }, [
          el('div.lr-t', { text: b.title.replace('SECTION ', '§') }),
          el('div.lr-s', { text: 'PAGE ' + U.pad(b.p) })
        ]);
        U.on(row, 'click', function () { show(b.p); });
        nav.appendChild(row);
      });
    }

    showTut('wire');
  }

  NW.apps.define({
    id: 'manual', name: 'MANUAL', short: 'MANUAL', icon: 'manual', always: true,
    hint: 'operator manual — and one other thing',
    win: { w: 700, h: 500, min: [520, 340] },
    build: build
  });

  NW.manual = { BOOK: BOOK, encodeBook: encodeBook, decodeTriple: decodeTriple, locate: locate, SECRET: SECRET };
})(window.NW);

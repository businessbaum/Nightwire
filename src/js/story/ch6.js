/* NIGHTWIRE — story/ch6.js — NIGHTWIRE */
(function (NW) {
  'use strict';
  var D = NW.director;

  function heldEvidence() {
    return NW.evidence.held().map(function (id) {
      return { v: id, l: NW.evidence.def(id).t };
    }).sort(function (a, b) { return a.l < b.l ? -1 : 1; });
  }

  D.scene('ch6', [
    { chapterNum: 6 },
    { flag: 'ch6' },
    { gate: "He's purging the index. We go now or we don't go." },
    { chapter: { num: 'CHAPTER SIX', title: 'NIGHTWIRE',
      desc: 'SATURDAY 7 NOVEMBER · 04:09<br>THE SAME HOUR OF THE SAME NIGHT SHE HAD<br>ONE OF YOU IS GOING TO FINISH IT' } },
    { caseLabel: '⚠ RECORDS PURGE IN PROGRESS — 4TH FLOOR', urgent: true },
    { clock: 11 },

    { sfx: 'alert' },
    { msg: 'solt', cls: 'alert', text: "He's running a retention purge against the case index. From his own terminal. At four in the morning." },
    { toast: { head: 'RECORD DELETED', body: 'VC 87-4410 — CORONER FINDING', kind: 'bad' } },
    { pause: 900 },
    { toast: { head: 'RECORD DELETED', body: 'WS-4-0119 — PROGRAM ENTRY', kind: 'bad' } },
    { ticker: 'RETENTION PURGE — 4TH FLOOR TERMINAL 01 — 214 RECORDS QUEUED' },
    { pause: 900 },
    { msg: 'solt', cls: 'alert', text: "Whatever you've got on that screen, it is the last copy in this building in about six minutes." },
    { ask: { prompt: 'RESPONSE WINDOW', timer: 25, options: [
      { label: "Print everything. Paper doesn't purge.", reply: "Graham — print everything. All of it. Paper doesn't purge.",
        flag: 'printed_all',
        steps: [
          { sfx: 'print' },
          { msg: 'solt', text: "Line printer's already going. It's going to take twenty minutes and make a noise like the end of the world and I do not care." },
          { toast: { head: 'PRINT QUEUE', body: '2,204 pages — SUB-LEVEL 2', kind: 'good' } }
        ] },
      { label: "Get a copy out of the building. Now.", reply: "Get a copy out of the building. Anyone. Now.",
        flag: 'copy_out',
        steps: [
          { msg: 'solt', text: "The Medical Examiner is nine minutes away and she is already awake." },
          { msg: 'solt', text: "Going." }
        ] },
      { label: "Let it run. What's gone is gone — I have the ledger.", reply: "Let it run. He can't purge a ledger in a locker.",
        flag: 'let_purge',
        steps: [
          { msg: 'solt', text: "..." },
          { msg: 'solt', text: "That is either very cool or very stupid and I honestly cannot tell which." }
        ] }
    ],
    timeoutOption: { label: '(no response)', reply: '(no response sent)', flag: 'let_purge',
      steps: [{ msg: 'solt', text: "Nothing? Right. I'll do what I think is right and you can explain it to the board." }] } } },

    { pause: 900 },
    { clock: 6 },

    /* ══════ THE FILE ══════ */
    { msg: 'reyes', cls: 'alert', text: "Operator. I'm in the ME's car park with a green ledger and a receipt." },
    { msg: 'reyes', cls: 'alert', text: "You are going to write the case file. Not me. You've had it in front of you all night and I've had a torch and a wet field." },
    { msg: 'reyes', text: "Name it. All of it. And then tell me where to drive." },
    { objective: 'Complete the case file.' },
    { request: {
      id: 'req_final', ref: 'VC 98-1173 / FINAL', title: 'CASE FILE — SUMMARY OF FINDING',
      prompt: 'Every field. This is the one that gets read out loud.',
      slots: [
        { id: 'principal', label: 'PRINCIPAL', accept: ['person'] },
        { id: 'victim87',  label: '1987 DECEDENT', accept: ['person'] },
        { id: 'shooter',   label: 'SHOOTER 11/04/98', accept: ['person'] },
        { id: 'voss',      label: 'LOCATION — M. VOSS', type: 'choice', options: [
          { v: 'grieve', l: 'GRIEVE HILL STATE HOSPITAL — BLDG B, WARD 17' },
          { v: 'mill',   l: 'MARROW STREET MILL — SECOND FLOOR OFFICE' },
          { v: 'quarry', l: 'HALLORAN QUARRY — SUBMERGED' },
          { v: 'gone',   l: 'DECEASED — WHEREABOUTS UNKNOWN' },
          { v: 'left',   l: 'RESIGNED AND LEFT THE STATE' }
        ] },
        { id: 'ex_money',  label: 'EXHIBIT — THE MONEY', type: 'choice', options: heldEvidence },
        { id: 'ex_weapon', label: 'EXHIBIT — THE WEAPON', type: 'choice', options: heldEvidence },
        { id: 'ex_hand',   label: 'EXHIBIT — THE HAND', type: 'choice', options: heldEvidence }
      ],
      answer: {
        principal: 'p_finn',
        victim87: 'p_fearn_r',
        shooter: 'p_ansel',
        voss: 'grieve',
        ex_money: ['ev_ledger_found', 'ev_wagetrace'],
        ex_weapon: ['ev_weapon_agency', 'ev_nc88'],
        ex_hand: ['ev_signature', 'ev_witsec_sole']
      },
      onWrong: function (filled, wrong) {
        var hints = {
          principal: 'The principal is the hand on all four instruments, not the man who pulled a trigger for him.',
          victim87: 'Who had the bridge on twelve and thirteen?',
          shooter: 'Whose print is on the mill office door, and whose licence was waived?',
          voss: 'Eighteen hundred kilowatt-hours. A PA chime. A rotor lane. A stencil.',
          ex_money: 'The money exhibit is the one written in an accountant\'s hand over eleven years.',
          ex_weapon: 'The weapon exhibit is the one that proves a destroyed revolver fired this week.',
          ex_hand: 'The hand exhibit is the one that puts one signature on four separate instruments.'
        };
        NW.wire.push({ msg: 'reyes', text: wrong.map(function (w) { return hints[w]; }).filter(Boolean).join(' ') || 'Read it again.' });
      }
    } },

    { pause: 1100 },
    { sfx: 'good' },
    { msg: 'reyes', text: "..." },
    { msg: 'reyes', text: "That's the file." },
    { msg: 'reyes', text: "That is a whole file, operator, written on a night desk by somebody who started this shift being told not to make identifications." },
    { flag: 'case_filed' },
    { pause: 900 },

    /* ══════ WHERE DOES IT GO ══════ */
    { msg: 'reyes', cls: 'alert', text: "Now the only decision that's left. Who gets it?" },
    { objective: 'Where does the file go?' },
    { ask: { prompt: 'THIS IS THE DECISION', timer: 40, options: [
      { label: "Outside the building. Medical Examiner, the Marshals in Kelland, and the Ledger. All three, tonight.",
        reply: "Outside the building. Abaroa, Pemberton's office in Kelland, and Adair. All three. Tonight.",
        choice: 'final_route', value: 'outside', flag: 'route_outside',
        steps: [
          { msg: 'reyes', text: "Three copies, three jurisdictions, one hour. He can't reach all of them." },
          { msg: 'solt', text: "I'll drive the Kelland one myself. I've got a full tank and nothing left to protect." }
        ] },
      { label: "Straight up the chain. Deputy Chief's office, as required.",
        reply: "Up the chain. Fourth floor, as required by procedure.",
        choice: 'final_route', value: 'chain', flag: 'route_chain',
        steps: [
          { pause: 1600 },
          { msg: 'reyes', text: "Operator." },
          { msg: 'reyes', text: "You have just sent a file naming Walter Finn to Walter Finn." },
          { pause: 1200 },
          { msg: 'solt', text: "..." },
          { msg: 'solt', text: "Oh, son." }
        ] },
      { label: "Hold it. Nothing moves until we have Voss.",
        reply: "Hold it. Nobody gets anything until she's out of that building.",
        choice: 'final_route', value: 'hold', flag: 'route_hold',
        steps: [
          { msg: 'reyes', text: "That's a hell of a bet." },
          { msg: 'reyes', text: "If we're wrong about the hill, there's no file and no her." }
        ] }
    ],
    timeoutOption: { label: '(no response)', reply: '(no response sent)', choice: 'final_route', value: 'chain', flag: 'route_chain',
      steps: [
        { msg: 'solt', text: "The routing default on a completed case file is the Deputy Chief's office." },
        { msg: 'solt', text: "It went up automatically, operator." },
        { pause: 1200 },
        { msg: 'reyes', text: "...Then we drive faster." }
      ] } } },

    { pause: 1000 },
    { clock: 8 },

    /* ══════ THE HILL ══════ */
    { msg: 'reyes', cls: 'alert', text: "I'm on County 40 doing ninety with a ledger on the passenger seat. Twelve minutes to the hill." },
    { msg: 'reyes', cls: 'alert', text: "Building B. Talk me in." },
    { objective: 'Talk her in.' },
    { ask: { prompt: 'RESPONSE WINDOW', timer: 30, options: [
      { label: "Ward 17 is on the first floor, north wing. Power's live — the lit windows are your corridor.",
        reply: "Ward 17, first floor, north wing. Building B is the only one with power — follow the lit windows.",
        flag: 'guided_well',
        steps: [
          { pause: 2400 },
          { msg: 'reyes', text: "North wing. There's a padlock on the ward door that is nine months newer than everything else on this ridge." },
          { pause: 2000 },
          { sfx: 'thunk' },
          { msg: 'reyes', text: "..." }
        ] },
      { label: "Go in quiet and clear it room by room.",
        reply: "Quiet entry. Clear it room by room.",
        flag: 'guided_slow',
        steps: [
          { pause: 3000 },
          { msg: 'reyes', text: "This building has ninety rooms, operator." },
          { pause: 2600 },
          { msg: 'reyes', text: "...North wing. First floor. There's a new padlock." },
          { pause: 1800 },
          { sfx: 'thunk' },
          { msg: 'reyes', text: "..." }
        ] },
      { label: "Wait for me to get you a unit. Don't go in alone.",
        reply: "Do not go in alone. Wait for a unit.",
        flag: 'guided_wait',
        steps: [
          { msg: 'reyes', text: "There is no unit. There has never been a unit. That is the entire point of tonight." },
          { pause: 2400 },
          { msg: 'reyes', text: "I'm going in." },
          { pause: 2600 },
          { msg: 'reyes', text: "North wing, first floor. New padlock." },
          { pause: 1600 },
          { sfx: 'thunk' },
          { msg: 'reyes', text: "..." }
        ] }
    ],
    timeoutOption: { label: '(no response)', reply: '(no response sent)', flag: 'guided_wait',
      steps: [
        { pause: 2000 },
        { msg: 'reyes', text: "Operator? ...Fine. I'll find it." },
        { pause: 3400 },
        { msg: 'reyes', text: "North wing. New padlock." },
        { sfx: 'thunk' },
        { msg: 'reyes', text: "..." }
      ] } } },

    { pause: 2600 },
    { do: function () { NW.notify.caseLabel('—'); } },
    { ending: 'auto' }
  ]);
})(window.NW);

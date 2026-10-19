/* NIGHTWIRE — story/ch0.js — CERTIFICATION */
(function (NW) {
  'use strict';
  var D = NW.director;

  function wrongMsg(text) {
    return function () { NW.wire.push({ msg: 'solt', text: text }); };
  }

  D.scene('ch0', [
    { chapterNum: 0 },
    { flag: 'ch0' },
    { caseLabel: 'CERTIFICATION — NIGHT WATCH' },
    { objective: 'Report in on the wire.' },
    { pause: 900 },

    { msg: 'solt', text: 'Terminal 04. You there?' },
    { msg: 'solt', text: "Graham Solt. Duty officer. I'm forty feet down the corridor behind the door that squeaks, and I will not be coming down to hold your hand, so we do this on the wire." },
    { pause: 400 },
    { ask: { prompt: 'REPLY', options: [
      { label: "Reporting in. Terminal 04, ready.", flag: 'tone_pro' },
      { label: "I'm here. It's very quiet down here.", flag: 'tone_human' },
      { label: "Who was here before me?", flag: 'asked_early', steps: [
        { msg: 'solt', text: '...' },
        { msg: 'solt', text: "That's a hell of an opening question." },
        { msg: 'solt', text: "An operator called Voss. She resigned in March. Now let's do the certification, because I've got a form that says I have to." }
      ] }
    ] } },

    { msg: 'solt', text: "Right. Certification. Three queries, you answer them, I sign the sheet, and then we sit here until something happens." },
    { msg: 'solt', text: "You've got the index. Names, dates of birth, addresses, plates, social security numbers. An empty query gives you the whole thing — read it sometime, it's the most useful hour you'll ever waste." },
    { unlockApp: 'registry' },
    { toast: { head: 'PROGRAM AUTHORISED', body: 'REGISTRY — Central Person & Vehicle Index', kind: 'good' } },
    { pause: 500 },

    /* ── DRILL 1 ── */
    { objective: 'DRILL 1 — identify the registered owner of plate RXP-206.' },
    { msg: 'solt', text: "Drill one. A unit has a blue Chevrolet stopped on Harbour Street. Plate Romeo X-ray Papa two zero six. Who owns it, and is there anything on him?" },
    { request: {
      id: 'req_d1', ref: 'CERT 1/3', title: 'REGISTERED KEEPER — RXP-206',
      prompt: 'Transmit the subject record from the index, and state the warrant status.',
      slots: [
        { id: 'subject', label: 'SUBJECT', accept: ['person'] },
        { id: 'warrant', label: 'WARRANT STATUS', type: 'choice', options: [
          { v: 'none', l: 'NO ACTIVE WARRANT' },
          { v: 'bench', l: 'ACTIVE BENCH WARRANT — FAILURE TO APPEAR' },
          { v: 'felony', l: 'ACTIVE FELONY WARRANT' }
        ] }
      ],
      answer: { subject: 'p_kruse', warrant: 'bench' },
      onWrong: wrongMsg("That's not it. Search the vehicle index on the plate, then open the keeper's record and read the disposition column. The whole answer's on one screen.")
    } },
    { msg: 'solt', text: "Kruse. Failed to appear in January. Good — you read the disposition instead of stopping at the name. Half of them don't." },
    { pause: 300 },

    /* ── DRILL 2 ── */
    { objective: 'DRILL 2 — identify the vehicle of a nurse on Cannery Walk.' },
    { msg: 'solt', text: "Drill two. Nineteen Cannery Walk. Woman, late twenties, nurse at St. Brendan's. A unit wants her car so they can stop knocking on the wrong door at midnight." },
    { request: {
      id: 'req_d2', ref: 'CERT 2/3', title: 'VEHICLE OF RECORD — 19 CANNERY WALK',
      prompt: 'Transmit the vehicle from the index.',
      slots: [{ id: 'veh', label: 'VEHICLE', accept: ['vehicle'] }],
      answer: { veh: 'JHM-330' },
      onWrong: wrongMsg("No. Query the address in the civil index, not the criminal one. She's a nurse, not a defendant. Then follow the plate through to the vehicle index.")
    } },
    { msg: 'solt', text: "Silver Accord. That's the one." },
    { pause: 300 },

    /* ── DRILL 3 ── */
    { objective: 'DRILL 3 — warrant check on DOWD, T., Garnet Street.' },
    { msg: 'solt', text: "Drill three. Dowd, Terrence, Garnet Street. Unit wants to know if they can take him in tonight." },
    { request: {
      id: 'req_d3', ref: 'CERT 3/3', title: 'WARRANT CHECK — DOWD, TERRENCE L.',
      prompt: 'State the position. Be careful.',
      slots: [{ id: 'ans', label: 'POSITION', type: 'choice', options: [
        { v: 'none', l: 'NO WARRANT — NO GROUND TO DETAIN' },
        { v: 'yes', l: 'WARRANT OUTSTANDING — DETAIN' },
        { v: 'maybe', l: 'PRIOR RECORD — DETAIN ON SUSPICION' }
      ] }],
      answer: { ans: 'none' },
      onWrong: wrongMsg("Read it again. A conviction from 1996 that went to diversion is not a warrant. If you send a man to arrest somebody on a record instead of a warrant, that arrest is unlawful and it is your name on the query log.")
    } },
    { pause: 400 },
    { msg: 'solt', text: "There we are. Prior record, no warrant, no ground. Most of this job is telling armed people the word 'no'." },
    { msg: 'solt', text: "Certified. Welcome to the night watch." },
    { objective: 'Certified. Stand by.', objDone: true },
    { flag: 'certified' },
    { pause: 900 },

    { msg: 'solt', text: "Now. Two things, and then I'll leave you alone." },
    { msg: 'solt', text: "One. Anything you're not sure of, say 'stand by' and take the extra ninety seconds. Nobody has ever been hurt by an operator being slow. I could give you a list of the other kind." },
    { msg: 'solt', text: "Two. There's a manual in the drawer under the desk. Copy 04. It doesn't leave this terminal. Read section nine if you get bored." },
    { unlockApp: ['manual', 'notepad'], quiet: true },
    { pause: 700 },
    { msg: 'solt', text: "And ignore the drawer that sticks. Property Branch have had a work order on it since March." },

    { pause: 1400 },
    { clock: 9 },
    { sfx: 'alert' },
    { sys: '— PRIORITY TRAFFIC — VC DISPATCH —' },
    { unlockContact: 'dispatch' },
    { msg: 'dispatch', cls: 'alert', text: 'ALL UNITS VANDERMEER — HALLORAN QUARRY ACCESS, OFF MERCER RD. CALLER REPORTS A BODY IN THE WATER. UNIT 4 ON SCENE. NCIB NOTIFIED.' },
    { pause: 800 },
    { msg: 'solt', text: "Well." },
    { msg: 'solt', text: "That's the quietest I've ever heard that room get." },
    { pause: 600 },
    { goto: 'ch1' }
  ]);
})(window.NW);

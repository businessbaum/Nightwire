/* NIGHTWIRE — data/evidence.js — exhibits, casebook theories and timeline puzzles */
(function (NW) {
  'use strict';

  var E = {
    /* ── Chapter 1 ── */
    ev_latent:        { k: 'object', t: 'LATENT L-1 (R. THUMB)',        d: 'Recovered from the quarry decedent by tissue-builder technique. Twelve usable minutiae.' },
    ev_printmatch:    { k: 'object', t: 'PRINT IDENTIFICATION — VANCE', d: 'L-1 identifies to the 1979 bonding card of ELIAS T. VANCE. A man who has been dead since 1987.' },
    ev_deadman:       { k: 'event',  t: 'A DEAD MAN\'S PRINTS',          d: 'The decedent recovered 11/06/1998 carries the ridge detail of a man buried in August 1987.' },
    ev_tyre:          { k: 'object', t: 'DUAL-WHEEL TYRE IMPRESSIONS',   d: 'Commercial dual-rear tracks backing to the quarry shelf edge. Nothing turned around.' },
    ev_key:           { k: 'object', t: 'BRASS PADLOCK KEY',             d: 'Warded padlock key, unmarked, left trouser pocket of the decedent.' },
    ev_87file:        { k: 'doc',    t: '1987 CORONER FINDING',          d: 'No fingerprint comparison attempted. Identification rests entirely on one dentist.' },

    /* ── Chapter 2 ── */
    ev_earlycall:     { k: 'event',  t: 'THE 22:52 CALL',                d: 'Dispatch logged a Mercer Road fire eighteen minutes before the collision that caused it.' },
    ev_callerloc:     { k: 'place',  t: 'CALLER STOOD AT THE QUARRY',    d: 'Blasting siren and rail crossing on the same tape. Only the quarry access road hears both.' },
    ev_dental_swap:   { k: 'object', t: 'THE BRIDGE THAT WASN\'T HIS',   d: 'The 1987 remains carried a #12–13 bridge Vance never had. Rennick Fearn did.' },
    ev_seibold_paid:  { k: 'doc',    t: 'TWO CHEQUES, ONE DAY',          d: '$12,000 each to the dentist and the reporting officer, same branch, 08/20/1987.' },
    ev_voss_dir:      { k: 'doc',    t: 'VOSS PARTITION',                d: 'A hidden directory on this terminal. Eight months of somebody else\'s night shifts.' },
    ev_voss_notes:    { k: 'doc',    t: 'VOSS — DECRYPTED NOTES',        d: 'Her working file. She got as far as the wage trace and then she stopped writing.' },
    ev_brennick_admit:{ k: 'person', t: 'BRENNICK — TIME WAS GIVEN',     d: 'He did not witness the alarm. Somebody handed him the time to write down.' },
    ev_brennick_coat: { k: 'person', t: 'THE MAN IN THE COAT',           d: 'A federal officer closed the 1987 file at Brennick\'s door and has paid him since.' },
    ev_ansel_motel:   { k: 'person', t: 'ANSEL PAID OUT ROOM 14',        d: 'The day after Rennick Fearn vanished, Curtis Ansel paid his room to month-end.' },
    ev_adair_press:   { k: 'person', t: 'ADAIR WAS MOVED OFF THE BEAT',  d: 'She printed the 22:52 discrepancy and was writing about the county fair a week later.' },
    ev_adair_photo:   { k: 'object', t: 'THE SPIKED WIRE PHOTO',         d: 'A car and a man on the quarry access road, above the 1987 fire. Never published.' },

    /* ── Chapter 3 ── */
    ev_millfigure:    { k: 'person', t: 'FIGURE IN THE BAY DOORWAY',     d: 'Six-two, heavy, standing back from the opening. Waiting to be walked in on.' },
    ev_trucks:        { k: 'event',  t: 'THE WEEKLY TIPPER',             d: 'A load leaves an empty quarry every week and arrives at the mill weighing the same.' },
    ev_millcall:      { k: 'event',  t: 'CALL FROM THE MILL, 11/04',     d: '"He had it on him. It\'s in the office." Something came off the body.' },
    ev_triangulated:  { k: 'place',  t: 'TRIANGULATED HANDSET',          d: 'The 11/04 23:07 call originates inside the Marrow Street mill footprint.' },
    ev_casing:        { k: 'object', t: 'CARTRIDGE CASE M-1',            d: '.38 Special, recovered loading bay 2. Revolver — so somebody stopped to pick it up and missed one.' },
    ev_plate418:      { k: 'object', t: 'PLATE KTV-418, ALIVE',          d: 'A plate released to an insurer in 1987 photographed in a motel lot in 1998.' },
    ev_maule_motel:   { k: 'person', t: 'MAULE AT THE BLUE LARKSPUR',    d: 'Vance came home under his program name and stayed four nights. He never checked out.' },
    ev_key_match:     { k: 'object', t: 'THE SECOND KEY',                d: 'A padlock key on orange string in his bag. Two keys. Two locks.' },
    ev_ansel_id:      { k: 'person', t: 'ANSEL, CURTIS R.',              d: 'Security contractor for the leaseholder. Felon licensed on a federal recommendation.' },

    /* ── Chapter 4 ── */
    ev_weapon_agency: { k: 'object', t: 'A DESTROYED WEAPON FIRED',      d: 'The casing identifies to agency inventory 8841-D, furnaced in 1994 — on the one unwitnessed line.' },
    ev_nc88:          { k: 'doc',    t: 'NC-88 SCHEDULE, LOT 12',        d: 'Every line initialled by two witnesses except the one that mattered. Signed W. R. Finn.' },
    ev_witsec_sole:   { k: 'doc',    t: 'SOLE CUSTODY WAIVER',           d: 'Joint custody of WS-4-0119 waived in a single sentence. Custodian: W. R. Finn.' },
    ev_pemberton_custody: { k: 'person', t: 'PEMBERTON\'S COMPLAINTS',   d: 'Two internal complaints about single-inspector custody. Both closed without a finding.' },
    ev_maildrop:      { k: 'place',  t: 'THE MAIL DROP',                 d: 'The protected witness\'s mail forwarded back into the county he was protected from.' },
    ev_pemberton_names_finn: { k: 'person', t: 'PEMBERTON NAMES FINN',   d: 'Named on a recorded line: Walter Finn, sole custodian, eleven years.' },
    ev_wagetrace:     { k: 'doc',    t: 'WAGE TRACE — 214-88-0917',      d: 'A dead man\'s number drawing $29,400 from the company he was going to testify against.' },
    ev_bellamy_finn:  { k: 'person', t: 'BELLAMY IS FINN\'S FAMILY',     d: 'The registered agent of the shell married Finn\'s sister in 1978.' },
    ev_bellamy_refuse:{ k: 'person', t: 'BELLAMY WOULD NOT DENY IT',     d: 'Asked directly whether the member was his brother-in-law, he ended the call.' },
    ev_signature:     { k: 'doc',    t: 'THE SAME HAND, FOUR TIMES',     d: 'WS-2, NC-71, NC-88 and the licensing recommendation share one signature.' },
    ev_finn_voss_line:{ k: 'person', t: '"COULD NOT SIGN FOR THEMSELVES"', d: 'Finn\'s own words about the Voss separation. Not "would not". "Could not".' },
    ev_lotreflection: { k: 'person', t: 'THE REFLECTION IN THE LOT',     d: 'A man in a long coat at the sub-level door at 22:04, standing outside the camera\'s arc.' },

    /* ── Chapter 5 ── */
    ev_grieve_power:  { k: 'place',  t: 'BUILDING B IS WARM',            d: '1,880 kWh a month in a building leased for paper storage at a dollar a year.' },
    ev_b17:           { k: 'place',  t: 'WARD B-17',                     d: 'A stencil in a photograph that arrived on this terminal with no routing header.' },
    ev_vosslocation:  { k: 'place',  t: 'GRIEVE HILL — THE TAPE',        d: 'A hospital PA chime and the Grieve Hill rotor lane behind Voss\'s last recording.' },
    ev_bookcipher:    { k: 'doc',    t: 'THE REFERENCE CIPHER',          d: 'Page · line · word triples keyed to a book she left in a box in cage three.' },
    ev_voss_tape_found:{ k: 'object',t: 'THE ANSWERING MACHINE TAPE',    d: 'Bagged in March, never logged out, found under a box of toner.' },
    ev_handprint:     { k: 'object', t: 'THE SMEAR ON THE WALL',         d: 'Four fingers dragged downward at shoulder height in the doorway of her flat.' },
    ev_solt_turn:     { k: 'person', t: 'SOLT WILL HELP',                d: 'Twenty-eight years of doing what he was told, ending tonight.' },
    ev_me_ally:       { k: 'person', t: 'A COPY OUTSIDE THE BUILDING',   d: 'The 1987 file is now in the hands of the county Medical Examiner, with a transmittal.' },
    ev_locker_hint:   { k: 'place',  t: '"WHERE THE NOISE IS"',          d: 'The shot-firing shed at the quarry, under the blasting siren. Vance\'s locker.' },
    ev_ledger_found:  { k: 'object', t: 'THE VANCE LEDGER',              d: 'Eleven years of the operation in an accountant\'s hand, in a padlocked locker under a siren.' },
    ev_claire_call:   { k: 'person', t: 'THE CALL TO CLAIRE',            d: 'April 1998. He said the name only he used. He was saying goodbye or asking for help.' },

    /* ── misc ── */
    ev_voss_partition_key: { k: 'doc', t: 'PARTITION PASSPHRASE',        d: 'MERCER87 — the road she never let go of.' }
  };

  /* Board node kinds map to pin colours. */
  function node(id) {
    var e = E[id];
    if (!e) return null;
    return { id: id, kind: e.k, title: e.t, desc: e.d };
  }

  /* ── DEDUCTION THEORIES ──
     The player joins two board nodes with string. Correct pairs prove a theory. */
  var THEORIES = [
    { id: 'th_notvance', chapter: 1, title: 'THE 1987 BODY WAS NOT VANCE',
      desc: 'Connect the print identification to the 1987 coroner finding.',
      pairs: [['ev_printmatch', 'ev_87file']],
      onSolve: { flag: 'th_notvance', fact: { c: 'DEDUCTION', t: 'If Vance died in 1998, the 1987 identification was false — and it was made without prints.' } } },

    { id: 'th_substitution', chapter: 2, title: 'A SUBSTITUTION WAS MADE',
      desc: 'Tie the dental discrepancy to the man who disappeared two days before the fire.',
      pairs: [['ev_dental_swap', 'ev_ansel_motel'], ['ev_dental_swap', 'ev_87file']],
      onSolve: { flag: 'th_substitution', evidence: 'ev_wagetrace',
        fact: { c: 'DEDUCTION', t: 'Rennick Fearn burned in Elias Vance\'s car so that Elias Vance could be declared dead.' } } },

    { id: 'th_timeline', chapter: 2, title: 'THE FIRE CAME FIRST',
      desc: 'Join the early alarm to the caller\'s position.',
      pairs: [['ev_earlycall', 'ev_callerloc']],
      onSolve: { flag: 'th_timeline',
        fact: { c: 'DEDUCTION', t: 'The fire was reported from the quarry before the crash on Mercer Road. It was staged, and the man who reported it was standing where the body came from.' } } },

    { id: 'th_purchase', chapter: 2, title: 'THE IDENTIFICATION WAS BOUGHT',
      desc: 'Connect the two twelve-thousand-dollar cheques to the men who signed the paperwork.',
      pairs: [['ev_seibold_paid', 'ev_brennick_admit']],
      onSolve: { flag: 'th_purchase',
        fact: { c: 'DEDUCTION', t: 'The officer who wrote the report and the dentist who made the identification were paid on the same day at the same branch.' } } },

    { id: 'th_mill', chapter: 3, title: 'THE MILL IS THE OPERATION',
      desc: 'Link the weekly haulage to the call placed from inside the building.',
      pairs: [['ev_trucks', 'ev_millcall'], ['ev_triangulated', 'ev_millcall']],
      onSolve: { flag: 'th_mill',
        fact: { c: 'DEDUCTION', t: 'Marrow Street is where the money is counted. The quarry is only the road it travels on.' } } },

    { id: 'th_insider', chapter: 4, title: 'THE PRINCIPAL IS INSIDE THE BUREAU',
      desc: 'Put the destroyed weapon beside the custody waiver.',
      pairs: [['ev_weapon_agency', 'ev_witsec_sole'], ['ev_nc88', 'ev_signature']],
      onSolve: { flag: 'th_insider', evidence: 'ev_signature',
        fact: { c: 'DEDUCTION', t: 'One signature authorises the weapon that killed him, the custody that owned him, and the resignation of the operator who found him.' } } },

    { id: 'th_voss', chapter: 5, title: 'VOSS IS ALIVE',
      desc: 'Connect what she left behind to where the tape says she went.',
      pairs: [['ev_handprint', 'ev_vosslocation'], ['ev_grieve_power', 'ev_b17']],
      onSolve: { flag: 'th_voss', flag2: 'voss_locatable',
        fact: { c: 'DEDUCTION', t: 'Nobody heats an empty building. Ward B-17, Grieve Hill. Eight months.' } } }
  ];

  /* ── TIMELINE PUZZLES ── */
  var TIMELINES = [
    {
      id: 'tl_1987', chapter: 2, title: 'NIGHT OF 12 AUGUST 1987',
      intro: 'Place each event at the time the record actually supports — not the time the report claims.',
      slots: [
        { time: '21:40', answer: 'e_meet' },
        { time: '22:15', answer: 'e_drive' },
        { time: '22:44', answer: 'e_set' },
        { time: '22:52', answer: 'e_call' },
        { time: '23:04', answer: 'e_ignite' },
        { time: '23:10', answer: 'e_report' },
        { time: '23:31', answer: 'e_suppress' }
      ],
      cards: [
        { id: 'e_call',  t: 'Anonymous caller reports a car fire on Mercer Road', s: 'VC DISPATCH LOG' },
        { id: 'e_report',t: 'Sgt. Brennick records the alarm time in PA-14',       s: 'PA 87-3319' },
        { id: 'e_ignite',t: 'Delayed ignition device reaches the fuel',            s: 'ARSON MO SUMMARY' },
        { id: 'e_set',   t: 'Vehicle positioned at the embankment, fuse set',      s: 'ARSON MO SUMMARY' },
        { id: 'e_suppress',t: 'Port Alden VFD suppresses the fire',                s: 'PA 87-3319' },
        { id: 'e_drive', t: 'Vehicle driven from the quarry to Mercer Road',       s: 'DISTANCE 2.8 MI' },
        { id: 'e_meet',  t: 'Rennick Fearn last seen alive, Blue Larkspur lot',    s: 'PA 87-2201' },
        { id: 'e_decoy1',t: 'Elias Vance testifies before the grand jury',         s: 'NEVER HAPPENED', decoy: true },
        { id: 'e_decoy2',t: 'Vehicle skids at the curve, driver loses control',    s: 'NO SKID MARKS', decoy: true }
      ],
      onSolve: { flag: 'tl_1987_done', evidence: 'ev_earlycall',
        fact: { c: 'TIMELINE', t: 'Reconstructed: the fire was set at 22:44 and reported at 22:52 — twelve minutes before it burned and twenty-six before the police say it was called in.' } }
    },
    {
      id: 'tl_1998', chapter: 5, title: 'THE LAST FOUR DAYS OF ELIAS VANCE',
      intro: 'Everything below is anchored to a record you already hold.',
      slots: [
        { time: '11/02 19:10', answer: 'v_arrive' },
        { time: '11/03 11:00', answer: 'v_payroll' },
        { time: '11/04 21:30', answer: 'v_quarry' },
        { time: '11/04 23:07', answer: 'v_call' },
        { time: '11/04 23:14', answer: 'v_anon' },
        { time: '11/06 20:52', answer: 'v_found' },
        { time: '11/06 21:14', answer: 'v_secure' }
      ],
      cards: [
        { id: 'v_arrive', t: '"P. Maule" checks into the Blue Larkspur, room 9', s: 'MOTEL — L. SIKES' },
        { id: 'v_payroll',t: 'Halloran Aggregate books a Q3 wage to SSN 214-88-0917', s: 'DOL PAYROLL SUMMARY' },
        { id: 'v_quarry', t: 'Vance goes to the shot-firing shed for the ledger',  s: 'C. OSTERHOLT / KEY' },
        { id: 'v_call',   t: '"He\'s in the deep end. He had it on him."',          s: 'INTERCEPT A-2' },
        { id: 'v_anon',   t: 'Payphone caller: "there\'s a car down here"',         s: 'VC SHERIFF CAD' },
        { id: 'v_found',  t: 'Trevino reports something in the water',              s: 'VC SHERIFF CAD' },
        { id: 'v_secure', t: 'Scene secured by Evidence Response',                  s: 'NC-30 SCENE REPORT' },
        { id: 'v_decoy1', t: 'Vance returns to Braemoor and resumes work',          s: 'NO RECORD', decoy: true },
        { id: 'v_decoy2', t: 'Ansel reports a trespasser to the Sheriff',           s: 'NO SUCH CALL', decoy: true }
      ],
      onSolve: { flag: 'tl_1998_done', evidence: 'ev_locker_hint',
        fact: { c: 'TIMELINE', t: 'He came home, got himself onto the payroll to be seen, collected the ledger from the quarry, and was killed within two hours of collecting it.' } }
    }
  ];

  NW.evidence = {
    def: function (id) { return E[id]; },
    all: function () { return E; },
    node: node,
    theories: THEORIES,
    timelines: TIMELINES,
    held: function () {
      var st = NW.state.s;
      return Object.keys(st.evidence).filter(function (k) { return E[k]; });
    }
  };
})(window.NW);

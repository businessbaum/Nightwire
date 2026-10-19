/* NIGHTWIRE — story/ch5.js — WARD SEVENTEEN */
(function (NW) {
  'use strict';
  var D = NW.director;

  D.scene('ch5', [
    { chapterNum: 5 },
    { flag: 'ch5' },
    { gate: "Something just opened a relay on this terminal. Stand by." },
    { chapter: { num: 'CHAPTER FIVE', title: 'WARD SEVENTEEN',
      desc: 'SATURDAY 7 NOVEMBER · 03:12<br>TWO HUNDRED AND FORTY DAYS SINCE 16 MARCH<br>SOMETHING ON THIS TERMINAL HAS BEEN COUNTING' } },
    { caseLabel: 'CASE VC 98-1173 — SEE ALSO 98-XXXX', urgent: true },
    { clock: 16 },

    { pause: 800 },
    { glitch: true },
    { sfx: 'glitch' },
    { unlockContact: 'nightwire' },
    { msg: 'nightwire', cls: 'ghost', text: 'RELAY 3312 — OPEN' },
    { pause: 1200 },
    { msg: 'nightwire', cls: 'ghost', text: 'AUTOMATIC. IF YOU ARE READING THIS I HAVE NOT LOGGED INTO THIS TERMINAL FOR TWO HUNDRED AND FORTY DAYS.' },
    { pause: 900 },
    { msg: 'nightwire', cls: 'ghost', text: 'THE LAST FILE IS IN THE WIRE DIRECTORY. IT IS KEYED THE SAME WAY. THERE IS ALSO A COLUMN OF NUMBERS AND YOU ARE SITTING AT THE BOOK.' },
    { pause: 700 },
    { msg: 'nightwire', cls: 'ghost', text: '— M.V.' },
    { pause: 1000 },
    { msg: 'solt', text: "What in God's name was that." },
    { ask: { options: [
      { label: "A dead man's switch. She set it in March and it just came due." },
      { label: "It's Voss. She left it running.", flag: 'tone_human' }
    ] } },
    { msg: 'solt', text: "..." },
    { msg: 'solt', text: "Two hundred and forty days." },
    { msg: 'solt', text: "She gave herself eight months to come back and tell it not to." },
    { objective: 'SHELL — decrypt /USR/VOSS/.WIRE/LAST.ENC.' },

    { wait: 'voss_last_read' },
    { pause: 700 },
    { msg: 'solt', text: "'Do not send anything to the fourth floor tonight.'" },
    { msg: 'solt', text: "She wrote that in March, for somebody she'd never meet, on the assumption that they'd be exactly where you are." },
    { pause: 500 },
    { msg: 'solt', text: "There's a second file. BOOK.TXT. TYPE it." },
    { objective: 'SHELL — read BOOK.TXT, then work it on the CIPHER DESK.' },

    { wait: 'have_cy_book' },
    { pause: 400 },
    { msg: 'solt', text: "Page, line, word. Section 9.3." },
    { msg: 'solt', text: "The book is the manual, operator. Copy 04. It has never left this desk in seven years and she knew that better than anybody alive." },
    { objective: 'CIPHER DESK — resolve the reference cipher.' },

    { wait: 'cy_book_done' },
    { pause: 1000 },
    { sfx: 'alert' },
    { msg: 'reyes', cls: 'alert', text: "Say it again." },
    { ask: { options: [
      { label: "Grieve Hill. Ward seventeen. She is alive." },
      { label: "She's alive, Reyes. Grieve Hill, ward seventeen.", flag: 'tone_human' }
    ] } },
    { pause: 900 },
    { msg: 'reyes', text: "Grieve Hill has been shut since 1989." },
    { msg: 'reyes', text: "Operator — get me the lease. Whatever it takes, get me who holds that ground." },
    { evidence: ['ev_b17'] },
    { objective: 'Establish who holds Grieve Hill.' },
    { unlockRecord: ['p_moss', 'p_bellamy'] },
    { msg: 'solt', text: "County records. Patrice Moss. She answers after hours because she cannot help herself." },

    { wait: function (s) { return s.evidence['ev_grieve_power']; } },
    { pause: 600 },
    { flag: 'place_pl_grieve' },
    { msg: 'reyes', text: "Eighteen hundred kilowatt-hours a month for paper storage." },
    { msg: 'reyes', text: "That building is heated and lit and somebody is in it." },
    { pause: 500 },

    /* ── the tape ── */
    { msg: 'solt', text: "Operator. Property Branch bagged her flat in March and I have a receipt with a micro-cassette on it and no disposal entry." },
    { msg: 'solt', text: "Ask me for it. On the line. So there's a version of tonight where I was asked." },
    { objective: 'SWITCHBOARD — ask Solt for the answering machine tape.' },

    { wait: 'audio_au_voss_tape' },
    { pause: 800 },
    { msg: 'solt', text: "It was in a drawer under a box of toner." },
    { msg: 'solt', text: "I'm not going to listen to it. I'll be in the corridor.", att: { kind: 'audio', id: 'au_voss_tape', label: 'EXHIBIT A-3 — ANSWERING MACHINE 03/16/98' } },
    { objective: 'AUDIO LAB — establish where the tape was made.' },

    { wait: 'auconc_au_voss_tape' },
    { pause: 800 },
    { evidence: ['ev_vosslocation'] },
    { msg: 'reyes', text: "A hospital PA chime and the Grieve Hill rotor lane, on a tape from her own flat." },
    { msg: 'reyes', text: "That's not where she made it. That's where the machine was when it was played back — somebody carried the tape to Grieve Hill and played it to make sure of what was on it." },
    { msg: 'reyes', text: "And then put it back in the drawer." },
    { pause: 600 },

    { flag: 'photo_ph_house_int' },
    { flag: 'photo_ph_ward' },
    { msg: 'solt', text: "Two more frames. Her flat, from the landlord entry. And one that came in on the relay with no routing header at all.", att: { kind: 'photo', id: 'ph_ward', label: 'EXHIBIT P-6 — GRIEVE HILL, BLDG B' } },
    { objective: 'IMAGE LAB — work both remaining frames.' },
    { wait: { all: ['find_fd_hand', 'find_fd_ward'] }, timeout: 300000 },
    { if: { not: ['find_fd_hand'] }, then: [
      { msg: 'solt', text: "I had a look at her flat frame myself while you were busy. Shoulder height, in the doorway — four fingers dragged down the paint." },
      { msg: 'solt', text: "It was photographed in March and never processed, and a contractor cleaned the room eleven days later." },
      { evidence: ['ev_handprint'] }
    ] },
    { if: { not: ['find_fd_ward'] }, then: [
      { msg: 'solt', text: "And the corridor frame has a stencil over the far door. B-17." },
      { msg: 'solt', text: "Building B. Ward seventeen. Somebody sent us a photograph of the door." },
      { evidence: ['ev_b17'] }
    ] },
    { pause: 500 },

    { objective: 'CASEBOOK — establish that Voss is alive and where.' },
    { wait: 'th_voss' },
    { pause: 700 },
    { msg: 'reyes', text: "Ward seventeen, Building B, Grieve Hill." },
    { msg: 'reyes', text: "Eight months." },
    { pause: 900 },

    /* ── the ledger ── */
    { msg: 'pryce', text: "Operator. I have been re-examining the decedent's clothing because I could not sleep and I did not want to." },
    { msg: 'pryce', text: "There was a slip of paper folded into the lining of his left shoe. It is enciphered and the header says K = THE NAME I USED." },
    { flag: 'have_cy_vance' },
    { objective: 'CIPHER DESK — break the slip from the decedent\'s shoe.' },

    { wait: 'cy_vance_done' },
    { pause: 700 },
    { msg: 'reyes', text: "Shot-firing shed. Locker eleven. Under the siren." },
    { msg: 'reyes', text: "'Where the noise is'. He told his wife in 1987 and she thought he was being poetic." },
    { msg: 'reyes', text: "I'm eight minutes from the quarry. Stay on the wire." },
    { pause: 2600 },
    { clock: 12 },
    { msg: 'reyes', text: "I'm in the shed. Locker eleven. Padlock's a warded pattern, and I have a brass key out of a dead man's pocket." },
    { pause: 2200 },
    { sfx: 'unlock' },
    { msg: 'reyes', text: "..." },
    { msg: 'reyes', text: "Operator, there is a ledger in here." },
    { msg: 'reyes', text: "Green cloth, hand-ruled, eleven years of it. Dates, amounts, initials. It stops in July." },
    { msg: 'reyes', text: "And on the inside cover, in pencil: 'W.R.F. — 1987 to date. If found, I did not run. I was kept.'" },
    { evidence: ['ev_ledger_found'] },
    { flag: 'ledger_recovered' },
    { pause: 1200 },
    { msg: 'reyes', text: "I'm not bringing this to the office. I'm taking it to the Medical Examiner and I'm getting a receipt with a time on it." },
    { ask: { options: [
      { label: "Do that. And call the Ledger. Adair still has a phone.", flag: 'went_public',
        steps: [
          { msg: 'reyes', text: "...You want to give a federal ledger to a newspaper." },
          { msg: 'reyes', text: "Yes. All right. Yes." },
          { msg: 'reyes', text: "Adair has been waiting eleven years for somebody to hand her the thing they took off her." }
        ] },
      { label: "Just the Medical Examiner. Keep it clean.", flag: 'kept_clean',
        steps: [
          { msg: 'reyes', text: "Clean is right. Clean is how it survives a courtroom." }
        ] }
    ] } },
    { pause: 800 },

    /* ── timeline ── */
    { msg: 'solt', text: "Reconstruction program. Put his last four days in order before anybody asks you to do it under oath." },
    { objective: 'TIMELINE — reconstruct the last four days of Elias Vance.' },
    { wait: 'tl_1998_done', timeout: 420000 },
    { pause: 500 },

    /* ── the trace ── */
    { sfx: 'alert' },
    { clock: 14 },
    { msg: 'pryce', cls: 'alert', text: "Operator. The cellular carrier just returned the overnight registrations I asked for on every agency handset, which I requested four hours ago as a routine audit and which is about to stop looking routine." },
    { msg: 'pryce', cls: 'alert', text: "The Deputy Chief's car phone registered to three sites at 01:52." },
    { flag: 'trace_grieve' },
    { objective: 'CARTOGRAPH — triangulate the 01:52 registration.' },

    { wait: 'triangulated_grieve' },
    { pause: 800 },
    { msg: 'reyes', cls: 'alert', text: "He was on the hill at two o'clock this morning." },
    { msg: 'reyes', cls: 'alert', text: "While he was offering you a job in Records, he had already been up there." },
    { pause: 1000 },
    { msg: 'solt', text: "Operator." },
    { msg: 'solt', text: "The fourth floor terminal just came up on the volume monitor. He's running something." },
    { shake: true },
    { pause: 900 },
    { goto: 'ch6' }
  ]);

  D.trigger({
    id: 't_ch5_finn_call', when: { all: ['ch5', 'finn_deal'] },
    steps: [
      { pause: 3000 },
      { msg: 'finn', text: "Operator. I see you are still working." },
      { msg: 'finn', text: "The Records post starts Monday. There is no work between now and Monday." },
      { msg: 'finn', text: "Please stop." }
    ]
  });
})(window.NW);

/* NIGHTWIRE — story/ch2.js — PAPER PEOPLE */
(function (NW) {
  'use strict';
  var D = NW.director;

  D.scene('ch2', [
    { chapterNum: 2 },
    { flag: 'ch2' },
    { gate: "Understood. I'm going to find out who signed off on 1987." },
    { chapter: { num: 'CHAPTER TWO', title: 'PAPER PEOPLE',
      desc: 'SATURDAY 7 NOVEMBER · 00:04<br>NCIB REGIONAL, SUB-LEVEL 2<br>THE BUILDING IS EMPTY ABOVE THE SECOND FLOOR' } },
    { caseLabel: 'CASE VC 98-1173 — IDENTIFICATION DISPUTED' },
    { clock: 14 },

    { msg: 'solt', text: "Operator. It's ten past midnight and I've been sitting here doing something I do not enjoy, which is thinking." },
    { msg: 'solt', text: "That terminal was supposed to be wiped in March. Property Branch raised a work order and closed it complete four days later without anybody coming down here." },
    { msg: 'solt', text: "I know because I signed for the engineer who never arrived." },
    { pause: 500 },
    { msg: 'solt', text: "There's a shell on the system. Everything Voss had is probably still sitting on that drive underneath your login." },
    { unlockApp: 'shell' },
    { objective: 'SHELL — find what the previous operator left on this terminal.' },
    { msg: 'solt', text: "DIR won't show you everything. It never does. Ask it properly." },

    { wait: { any: ['fs_reveal', 'voss_partition_open'] } },
    { pause: 400 },
    { msg: 'solt', text: "There it is. USR, VOSS." },
    { msg: 'solt', text: "Read her index file first. She left a note for whoever came next, and I have not been able to make myself open it." },

    { wait: 'voss_partition_open' },
    { pause: 600 },
    { sfx: 'unlock' },
    { msg: 'solt', text: "..." },
    { msg: 'solt', text: "'The road, and the year.' She meant Mercer. She was already on Mercer Road in March." },
    { evidence: ['ev_voss_dir'] },
    { unlockRecord: ['p_voss'] },
    { unlockApp: 'cipher' },
    { objective: 'SHELL — decrypt everything in her .WIRE directory.' },

    { wait: { any: ['voss_notes_read', 'trace_read'] } },
    { pause: 500 },
    { msg: 'reyes', text: "Operator, it's Reyes, I'm in the car park. What have you got that couldn't wait till morning?" },
    { ask: { options: [
      { label: "The operator before me was working this case in March. She found a dead man drawing a wage." },
      { label: "There's an eight-month-old file on my terminal and it says the same thing we found tonight." }
    ] } },
    { msg: 'reyes', text: "Say that again slowly." },
    { msg: 'reyes', text: "A social security number with a death indicator set in August of '87, cleared by hand four weeks later, drawing wages ever since." },
    { msg: 'reyes', text: "Cleared by hand means somebody typed it. Somebody with a supervisory code." },
    { unlockDoc: ['d_w2_98'] },
    { evidence: ['ev_wagetrace'] },
    { pause: 400 },
    { msg: 'reyes', text: "And the wage in the last two quarters is being paid by Halloran Aggregate. In this county. He came home." },
    { pause: 500 },

    /* ── press ── */
    { objective: 'Find out what was printed in 1987.' },
    { msg: 'solt', text: "There's a reel reader on sub-level two. County holds the Ledger back to 1961 on microfilm and nobody has looked at 1987 since 1987." },
    { unlockApp: 'microfilm' },
    { msg: 'solt', text: "Reel's already mounted. Focus knob sticks; give it a push." },

    { wait: function (s) { return s.docs['d_ledger_1']; } },
    { pause: 500 },
    { msg: 'reyes', text: "Twenty-two fifty-two." },
    { msg: 'reyes', text: "The fire was called in at 22:52 and the police report says the alarm came at 23:10. A reporter found that in 1987, printed it, and was writing about the county fair a fortnight later." },
    { evidence: ['ev_earlycall'] },
    { flag: 'ch2_dispatch_seen' },
    { unlockRecord: ['p_adair'] },
    { pause: 400 },

    /* ── audio ── */
    { msg: 'pryce', text: "Operator — I went into the county tape vault on my own initiative, which is a phrase I would like on my headstone." },
    { msg: 'pryce', text: "Dispatch reel 87/33. The 22:52 call is still on it. Fourteen seconds of a frightened man and about nine seconds of everything behind him." },
    { unlockApp: 'audiolab' },
    { flag: 'audio_au_911_87' },
    { msg: 'pryce', text: "Filter the voice out and listen to the room. A recording of a man is also a recording of where he was standing.", att: { kind: 'audio', id: 'au_911_87', label: 'EXHIBIT A-1 — DISPATCH TAPE 08/12/1987' } },
    { objective: 'AUDIO LAB — establish where the 1987 caller was standing.' },

    { wait: 'auconc_au_911_87' },
    { pause: 600 },
    { msg: 'reyes', text: "He was at the quarry." },
    { msg: 'reyes', text: "He phoned in a car fire on Mercer Road from a quarry two and a half miles away, eighteen minutes before the car caught." },
    { msg: 'reyes', text: "That's not a witness. That's a man on a schedule." },
    { pause: 400 },

    /* ── timeline ── */
    { msg: 'solt', text: "Reconstruction program's on the rail. Put the night of the twelfth in order using what the records actually support, not what the report says." },
    { unlockApp: 'timeline' },
    { objective: 'TIMELINE — reconstruct the night of 12 August 1987.' },
    { wait: 'tl_1987_done' },
    { pause: 500 },
    { msg: 'reyes', text: "So the car was put in position, the fuse was set, the fire was reported before it burned, and a police sergeant wrote down a time he was given." },
    { msg: 'reyes', text: "Which leaves the only question worth asking." },
    { msg: 'reyes', text: "If Elias Vance walked away from that car — who was in it?" },
    { objective: 'Identify the body that burned in 1987.' },
    { pause: 400 },

    /* ── the phone ── */
    { msg: 'solt', text: "You'll want the outside line. It's authorised for the night desk and nobody has used it in years because nobody wants a record of who they called." },
    { unlockApp: 'switchboard' },
    { unlockRecord: ['p_sikes', 'p_abaroa', 'p_seibold'] },
    { unlockDoc: ['d_dental_87'] },
    { msg: 'solt', text: "Three numbers worth your time tonight: the Medical Examiner, the woman who's worked the desk at the Blue Larkspur since 1979, and Doyle Brennick, who wrote the report and lives four hundred yards from where he wrote it." },
    { msg: 'solt', text: "Brennick will lie to you. Let him. Then read him his own bank statement." },
    { unlockRecord: ['p_brennick'] },

    { wait: { any: [{ evidence: ['ev_dental_swap'] }, { evidence: ['ev_ansel_motel'] }] } },
    { pause: 500 },
    { unlockRecord: ['p_fearn_r', 'p_fearn_o', 'p_ansel'] },
    { unlockDoc: ['d_missing_87', 'd_motel_reg', 'd_dental_seibold', 'd_fearn_method'] },
    { toast: { head: 'INDEX EXPANDED', body: 'FEARN, R. · FEARN, O. · ANSEL, C. — and four documents', kind: 'good' } },
    { msg: 'reyes', text: "Rennick Fearn. Went missing from a motel on Route 9 two days before the fire and nobody ever worked the case." },
    { msg: 'reyes', text: "Brother of Odis Fearn, who is doing twenty-five years for burning a house down with a person in it." },

    { objective: 'Report who burned in the 1987 vehicle.' },
    { request: {
      id: 'req_ch2_body', ref: 'VC 98-1173 / 3', title: 'THE 1987 DECEDENT',
      prompt: 'Name the man who actually burned on Mercer Road, and the basis.',
      slots: [
        { id: 'who', label: 'DECEDENT', accept: ['person'] },
        { id: 'basis', label: 'BASIS', type: 'choice', options: [
          { v: 'dental', l: 'DENTITION — #12-13 BRIDGE AND #21 EXTRACTION' },
          { v: 'height', l: 'HEIGHT ESTIMATE FROM THE REMAINS' },
          { v: 'motel', l: 'HE WAS MISSING AT THE RIGHT TIME' },
          { v: 'brother', l: 'HIS BROTHER IS A CONVICTED ARSONIST' }
        ] }
      ],
      answer: { who: 'p_fearn_r', basis: 'dental' },
      onWrong: function () {
        NW.wire.push({ msg: 'reyes', text: "Timing and family aren't evidence, they're a reason to look. What is in that man's mouth that was also in the 1987 remains and was never in Elias Vance's chart?" });
      }
    } },
    { evidence: ['ev_dental_swap'] },
    { pause: 600 },
    { msg: 'reyes', text: "A bridge on twelve and thirteen, and an extraction on twenty-one, in a chart that didn't have them." },
    { msg: 'reyes', text: "Seibold wrote 'in my opinion the identification is sound' and banked twelve thousand dollars eight days later." },
    { pause: 400 },

    { objective: 'CASEBOOK — prove the substitution.' },
    { wait: 'th_substitution' },
    { pause: 500 },

    /* ── Finn ── */
    { clock: 24 },
    { sfx: 'alert' },
    { unlockContact: 'finn' },
    { msg: 'finn', cls: 'alert', text: 'Operator. Walter Finn, Deputy Chief.' },
    { pause: 900 },
    { msg: 'finn', text: "I gather you have had a productive first night." },
    { msg: 'finn', text: "I have read the summary. A fingerprint from a 1979 bonding card against a body with no hands to speak of. I would be careful about how much weight you put on that." },
    { msg: 'finn', text: "Transcription errors in the seventies indices are not rare. I have seen an operator lose a year to one." },
    { ask: { prompt: 'REPLY TO THE FOURTH FLOOR', options: [
      { label: "Twelve corresponding points, sir. No unexplained differences.", flag: 'stood_up',
        steps: [
          { msg: 'finn', text: "Twelve." },
          { pause: 700 },
          { msg: 'finn', text: "You are very sure of yourself for somebody who has been in that chair for three hours." },
          { msg: 'finn', text: "Send everything you have to my office before you go off shift. Everything, operator. Not a summary." }
        ] },
      { label: "Understood. I'll flag it as provisional.", flag: 'played_along',
        steps: [
          { msg: 'finn', text: "Good. That is the correct instinct." },
          { msg: 'finn', text: "The night desk is not the place to make an identification that will end up in a courtroom. Leave it for the day people." },
          { msg: 'finn', text: "Send me what you have and get some sleep." }
        ] },
      { label: "Sir — why is the 1987 coroner file marked archived offsite when it's in the county index?", flag: 'confronted_finn',
        steps: [
          { pause: 1400 },
          { msg: 'finn', text: "..." },
          { msg: 'finn', text: "That is a records question and you should put it to Records." },
          { msg: 'finn', text: "Send me everything you have before you go off shift." },
          { evidence: ['ev_finn_voss_line'] }
        ] }
    ] } },
    { pause: 1200 },
    { msg: 'solt', text: "He's never once rung this desk at one in the morning. Not in twelve years." },
    { pause: 700 },
    { msg: 'solt', text: "Operator — ask me about Voss." },
    { objective: 'SWITCHBOARD — call the duty desk. Ask Solt about Voss.' },
    { flag: 'solt_ready' },

    { wait: 'solt_ally' },
    { pause: 600 },
    { msg: 'solt', text: "Right. That's said." },
    { msg: 'solt', text: "You keep pulling. I'll fetch." },
    { evidence: ['ev_solt_turn'] },
    { unlockDoc: ['d_nc71_voss', 'd_effects_log', 'd_solt_note'] },
    { toast: { head: 'DUTY DESK — OFF LOG', body: 'Voss separation file, effects log, staffing note', kind: 'good' } },
    { pause: 800 },
    { goto: 'ch3' }
  ]);

  /* ── optional threads ── */
  D.trigger({
    id: 't_ch2_register', when: { all: ['read_d_motel_reg'], not: [{ evidence: ['ev_ansel_motel'] }] },
    steps: [
      { msg: 'reyes', text: "You've read the register. Room 14, eleventh of August, paid out to month end by a man who signed himself 'Ansell' with two Ls." },
      { msg: 'reyes', text: "Lenore Sikes asked him twice because she thought he'd made a mistake. He hadn't. He just couldn't spell his own alias." },
      { evidence: ['ev_ansel_motel'] }
    ]
  });

  D.trigger({
    id: 't_ch2_brennick', when: { all: ['ch2', function (s) { return s.evidence['ev_brennick_admit']; }] },
    steps: [
      { msg: 'reyes', text: "He hung up on you. That's not nothing — a man with a clean conscience argues." },
      { unlockDoc: ['d_brennick_pay'] },
      { evidence: ['ev_seibold_paid'] },
      { msg: 'reyes', text: "I've got his bank return here. Twelve thousand on the twentieth of August 1987. Same branch, same day, as the dentist." },
      { msg: 'reyes', text: "They didn't even go to different banks." }
    ]
  });

  D.trigger({
    id: 't_ch2_adair', when: { all: ['ch2', function (s) { return s.evidence['ev_adair_photo']; }] },
    steps: [
      { msg: 'reyes', text: "Adair's photograph is the whole case in one frame and a wire editor spiked it in 1987." },
      { msg: 'reyes', text: "A car on the quarry access road, above the fire, with a man standing beside it. Whoever that is watched it burn from the place he'd phoned it in from." }
    ]
  });
})(window.NW);

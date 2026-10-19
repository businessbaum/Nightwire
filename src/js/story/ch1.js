/* NIGHTWIRE — story/ch1.js — THE QUARRY */
(function (NW) {
  'use strict';
  var D = NW.director;

  D.scene('ch1', [
    { chapterNum: 1 },
    { flag: 'ch1' },
    { gate: "Terminal 04 acknowledging. Put me through to whoever is standing at that quarry." },
    { chapter: { num: 'CHAPTER ONE', title: 'THE QUARRY',
      desc: 'FRIDAY 6 NOVEMBER 1998 · 22:50<br>HALLORAN QUARRY, OFF MERCER ROAD<br>SEVEN DEGREES AND RAINING ON THE RIDGE' } },
    { caseLabel: 'CASE VC 98-1173 — HALLORAN QUARRY', urgent: true },
    { clock: 12 },

    { unlockContact: 'reyes' },
    { msg: 'reyes', text: "Terminal 04, this is Reyes, Unit 11. Are you the new one?" },
    { ask: { options: [
      { label: "Reporting. Go ahead." },
      { label: "Newer than you'd like tonight. Go ahead.", flag: 'tone_human' }
    ] } },
    { msg: 'reyes', text: "Don't apologise for it. Half the people who've sat in that chair were worse than nobody." },
    { msg: 'reyes', text: "Here's what I've got. Adult male, out of the south end of a flooded quarry, weighted at the ankles with chain and a plate of steel off the stockpile. In the water somewhere between a day and three days." },
    { msg: 'reyes', text: "No wallet. No keys. No ring. Somebody cut the labels out of his shirt and his trousers — cut, not torn, so they took their time." },
    { msg: 'reyes', text: "I need a name. Everything else waits until I have a name." },
    { objective: 'Identify the quarry decedent.' },
    { pause: 500 },

    { unlockContact: 'pryce' },
    { msg: 'pryce', text: "Pryce, evidence response. I'm at the tent and I'm cold." },
    { msg: 'pryce', text: "Hands were sloughing but I ran the tissue-builder and I got you ridge detail off the right thumb. Twelve points, clean. That's a gift and I want it acknowledged." },
    { msg: 'pryce', text: "L-1 is on your terminal. Comparison program's been authorised for your badge." },
    { evidence: ['ev_latent'] },
    { flag: 'latent_cmp_quarry' },
    { unlockApp: 'daktylo' },
    { unlockDoc: 'd_scene_98' },
    { unlockApp: 'archive' },
    { msg: 'pryce', text: "The index gave me four candidate cards on pattern class. One of them is your man, or none of them are. Both are answers.", att: { kind: 'app', id: 'daktylo', label: 'OPEN DAKTYLO — LATENT L-1' } },
    { objective: 'DAKTYLO — compare latent L-1 against the four candidate cards.' },

    { wait: 'print_ident_quarry' },
    { pause: 600 },
    { msg: 'pryce', text: "You got there. Eight points is court; twelve is an easy afternoon." },

    { objective: 'Transmit the identification to Unit 11.' },
    { request: {
      id: 'req_ch1_id', ref: 'VC 98-1173 / 1', title: 'IDENTIFICATION OF DECEDENT',
      prompt: 'Transmit the subject record to Unit 11.',
      slots: [{ id: 'subject', label: 'DECEDENT', accept: ['person'] }],
      answer: { subject: 'p_vance' },
      onWrong: function () { NW.wire.push({ msg: 'reyes', text: "That's not who the print says. Send me the record the comparison landed on, not the one that feels right." }); }
    } },

    { pause: 900 },
    { msg: 'reyes', text: "..." },
    { msg: 'reyes', text: "Operator, my copy of that record has a line in it that says the man died in 1987." },
    { msg: 'reyes', text: "Read it back to me. All of it." },
    { ask: { options: [
      { label: "Vance, Elias Theodore. Accountant, Halloran Aggregate. Deceased twelve August 1987, vehicle fire, Mercer Road. Coroner file 87-4410." },
      { label: "The record's wrong, or the print is. One of them has to give." , flag: 'tone_pro' }
    ] } },
    { pause: 600 },
    { msg: 'reyes', text: "Mercer Road is two and a half miles from where I'm standing." },
    { msg: 'reyes', text: "Pull the '87 file. All of it. I want to know how they decided he was dead the first time." },
    { unlockDoc: ['d_accident_87', 'd_coroner_87'] },
    { unlockRecord: ['p_vance', 'p_brennick'] },
    { evidence: ['ev_deadman', 'ev_87file'] },
    { objective: 'ARCHIVE — read the 1987 accident report and coroner finding.' },
    { toast: { head: 'FILED TO ARCHIVE', body: '2 documents — 1987 Mercer Road', kind: 'good' } },

    { wait: { all: ['read_d_coroner_87', 'read_d_accident_87'] } },
    { pause: 700 },
    { msg: 'reyes', text: "Well?" },
    { objective: 'Report what is wrong with the 1987 identification.' },
    { request: {
      id: 'req_ch1_87', ref: 'VC 98-1173 / 2', title: 'DEFECT IN THE 1987 IDENTIFICATION',
      prompt: 'One answer. The one that actually matters.',
      slots: [{ id: 'defect', label: 'PRINCIPAL DEFECT', type: 'choice', options: [
        { v: 'skid', l: 'NO SKID MARKS WERE RECORDED AT THE SCENE' },
        { v: 'prints', l: 'NO FINGERPRINT COMPARISON WAS ATTEMPTED — DENTAL ONLY' },
        { v: 'fire', l: 'CAUSE OF FIRE WAS NOT PROPERLY DETERMINED' },
        { v: 'insurer', l: 'THE VEHICLE WAS RELEASED TO THE INSURER TOO EARLY' }
      ] }],
      answer: { defect: 'prints' },
      onWrong: function () { NW.wire.push({ msg: 'reyes', text: "All true and none of them make a dead man walk. What established that the body in that car was Elias Vance? Not what was sloppy — what was the identification actually built on?" }); }
    } },
    { pause: 400 },
    { msg: 'reyes', text: "Dental. One dentist, one afternoon, and three of the six features didn't agree." },
    { msg: 'reyes', text: "Somebody accepted that. In writing." },
    { evidence: ['ev_printmatch'] },
    { pause: 500 },

    /* ── image lab ── */
    { msg: 'pryce', text: "Operator — I'm sending you the wide shot of the south shelf before we churned it up with boots. Enhancement's authorised on your badge." },
    { unlockApp: 'imagelab' },
    { flag: 'photo_ph_quarry_wide' },
    { msg: 'pryce', text: "The ground there is dust over hardpan. If anything drove down to the water in the last week it's still written on it. Push the contrast — the flood lamps flattened everything.", att: { kind: 'photo', id: 'ph_quarry_wide', label: 'EXHIBIT P-1 — QUARRY, SOUTH SHELF' } },
    { objective: 'IMAGE LAB — find what came down to the water.' },

    { wait: 'find_fd_tracks' },
    { pause: 500 },
    { msg: 'reyes', text: "Dual rear wheels. That's a tipper or a heavy van, and it reversed to the edge and never turned round." },
    { msg: 'reyes', text: "Nobody dumps a body out of a vehicle like that unless the vehicle belongs there. That's a working motion, operator. Somebody did this at the end of a shift." },
    { evidence: ['ev_tyre', 'ev_key'] },
    { pause: 500 },

    /* ── casebook ── */
    { msg: 'solt', text: "Terminal 04. There's a corkboard program on the system. Voss used it constantly and nobody's touched it since." },
    { msg: 'solt', text: "Put your exhibits on it. String the ones that belong together. It sounds like arts and crafts. It is not." },
    { unlockApp: 'casebook' },
    { objective: 'CASEBOOK — connect the print identification to the 1987 coroner finding.' },
    { wait: 'th_notvance' },
    { pause: 400 },

    { msg: 'reyes', text: "So we agree. Either the print is wrong, or a man was declared dead in 1987 and somebody else burned in his car." },
    { msg: 'reyes', text: "And prints don't lie about this. Prints lie about a lot of things but not about this." },
    { pause: 600 },

    { clock: 20 },
    { msg: 'solt', text: "Heads up. Fourth floor rang the night desk." },
    { msg: 'solt', text: "Deputy Chief Finn wants a one-page summary of the quarry job before you go any further with it." },
    { msg: 'solt', text: "That's not unusual. I want you to know I said that out loud so that one of us has said it." },
    { ask: { prompt: 'HOW DO YOU HANDLE THE FOURTH FLOOR?', options: [
      { label: "Send the summary. Everything we have.", choice: 'ch1_summary', value: 'full', flag: 'finn_alerted',
        steps: [
          { msg: 'solt', text: "All right." },
          { pause: 500 },
          { msg: 'solt', text: "For what it's worth: you just told a man on the fourth floor the name of a dead man, at eleven o'clock at night, before you knew why it mattered." },
          { msg: 'solt', text: "I'm not saying that's wrong. I'm saying I noticed." }
        ] },
      { label: "Send a summary. Leave the name out for now.", choice: 'ch1_summary', value: 'partial', flag: 'held_name',
        steps: [
          { msg: 'solt', text: "'Unidentified adult male, enquiries continuing.'" },
          { msg: 'solt', text: "That's a true sentence and it is not the whole truth, and I've written it four hundred times myself." },
          { msg: 'solt', text: "Noted and not logged." }
        ] },
      { label: "Nothing goes up until Reyes has the ground.", choice: 'ch1_summary', value: 'none', flag: 'stonewalled',
        steps: [
          { msg: 'solt', text: "(pause)" },
          { msg: 'solt', text: "You've been in that chair two hours." },
          { msg: 'solt', text: "...Fine. I'll tell them the operator is mid-comparison. Which is true. Don't make a habit of making me true." }
        ] }
    ] } },

    { pause: 900 },
    { msg: 'reyes', text: "Operator. I'm going to be here until the divers finish and then I'm going to drive to the office and sleep in the car." },
    { msg: 'reyes', text: "While I'm doing that, you've got a whole building of paper and nobody watching you use it." },
    { msg: 'reyes', text: "Find out who signed off on 1987." },
    { objective: 'Find out who closed the 1987 file.' },
    { pause: 700 },
    { goto: 'ch2' }
  ]);

  /* ── optional discoveries ── */
  D.trigger({
    id: 't_ch1_key', when: { all: ['ch1', 'read_d_scene_98'] },
    steps: [
      { msg: 'pryce', text: "You read the scene report. Then you'll have seen the key." },
      { msg: 'pryce', text: "Brass, warded, unmarked. That's a padlock key, not a door key. A man with no wallet and no labels in his clothes was still carrying one key." },
      { msg: 'pryce', text: "Whatever it opens, he thought it was worth more than being anonymous." },
      { evidence: ['ev_key'] }
    ]
  });
})(window.NW);

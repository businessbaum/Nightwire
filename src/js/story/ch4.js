/* NIGHTWIRE — story/ch4.js — GOOD MEN */
(function (NW) {
  'use strict';
  var D = NW.director;

  D.scene('ch4', [
    { chapterNum: 4 },
    { flag: 'ch4' },
    { gate: "Reyes — it's one of ours. I'm going to prove it on paper before I say it out loud." },
    { chapter: { num: 'CHAPTER FOUR', title: 'GOOD MEN',
      desc: 'SATURDAY 7 NOVEMBER · 02:41<br>NCIB REGIONAL, SUB-LEVEL 2<br>THE FOURTH FLOOR LIGHTS ARE ON' } },
    { caseLabel: 'CASE VC 98-1173 — INTERNAL NEXUS', urgent: true },
    { clock: 15 },

    { msg: 'pryce', text: "Operator. I have run the casing and I would like you to sit still for this." },
    { msg: 'pryce', text: "Comparison microscope's authorised for your badge. Do it yourself. I want a second pair of eyes on this before it goes anywhere." },
    { unlockApp: 'ballistics' },
    { objective: 'BALLISTICS — identify the weapon that fired M-1.' },

    { wait: 'ballistics_done' },
    { pause: 700 },
    { msg: 'pryce', text: "8841-D. A revolver this agency put in a furnace in December 1994." },
    { msg: 'pryce', text: "And the only line on that schedule with no witnessing initials." },
    { evidence: ['ev_weapon_agency', 'ev_nc88'] },
    { pause: 500 },
    { msg: 'reyes', text: "Operator, read me the signature block on the NC-88." },
    { ask: { options: [
      { label: "Authorising officer: W. R. Finn, Deputy Chief." },
      { label: "It's Finn. It's been Finn since the second document.", flag: 'said_it_first' }
    ] } },
    { pause: 800 },
    { msg: 'reyes', text: "Say it once more into the log so it's on the record that you said it and not me." },
    { pause: 600 },

    /* ── clearance ── */
    { msg: 'reyes', text: "Now. You can't read a personnel file at clearance one and I am not going to be the one who authorises it, because I am the officer he moved off Public Corruption in 1997." },
    { msg: 'reyes', text: "Pryce is a Technician III. She can sponsor an uplift for a live case. It logs. Everybody will know by Monday." },
    { msg: 'reyes', text: "Ask her anyway." },
    { objective: 'SWITCHBOARD — get a clearance uplift from Pryce.' },

    { wait: 'clearance2' },
    { pause: 500 },
    { sfx: 'unlock' },
    { toast: { head: 'CLEARANCE 2 — 12 HRS', body: 'Personnel index open', kind: 'good' } },
    { unlockRecord: ['p_finn', 'p_solt', 'p_reyes', 'p_del', 'p_pryce', 'p_voss'] },
    { msg: 'reyes', text: "Read his file. Then read hers." },
    { objective: 'REGISTRY — read the personnel index.' },

    { wait: 'read_p_finn' },
    { pause: 600 },
    { msg: 'reyes', text: "Field Operations to 1989. Witness Security liaison, '85 to '90." },
    { msg: 'reyes', text: "He was the liaison in 1987." },
    { pause: 400 },

    /* ── witsec ── */
    { msg: 'solt', text: "Operator — the Marshals' duty desk in Kelland just called me back. I rang them an hour ago on a hunch and I did not log it." },
    { msg: 'solt', text: "There's a retired inspector called Pemberton who has been filing complaints about one file in his sector since 1988." },
    { unlockRecord: ['p_pemberton'] },
    { unlockDoc: ['d_pemberton_complaint'] },
    { msg: 'solt', text: "He's awake. He said, and I quote, 'I have been waiting eleven years, put them through.'" },
    { objective: 'SWITCHBOARD — call Inspector Pemberton.' },

    { wait: function (s) { return s.evidence['ev_pemberton_names_finn']; } },
    { pause: 700 },
    { unlockDoc: ['d_witsec_87'] },
    { unlockRecord: ['p_maule'] },
    { evidence: ['ev_witsec_sole'] },
    { toast: { head: 'SEALED FILE RELEASED', body: 'WS-2 · PROGRAM ENTRY 08/29/1987', kind: 'good' } },
    { msg: 'reyes', text: "Sole custodian. Joint custody waived in one sentence 'at the request of the originating office'." },
    { msg: 'reyes', text: "He wrote the sentence, he made the request, and he approved it. All three." },
    { msg: 'reyes', text: "And then he ran a man for eleven years." },
    { pause: 500 },

    /* ── the deduction ── */
    { objective: 'Report the common authorising signature.' },
    { msg: 'solt', text: "Before you send anything up — do it properly. Cross-reference the signature block on every document you hold. Not the ones you remember. All of them." },
    { request: {
      id: 'req_ch4_sig', ref: 'VC 98-1173 / 4', title: 'COMMON AUTHORISING OFFICER',
      prompt: 'Name the officer whose signature or written recommendation appears on all four instruments.',
      slots: [
        { id: 'who', label: 'OFFICER', accept: ['person'] },
        { id: 'docs', label: 'INSTRUMENTS', type: 'choice', options: [
          { v: 'a', l: 'WS-2 · NC-71 · NC-88 · SECURITY LICENCE WAIVER' },
          { v: 'b', l: 'PA-14 · VC-9 · DENTAL WORKSHEET · CLAIM ADVICE' },
          { v: 'c', l: 'NC-30 · AUTOPSY · BALLISTICS · CAD LOG' },
          { v: 'd', l: 'LEDGER ARTICLES · MOTEL REGISTER · MANIFESTS' }
        ] }
      ],
      answer: { who: 'p_finn', docs: 'a' },
      onWrong: function () {
        NW.wire.push({ msg: 'solt', text: "No. Look at who signs, not who is written about. The program entry, the separation, the disposal schedule and the licence waiver. One hand on all four." });
      }
    } },
    { evidence: ['ev_signature'] },
    { pause: 800 },
    { msg: 'reyes', text: "One hand authorised the man's disappearance, the weapon that killed him, the licence of the man who drove for the killer, and the resignation of the operator who found the whole thing." },
    { objective: 'CASEBOOK — establish that the principal is inside the Bureau.' },
    { wait: 'th_insider' },
    { pause: 600 },

    /* ── the lot ── */
    { msg: 'solt', text: "One more thing and then I want you to think about what I'm about to do to my pension." },
    { flag: 'photo_ph_lot_van' },
    { msg: 'solt', text: "Staff car park security frame, twenty-two oh four tonight. Before your shift started properly. Push it.", att: { kind: 'photo', id: 'ph_lot_van', label: 'EXHIBIT P-4 — STAFF LOT' } },
    { objective: 'IMAGE LAB — enhance the staff lot frame.' },
    { wait: 'find_fd_reflect', timeout: 240000 },
    { if: 'find_fd_reflect', then: [
      { pause: 500 },
      { msg: 'solt', text: "A man in a long coat at the sub-level service door at ten past ten at night, standing exactly where that camera can't see him." },
      { msg: 'solt', text: "Brennick's man in the coat. Nine years apart and he's still standing outside a door." },
      { evidence: ['ev_lotreflection'] }
    ] },
    { pause: 400 },
    { msg: 'solt', text: "And there's an access log on the volume. It won't have been purged because the purge job runs off the same work order as the reimage." },
    { flag: 'ch4' },
    { objective: 'SHELL — read /VAR/LOG/ACCESS.LOG.' },
    { wait: 'access_log_read', timeout: 240000 },
    { if: 'access_log_read', then: [
      { pause: 600 },
      { msg: 'solt', text: "Three minutes." },
      { msg: 'solt', text: "He watched her session, cancelled her print job, revoked her access and printed her resignation in three minutes at four o'clock in the morning." },
      { msg: 'solt', text: "And the service exit opened at 04:31 with no badge on it." },
      { msg: 'solt', text: "She never walked out of this building, operator. She was carried out of it." }
    ] },
    { pause: 900 },

    /* ── Finn's offer ── */
    { sfx: 'alert' },
    { clock: 12 },
    { msg: 'finn', cls: 'alert', text: 'Operator.' },
    { pause: 1100 },
    { msg: 'finn', text: "I see a clearance uplift on a live case, sponsored by a technician, at three in the morning." },
    { msg: 'finn', text: "I am not angry. I want to say that plainly. I was your age once and I understood exactly nothing about how a building works." },
    { pause: 700 },
    { msg: 'finn', text: "There is a vacancy in Records. Days. Weekends off. Two grades up from the night desk and no field agent has ever bled because a Records clerk was slow." },
    { msg: 'finn', text: "It is yours on Monday if you want it. Nothing else needs to be said about tonight." },
    { objective: 'Answer the Deputy Chief.' },
    { ask: { prompt: 'THIS IS ON THE RECORD', options: [
      { label: "I'll take it. Thank you, sir.", choice: 'finn_offer', value: 'accept', flag: 'finn_deal',
        steps: [
          { msg: 'finn', text: "Good." },
          { msg: 'finn', text: "Close the quarry file as unidentified pending dental review and go home." },
          { pause: 900 },
          { msg: 'solt', text: "..." },
          { msg: 'solt', text: "All right." },
          { msg: 'solt', text: "I'm not going to say anything. I took the same deal in 1987, I just wasn't offered it out loud." }
        ] },
      { label: "No, sir.", choice: 'finn_offer', value: 'refuse', flag: 'finn_refused',
        steps: [
          { pause: 1400 },
          { msg: 'finn', text: "..." },
          { msg: 'finn', text: "That is a very expensive word." },
          { msg: 'finn', text: "Get some sleep, operator." },
          { pause: 600 },
          { msg: 'reyes', text: "He's not going to sleep. Neither are we." }
        ] },
      { label: "Where is Margaret Voss?", choice: 'finn_offer', value: 'voss', flag: 'finn_refused',
        steps: [
          { pause: 2200 },
          { msg: 'finn', text: "..." },
          { pause: 1400 },
          { msg: 'finn', text: "Margaret resigned." },
          { msg: 'finn', text: "Some people cannot carry this work. It is not a failing. It is a fact about them that they discover late." },
          { pause: 900 },
          { msg: 'finn', text: "Go home." },
          { evidence: ['ev_finn_voss_line'] },
          { flag: 'asked_finn_voss' },
          { pause: 800 },
          { msg: 'reyes', text: "'Cannot'. Present tense." },
          { msg: 'reyes', text: "Operator, he just used the present tense about her." }
        ] }
    ] } },
    { pause: 1500 },
    { glitch: true },
    { goto: 'ch5' }
  ]);

  D.trigger({
    id: 't_ch4_bellamy', when: { all: ['ch4', function (s) { return s.evidence['ev_bellamy_finn']; }] },
    steps: [
      { msg: 'reyes', text: "The registered agent is his brother-in-law. Of course he is." },
      { msg: 'reyes', text: "Nobody clever ever gets caught by the clever part, operator. They get caught by the fact that they gave the paperwork to family." },
      { unlockDoc: ['d_llc_alden'] }
    ]
  });
})(window.NW);

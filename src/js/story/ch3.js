/* NIGHTWIRE — story/ch3.js — LIVE WIRE */
(function (NW) {
  'use strict';
  var D = NW.director;

  D.scene('ch3', [
    { chapterNum: 3 },
    { flag: 'ch3' },
    { gate: "Then start fetching. Everything on the Marrow Street mill." },
    { chapter: { num: 'CHAPTER THREE', title: 'LIVE WIRE',
      desc: 'SATURDAY 7 NOVEMBER · 01:38<br>77 MARROW STREET<br>THE ONLY BUILDING IN THE COUNTY WITH ITS LIGHTS ON' } },
    { caseLabel: 'CASE VC 98-1173 — ACTIVE', urgent: true },
    { clock: 18 },

    { msg: 'reyes', text: "Operator. Change of pace." },
    { msg: 'reyes', text: "Sheriff's CAD has a watchman at the Marrow Street mill calling in trucks at night for two years. Nobody ever went. One of those calls got referred to this agency by name." },
    { unlockDoc: ['d_dispatch_98', 'd_manifest_98'] },
    { msg: 'reyes', text: "And the haulage log says a tipper leaves an empty quarry every Wednesday and arrives at that mill weighing the same as it left." },
    { evidence: ['ev_trucks'] },
    { pause: 400 },

    { msg: 'pryce', text: "There's a pen register on 555-0288 — Ansel's line at the mill. It's been running since a wire-tampering referral in 1996 and nobody has listened to a minute of it." },
    { msg: 'pryce', text: "Twelve seconds from the fourth of November. Two men. It is not a nice recording." },
    { flag: 'audio_au_mill_tap' },
    { flag: 'trace_mill' },
    { unlockApp: 'cartograph' },
    { msg: 'pryce', text: "You've also got the cell registrations for the handset that placed it.", att: { kind: 'audio', id: 'au_mill_tap', label: 'EXHIBIT A-2 — INTERCEPT 11/04/98' } },
    { objective: 'AUDIO LAB + CARTOGRAPH — establish where the 11/04 call was placed from.' },

    { wait: { all: ['auconc_au_mill_tap', 'triangulated_mill'] } },
    { pause: 500 },
    { msg: 'reyes', text: "Inside the mill footprint. And 'he had it on him, it's in the office'." },
    { msg: 'reyes', text: "Something came off that body before it went in the water, and it's still in that building." },
    { evidence: ['ev_triangulated'] },
    { pause: 400 },

    { unlockContact: 'del' },
    { msg: 'del', text: "Operator, Nkemdirim. I'm with Reyes. We're two streets out and I want to say hello before anything happens, because my wife says I'm rude on the radio." },
    { msg: 'del', text: "Hello." },
    { ask: { options: [
      { label: "Hello, Agent. Stay behind Reyes." },
      { label: "Hello. I'm going to keep you two out of trouble." },
      { label: "Hello. Do not go in that building yet." , flag: 'cautious' }
    ] } },
    { pause: 500 },

    /* ── the photo ── */
    { msg: 'reyes', text: "I'm parked on the north face with the lamps off. Sending you a frame off the car camera before we move." },
    { flag: 'photo_ph_mill_ext' },
    { msg: 'reyes', text: "Tell me what I'm looking at, operator. You have about four minutes before Del gets bored.", att: { kind: 'photo', id: 'ph_mill_ext', label: 'EXHIBIT P-2 — MILL, NORTH FACE' } },
    { objective: 'IMAGE LAB — enhance the mill frame before they move.' },

    { wait: 'find_fd_figure', timeout: 150000 },
    { pause: 400 },
    { if: 'find_fd_figure',
      then: [
        { msg: 'reyes', text: "Say again — there's a man standing in the bay doorway?" },
        { msg: 'reyes', text: "He's not moving toward us. He's standing well back in the dark with the door open." },
        { msg: 'reyes', text: "That's not a man who hasn't seen us. That's a man who's left the door open." },
        { evidence: ['ev_millfigure'] },
        { flag: 'saw_figure' }
      ],
      else: [
        { msg: 'reyes', text: "Nothing? All right. We'll do it the old way." }
      ] },
    { pause: 300 },

    /* ── TIMED DECISION 1 ── */
    { sfx: 'alert' },
    { msg: 'reyes', cls: 'alert', text: "We're going in. Loading bay's standing open and the personnel door on the north side is chained." },
    { msg: 'reyes', cls: 'alert', text: "Operator — bay or side? Call it." },
    { objective: 'CALL IT.' },
    { ask: { prompt: 'RESPONSE WINDOW', timer: 22, options: [
      { label: "Do not use the bay. Cut the chain on the north door.", reply: "Do not use the bay. It's open because he wants it used. Cut the chain.",
        flag: 'ch3_good_entry', choice: 'entry', value: 'north',
        steps: [
          { msg: 'reyes', text: "Copy. Del, bolt cutters." },
          { pause: 1600 },
          { msg: 'reyes', text: "Chain's off. We're in the packing hall." }
        ] },
      { label: "Take the bay. Speed over caution.", reply: "Take the bay. Go fast.",
        choice: 'entry', value: 'bay', flag: 'ch3_bad_entry', set: { del_hurt: true },
        steps: [
          { msg: 'reyes', text: "Copy. Going." },
          { pause: 2200 },
          { sfx: 'bad' }, { shake: true },
          { msg: 'reyes', cls: 'alert', text: "SHOTS FIRED. SHOTS FIRED, DEL IS DOWN—" },
          { pause: 1800 },
          { msg: 'reyes', cls: 'alert', text: "He's breathing. Vest took it, he's breathing, shoulder's bad. I've got pressure on it." },
          { flag: 'del_hurt' },
          { pause: 900 },
          { msg: 'reyes', text: "The bay was open because it was covered, operator." },
          { msg: 'reyes', text: "I'm not going to say anything else about it tonight." }
        ] },
      { label: "Stand down. Wait for a second unit.", reply: "Stand down. Wait for backup.",
        choice: 'entry', value: 'wait', flag: 'ch3_waited', set: { ch3_good_entry: true },
        steps: [
          { msg: 'reyes', text: "There is no second unit. There are two night cars in this county and the other one is at the quarry." },
          { pause: 1200 },
          { msg: 'reyes', text: "...We'll take the side door. Del, cutters." },
          { pause: 1600 },
          { msg: 'reyes', text: "We're in. That cost us four minutes." },
          { flag: 'ch3_good_entry' }
        ] }
    ],
    timeoutOption: { label: '(no response)', reply: '(no response sent)', choice: 'entry', value: 'timeout', flag: 'ch3_bad_entry', set: { del_hurt: true },
      steps: [
        { msg: 'reyes', text: "Operator?" },
        { pause: 1400 },
        { msg: 'reyes', text: "Going in the bay. I'm not standing in a car park all night." },
        { pause: 2000 },
        { sfx: 'bad' }, { shake: true },
        { msg: 'reyes', cls: 'alert', text: "SHOTS — DEL IS DOWN—" },
        { pause: 1600 },
        { msg: 'reyes', cls: 'alert', text: "Vest took it. He's breathing." },
        { flag: 'del_hurt' },
        { pause: 900 },
        { msg: 'reyes', text: "Next time answer me." }
      ] } } },

    { pause: 800 },

    /* ── TIMED DECISION 2 ── */
    { msg: 'reyes', cls: 'alert', text: "He's running. North end, up the stairs toward the old office." },
    { msg: 'reyes', cls: 'alert', text: "Operator — is there another way out of that building? Fast." },
    { objective: 'IS THERE A SECOND EXIT?' },
    { ask: { prompt: 'RESPONSE WINDOW', timer: 18, options: [
      { label: "Stand by — checking the lease plan.", reply: "Stand by. Ninety seconds.",
        steps: [
          { pause: 2400 },
          { msg: 'reyes', text: "Ninety seconds is ninety seconds. Talk." },
          { ask: { prompt: 'NOW ANSWER', timer: 16, options: [
            { label: "Fire escape, north gable, drops to the yard. He's going for it.", reply: "Fire escape on the north gable. He's going for the yard.",
              flag: 'ch3_exit_right',
              steps: [
                { msg: 'reyes', text: "Del — yard, now—" },
                { pause: 2000 },
                { msg: 'reyes', text: "Missed him by about nine seconds. Grey van, out the west gate, no lights." },
                { msg: 'reyes', text: "But we have got the office, and he left in a hurry." }
              ] },
            { label: "No second exit. He's cornered up there.", reply: "No second exit on the plan. He's cornered.",
              flag: 'ch3_exit_wrong',
              steps: [
                { pause: 2200 },
                { msg: 'reyes', text: "There's a fire escape, operator." },
                { msg: 'reyes', text: "There is a fire escape on the north gable and he went down it while we were standing at the bottom of a staircase feeling clever." },
                { msg: 'reyes', text: "Grey van, west gate. Gone." }
              ] }
          ] } }
        ] },
      { label: "Fire escape, north gable. He's going for the yard.", reply: "Fire escape, north gable, drops to the yard.",
        flag: 'ch3_exit_right',
        steps: [
          { msg: 'reyes', text: "Del — yard—" },
          { pause: 1800 },
          { msg: 'reyes', text: "Nine seconds too slow. Grey van, west gate, no lights." },
          { msg: 'reyes', text: "But we have the office." }
        ] },
      { label: "No — he's cornered.", reply: "No second exit. He's cornered.",
        flag: 'ch3_exit_wrong',
        steps: [
          { pause: 2000 },
          { msg: 'reyes', text: "There was a fire escape." },
          { msg: 'reyes', text: "Grey van. West gate. Gone." }
        ] }
    ],
    timeoutOption: { label: '(no response)', reply: '(no response sent)', flag: 'ch3_exit_wrong',
      steps: [
        { pause: 1600 },
        { msg: 'reyes', text: "Nothing. Fine." },
        { pause: 1800 },
        { msg: 'reyes', text: "He went out a fire escape on the north gable while we held a staircase." }
      ] } } },

    { pause: 1000 },
    { clock: 16 },

    /* ── aftermath ── */
    { msg: 'reyes', text: "Right. Standing in the office. I'm going to describe it and you're going to write it down." },
    { msg: 'reyes', text: "Camp bed. Two-ring stove. A calendar with the Wednesdays circled. A gun safe, open and empty." },
    { msg: 'reyes', text: "And a cartridge case on the floor of the loading bay that somebody bent down for and missed." },
    { evidence: ['ev_casing'] },
    { unlockApp: 'ballistics' },
    { flag: 'latent_cmp_mill' },
    { msg: 'pryce', text: "Casing's coming to me. There's also a latent off the office door plate — M-4, left index. It's on your terminal." },
    { unlockRecord: ['p_ansel', 'p_gault', 'p_keel'] },
    { objective: 'DAKTYLO — identify latent M-4 from the mill office.' },

    { wait: 'print_ident_mill' },
    { pause: 500 },
    { msg: 'reyes', text: "Curtis Ray Ansel. Security contractor for the leaseholder. Felony conviction, licensed anyway." },
    { msg: 'reyes', text: "Read me the waiver." },
    { unlockDoc: ['d_ansel_lic'] },
    { pause: 600 },
    { msg: 'reyes', text: "'Waiver granted on the written recommendation of a federal law-enforcement officer.'" },
    { msg: 'reyes', text: "Somebody in our building vouched for an arsonist's driver so he could carry a gun legally." },
    { evidence: ['ev_ansel_id'] },
    { pause: 400 },

    /* ── the motel ── */
    { msg: 'solt', text: "Operator. Traffic camera on Route 9 keeps thirty days. I pulled the fourth of November because I am now, apparently, the kind of man who does that." },
    { flag: 'photo_ph_motel_lot' },
    { unlockRecord: ['p_sikes'] },
    { msg: 'solt', text: "Blue Larkspur car park, half eleven at night. There's a plate in that frame. Read it and then sit down before you read it.", att: { kind: 'photo', id: 'ph_motel_lot', label: 'EXHIBIT P-3 — BLUE LARKSPUR LOT' } },
    { objective: 'IMAGE LAB — read the plate in the motel lot.' },

    { wait: 'find_fd_plate' },
    { pause: 700 },
    { msg: 'solt', text: "KTV-418." },
    { msg: 'solt', text: "That's the plate off the car that burned on Mercer Road in 1987. Released to the insurer. Never scrapped." },
    { msg: 'solt', text: "He kept his own car for eleven years and drove it home." },
    { evidence: ['ev_plate418'] },
    { objective: 'SWITCHBOARD — call the Blue Larkspur.' },

    { wait: function (s) { return s.evidence['ev_maule_motel']; } },
    { pause: 600 },
    { msg: 'reyes', text: "'Then you'll remember me.' And she didn't. And he was glad." },
    { msg: 'reyes', text: "Eleven years as Peter Maule and he came back to a motel four miles from his own house to find out whether he still existed." },
    { pause: 700 },
    { msg: 'reyes', text: "Operator — I'm going to say the thing neither of us has said." },
    { msg: 'reyes', text: "Somebody put a man into witness protection and then kept him. For eleven years. On a payroll." },
    { msg: 'reyes', text: "That is not organised crime with a friend in the Bureau. That is the Bureau, with a business." },
    { objective: 'CASEBOOK — connect the mill to the operation.' },
    { wait: 'th_mill' },
    { pause: 600 },
    { goto: 'ch4' }
  ]);

  D.trigger({
    id: 't_ch3_delhurt', when: { all: ['del_hurt', 'ch3'] },
    steps: [
      { pause: 4000 },
      { msg: 'del', text: "Operator." },
      { msg: 'del', text: "It's Del. They've got me in the back of the ambulance and Reyes is being very quiet, which is how she shouts." },
      { msg: 'del', text: "It wasn't the wrong call. It was a call. Somebody had to make one." },
      { msg: 'del', text: "Just — make the next one faster." }
    ]
  });
})(window.NW);

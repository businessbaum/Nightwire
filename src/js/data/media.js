/* NIGHTWIRE — data/media.js
   Photographic exhibits and audio exhibits. Both are generated, not loaded.
   Photographs hide detail at very low contrast: the player has to push the
   image before it gives anything up. */
(function (NW) {
  'use strict';

  var PHOTOS = [
    {
      id: 'ph_quarry_wide', title: 'EXHIBIT P-1 — QUARRY, SOUTH SHELF', scene: 'quarry', seed: 'q1',
      cap: 'HALLORAN QUARRY · 11/06/1998 · 21:40 · ERT',
      finds: [
        { id: 'fd_tracks', x: 0.585, y: 0.60, r: 0.10, label: 'DUAL-WHEEL TYRE IMPRESSIONS TO THE WATERLINE',
          minContrast: 1.35, evidence: 'ev_tyre',
          note: 'Twin tracks, commercial dual-rear pattern, running from the access road straight to the shelf edge. Nothing was turned around. Something was backed up and tipped in.' }
      ]
    },
    {
      id: 'ph_mill_ext', title: 'EXHIBIT P-2 — MARROW ST MILL, NORTH FACE', scene: 'mill', seed: 'm2',
      cap: 'MARROW STREET PAPER MILL · 11/07/1998 · 00:12 · UNIT 11',
      finds: [
        { id: 'fd_figure', x: 0.415, y: 0.63, r: 0.090, label: 'FIGURE STANDING INSIDE THE BAY DOORWAY',
          minContrast: 1.45, evidence: 'ev_millfigure',
          note: 'A man, roughly 6-2, heavy build, standing well back from the opening. He is not moving toward the agents. He is waiting for them to come in.' }
      ]
    },
    {
      id: 'ph_motel_lot', title: 'EXHIBIT P-3 — BLUE LARKSPUR, LOT', scene: 'motel', seed: 'b3',
      cap: 'BLUE LARKSPUR MOTEL · 11/04/1998 · 23:31 · TRAFFIC CAM',
      finds: [
        { id: 'fd_plate', x: 0.612, y: 0.893, r: 0.070, label: 'REGISTRATION PLATE — KTV-418',
          minContrast: 1.55, evidence: 'ev_plate418',
          note: 'KTV-418. That plate belongs to a car that burned on Mercer Road in August 1987 and was released to an insurer. It is in this parking lot, two days before a body went into the quarry.' }
      ]
    },
    {
      id: 'ph_lot_van', title: 'EXHIBIT P-4 — CIVIC PLAZA STAFF LOT', scene: 'lot', seed: 'l4',
      cap: 'NCIB REGIONAL — STAFF LOT · 11/06/1998 · 22:04 · SECURITY',
      finds: [
        { id: 'fd_reflect', x: 0.615, y: 0.650, r: 0.070, label: 'SECOND FIGURE REFLECTED IN THE VAN GLASS',
          minContrast: 1.45, evidence: 'ev_lotreflection',
          note: 'There are two people in this frame and only one of them is in it. The reflection is of a man in a long coat standing where the camera cannot see him — inside the building line, at the sub-level door.' }
      ]
    },
    {
      id: 'ph_house_int', title: 'EXHIBIT P-5 — 4 LOWNDES ST, APT 3', scene: 'house', seed: 'h5',
      cap: '4 LOWNDES STREET · 03/17/1998 · LANDLORD ENTRY',
      finds: [
        { id: 'fd_hand', x: 0.44, y: 0.41, r: 0.090, label: 'PARTIAL HAND SMEAR ON THE WALL, SHOULDER HEIGHT',
          minContrast: 1.50, evidence: 'ev_handprint',
          note: 'Four fingers, dragged downward, at the height of a person being taken through a doorway sideways. It was photographed and never processed. The apartment was cleaned by a contractor eleven days later.' }
      ]
    },
    {
      id: 'ph_ward', title: 'EXHIBIT P-6 — GRIEVE HILL, BLDG B CORRIDOR', scene: 'ward', seed: 'w6',
      cap: 'GRIEVE HILL STATE HOSPITAL · UNDATED · SOURCE UNKNOWN',
      finds: [
        { id: 'fd_ward', x: 0.487, y: 0.345, r: 0.090, label: 'STENCILLED WARD DESIGNATION — B-17',
          minContrast: 1.50, evidence: 'ev_b17',
          note: 'B-17. Building B, Ward 17. The photograph arrived on this terminal without a routing header. Somebody wanted it here.' }
      ]
    }
  ];

  /* ── AUDIO EXHIBITS ──
     layers: each is synthesised. `band` is where it lives in the spectrum —
     the player has to filter down to it before the spectrogram shows it. */
  var AUDIO = [
    {
      id: 'au_911_87', title: 'EXHIBIT A-1 — DISPATCH TAPE, 08/12/1987 22:52',
      dur: 14, source: 'VC DISPATCH — REEL 87/33',
      transcript: [
        { t: 0.6, s: 'DISPATCH', l: 'Vandermeer emergency.' },
        { t: 2.4, s: 'CALLER', l: "There's a fire. Car fire. Off Mercer." },
        { t: 5.2, s: 'DISPATCH', l: 'Mercer Road? What mile marker, sir?' },
        { t: 7.4, s: 'CALLER', l: "I don't— four. Around four. It's already going." },
        { t: 10.2, s: 'DISPATCH', l: 'Sir, are you at the scene?' },
        { t: 11.8, s: 'CALLER', l: '(line disconnects)' }
      ],
      layers: [
        { type: 'phoneline', vol: 0.14 },
        { type: 'voice', vol: 0.42, f0: 118, band: [300, 3000],
          words: [[0.6, 1.3], [2.4, 2.4], [5.2, 2.0], [7.4, 2.4], [10.2, 1.4]] },
        { type: 'siren', vol: 0.045, band: [280, 520], at: [3.1, 8.9], hidden: true, id: 'quarry_siren' },
        { type: 'crossing', vol: 0.030, band: [700, 1200], at: [0, 14], hidden: true, id: 'rail_crossing' },
        { type: 'wind', vol: 0.035, band: [60, 400] }
      ],
      options: [
        { id: 'quarry_siren', l: 'BLASTING SIREN (QUARRY)', ok: true,
          note: 'Two long blasts, 90 seconds apart — the Halloran shot-firing signal. It is audible for about 900 metres.' },
        { id: 'rail_crossing', l: 'RAILROAD CROSSING BELL', ok: true,
          note: 'The Mercer Ridge spur crossing. It rings for four minutes either side of the 22:50 freight.' },
        { id: 'church', l: 'CHURCH BELLS', ok: false },
        { id: 'gulls', l: 'GULLS / HARBOUR', ok: false },
        { id: 'dog', l: 'DOG BARKING', ok: false },
        { id: 'traffic', l: 'PASSING TRAFFIC', ok: false }
      ],
      conclusion: {
        evidence: 'ev_callerloc',
        fact: 'The 1987 caller stood inside the quarry, not on Mercer Road — and he called eighteen minutes before the crash he was reporting.',
        text: 'Only one point in the county hears both the Halloran blasting siren and the Mercer Ridge crossing: the quarry access road. The man who reported the fire was standing at the quarry — 2.8 miles from Mercer Road mile 4 — eighteen minutes before the collision he described.'
      }
    },
    {
      id: 'au_mill_tap', title: 'EXHIBIT A-2 — INTERCEPT, 11/04/1998 23:07',
      dur: 12, source: 'PEN REGISTER — 555-0288',
      transcript: [
        { t: 0.4, s: 'MALE 1', l: "It's done. He's in the deep end." },
        { t: 3.0, s: 'MALE 2', l: '(unintelligible)' },
        { t: 4.4, s: 'MALE 1', l: "No. He had it on him. It's in the office." },
        { t: 7.2, s: 'MALE 2', l: 'Burn it.' },
        { t: 8.4, s: 'MALE 1', l: "You don't burn a thing like that. You keep it." },
        { t: 11.2, s: 'MALE 2', l: '(disconnects)' }
      ],
      layers: [
        { type: 'phoneline', vol: 0.13 },
        { type: 'voice', vol: 0.40, f0: 96, band: [280, 2800],
          words: [[0.4, 2.2], [4.4, 2.4], [8.4, 2.4]] },
        { type: 'voice', vol: 0.28, f0: 142, band: [300, 3000],
          words: [[3.0, 1.1], [7.2, 0.9]] },
        { type: 'machine', vol: 0.045, band: [90, 260], at: [0, 12], hidden: true, id: 'mill_plant' },
        { type: 'ferry', vol: 0.035, band: [55, 150], at: [5.6, 0], hidden: true, id: 'ferry_horn' }
      ],
      options: [
        { id: 'mill_plant', l: 'HEAVY PLANT / DRYER DRUM', ok: true,
          note: 'A slow 3.2 Hz beat under a 110 Hz drone — a paper dryer drum turning. Only one still turns in this county.' },
        { id: 'ferry_horn', l: 'FERRY HORN (SINGLE BLAST)', ok: true,
          note: 'The 23:07 Ashvale ferry. Audible along the north bank as far as Marrow Street.' },
        { id: 'siren', l: 'EMERGENCY SIREN', ok: false },
        { id: 'crossing', l: 'RAILROAD CROSSING', ok: false },
        { id: 'rain', l: 'HEAVY RAIN', ok: false },
        { id: 'aircraft', l: 'AIRCRAFT OVERHEAD', ok: false }
      ],
      conclusion: {
        evidence: 'ev_millcall',
        fact: 'The 11/04 call to Ansel\'s line was placed from inside the Marrow Street mill — and something taken off the body is still in the mill office.',
        text: 'A running dryer drum and the 23:07 ferry put this call at the Marrow Street mill. Male 1 says the item was "on him" and "it\'s in the office." Whatever Elias Vance was carrying when he died did not go into the water with him.'
      }
    },
    {
      id: 'au_voss_tape', title: 'EXHIBIT A-3 — ANSWERING MACHINE, 03/16/1998 04:09',
      dur: 16, source: 'RECOVERED — 4 LOWNDES ST',
      transcript: [
        { t: 0.5, s: 'VOSS', l: "Grahame, it's Maggie. Don't come in. Don't call anybody." },
        { t: 4.2, s: 'VOSS', l: "I pulled a wage trace on a dead man and it came back current." },
        { t: 8.0, s: 'VOSS', l: "It's somebody upstairs. It's somebody with a signature." },
        { t: 11.4, s: 'VOSS', l: '(door) — no, I— ' },
        { t: 13.0, s: '', l: '(tape ends)' }
      ],
      layers: [
        { type: 'tapehiss', vol: 0.11 },
        { type: 'voice', vol: 0.42, f0: 196, band: [320, 3200],
          words: [[0.5, 3.2], [4.2, 3.4], [8.0, 3.0], [11.4, 1.2]] },
        { type: 'chime', vol: 0.035, band: [800, 1800], at: [6.4, 0], hidden: true, id: 'pa_chime' },
        { type: 'rotor', vol: 0.045, band: [40, 220], at: [9.5, 16], hidden: true, id: 'helicopter' },
        { type: 'hum', vol: 0.05, band: [50, 70] }
      ],
      options: [
        { id: 'pa_chime', l: 'INSTITUTIONAL PA CHIME (3-TONE)', ok: true,
          note: 'A three-note Westminster fragment. State hospitals used a single make of PA head; Grieve Hill still has power to Building B.' },
        { id: 'helicopter', l: 'ROTORCRAFT — LOW PASS', ok: true,
          note: 'A 12 Hz rotor beat holding for six seconds. The county air-ambulance pad is on Grieve Hill, and it was decommissioned in 1989 — but the approach lane is still flown.' },
        { id: 'traffic', l: 'MOTORWAY TRAFFIC', ok: false },
        { id: 'bells', l: 'CHURCH BELLS', ok: false },
        { id: 'surf', l: 'SURF / SHORELINE', ok: false },
        { id: 'crowd', l: 'CROWD NOISE', ok: false }
      ],
      conclusion: {
        evidence: 'ev_vosslocation',
        fact: 'Voss\'s last recording carries a state-hospital PA chime and the Grieve Hill rotor lane. She was taken toward Grieve Hill.',
        text: 'She did not record this at home. A hospital PA head and the Grieve Hill approach lane are on this tape. Wherever she was when the door opened, she got as far as Grieve Hill.'
      }
    }
  ];

  var pById = {}, aById = {};
  PHOTOS.forEach(function (p) { pById[p.id] = p; });
  AUDIO.forEach(function (a) { aById[a.id] = a; });

  NW.media = {
    photos: PHOTOS, audio: AUDIO,
    photo: function (id) { return pById[id]; },
    clip: function (id) { return aById[id]; },
    availablePhotos: function () {
      var st = NW.state.s;
      return PHOTOS.filter(function (p) { return st.flags['photo_' + p.id]; });
    },
    availableAudio: function () {
      var st = NW.state.s;
      return AUDIO.filter(function (a) { return st.flags['audio_' + a.id]; });
    }
  };
})(window.NW);

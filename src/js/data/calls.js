/* NIGHTWIRE — data/calls.js
   Switchboard numbers. Each live line has a greeting and topics; a topic can
   require a document or evidence first, and can give something back. */
(function (NW) {
  'use strict';
  var has = function (f) { return NW.state.has(f); };
  var ev = function (e) { return NW.state.hasEvidence(e); };

  var CALLS = [

  { number: '555-0198', who: 'BRENNICK, DOYLE S.', place: '3 MERCER ROAD',
    ring: 6,
    greeting: [
      { s: 'BRENNICK', l: "Yeah." },
      { s: 'YOU', l: 'This is the night desk at NCIB Regional. Sergeant Brennick?' },
      { s: 'BRENNICK', l: "Retired. Twenty-four years next spring. What time is it?" },
      { s: 'BRENNICK', l: "Say it or don't, son. I'm holding a drink." }
    ],
    topics: [
      { id: 'fire', q: 'Ask about the Mercer Road fire, August 1987.',
        a: [
          { s: 'BRENNICK', l: "(pause) Long time ago." },
          { s: 'BRENNICK', l: "Car left the road, caught. One fella inside. It happens on that curve." },
          { s: 'YOU', l: 'There were no skid marks.' },
          { s: 'BRENNICK', l: "Man falls asleep, he don't brake. You want physics or you want a story?" }
        ] },
      { id: 'time', q: 'Ask why the alarm time in his report is 23:10 when dispatch logged 22:52.',
        requires: function () { return ev('ev_earlycall') || has('ch2_dispatch_seen'); },
        a: [
          { s: 'BRENNICK', l: "..." },
          { s: 'BRENNICK', l: "Clerical. Dispatch double-punched it. Happened all the time back then." },
          { s: 'YOU', l: 'You wrote the later time. You were the one who saw the fire.' },
          { s: 'BRENNICK', l: "I wrote what I was told the alarm was." },
          { s: 'YOU', l: 'Told by whom?' },
          { s: 'BRENNICK', l: "(long pause) You know what I got out of twenty years? A knee that don't bend and a house four hundred yards from the worst thing I ever did." },
          { s: 'BRENNICK', l: "Don't call this number again." },
          { s: 'SYS', l: 'LINE DISCONNECTED BY FAR END' }
        ],
        gives: { evidence: 'ev_brennick_admit', fact: { c: 'BRENNICK', t: 'Brennick did not witness the alarm — he was given the time to write. He knows what he did.' } },
        end: true },
      { id: 'money', q: 'Ask about the $1,100 a month from Alden Civic Holdings.',
        requires: function () { return NW.state.s.docs['d_brennick_pay']; },
        a: [
          { s: 'BRENNICK', l: "Consulting." },
          { s: 'YOU', l: 'On what?' },
          { s: 'BRENNICK', l: "On keeping my mouth shut, obviously. What do you want me to say — that I'm proud?" },
          { s: 'BRENNICK', l: "A man came to my house in September of '87. He had a federal card and a nice coat and he never told me his name. He told me the file was closed and that it would stay closed and that my daughter was starting at the state college." },
          { s: 'BRENNICK', l: "That's the whole confession. Write it down." },
          { s: 'SYS', l: 'LINE DISCONNECTED BY FAR END' }
        ],
        gives: { evidence: 'ev_brennick_coat', fact: { c: 'BRENNICK', t: 'A federal officer in a long coat closed the 1987 file in person and has been paying Brennick since.' } },
        end: true }
    ]
  },

  { number: '555-0303', who: 'SIKES, LENORE — BLUE LARKSPUR MOTEL', place: 'RT 9',
    ring: 3,
    greeting: [
      { s: 'SIKES', l: "Blue Larkspur, we've got rooms." },
      { s: 'YOU', l: 'This is NCIB Regional, night desk.' },
      { s: 'SIKES', l: "Oh. Well. Nobody's dead in any of my rooms tonight, so you're ahead." }
    ],
    topics: [
      { id: 'fearn', q: 'Ask about Rennick Fearn, room 14, August 1987.',
        a: [
          { s: 'SIKES', l: "Renny. Sure. Quiet man. Paid Fridays." },
          { s: 'SIKES', l: "Then he didn't come back and a big fella came in and paid the room out to the end of the month and told me not to touch his things." },
          { s: 'YOU', l: 'Did he give a name?' },
          { s: 'SIKES', l: "He signed the book. Ansell, with two L's. I asked him twice because I thought he'd made a mistake and he looked at me like I'd made the mistake." },
          { s: 'SIKES', l: "Grey van. No plate I could see. Big hands." }
        ],
        gives: { evidence: 'ev_ansel_motel', fact: { c: 'MOTEL', t: 'Curtis Ansel paid off Rennick Fearn\'s motel room the day after Fearn vanished — 08/11/1987 — and signed the register "Ansell".' } } },
      { id: 'plate', q: 'Ask about the beige Oldsmobile in the lot, 11/04/1998.',
        requires: function () { return ev('ev_plate418'); },
        a: [
          { s: 'SIKES', l: "The beige one. Room 9. He was here four nights." },
          { s: 'YOU', l: 'Name?' },
          { s: 'SIKES', l: "Maule. Peter Maule. Older gentleman, glasses, very polite. Paid cash and asked if there was a bus." },
          { s: 'SIKES', l: "He asked me if I'd been here long. I said twenty years. He said —" },
          { s: 'SIKES', l: "He said, 'then you'll remember me.' And I didn't. And he seemed glad about it." },
          { s: 'SIKES', l: "He left on the sixth and didn't check out. His bag's still behind my desk." }
        ],
        gives: { evidence: 'ev_maule_motel', fact: { c: 'MOTEL', t: 'Elias Vance — as "Peter Maule" — stayed at the Blue Larkspur 11/02–11/06/1998. His bag is still behind the desk.' } } },
      { id: 'bag', q: 'Ask what is in the bag.',
        requires: function () { return ev('ev_maule_motel'); },
        a: [
          { s: 'SIKES', l: "I'm not going through a guest's bag." },
          { s: 'YOU', l: 'Mrs Sikes, the guest is in the county morgue.' },
          { s: 'SIKES', l: "(pause) ...Shirts. A razor. A bus timetable with Thursday circled." },
          { s: 'SIKES', l: "And a padlock key on a bit of orange string. No lock." },
          { s: 'YOU', l: 'Keep the bag. Don\'t let anybody else have it. Anybody.' },
          { s: 'SIKES', l: "...All right." }
        ],
        gives: { evidence: 'ev_key_match', fact: { c: 'MOTEL', t: 'Vance had a second padlock key on orange string — a pair to the one in his pocket. Two locks. Two hiding places.' } } }
    ]
  },

  { number: '555-0277', who: 'TREVINO, MARCUS', place: '14 MARROW ST',
    ring: 8,
    greeting: [
      { s: 'TREVINO', l: "(whispering) Who is this?" },
      { s: 'YOU', l: 'NCIB Regional, night desk. Mr Trevino?' },
      { s: 'TREVINO', l: "I called you people three times. Three times in two years." }
    ],
    topics: [
      { id: 'trucks', q: 'Ask about the trucks at the mill.',
        a: [
          { s: 'TREVINO', l: "Once a week. Wednesday, mostly. A tipper comes up from the quarry with its lights off." },
          { s: 'TREVINO', l: "You know what an empty tipper sounds like on Marrow Street? Like a drum. This one doesn't sound like a drum." },
          { s: 'TREVINO', l: "They back it into bay two and they're twenty minutes and then it goes out and it sounds exactly the same." }
        ],
        gives: { evidence: 'ev_trucks', fact: { c: 'MILL', t: 'A Halloran tipper delivers to Marrow Street weekly. It weighs the same going in and coming out.' } } },
      { id: 'light', q: 'Ask about the light in the old office.',
        a: [
          { s: 'TREVINO', l: "Second floor, north end. It's on some nights until three." },
          { s: 'TREVINO', l: "There's a man sleeps up there. Big. Drives a grey van. He's the one they pay to watch the place, which is funny, because I'm the one they pay to watch the place." },
          { s: 'TREVINO', l: "He never comes down the stairs, either. There's a fire escape off the north gable that drops into the yard, and that's where he keeps the van. Nose out, always." },
          { s: 'TREVINO', l: "I don't go past the stairs anymore." }
        ],
        gives: { flag: 'knows_fire_escape',
          fact: { c: 'MILL', t: 'The man in the mill office leaves by the fire escape on the north gable. It drops to the yard where his grey van is parked.' } } },
      { id: 'warn', q: 'Warn him to stay out of the building tonight.',
        requires: function () { return NW.state.s.chapter >= 3; },
        a: [
          { s: 'TREVINO', l: "...Tonight?" },
          { s: 'YOU', l: 'Get in your car and drive to a diner. Now.' },
          { s: 'TREVINO', l: "Okay. Okay. Thank you. Nobody's ever— okay." },
          { s: 'SYS', l: 'CALL ENDED' }
        ],
        gives: { flag: 'trevino_safe', fact: { c: 'MILL', t: 'Trevino was warned off the mill before the entry. He is out of the building.' } },
        end: true }
    ]
  },

  { number: '555-0411', who: 'PEMBERTON, HOLLIS — RET. INSPECTOR', place: 'BRAEMOOR, ST. OF KELLAND',
    ring: 10,
    requires: function () { return NW.state.s.records['p_pemberton'] || NW.state.s.docs['d_pemberton_complaint']; },
    greeting: [
      { s: 'PEMBERTON', l: "Pemberton." },
      { s: 'YOU', l: 'Inspector, this is NCIB Regional in Port Alden. It\'s about file WS-4-0119.' },
      { s: 'PEMBERTON', l: "(silence)" },
      { s: 'PEMBERTON', l: "Say the number again." },
      { s: 'YOU', l: 'WS-4-0119.' },
      { s: 'PEMBERTON', l: "It's eleven years and four months. I have been waiting for this telephone call for eleven years and four months." }
    ],
    topics: [
      { id: 'file', q: 'Ask what was wrong with the file.',
        a: [
          { s: 'PEMBERTON', l: "Everything and nothing. One custodian. That's the whole of it. One man held that file alone." },
          { s: 'PEMBERTON', l: "In this work you do not let one man own a human being. That is the entire reason the rules exist and they waived it in a single sentence." },
          { s: 'PEMBERTON', l: "I filed twice. They closed it twice. The second time a very polite person from Professional Responsibility called me at home to ask whether I was under strain." }
        ],
        gives: { evidence: 'ev_pemberton_custody', fact: { c: 'WITSEC', t: 'Finn held WS-4-0119 as sole custodian for eleven years. Two internal complaints were closed without a finding.' } } },
      { id: 'visit', q: 'Ask if he ever saw the principal.',
        a: [
          { s: 'PEMBERTON', l: "Never. Not once. I drove to the address in '92. It's a mail drop over a laundry." },
          { s: 'PEMBERTON', l: "The man renting the box was not my witness. He was some fellow who got twenty dollars a month to forward envelopes to a post office in Vandermeer County." },
          { s: 'YOU', l: 'Vandermeer.' },
          { s: 'PEMBERTON', l: "Yes. My protected witness's mail was being forwarded to the county he was protected from. I put that in writing. It is in the second complaint. Nobody has ever asked me about it." }
        ],
        gives: { evidence: 'ev_maildrop', fact: { c: 'WITSEC', t: 'Vance\'s WITSEC mail drop forwarded to Vandermeer County — he was never actually relocated away.' } } },
      { id: 'finn', q: 'Ask him to name the custodian.',
        requires: function () { return ev('ev_pemberton_custody'); },
        a: [
          { s: 'PEMBERTON', l: "You already know or you wouldn't have called." },
          { s: 'YOU', l: 'I need you to say it.' },
          { s: 'PEMBERTON', l: "Walter Finn. He was a GS-13 when he took it and he was a Deputy Chief when I stopped being able to do anything about it." },
          { s: 'PEMBERTON', l: "Son — if you are doing what I think you are doing, put it in writing tonight and give it to somebody outside that building. Not tomorrow. Tonight." },
          { s: 'PEMBERTON', l: "The last person who worked on this stopped answering her telephone in March." },
          { s: 'YOU', l: 'You knew Voss?' },
          { s: 'PEMBERTON', l: "She called me on a Tuesday. She was very careful and very frightened and she said she'd call me back on the Friday." },
          { s: 'PEMBERTON', l: "It is November." }
        ],
        gives: { evidence: 'ev_pemberton_names_finn', flag: 'knows_finn',
          fact: { c: 'WITSEC', t: 'Pemberton names Walter Finn as sole custodian — and confirms Voss called him days before she disappeared.' } } }
    ]
  },

  { number: '555-0122', who: 'MOSS, PATRICE — VC COUNTY RECORDS', place: 'COURTHOUSE SQ',
    ring: 4,
    greeting: [
      { s: 'MOSS', l: "County records, we're closed." },
      { s: 'YOU', l: 'You answered.' },
      { s: 'MOSS', l: "I always answer. It's my great failing. What do you need?" }
    ],
    topics: [
      { id: 'llc', q: 'Ask for filings by ALDEN CIVIC HOLDINGS LLC.',
        a: [
          { s: 'MOSS', l: "Oh, that one. Hold on. ...Four properties, one member undisclosed, registered agent Howard Bellamy." },
          { s: 'MOSS', l: "You want my opinion or you want the record?" },
          { s: 'YOU', l: 'Both.' },
          { s: 'MOSS', l: "The record is that it's a property company. My opinion is that a property company that has never rented anything to anyone is a coat with nobody in it." }
        ],
        gives: { doc: 'd_llc_alden' } },
      { id: 'grieve', q: 'Ask about the Grieve Hill lease.',
        requires: function () { return NW.state.s.docs['d_llc_alden']; },
        a: [
          { s: 'MOSS', l: "Buildings B and C. Twenty-five years at a dollar. Signed off by the Surplus Property Board in '94." },
          { s: 'MOSS', l: "Records storage, permitted use. No public admittance." },
          { s: 'MOSS', l: "There's a note in the file from the power company from last month. Building B is drawing eighteen hundred kilowatt-hours a month." },
          { s: 'YOU', l: 'What does eighteen hundred mean?' },
          { s: 'MOSS', l: "It means it's warm in there, honey. Paper doesn't need heating." }
        ],
        gives: { doc: 'd_lease_grieve', evidence: 'ev_grieve_power', flag: 'place_pl_grieve',
          fact: { c: 'GRIEVE HILL', t: 'Building B at Grieve Hill draws 1,880 kWh a month under a $1-a-year "records storage" lease.' } } },
      { id: 'bellamy', q: 'Ask who Howard Bellamy is.',
        requires: function () { return NW.state.s.docs['d_llc_alden']; },
        a: [
          { s: 'MOSS', l: "Married Eleanor Finn in 1978. St. Brendan's. I was at the wedding — my cousin did the flowers." },
          { s: 'MOSS', l: "Eleanor Finn. As in Walter Finn, over at your place." },
          { s: 'MOSS', l: "You didn't get that from me and also everybody in this county already knows it." }
        ],
        gives: { evidence: 'ev_bellamy_finn', unlockRecord: 'p_bellamy',
          fact: { c: 'SHELL', t: 'Howard Bellamy, registered agent of Alden Civic Holdings, is Walter Finn\'s brother-in-law.' } } }
    ]
  },

  { number: '555-0140', who: 'ABAROA, INES — VC MEDICAL EXAMINER', place: '2 CIVIC PLAZA',
    ring: 3,
    greeting: [
      { s: 'ABAROA', l: "Abaroa." },
      { s: 'YOU', l: 'Night desk, NCIB Regional. About 98-6612.' },
      { s: 'ABAROA', l: "The quarry. Good. Somebody read it." }
    ],
    topics: [
      { id: 'teeth', q: 'Ask about the #12–13 bridge.',
        a: [
          { s: 'ABAROA', l: "It's a 1980s porcelain-fused bridge, and it is the second one I have read about in this county." },
          { s: 'ABAROA', l: "The first is in a 1987 coroner's finding I have been trying to get hold of since 1995." },
          { s: 'ABAROA', l: "The dentition in my quarry decedent does not match the 1987 ante-mortem chart. It matches the *post-mortem* description in the 1987 file." },
          { s: 'YOU', l: 'Say that again.' },
          { s: 'ABAROA', l: "In 1987 they had a body with a bridge and a chart without one, and they signed it anyway." },
          { s: 'ABAROA', l: "Tonight I have a body with the same bridge. Two men cannot share a mouth. One of those identifications is a lie and I would very much like to know which." }
        ],
        gives: { evidence: 'ev_dental_swap',
          fact: { c: 'MEDICAL', t: 'The 1987 remains had a #12–13 bridge that Vance never had — but Rennick Fearn did. The 1987 body was Fearn.' } } },
      { id: 'gun', q: 'Ask about the gunshot wound.',
        a: [
          { s: 'ABAROA', l: "Left chest, front to back, slightly downward. No soot, no stippling — over a metre." },
          { s: 'ABAROA', l: "And no water in the airways. He was dead before he went in." },
          { s: 'ABAROA', l: "Whoever did it stood back and did it properly. That is not a fight. That is an appointment." }
        ] },
      { id: 'file87', q: 'Tell her you can send her the 1987 coroner file.',
        requires: function () { return NW.state.s.docs['d_coroner_87']; },
        a: [
          { s: 'ABAROA', l: "You have it?" },
          { s: 'YOU', l: 'It was never offsite. It was in the county index the whole time.' },
          { s: 'ABAROA', l: "(quietly) Three years." },
          { s: 'ABAROA', l: "Send it. And operator — put your name on the transmittal. If this goes the way I think it goes, you'll want a record that you were the one who handed it over." }
        ],
        gives: { evidence: 'ev_me_ally', flag: 'me_ally',
          fact: { c: 'MEDICAL', t: 'Dr Abaroa has the 1987 file and an independent record of it. There is now a copy outside the building.' } } }
    ]
  },

  { number: '555-0322', who: 'ADAIR, SIMONE — FMR. PORT ALDEN LEDGER', place: '88 GARNET ST',
    ring: 5,
    requires: function () { return NW.state.s.docs['d_ledger_1']; },
    greeting: [
      { s: 'ADAIR', l: "Hello?" },
      { s: 'YOU', l: 'Ms Adair? NCIB Regional.' },
      { s: 'ADAIR', l: "It's a quarter past one in the morning." },
      { s: 'ADAIR', l: "...It's about Mercer Road, isn't it. Hold on, let me sit down." }
    ],
    topics: [
      { id: 'dispatch', q: 'Ask about the 10:52 dispatch entry.',
        a: [
          { s: 'ADAIR', l: "I found it in four hours with a photocopier and a friend in dispatch. Four hours." },
          { s: 'ADAIR', l: "I put it in the paper. And a week later the county desk was 'restructured' and I was writing about the county fair." },
          { s: 'YOU', l: 'Who called the paper?' },
          { s: 'ADAIR', l: "Nobody called the paper. Somebody called my publisher's golf partner. That's how it's done here." }
        ],
        gives: { evidence: 'ev_adair_press', fact: { c: 'PRESS', t: 'Adair broke the 22:52 discrepancy in 1987 and was moved off the beat within a week.' } } },
      { id: 'morgue', q: 'Ask what she kept.',
        a: [
          { s: 'ADAIR', l: "Everything. Two filing boxes and a shoebox of microfiche I am not supposed to have." },
          { s: 'ADAIR', l: "There's a photograph in there that never ran. Wire service pulled it. It's the fire scene at about midnight, wide, from the ridge." },
          { s: 'ADAIR', l: "There's a car parked up on the access road above the fire with somebody standing beside it. Nobody ever asked who." },
          { s: 'YOU', l: 'Can you get it to the county morgue — Dr Abaroa? Not to this building.' },
          { s: 'ADAIR', l: "...You're the first person from your outfit who's ever said 'not to this building.'" },
          { s: 'ADAIR', l: "I'll drive it over now." }
        ],
        requires: function () { return ev('ev_adair_press'); },
        gives: { evidence: 'ev_adair_photo', flag: 'adair_helping',
          fact: { c: 'PRESS', t: 'Adair kept a spiked 1987 wire photo showing a car and a figure on the quarry access road above the fire.' } } }
    ]
  },

  { number: '555-0155', who: 'OSTERHOLT, CLAIRE', place: '6 WREN COURT, ASHVALE',
    ring: 9,
    requires: function () { return NW.state.s.records['p_claire']; },
    greeting: [
      { s: 'OSTERHOLT', l: "(sleepy) Hello?" },
      { s: 'YOU', l: 'Mrs Osterholt, I\'m sorry for the hour. NCIB Regional.' },
      { s: 'OSTERHOLT', l: "(fully awake) Is this about Elias." }
    ],
    topics: [
      { id: 'calls', q: 'Ask about the calls in April.',
        a: [
          { s: 'OSTERHOLT', l: "I withdrew that complaint." },
          { s: 'YOU', l: 'I know. I\'d like to know why.' },
          { s: 'OSTERHOLT', l: "...Because on the third call he said my name. Not Claire. The other one. The one he made up on our honeymoon and never used in front of anyone." },
          { s: 'OSTERHOLT', l: "And I have buried that man. I buried him with a closed casket because they told me there was nothing to see." },
          { s: 'OSTERHOLT', l: "You do not get to make me un-bury him at one in the morning." },
          { s: 'OSTERHOLT', l: "(pause) He's dead again, isn't he. That's why you're calling." }
        ],
        gives: { evidence: 'ev_claire_call', fact: { c: 'VANCE', t: 'Vance telephoned his widow in April 1998 and used a private name only he knew.' } } },
      { id: 'ledger', q: 'Ask whether Elias kept anything at the quarry.',
        requires: function () { return ev('ev_claire_call'); },
        a: [
          { s: 'OSTERHOLT', l: "He had a locker in the shot-firing shed. Everyone did." },
          { s: 'OSTERHOLT', l: "That summer he stopped bringing work home. He used to spread it all over the kitchen table and that summer he stopped, and he got very cheerful about it, which is how I knew it was bad." },
          { s: 'OSTERHOLT', l: "He said, 'if anything happens, the important thing is where the noise is.'" },
          { s: 'OSTERHOLT', l: "I thought he was being poetic. He was an accountant. He was never poetic in his life." }
        ],
        gives: { evidence: 'ev_locker_hint', fact: { c: 'VANCE', t: '"Where the noise is" — Vance kept a locker in the quarry shot-firing shed, where the blasting siren is mounted.' } } }
    ]
  },

  { number: '555-0244', who: 'PRYCE, OONA — EVIDENCE RESPONSE', place: 'NCIB LAB',
    ring: 2,
    greeting: [
      { s: 'PRYCE', l: "Lab." },
      { s: 'YOU', l: 'Night desk.' },
      { s: 'PRYCE', l: "Terminal 04. I know. Your extension comes up as 'VOSS, M.' and nobody has ever fixed it." }
    ],
    topics: [
      { id: 'prints', q: 'Ask about the quality of the quarry latents.',
        a: [
          { s: 'PRYCE', l: "L-1 is a gift. L-2 is a smear with opinions." },
          { s: 'PRYCE', l: "Use L-1. Eight points and I'll testify. Twelve and I'll enjoy it." }
        ] },
      { id: 'clearance', q: 'Ask her to sponsor a clearance uplift for personnel files.',
        requires: function () { return NW.state.s.chapter >= 4; },
        a: [
          { s: 'PRYCE', l: "You want to read personnel files at two in the morning." },
          { s: 'YOU', l: 'Yes.' },
          { s: 'PRYCE', l: "Whose?" },
          { s: 'YOU', l: "I'd rather not say on this line." },
          { s: 'PRYCE', l: "(pause) That's the correct answer, actually." },
          { s: 'PRYCE', l: "I'm a Technician III. I can sponsor a temporary uplift for a live case. It logs. Everybody will know by Monday." },
          { s: 'YOU', l: 'Do it anyway.' },
          { s: 'PRYCE', l: "Done. Clearance 2, twelve hours. Don't make me regret being the interesting one at my own disciplinary hearing." },
          { s: 'SYS', l: 'CLEARANCE UPLIFT GRANTED — LEVEL 2 — 12 HRS' }
        ],
        gives: { flag: 'clearance2', fact: { c: 'ACCESS', t: 'Clearance 2 granted on Pryce\'s sponsorship. Personnel index is readable.' } },
        end: true },
      { id: 'ballistics', q: 'Ask about the casing from the mill.',
        requires: function () { return ev('ev_casing'); },
        a: [
          { s: 'PRYCE', l: "I ran it against everything, including the reference collection, because I am thorough and because I hate sleeping." },
          { s: 'PRYCE', l: "It identifies to a test-fire held for agency inventory 8841-D." },
          { s: 'PRYCE', l: "8841-D went in the furnace in December 1994. There is a form." },
          { s: 'YOU', l: 'Is there a witness signature on that line of the form?' },
          { s: 'PRYCE', l: "(paper) ...No. Every other line has two sets of initials. That line has none." },
          { s: 'PRYCE', l: "Somebody walked a revolver out of this building and signed the schedule anyway." }
        ],
        gives: { doc: 'd_ballistics_98', evidence: 'ev_weapon_agency',
          fact: { c: 'BALLISTICS', t: 'The mill casing identifies to NCIB inventory 8841-D, "destroyed" in 1994 on an unwitnessed line of a schedule Finn signed.' } } }
    ]
  },

  { number: '555-0100', who: 'FINN, WALTER — DEPUTY CHIEF (DIRECT)', place: 'CIVIC PLAZA',
    ring: 12,
    requires: function () { return NW.state.s.records['p_finn']; },
    greeting: [
      { s: 'SYS', l: 'RINGING — EXTENSION 0100 — DEPUTY CHIEF' },
      { s: 'FINN', l: "Finn." },
      { s: 'FINN', l: "It's late for the night desk to be calling my direct line, Operator." }
    ],
    topics: [
      { id: 'case', q: 'Report the quarry identification.',
        a: [
          { s: 'FINN', l: "A dead man. How interesting." },
          { s: 'FINN', l: "You'll find that fingerprint indices from the seventies are full of transcription errors. I'd not put weight on it." },
          { s: 'FINN', l: "Send me what you have and go home at six." }
        ],
        gives: { flag: 'finn_alerted', fact: { c: 'FINN', t: 'Finn was told about the quarry identification. He advised dropping it within thirty seconds.' } } },
      { id: 'voss', q: 'Ask about Margaret Voss.',
        requires: function () { return NW.state.s.chapter >= 2; },
        a: [
          { s: 'FINN', l: "(pause)" },
          { s: 'FINN', l: "Margaret resigned. It was a personal matter and I will not discuss it with the night desk." },
          { s: 'YOU', l: 'She resigned at four in the morning, in the middle of a shift, and you signed it on her behalf.' },
          { s: 'FINN', l: "You have been reading personnel files." },
          { s: 'FINN', l: "Operator — I have signed a great many forms in twenty-nine years. Some of them were kindnesses to people who could not sign for themselves." },
          { s: 'FINN', l: "Get some sleep." },
          { s: 'SYS', l: 'CALL ENDED — FAR END' }
        ],
        gives: { flag: 'finn_warned', evidence: 'ev_finn_voss_line',
          fact: { c: 'FINN', t: 'Finn calls the Voss separation "a kindness to someone who could not sign for themselves". He said "could not", not "would not".' } },
        end: true }
    ]
  },

  { number: '555-0201', who: 'SOLT, GRAHAM — DUTY OFFICER', place: 'SUB-LEVEL 2',
    ring: 2,
    greeting: [
      { s: 'SOLT', l: "Night watch." },
      { s: 'YOU', l: "It's Terminal 04." },
      { s: 'SOLT', l: "I know. You're the only other person in this basement." }
    ],
    topics: [
      { id: 'voss', q: 'Ask him about Voss.',
        requires: function () { return NW.state.s.chapter >= 2; },
        a: [
          { s: 'SOLT', l: "...You've been in the box in cage three." },
          { s: 'YOU', l: 'She left her inhaler, Graham.' },
          { s: 'SOLT', l: "(long silence)" },
          { s: 'SOLT', l: "I got a note the next morning telling me not to talk about it on the floor. I've read that note maybe four hundred times." },
          { s: 'SOLT', l: "I told myself she'd had enough. People do. This job eats the quiet ones." },
          { s: 'SOLT', l: "I have twenty-eight years and a pension and a wife with a bad hip and I told myself she'd had enough." },
          { s: 'SOLT', l: "Ask me for something. Anything you want from this desk, ask me and I'll get it and I won't log it." }
        ],
        gives: { flag: 'solt_ally', evidence: 'ev_solt_turn',
          fact: { c: 'NIGHT WATCH', t: 'Solt is in. He will pull anything from the duty desk and keep it off the log.' } } },
      { id: 'tape', q: 'Ask if the Lowndes Street answering machine tape still exists.',
        requires: function () { return NW.state.has('solt_ally') && NW.state.s.chapter >= 5; },
        a: [
          { s: 'SOLT', l: "Landlord entry, March. Property Branch bagged the apartment." },
          { s: 'SOLT', l: "...There's a property receipt with a micro-cassette on it and no disposal entry." },
          { s: 'SOLT', l: "Give me ten minutes." },
          { s: 'SOLT', l: "(nine minutes later) It's on your desk. It was in a drawer under a box of toner." }
        ],
        gives: { flag: 'audio_au_voss_tape', evidence: 'ev_voss_tape_found',
          fact: { c: 'VOSS', t: 'Solt recovered the answering-machine cassette from 4 Lowndes Street. It was never logged out.' } },
        end: true }
    ]
  },

  { number: '555-0166', who: 'BELLAMY, HOWARD — ALDEN CIVIC HOLDINGS', place: 'ASHVALE',
    ring: 7,
    requires: function () { return NW.state.s.records['p_bellamy']; },
    greeting: [
      { s: 'BELLAMY', l: "Bellamy residence." },
      { s: 'YOU', l: 'NCIB Regional. Is this the registered agent for Alden Civic Holdings?' },
      { s: 'BELLAMY', l: "It is very late." }
    ],
    topics: [
      { id: 'grieve', q: 'Ask what is stored at Grieve Hill.',
        a: [
          { s: 'BELLAMY', l: "Records." },
          { s: 'YOU', l: 'Whose records?' },
          { s: 'BELLAMY', l: "I'm the agent, not the member. I sign what's put in front of me and I get a cheque at Christmas." },
          { s: 'BELLAMY', l: "That is not a crime. I've asked." },
          { s: 'YOU', l: 'Who is the member, Mr Bellamy?' },
          { s: 'BELLAMY', l: "...I'd like to end this call." },
          { s: 'YOU', l: 'Is it your brother-in-law?' },
          { s: 'BELLAMY', l: "I'd like to end this call." },
          { s: 'SYS', l: 'CALL ENDED — FAR END' }
        ],
        gives: { evidence: 'ev_bellamy_refuse',
          fact: { c: 'SHELL', t: 'Bellamy would not deny that Finn is the undisclosed member of Alden Civic Holdings. He ended the call instead.' } },
        end: true }
    ]
  },

  /* ── dead numbers, for texture ── */
  { number: '555-0134', who: 'VANCE, E. — 18 KESTREL ROW (1987)', dead: 'DISCONNECTED — NUMBER NOT IN SERVICE SINCE 1988' },
  { number: '555-0331', who: 'VOSS, M. — 4 LOWNDES ST', ring: 20,
    dead: 'RINGS. TWENTY-TWO TIMES. NOBODY PICKS UP AND THE MACHINE NEVER CUTS IN.',
    onDial: function () {
      NW.state.addFact('VOSS', 'Her line still rings. The answering machine has been full since March.');
    } },
  { number: '555-0288', who: 'ANSEL, C. — 77 MARROW ST', ring: 4,
    dead: 'PICKED UP. NOBODY SPEAKS. YOU CAN HEAR A DRYER DRUM TURNING. THE LINE GOES DEAD AFTER ELEVEN SECONDS.',
    onDial: function () {
      NW.state.addFact('MILL', 'Ansel\'s line was answered in silence — with heavy plant running behind it.');
      NW.state.flag('ansel_spooked', true);
    } },
  { number: '555-0177', who: 'HALLORAN-KEEL, R.', dead: 'ANSWERING SERVICE. "MS HALLORAN-KEEL IS TRAVELLING AND WILL RETURN CALLS ON THE TWELFTH."' },
  { number: '555-0266', who: 'GAULT & SON TRUCKING', dead: 'RECORDED: "OFFICE HOURS ARE SIX TO FOUR." NO OPTION TO LEAVE A MESSAGE.' },
  { number: '555-0211', who: 'REYES, A. — UNIT 11 CAR PHONE', dead: 'USE THE WIRE. THE CAR PHONE IS FOR HER TO CALL OUT.' },
  { number: '555-0000', who: '—', dead: 'THAT IS NOT A NUMBER.' }
  ];

  var byNum = {};
  CALLS.forEach(function (c) { byNum[c.number.replace(/\D/g, '')] = c; });

  function get(num) { return byNum[String(num).replace(/\D/g, '')] || null; }
  function known() {
    return CALLS.filter(function (c) {
      if (c.requires && !c.requires()) return false;
      return true;
    });
  }

  NW.calls = { get: get, all: function () { return CALLS; }, known: known };
})(window.NW);

/* NIGHTWIRE — data/people.js — the person index searched in REGISTRY */
(function (NW) {
  'use strict';

  /* index:  'crim'  criminal history index
             'civ'   civil / licensing index
             'per'   NCIB personnel  (clearance 2)
             'wit'   sealed federal witness index (clearance 3) */

  var P = [

  /* ══════════ THE CASE ══════════ */
  {
    id: 'p_vance', index: 'crim', name: 'VANCE, ELIAS THEODORE', aka: ['E. T. VANCE', 'MAULE, PETER'],
    dob: '03/19/1949', sex: 'M', ht: '5-11', wt: '178', eyes: 'BRO', hair: 'BRO/GRY',
    ssn: '214-88-0917', addr: '18 KESTREL ROW, PORT ALDEN VC',
    occupation: 'ACCOUNTANT — HALLORAN AGGREGATE & QUARRY CO.',
    status: 'DECEASED 08/12/1987 (VC CORONER 87-4410)',
    statusKind: 'dec',
    printSeed: 'vance-1979', face: { sex: 'm', age: 38, hair: 'short', hairColor: 1, skin: 1, glasses: true, mood: 'flat', plate: 'VC-114772' },
    priors: [
      { d: '11/02/1979', o: 'BONDING APPLICATION — FIDELITY (PRINTS ON FILE)', dp: 'VC SHERIFF', r: 'NO CRIMINAL HISTORY' },
      { d: '06/14/1985', o: 'CIVIL — SUBPOENA DUCES TECUM, FED. GRAND JURY 85-VC-2', dp: 'US DIST CT', r: 'COMPLIED' }
    ],
    notes: 'Employed 1974–1987 as senior ledger accountant, Halloran Aggregate & Quarry Co.\nSubject was a cooperating witness in federal grand jury matter 87-VC-9 (SEALED).\nDecedent per VC Coroner file 87-4410 — vehicle fire, Mercer Road, 08/12/1987.\nIdentification by dental comparison. No fingerprint comparison of record.',
    xref: ['p_claire', 'p_halloran', 'p_fearn_o'],
    docs: ['d_coroner_87', 'd_accident_87'],
    tags: ['1987', 'QUARRY', 'WITNESS'],
    phone: '555-0134', plate: 'KTV-418'
  },
  {
    id: 'p_maule', index: 'wit', clearance: 3, name: 'MAULE, PETER ALLEN', aka: ['VANCE, ELIAS T.'],
    dob: '03/19/1949', sex: 'M', ht: '5-11', wt: '186', eyes: 'BRO', hair: 'GRY',
    ssn: '214-88-0917', addr: 'RELOCATED — SECTOR 4 (BRAEMOOR, ST. OF KELLAND)',
    occupation: 'STOCKROOM SUPERVISOR — BRAEMOOR CO-OP',
    status: 'PROTECTED WITNESS — PROGRAM ENTRY 08/29/1987',
    statusKind: 'sealed',
    printSeed: 'vance-1979',
    face: { sex: 'm', age: 49, hair: 'short', hairColor: 6, skin: 1, glasses: true, mood: 'grim' },
    priors: [],
    notes: 'PROGRAM RECORD — RESTRICTED.\nEntry authorised 08/29/1987. Inspector of record: W. FINN (then GS-13, Field Ops).\nRelocation sector 4. Quarterly contact required; last logged contact 02/1998.\nSTATUS FLAG 03/1998: CONTACT LAPSED. NO INSPECTOR ACTION RECORDED.\nEmployment reporting (W-2) continued under SSN 214-88-0917 through 10/1998.',
    xref: ['p_finn', 'p_vance', 'p_pemberton'],
    docs: ['d_witsec_87', 'd_w2_98'],
    tags: ['WITSEC', 'SEALED', 'FINN']
  },
  {
    id: 'p_voss', index: 'per', clearance: 2, name: 'VOSS, MARGARET ANNE', aka: ['M. VOSS', 'OPERATOR 3312'],
    dob: '07/22/1961', sex: 'F', ht: '5-6', wt: '139', eyes: 'GRN', hair: 'RED',
    ssn: '390-52-1188', addr: '4 LOWNDES ST APT 3, PORT ALDEN VC',
    occupation: 'ANALYSIS OPERATOR — NCIB REGIONAL, TERMINAL 04',
    status: 'SEPARATED FROM SERVICE 03/16/1998 — VOLUNTARY',
    statusKind: 'warn',
    face: { sex: 'f', age: 36, hair: 'long', hairColor: 2, skin: 0, mood: 'flat' },
    priors: [],
    notes: 'Appointed 04/1991. Night desk, Terminal 04. Two commendations.\nSeparation processed 03/16/1998, form NC-71 signed by DEP. CHIEF W. FINN.\nNo exit interview of record. No forwarding address of record.\nPersonal effects log: 1 box, unclaimed, held Sub-Level 2.\n\n[FLAG] Apartment lease at 4 Lowndes St remains active and paid by standing order.\n[FLAG] No credit or employment activity under SSN since 03/1998.',
    xref: ['p_finn', 'p_solt'],
    docs: ['d_nc71_voss', 'd_effects_log'],
    tags: ['PREDECESSOR', 'TERMINAL 04'],
    phone: '555-0331'
  },
  {
    id: 'p_finn', index: 'per', clearance: 2, name: 'FINN, WALTER RUSSELL', aka: ['W. R. FINN', 'W.R.F.'],
    dob: '01/08/1944', sex: 'M', ht: '6-1', wt: '211', eyes: 'BLU', hair: 'GRY',
    ssn: '112-40-6603', addr: '1 HARBOUR CREST, ASHVALE VC',
    occupation: 'DEPUTY CHIEF — NCIB REGIONAL (PORT ALDEN)',
    status: 'ACTIVE — CLEARANCE TS/SCI',
    statusKind: 'ok',
    face: { sex: 'm', age: 54, hair: 'short', hairColor: 5, skin: 0, mood: 'flat' },
    priors: [],
    notes: 'Appointed 1969. Field Operations 1974–1989. Witness Security liaison 1985–1990.\nRegional Deputy Chief from 1991.\nCommendations: 4. Disciplinary: none of record.\nSignature authority: NC-71 (separations), NC-88 (asset disposal), WS-2 (program entry).',
    xref: ['p_voss', 'p_maule', 'p_keel', 'p_bellamy'],
    docs: ['d_witsec_87', 'd_nc71_voss', 'd_nc88_lease'],
    tags: ['PERSONNEL', 'SIGNATURE'],
    phone: '555-0100'
  },
  {
    id: 'p_ansel', index: 'crim', name: 'ANSEL, CURTIS RAY', aka: ['CURT ANSEL', 'RAY CURTIS'],
    dob: '05/30/1955', sex: 'M', ht: '6-2', wt: '235', eyes: 'HAZ', hair: 'BLK',
    ssn: '441-09-7752', addr: '77 MARROW ST (C/O ALDEN CIVIC HOLDINGS), PORT ALDEN VC',
    occupation: 'SECURITY CONTRACTOR — SELF EMPLOYED',
    status: 'AT LARGE — WANTED VC 98-1173',
    statusKind: 'wanted',
    printSeed: 'ansel-1981',
    face: { sex: 'm', age: 43, hair: 'buzz', hairColor: 0, skin: 2, beard: true, mood: 'grim', scar: true, plate: 'VC-227901' },
    priors: [
      { d: '04/12/1981', o: 'ASSAULT 2ND DEG', dp: 'PORT ALDEN PD', r: 'CONVICTED — 30 MO' },
      { d: '09/03/1986', o: 'ARSON 3RD DEG (CONSPIRACY)', dp: 'VC SHERIFF', r: 'DISMISSED — WITNESS UNAVAILABLE' },
      { d: '02/20/1990', o: 'FIREARM — POSSESSION BY FELON', dp: 'STATE POLICE', r: 'PLED — 18 MO SUSPENDED' },
      { d: '07/07/1996', o: 'WITNESS TAMPERING (ALLEGED)', dp: 'NCIB', r: 'NO ACTION — REFERRED W.R.F.' }
    ],
    notes: 'Known associate of ODIS FEARN (see xref). Licensed for private security 1994 through corporate sponsor ALDEN CIVIC HOLDINGS LLC.\nEmployment: night security, Marrow Street Paper Mill (closed 1994) — retained by leaseholder.\nWeapon of record: .38 SPL revolver, serial RH-44120, registered 1995.',
    xref: ['p_fearn_o', 'p_keel', 'p_finn'],
    docs: ['d_ansel_lic', 'd_ballistics_98'],
    tags: ['MILL', 'SUSPECT'],
    phone: '555-0288', plate: 'VC-227901'
  },
  {
    id: 'p_fearn_o', index: 'crim', name: 'FEARN, ODIS LEE', aka: ['O. FEARN', 'ODIE'],
    dob: '11/14/1951', sex: 'M', ht: '5-9', wt: '164', eyes: 'BRO', hair: 'BRO',
    ssn: '441-22-3390', addr: 'STATE CORRECTIONAL FAC. — HOLLIS UNIT, CELL D-22',
    occupation: 'INMATE #88-40213',
    status: 'INCARCERATED — 25 YRS, ARSON 1ST / MANSLAUGHTER',
    statusKind: 'jail',
    printSeed: 'fearn-1976',
    face: { sex: 'm', age: 47, hair: 'short', hairColor: 2, skin: 1, mood: 'grim', plate: 'VC-088402' },
    priors: [
      { d: '06/22/1976', o: 'BURGLARY 2ND DEG', dp: 'PORT ALDEN PD', r: 'CONVICTED — 24 MO' },
      { d: '03/18/1983', o: 'ARSON 2ND DEG', dp: 'VC SHERIFF', r: 'CONVICTED — 5 YRS' },
      { d: '08/29/1988', o: 'ARSON 1ST DEG / MANSLAUGHTER (WARRENDALE)', dp: 'STATE POLICE', r: 'CONVICTED — 25 YRS' }
    ],
    notes: 'Fire-for-hire. Signature method: accelerant siphoned from the vehicle itself; delayed ignition by cigarette-and-matchbook fuse.\nBrother: RENNICK FEARN (see xref) — reported missing 08/1987, never located.\nSubject has refused all interviews since 1991. Visitor log shows one recurring visitor, name redacted at facility request.',
    xref: ['p_fearn_r', 'p_ansel'],
    docs: ['d_fearn_method', 'd_visitor_log'],
    tags: ['ARSON', '1987']
  },
  {
    id: 'p_fearn_r', index: 'crim', name: 'FEARN, RENNICK JOEL', aka: ['RENNY FEARN'],
    dob: '02/28/1947', sex: 'M', ht: '5-10', wt: '171', eyes: 'BRO', hair: 'BRO',
    ssn: '441-22-1104', addr: 'NO FIXED ADDRESS — PORT ALDEN VC',
    occupation: 'ITINERANT LABOURER',
    status: 'MISSING SINCE 08/10/1987 — VC 87-2201',
    statusKind: 'warn',
    printSeed: 'fearnr-1974',
    face: { sex: 'm', age: 40, hair: 'short', hairColor: 1, skin: 1, beard: true, mood: 'flat', plate: 'VC-071188' },
    priors: [
      { d: '05/09/1974', o: 'VAGRANCY / PUBLIC INTOX', dp: 'PORT ALDEN PD', r: 'FINE' },
      { d: '01/30/1980', o: 'PETIT LARCENY', dp: 'PORT ALDEN PD', r: 'TIME SERVED' }
    ],
    notes: 'Brother of ODIS FEARN. No known family besides.\nLast seen 08/10/1987 at the Blue Larkspur Motel, Rt. 9. Reported missing by motel clerk after two weeks of unpaid room.\nDentition: extensive bridgework, upper left, performed 1981 by DR. A. SEIBOLD, Port Alden.\nCase never worked. Closed administratively 1991.',
    xref: ['p_fearn_o', 'p_sikes', 'p_seibold'],
    docs: ['d_missing_87', 'd_dental_seibold'],
    tags: ['1987', 'MISSING']
  },

  /* ══════════ AGENCY ══════════ */
  {
    id: 'p_reyes', index: 'per', clearance: 2, name: 'REYES, ADA MARISOL', dob: '09/02/1962', sex: 'F',
    ht: '5-7', wt: '145', eyes: 'BRO', hair: 'BLK', ssn: '552-31-7740',
    addr: '221 CANNERY WALK, PORT ALDEN VC', occupation: 'SPECIAL AGENT — NCIB REGIONAL',
    status: 'ACTIVE — FIELD', statusKind: 'ok',
    face: { sex: 'f', age: 36, hair: 'short', hairColor: 0, skin: 2, mood: 'flat' },
    priors: [],
    notes: 'Appointed 1988. Violent Crimes, then Public Corruption 1995–1997, returned to Violent Crimes 1997 at own request.\nTransfer request 04/1997 cites "difference of view on case assignment." Endorsed by DEP. CHIEF FINN.\nFirearms: expert. Commendation 1994 (Warrendale).',
    xref: ['p_del', 'p_finn'], docs: [], tags: ['FIELD'], phone: '555-0211'
  },
  {
    id: 'p_del', index: 'per', clearance: 2, name: 'NKEMDIRIM, DELROY OBI', dob: '12/11/1966', sex: 'M',
    ht: '6-0', wt: '190', eyes: 'BRO', hair: 'BLK', ssn: '552-77-2213',
    addr: '9 ELM TERRACE, ASHVALE VC', occupation: 'SPECIAL AGENT — NCIB REGIONAL',
    status: 'ACTIVE — FIELD', statusKind: 'ok',
    face: { sex: 'm', age: 32, hair: 'buzz', hairColor: 0, skin: 4, mood: 'flat' },
    priors: [],
    notes: 'Appointed 1993. Two years property crimes, then Violent Crimes.\nMarried, two children. Requested night rotation for childcare reasons 1996.',
    xref: ['p_reyes'], docs: [], tags: ['FIELD'], phone: '555-0212'
  },
  {
    id: 'p_solt', index: 'per', clearance: 2, name: 'SOLT, GRAHAM ELDRED', dob: '04/17/1946', sex: 'M',
    ht: '5-10', wt: '224', eyes: 'GRY', hair: 'GRY', ssn: '112-88-4402',
    addr: '30 PENNYFIELD RD, PORT ALDEN VC', occupation: 'DUTY OFFICER — NIGHT WATCH, SUB-LEVEL 2',
    status: 'ACTIVE — 28 YRS SERVICE', statusKind: 'ok',
    face: { sex: 'm', age: 52, hair: 'bald', hairColor: 6, skin: 0, glasses: true, mood: 'flat' },
    priors: [],
    notes: 'Appointed 1970. Field to 1984; desk thereafter following an injury at Cassadaga.\nHas held the night watch since 1986. Declined promotion three times.\nNote appended 03/1998 by DEP. CHIEF FINN: "Officer Solt to be advised of Terminal 04 staffing changes directly."',
    xref: ['p_voss', 'p_finn'], docs: ['d_solt_note'], tags: ['NIGHT WATCH'], phone: '555-0201'
  },
  {
    id: 'p_pryce', index: 'per', clearance: 2, name: 'PRYCE, OONA BEATRIX', dob: '06/05/1968', sex: 'F',
    ht: '5-4', wt: '128', eyes: 'GRN', hair: 'BLN', ssn: '552-90-3311',
    addr: '12 SALTHOUSE LN, PORT ALDEN VC', occupation: 'FORENSIC TECHNICIAN III — EVIDENCE RESPONSE',
    status: 'ACTIVE', statusKind: 'ok',
    face: { sex: 'f', age: 30, hair: 'short', hairColor: 4, skin: 0, glasses: true, mood: 'flat' },
    priors: [],
    notes: 'Appointed 1994. Latent prints, toolmarks, questioned documents.\nCertified AFIS examiner 1996. Testified 11 times.',
    xref: [], docs: [], tags: ['LAB'], phone: '555-0244'
  },
  {
    id: 'p_bellamy', index: 'per', clearance: 2, name: 'BELLAMY, HOWARD KEEL', dob: '08/19/1950', sex: 'M',
    ht: '5-8', wt: '175', eyes: 'BRO', hair: 'BRO', ssn: '112-55-9081',
    addr: '1 HARBOUR CREST (GUEST HOUSE), ASHVALE VC',
    occupation: 'REGISTERED AGENT — ALDEN CIVIC HOLDINGS LLC',
    status: 'CIVILIAN — RELATED PARTY', statusKind: 'warn',
    face: { sex: 'm', age: 48, hair: 'short', hairColor: 3, skin: 0, mood: 'flat' },
    priors: [],
    notes: 'Brother-in-law of DEP. CHIEF W. R. FINN (married Finn\'s sister, ELEANOR FINN-BELLAMY, 1978).\nRegistered agent for four county shell entities. Occupation listed as "consultant."\nNo tax filings of record 1994–1997 in own name.',
    xref: ['p_finn', 'p_keel'], docs: ['d_llc_alden', 'd_nc88_lease'], tags: ['SHELL', 'FINN'], phone: '555-0166'
  },

  /* ══════════ HALLORAN / QUARRY ══════════ */
  {
    id: 'p_halloran', index: 'civ', name: 'HALLORAN, JONAS PIERCE', dob: '10/03/1921', sex: 'M',
    ht: '6-0', wt: '198', eyes: 'BLU', hair: 'WHT', ssn: '112-01-4477',
    addr: 'HALLORAN HOUSE, ASHVALE VC', occupation: 'PRESIDENT — HALLORAN AGGREGATE & QUARRY CO.',
    status: 'DECEASED 05/22/1993 — NATURAL', statusKind: 'dec',
    face: { sex: 'm', age: 71, hair: 'short', hairColor: 5, skin: 0, mood: 'flat' },
    priors: [],
    notes: 'Founded 1952. County\'s largest private employer until 1991.\nSubject of federal grand jury 87-VC-9 (structuring, false invoicing). Matter abated on the death of the cooperating witness.\nEstate passed to daughter R. HALLORAN-KEEL.',
    xref: ['p_keel', 'p_vance'], docs: ['d_gj_abate'], tags: ['QUARRY', '1987']
  },
  {
    id: 'p_keel', index: 'civ', name: 'HALLORAN-KEEL, RUTH ISOBEL', aka: ['RUTHIE KEEL'], dob: '02/09/1954', sex: 'F',
    ht: '5-5', wt: '142', eyes: 'BLU', hair: 'BLN', ssn: '390-11-2288',
    addr: 'HALLORAN HOUSE, ASHVALE VC', occupation: 'PRESIDENT — HALLORAN AGGREGATE & QUARRY CO.',
    status: 'CIVILIAN', statusKind: 'ok',
    face: { sex: 'f', age: 44, hair: 'short', hairColor: 4, skin: 0, mood: 'flat' },
    priors: [
      { d: '03/02/1995', o: 'DWI', dp: 'ASHVALE PD', r: 'PLED — DIVERSION' }
    ],
    notes: 'Assumed control 1993. Quarry operations suspended 1994; site retained.\nCompany continues to file payroll for 14 employees. Site produces no aggregate.\nBanking: three accounts, Vandermeer Savings; monthly transfers to ALDEN CIVIC HOLDINGS LLC since 1994.',
    xref: ['p_halloran', 'p_bellamy', 'p_ansel'], docs: ['d_payroll_98', 'd_llc_alden'],
    tags: ['QUARRY', 'MONEY'], phone: '555-0177'
  },
  {
    id: 'p_claire', index: 'civ', name: 'OSTERHOLT, CLAIRE MAY', aka: ['VANCE, CLAIRE'], dob: '06/30/1952', sex: 'F',
    ht: '5-4', wt: '134', eyes: 'GRN', hair: 'BRO', ssn: '390-44-7712',
    addr: '6 WREN COURT, ASHVALE VC', occupation: 'SCHOOL ADMINISTRATOR — ASHVALE CONSOLIDATED',
    status: 'CIVILIAN', statusKind: 'ok',
    face: { sex: 'f', age: 46, hair: 'short', hairColor: 2, skin: 0, mood: 'flat' },
    priors: [],
    notes: 'Married E. T. VANCE 1974; widowed 1987. Remarried D. OSTERHOLT 1991.\nBeneficiary, Vance policy — claim paid 11/1987, $85,000, Meridian Life.\nNote 04/1998: subject reported an "unwanted contact" to Ashvale PD; complaint withdrawn same week.',
    xref: ['p_vance'], docs: ['d_insurance_87', 'd_ashvale_complaint'], tags: ['1987'], phone: '555-0155'
  },

  /* ══════════ WITNESSES / PERIPHERY ══════════ */
  {
    id: 'p_brennick', index: 'civ', name: 'BRENNICK, DOYLE STANFORD', dob: '07/04/1941', sex: 'M',
    ht: '6-2', wt: '240', eyes: 'BLU', hair: 'GRY', ssn: '112-77-1029',
    addr: '3 MERCER ROAD, PORT ALDEN VC', occupation: 'RETIRED — SERGEANT, PORT ALDEN PD',
    status: 'RETIRED 1994', statusKind: 'ok',
    face: { sex: 'm', age: 57, hair: 'short', hairColor: 6, skin: 0, mood: 'grim' },
    priors: [
      { d: '08/30/1991', o: 'INTERNAL — EVIDENCE HANDLING (SUSTAINED)', dp: 'PORT ALDEN PD IA', r: 'LETTER OF REPRIMAND' }
    ],
    notes: 'First officer on scene, Mercer Road vehicle fire, 08/12/1987.\nRetired at 20 years on a disability pension. Lives 400 yards from the 1987 scene.\nPension supplemented since 1994 by consulting fees — payer of record: ALDEN CIVIC HOLDINGS LLC, $1,100 monthly.',
    xref: ['p_vance', 'p_bellamy'], docs: ['d_accident_87', 'd_brennick_pay'],
    tags: ['1987', 'PAID'], phone: '555-0198'
  },
  {
    id: 'p_sikes', index: 'civ', name: 'SIKES, LENORE FAY', dob: '01/12/1944', sex: 'F',
    ht: '5-2', wt: '119', eyes: 'BRO', hair: 'GRY', ssn: '390-08-5544',
    addr: 'BLUE LARKSPUR MOTEL, RT 9, PORT ALDEN VC', occupation: 'NIGHT CLERK — BLUE LARKSPUR MOTEL',
    status: 'CIVILIAN', statusKind: 'ok',
    face: { sex: 'f', age: 54, hair: 'short', hairColor: 6, skin: 0, glasses: true, mood: 'flat' },
    priors: [],
    notes: 'Clerk at the Blue Larkspur since 1979. Reported R. FEARN missing 08/24/1987.\nKeeps a paper register. Has never thrown one out.',
    xref: ['p_fearn_r'], docs: ['d_motel_reg'], tags: ['MOTEL'], phone: '555-0303'
  },
  {
    id: 'p_trevino', index: 'civ', name: 'TREVINO, MARCUS ANTONIO', dob: '05/21/1959', sex: 'M',
    ht: '5-9', wt: '181', eyes: 'BRO', hair: 'BLK', ssn: '441-33-8890',
    addr: '14 MARROW ST APT 2, PORT ALDEN VC', occupation: 'NIGHT WATCHMAN — MARROW ST MILL (RETAINED)',
    status: 'CIVILIAN', statusKind: 'ok',
    face: { sex: 'm', age: 39, hair: 'short', hairColor: 0, skin: 3, beard: true, mood: 'scared' },
    priors: [
      { d: '10/11/1992', o: 'DRIVING — SUSPENDED LICENCE', dp: 'PORT ALDEN PD', r: 'FINE' }
    ],
    notes: 'Employed by the leaseholder, not the mill owner. Paid in cash.\nCalled the sheriff twice in 1998 to report "trucks at night" at the mill. Both calls logged, neither dispatched.',
    xref: ['p_ansel'], docs: ['d_dispatch_98'], tags: ['MILL', 'WITNESS'], phone: '555-0277'
  },
  {
    id: 'p_adair', index: 'civ', name: 'ADAIR, SIMONE PAULETTE', aka: ['SIM ADAIR'], dob: '03/07/1955', sex: 'F',
    ht: '5-6', wt: '140', eyes: 'BRO', hair: 'BLK', ssn: '390-77-4432',
    addr: '88 GARNET ST, PORT ALDEN VC', occupation: 'FORMER STAFF WRITER — PORT ALDEN LEDGER',
    status: 'CIVILIAN', statusKind: 'ok',
    face: { sex: 'f', age: 43, hair: 'long', hairColor: 0, skin: 3, mood: 'flat' },
    priors: [],
    notes: 'Covered the Halloran grand jury and the Mercer Road fire, 1987.\nReassigned from the county desk to features 09/1987. Left the paper 1989.\nNow keeps a clipping morgue in her garage. Has spoken to two prior investigators; both files closed.',
    xref: ['p_vance', 'p_halloran'], docs: ['d_ledger_1', 'd_ledger_2'],
    tags: ['PRESS', '1987'], phone: '555-0322'
  },
  {
    id: 'p_abaroa', index: 'civ', name: 'ABAROA, INES CARLOTTA', dob: '11/30/1956', sex: 'F',
    ht: '5-5', wt: '133', eyes: 'BRO', hair: 'BRO', ssn: '390-66-1120',
    addr: 'VC MEDICAL EXAMINER, 2 CIVIC PLAZA', occupation: 'CHIEF MEDICAL EXAMINER — VANDERMEER COUNTY',
    status: 'CIVILIAN — OFFICIAL', statusKind: 'ok',
    face: { sex: 'f', age: 42, hair: 'short', hairColor: 1, skin: 2, glasses: true, mood: 'flat' },
    priors: [],
    notes: 'Appointed 1994. Reviewed and reopened eleven historic identifications on taking office.\nRequested the 1987 Mercer Road file in 1995. Request marked "ARCHIVED OFFSITE — UNAVAILABLE."',
    xref: ['p_vance'], docs: ['d_me_98', 'd_me_request'], tags: ['ME'], phone: '555-0140'
  },
  {
    id: 'p_seibold', index: 'civ', name: 'SEIBOLD, ARTHUR MILES', dob: '09/09/1930', sex: 'M',
    ht: '5-7', wt: '160', eyes: 'BLU', hair: 'WHT', ssn: '112-23-8890',
    addr: 'CEDAR REST HOME, ASHVALE VC', occupation: 'RETIRED — DENTIST (LIC. SURRENDERED 1990)',
    status: 'CIVILIAN — CARE FACILITY', statusKind: 'warn',
    face: { sex: 'm', age: 68, hair: 'bald', hairColor: 5, skin: 0, glasses: true, mood: 'flat' },
    priors: [
      { d: '06/14/1990', o: 'STATE DENTAL BOARD — RECORDS FALSIFICATION', dp: 'STATE BOARD', r: 'LICENCE SURRENDERED' }
    ],
    notes: 'Supplied the dental comparison that identified the Mercer Road decedent as E. T. VANCE, 08/1987.\nBoard action 1990 concerned three unrelated charts altered after the fact.\nBank record: single deposit of $12,000, 08/20/1987, source "cashier\'s cheque, Vandermeer Savings."',
    xref: ['p_vance', 'p_fearn_r'], docs: ['d_dental_87', 'd_board_90'],
    tags: ['1987', 'PAID']
  },
  {
    id: 'p_pemberton', index: 'civ', name: 'PEMBERTON, HOLLIS DEAN', dob: '02/14/1938', sex: 'M',
    ht: '6-0', wt: '186', eyes: 'GRY', hair: 'WHT', ssn: '112-14-3302',
    addr: '9 SALTGRASS WAY, BRAEMOOR (ST. OF KELLAND)',
    occupation: 'RETIRED — INSPECTOR, WITNESS SECURITY',
    status: 'RETIRED 1996', statusKind: 'ok',
    face: { sex: 'm', age: 60, hair: 'short', hairColor: 5, skin: 0, mood: 'grim' },
    priors: [],
    notes: 'Sector 4 inspector 1984–1996. Held 31 protected files.\nFiled two internal complaints (1988, 1992) regarding "single-inspector custody" of a Sector 4 file. Both closed without finding.\nWill talk. Has been waiting eleven years for someone to call.',
    xref: ['p_maule', 'p_finn'], docs: ['d_pemberton_complaint'],
    tags: ['WITSEC'], phone: '555-0411'
  },
  {
    id: 'p_moss', index: 'civ', name: 'MOSS, PATRICE ELAINE', dob: '08/08/1963', sex: 'F',
    ht: '5-3', wt: '150', eyes: 'BRO', hair: 'BRO', ssn: '390-99-2201',
    addr: '41 COURTHOUSE SQ APT 6, PORT ALDEN VC', occupation: 'DEPUTY CLERK — VC COUNTY RECORDS',
    status: 'CIVILIAN — OFFICIAL', statusKind: 'ok',
    face: { sex: 'f', age: 35, hair: 'long', hairColor: 1, skin: 2, mood: 'flat' },
    priors: [],
    notes: 'Custodian of county deeds, leases and corporate filings.\nWill answer the phone after hours. Complains about it, then answers.',
    xref: [], docs: ['d_lease_grieve'], tags: ['RECORDS'], phone: '555-0122'
  },
  {
    id: 'p_gault', index: 'crim', name: 'GAULT, PRESTON WYNN', aka: ['PRESS GAULT'], dob: '12/02/1960', sex: 'M',
    ht: '5-11', wt: '199', eyes: 'BLU', hair: 'BRO', ssn: '441-77-1188',
    addr: '2 DERRY LANE, PORT ALDEN VC', occupation: 'HAULAGE — GAULT & SON TRUCKING',
    status: 'CIVILIAN — PRIOR RECORD', statusKind: 'ok',
    printSeed: 'gault-1988',
    face: { sex: 'm', age: 38, hair: 'short', hairColor: 2, skin: 0, beard: true, mood: 'flat', plate: 'VC-119023' },
    priors: [
      { d: '05/17/1988', o: 'RECEIVING STOLEN PROPERTY', dp: 'STATE POLICE', r: 'CONVICTED — PROBATION' },
      { d: '11/22/1994', o: 'OVERWEIGHT VEHICLE / FALSE MANIFEST', dp: 'DOT', r: 'FINE' }
    ],
    notes: 'Contract hauler for Halloran Aggregate 1991–present, though the quarry produces nothing.\nManifests filed monthly. Loads listed as "FILL — MISCELLANEOUS."\nRoute of record: quarry to Marrow Street.',
    xref: ['p_keel', 'p_ansel'], docs: ['d_manifest_98'], tags: ['HAULAGE'], phone: '555-0266', plate: 'VC-119023'
  },
  {
    id: 'p_lindqvist', index: 'crim', name: 'LINDQVIST, ERIK PAUL', dob: '04/25/1953', sex: 'M',
    ht: '6-0', wt: '190', eyes: 'BLU', hair: 'BLN', ssn: '441-55-2299',
    addr: '55 HARBOUR ST, PORT ALDEN VC', occupation: 'DOCK FOREMAN',
    status: 'CIVILIAN — PRIOR RECORD', statusKind: 'ok',
    printSeed: 'lindqvist-1982',
    face: { sex: 'm', age: 45, hair: 'short', hairColor: 4, skin: 0, mood: 'flat', plate: 'VC-140228' },
    priors: [{ d: '07/19/1982', o: 'ASSAULT 3RD DEG', dp: 'PORT ALDEN PD', r: 'CONVICTED — FINE' }],
    notes: 'Included in the print candidate set on physical similarity only. No case connection of record.',
    xref: [], docs: [], tags: ['CANDIDATE']
  },
  {
    id: 'p_okafor', index: 'crim', name: 'OKAFOR, BENEDICT CHIKE', dob: '10/17/1957', sex: 'M',
    ht: '5-10', wt: '176', eyes: 'BRO', hair: 'BLK', ssn: '441-66-3311',
    addr: '3 FERRY BEND, ASHVALE VC', occupation: 'MACHINIST',
    status: 'CIVILIAN — PRIOR RECORD', statusKind: 'ok',
    printSeed: 'okafor-1986',
    face: { sex: 'm', age: 41, hair: 'buzz', hairColor: 0, skin: 4, mood: 'flat', plate: 'VC-160034' },
    priors: [{ d: '02/03/1986', o: 'CRIMINAL MISCHIEF', dp: 'ASHVALE PD', r: 'DISMISSED' }],
    notes: 'Included in the print candidate set on physical similarity only. No case connection of record.',
    xref: [], docs: [], tags: ['CANDIDATE']
  },
  {
    id: 'p_darrow', index: 'crim', name: 'DARROW, WENDELL ROSS', dob: '06/11/1948', sex: 'M',
    ht: '5-11', wt: '183', eyes: 'HAZ', hair: 'GRY', ssn: '441-88-4422',
    addr: '17 PENNYFIELD RD, PORT ALDEN VC', occupation: 'UNEMPLOYED',
    status: 'CIVILIAN — PRIOR RECORD', statusKind: 'ok',
    printSeed: 'darrow-1977',
    face: { sex: 'm', age: 50, hair: 'short', hairColor: 6, skin: 1, mood: 'grim', plate: 'VC-177412' },
    priors: [
      { d: '09/12/1977', o: 'FORGERY 2ND DEG', dp: 'PORT ALDEN PD', r: 'CONVICTED — 18 MO' },
      { d: '04/04/1991', o: 'FRAUD — INSURANCE', dp: 'STATE POLICE', r: 'CONVICTED — PROBATION' }
    ],
    notes: 'Included in the print candidate set on physical similarity only. No case connection of record.',
    xref: [], docs: [], tags: ['CANDIDATE']
  },

  /* ══════════ TRAINING / FILLER (Chapter 0) ══════════ */
  {
    id: 'p_kruse', index: 'crim', name: 'KRUSE, DIETER HANS', dob: '08/14/1964', sex: 'M',
    ht: '6-1', wt: '205', eyes: 'BLU', hair: 'BLN', ssn: '441-12-9987',
    addr: '82 HARBOUR ST APT 11, PORT ALDEN VC', occupation: 'BARTENDER',
    status: 'ACTIVE WARRANT — VC 98-0912 (FTA)', statusKind: 'wanted',
    face: { sex: 'm', age: 34, hair: 'short', hairColor: 4, skin: 0, beard: true, mood: 'grim', plate: 'VC-190881' },
    priors: [
      { d: '03/22/1993', o: 'DWI', dp: 'PORT ALDEN PD', r: 'CONVICTED' },
      { d: '01/09/1998', o: 'ASSAULT 3RD DEG', dp: 'PORT ALDEN PD', r: 'FAILED TO APPEAR' }
    ],
    notes: 'Vehicle of record: 1989 CHEV CAPRICE, plate RXP-206, blue.\nKnown to frequent the Anchor Tap, Harbour St.',
    xref: [], docs: [], tags: ['TRAINING'], plate: 'RXP-206'
  },
  {
    id: 'p_dowd', index: 'crim', name: 'DOWD, TERRENCE LYLE', dob: '02/26/1970', sex: 'M',
    ht: '5-8', wt: '155', eyes: 'BRO', hair: 'BRO', ssn: '441-44-7766',
    addr: '5 GARNET ST, PORT ALDEN VC', occupation: 'DELIVERY DRIVER',
    status: 'CIVILIAN — PRIOR RECORD', statusKind: 'ok',
    face: { sex: 'm', age: 28, hair: 'short', hairColor: 2, skin: 1, mood: 'flat', plate: 'VC-200114' },
    priors: [{ d: '06/30/1996', o: 'POSSESSION — CONTROLLED SUB.', dp: 'PORT ALDEN PD', r: 'DIVERSION' }],
    notes: 'Vehicle of record: 1992 FORD ECONOLINE, plate TDL-771, white.',
    xref: [], docs: [], tags: ['TRAINING'], plate: 'TDL-771'
  },
  {
    id: 'p_ivers', index: 'civ', name: 'IVERS, ROSALIND JUNE', dob: '05/03/1971', sex: 'F',
    ht: '5-5', wt: '130', eyes: 'GRN', hair: 'RED', ssn: '390-31-0099',
    addr: '19 CANNERY WALK, PORT ALDEN VC', occupation: 'NURSE — ST. BRENDAN\'S',
    status: 'CIVILIAN', statusKind: 'ok',
    face: { sex: 'f', age: 27, hair: 'long', hairColor: 2, skin: 0, mood: 'flat' },
    priors: [],
    notes: 'Vehicle of record: 1994 HONDA ACCORD, plate JHM-330, silver.\nNo record of interest. Included in training set.',
    xref: [], docs: [], tags: ['TRAINING'], plate: 'JHM-330'
  }
  ];

  var byId = {};
  P.forEach(function (p) { byId[p.id] = p; });

  function get(id) { return byId[id]; }

  /** search(query, {index, clearance}) — records above the clearance stay hidden unless unlocked. */
  function search(q, opts) {
    opts = opts || {};
    var st = NW.state.s;
    var clr = opts.clearance || st.operator.clearance;
    return P.filter(function (p) {
      if (opts.index && p.index !== opts.index) return false;
      if ((p.clearance || 1) > clr && !st.records[p.id]) return false;
      if (p.hidden && !st.records[p.id]) return false;
      var hay = [p.name, (p.aka || []).join(' '), p.dob, p.addr, p.ssn, p.occupation,
                 p.plate, p.phone, (p.tags || []).join(' '), p.status].join(' ');
      return NW.util.matches(hay, q);
    });
  }

  function all() { return P; }

  NW.people = { get: get, search: search, all: all, byId: byId };
})(window.NW);

/* NIGHTWIRE — data/documents.js — archive documents, rendered as 1990s paperwork */
(function (NW) {
  'use strict';

  function head(org, form) {
    return `<div class="p-org">${org}</div><div class="p-form">${form}</div><div class="p-rule"></div>`;
  }
  function f(l, v) { return `<div class="p-field"><span class="pf-l">${l}</span><span class="pf-v">${v}</span></div>`; }
  function sig(name, title) {
    return `<div class="p-sig"><div><span class="p-hand">${name}</span><br>${title}</div><div><span class="p-hand">&nbsp;</span><br>DATE</div></div>`;
  }

  var DOCS = [

  /* ═══════════ 1987 ═══════════ */
  {
    id: 'd_accident_87', title: 'ACCIDENT / FIRE REPORT — MERCER RD', kind: 'report',
    date: '08/12/1987', source: 'PORT ALDEN PD', tags: ['1987', 'FIRE', 'VANCE'],
    html: () => `
      ${head('PORT ALDEN POLICE DEPARTMENT', 'FORM PA-14 · VEHICLE FIRE / FATALITY')}
      <div class="stamp tr">COPY</div>
      ${f('CASE NUMBER', 'PA 87-3319')}
      ${f('DATE / TIME OF ALARM', '08/12/1987 &nbsp; 23:10 HRS')}
      ${f('LOCATION', 'MERCER ROAD, MILE 4.1 — EMBANKMENT, EAST SIDE')}
      ${f('VEHICLE', '1986 OLDSMOBILE CUTLASS CIERA, BEIGE — PLATE KTV-418')}
      ${f('REGISTERED OWNER', 'VANCE, ELIAS T., 18 KESTREL ROW')}
      ${f('OCCUPANTS', 'ONE (1) — DECEASED')}
      ${f('REPORTING OFFICER', 'SGT. D. BRENNICK #221')}
      <h3 class="p-h">NARRATIVE</h3>
      <p>At 2310 hrs this officer responded to a report of a vehicle fire on Mercer Road. On arrival the
      vehicle was fully involved. Fire suppression by Port Alden VFD at 2331 hrs.</p>
      <p>Vehicle had left the roadway at a right-hand curve and come to rest against the embankment.
      <b>No skid marks were observed on the roadway surface.</b> One occupant was located in the driver
      position, deceased, <b>badly burned beyond visual identification</b>.</p>
      <p>Roadway was dry. Weather clear. No other vehicles involved. No witnesses located.</p>
      <p>Cause of fire attributed to fuel line rupture on impact. <b>No further investigation recommended.</b></p>
      <h3 class="p-h">DISPOSITION</h3>
      <p>Decedent removed to Vandermeer County Morgue by Wexler Funeral Service under coroner
      authority. Vehicle removed to PA PD impound lot, released to insurer 09/04/1987.</p>
      ${sig('D. Brennick', 'REPORTING OFFICER')}
      <div class="p-foot">PA-14 (REV. 3-84) · PAGE 1 OF 1</div>`
  },
  {
    id: 'd_coroner_87', title: 'CORONER FINDING — DECEDENT 87-4410', kind: 'medical',
    date: '08/17/1987', source: 'VC CORONER', tags: ['1987', 'VANCE', 'ID'],
    html: () => `
      ${head('VANDERMEER COUNTY CORONER', 'FORM VC-9 · FINDING OF DEATH')}
      <div class="stamp tr blue">FILED</div>
      ${f('FILE', '87-4410')}
      ${f('DECEDENT', 'VANCE, ELIAS THEODORE')}
      ${f('DOB', '03/19/1949')}
      ${f('DATE OF DEATH', '08/12/1987 (EST. 2255–2310 HRS)')}
      ${f('CAUSE', 'THERMAL INJURY / SMOKE INHALATION')}
      ${f('MANNER', 'ACCIDENT')}
      <h3 class="p-h">IDENTIFICATION</h3>
      <p>Remains were not visually identifiable. Fingerprint comparison was <b>not attempted</b>;
      the epidermal ridges of both hands were destroyed.</p>
      <p>Identification was made by comparison of post-mortem dental radiographs against ante-mortem
      charts supplied by <b>DR. A. M. SEIBOLD, D.D.S.</b>, Port Alden, treating dentist of record for
      the named decedent. Comparison performed 08/16/1987. Concordance reported on four restorations.</p>
      <h3 class="p-h">EXAMINER'S NOTE</h3>
      <p class="p-mono">Height of remains estimated 5'9"–5'11". Ante-mortem record for the named
      decedent lists 5'11". Within tolerance.</p>
      <p class="p-mono">Upper-left bridgework present in the remains is <u>not reflected</u> in the
      supplied ante-mortem chart. Dr. Seibold advises this was placed at another practice and the
      chart not updated. Accepted.</p>
      ${sig('R. Wexler', 'ACTING CORONER')}
      <div class="p-foot">VC-9 · RECORD RETAINED 25 YEARS</div>`,
    highlight: ['bridgework', 'not attempted']
  },
  {
    id: 'd_dental_87', title: 'DENTAL COMPARISON WORKSHEET', kind: 'medical',
    date: '08/16/1987', source: 'DR. A. M. SEIBOLD DDS', tags: ['1987', 'ID'],
    html: () => `
      ${head('SEIBOLD FAMILY DENTISTRY · PORT ALDEN', 'ANTE-MORTEM / POST-MORTEM COMPARISON')}
      <p class="p-mono">PATIENT OF RECORD: VANCE, E. — CHART 1140
POST-MORTEM SET: VC CORONER 87-4410

  TOOTH  ANTE-MORTEM              POST-MORTEM            CONCORDANT
  ─────  ───────────────────────  ─────────────────────  ──────────
  #3     MOD AMALGAM 1981         MOD AMALGAM            YES
  #14    OCCLUSAL AMALGAM 1979    OCCLUSAL AMALGAM       YES
  #19    CROWN, GOLD 1983         CROWN, GOLD            YES
  #30    MOD COMPOSITE 1985       MOD AMALGAM            *SEE NOTE
  #12-13 —                        FIXED BRIDGE           *NOT CHARTED
  #21    —                        EXTRACTED (HEALED)     *NOT CHARTED</p>
      <h3 class="p-h">NOTE</h3>
      <p class="handwrite">#30 — restoration material differs but position &amp; margin consistent.
      Bridge 12–13 placed elsewhere, chart not updated. Extraction #21 likewise.
      In my opinion the identification is sound.</p>
      ${sig('A. M. Seibold', 'D.D.S. LIC. 4471-D')}
      <div class="margin-note" style="top:300px">3 of 6 features
      do not match &mdash; who
      accepted this?</div>`,
    handAnnotated: true
  },
  {
    id: 'd_dental_seibold', title: 'DENTAL CHART — FEARN, R. (1981)', kind: 'medical',
    date: '04/02/1981', source: 'DR. A. M. SEIBOLD DDS', tags: ['1987', 'FEARN'],
    html: () => `
      ${head('SEIBOLD FAMILY DENTISTRY · PORT ALDEN', 'PATIENT CHART EXTRACT')}
      ${f('PATIENT', 'FEARN, RENNICK J.')}
      ${f('CHART', '2207')}
      ${f('LAST SEEN', '04/02/1981')}
      <p class="p-mono">  TOOTH   TREATMENT                           DATE
  ─────   ──────────────────────────────────  ──────────
  #12-13  FIXED BRIDGE, PORCELAIN-FUSED       04/02/1981
  #21     EXTRACTION (NON-RESTORABLE)         01/19/1981
  #30     MOD AMALGAM                          11/08/1980
  #3      MOD AMALGAM                          06/22/1979
  #14     OCCLUSAL AMALGAM                     06/22/1979
  #19     CROWN, GOLD                          09/30/1979</p>
      <p>Account settled in cash. No further appointments scheduled.</p>
      <div class="p-foot">RECOVERED FROM PRACTICE RECORDS SEIZED BY THE STATE BOARD, 1990</div>`
  },
  {
    id: 'd_missing_87', title: 'MISSING PERSON — FEARN, RENNICK J.', kind: 'report',
    date: '08/24/1987', source: 'PORT ALDEN PD', tags: ['1987', 'MISSING'],
    html: () => `
      ${head('PORT ALDEN POLICE DEPARTMENT', 'FORM PA-22 · MISSING PERSON')}
      <div class="stamp br">INACTIVE</div>
      ${f('CASE', 'PA 87-2201')}
      ${f('SUBJECT', 'FEARN, RENNICK JOEL — WM, 40, 5-10, 171')}
      ${f('LAST SEEN', '08/10/1987, BLUE LARKSPUR MOTEL, RT 9, ROOM 14')}
      ${f('REPORTED BY', 'SIKES, LENORE F. (NIGHT CLERK)')}
      <h3 class="p-h">NARRATIVE</h3>
      <p>Complainant states subject had occupied room 14 continuously since 07/28/1987, paying weekly
      in cash. <b>Subject failed to return the evening of 08/10/1987.</b> Personal effects (one bag, work
      boots, jacket) remain in the room.</p>
      <p>Complainant states a man came to the office <b>on 08/11/1987</b> and <b>paid the room out through
      the end of the month</b>, in cash, and asked that the effects not be disturbed. Complainant describes
      him as <b>"big, dark hair, maybe forty, drove a grey van."</b> Complainant did not obtain a name.</p>
      <p>Subject has no fixed address, no employer, and one known relative (brother, O. L. FEARN,
      currently in custody). Brother declined to be interviewed.</p>
      <h3 class="p-h">DISPOSITION</h3>
      <p>No evidence of foul play. Subject is an adult with a transient history. Case placed inactive
      pending further information. Closed administratively 01/1991.</p>
      ${sig('T. Halloway', 'DETECTIVE')}`
  },
  {
    id: 'd_motel_reg', title: 'MOTEL REGISTER — BLUE LARKSPUR, AUG 1987', kind: 'ledger',
    date: '08/1987', source: 'BLUE LARKSPUR MOTEL', tags: ['1987', 'MOTEL'],
    html: () => `
      ${head('BLUE LARKSPUR MOTEL · ROUTE 9', 'GUEST REGISTER — AUGUST 1987 (EXTRACT)')}
      <table>
        <tr><th>RM</th><th>NAME AS GIVEN</th><th>IN</th><th>OUT</th><th>PAID</th><th>VEHICLE</th></tr>
        <tr><td>11</td><td>J. SWANN</td><td>07/30</td><td>08/02</td><td>CASH</td><td>—</td></tr>
        <tr><td>14</td><td>R. FEARN</td><td>07/28</td><td>—</td><td>CASH/WK</td><td>NONE</td></tr>
        <tr><td>14</td><td>(PAID FWD BY OTHER)</td><td>08/11</td><td>08/31</td><td>CASH $210</td><td>GREY VAN, NO PLATE NOTED</td></tr>
        <tr><td>6</td><td>M. ORLOFF</td><td>08/09</td><td>08/12</td><td>CHECK</td><td>WI PLATE</td></tr>
        <tr><td>9</td><td>C. ANSELL</td><td>08/11</td><td>08/13</td><td>CASH</td><td>GREY VAN</td></tr>
        <tr><td>3</td><td>D. PARRISH</td><td>08/14</td><td>08/15</td><td>CASH</td><td>—</td></tr>
      </table>
      <p class="handwrite">Spelled it with two L's when he signed. I remember because
      I asked him twice. — L.S.</p>
      <div class="p-foot">PHOTOCOPIED FROM THE ORIGINAL BOUND REGISTER AT THE REQUEST OF NCIB, 11/1998</div>`,
    highlight: ['ANSELL']
  },
  {
    id: 'd_witsec_87', title: 'PROGRAM ENTRY — WS-2 (REDACTED)', kind: 'federal',
    date: '08/29/1987', source: 'WITNESS SECURITY', tags: ['WITSEC', 'FINN', 'SEALED'],
    clearance: 3,
    html: () => `
      ${head('UNITED STATES — WITNESS SECURITY PROGRAM', 'FORM WS-2 · AUTHORISATION FOR PROGRAM ENTRY')}
      <div class="stamp mid">SEALED</div>
      ${f('FILE', 'WS-4-0119')}
      ${f('PRINCIPAL — TRUE NAME', '<span class="redact">VANCE, ELIAS THEODORE</span>')}
      ${f('PRINCIPAL — ASSIGNED', 'MAULE, PETER ALLEN')}
      ${f('SECTOR', '4 — BRAEMOOR, ST. OF KELLAND')}
      ${f('BASIS', 'TESTIMONY, FED. GRAND JURY 87-VC-9')}
      ${f('THREAT ASSESSMENT', 'HIGH — ORGANISED FINANCIAL / VIOLENT NEXUS')}
      <h3 class="p-h">CUSTODY OF FILE</h3>
      <p>Program files are ordinarily held jointly by the sector inspector and the originating field
      office. <b>In this matter joint custody is waived</b> at the request of the originating office
      on grounds of source protection.</p>
      ${f('SOLE CUSTODIAN', 'FINN, W. R. — GS-13, FIELD OPERATIONS')}
      ${f('SECTOR INSPECTOR', 'PEMBERTON, H. D. — <i>(noted, not concurring)</i>')}
      <h3 class="p-h">DEATH NOTICE PROTOCOL</h3>
      <p><b>A public death record has been established for the true name</b> to close open exposure.
      Coroner file VC 87-4410 refers. Custodian is responsible for the maintenance of the fiction.</p>
      ${sig('W. R. Finn', 'AUTHORISING OFFICER')}
      <div class="p-foot">DISCLOSURE OUTSIDE THE PROGRAM IS A FEDERAL OFFENCE · 18 USC 3521</div>`
  },
  {
    id: 'd_pemberton_complaint', title: 'INTERNAL COMPLAINT — SINGLE CUSTODY', kind: 'federal',
    date: '05/11/1992', source: 'INSP. H. PEMBERTON', tags: ['WITSEC', 'FINN'],
    html: () => `
      ${head('WITNESS SECURITY — SECTOR 4', 'MEMORANDUM · INTERNAL COMPLAINT (2ND)')}
      <div class="stamp br">CLOSED — NO FINDING</div>
      ${f('FROM', 'PEMBERTON, H. D., INSPECTOR')}
      ${f('TO', 'OFFICE OF PROFESSIONAL RESPONSIBILITY')}
      ${f('RE', 'FILE WS-4-0119 — CUSTODY IRREGULARITY (REPEAT)')}
      <p>I raised this in 1988 and I am raising it again.</p>
      <p><b>One file in my sector is held by a single custodian outside this office.</b> I have never met the
      principal. I have never verified that the principal is alive. Quarterly contact reports arrive
      typed, unsigned, and in an identical format, from the custodian.</p>
      <p>In February of this year I attempted a courtesy visit to the address of record in Braemoor.
      <b>The address is a mail drop above a laundry.</b> The proprietor states the box has been rented for
      five years by <b>a man who is not the principal</b>.</p>
      <p>I am aware that <b>the custodian is now a Deputy Chief</b>. That is the reason I am writing rather
      than telephoning.</p>
      <p>I ask only that someone other than the custodian lay eyes on the principal once.</p>
      ${sig('H. D. Pemberton', 'INSPECTOR, SECTOR 4')}
      <p class="p-mono" style="margin-top:18px">— — — ENDORSEMENT — — —
REVIEWED. NO IRREGULARITY IDENTIFIED. COMPLAINANT ADVISED.
FILE CLOSED 07/02/1992.</p>`
  },
  {
    id: 'd_gj_abate', title: 'ORDER OF ABATEMENT — GJ 87-VC-9', kind: 'court',
    date: '09/03/1987', source: 'US DISTRICT COURT', tags: ['1987', 'HALLORAN'],
    html: () => `
      ${head('UNITED STATES DISTRICT COURT · DISTRICT OF VANDERMEER', 'ORDER')}
      <h2 class="p-title">IN RE: GRAND JURY 87-VC-9</h2>
      <p>The Government having advised the Court that its cooperating witness in the above matter is
      deceased as of 12 August 1987, and no substitute testimony being available as to the entries in
      the ledgers described in the Government's proffer;</p>
      <p>IT IS ORDERED that the investigation is <b>ABATED</b>. The empanelment is discharged. Materials
      produced under subpoena shall be returned to the producing parties.</p>
      <p>The Court notes with regret that a matter of this magnitude should rest upon the survival of
      one man.</p>
      ${sig('Hon. E. Ruvalcaba', 'UNITED STATES DISTRICT JUDGE')}`
  },
  {
    id: 'd_insurance_87', title: 'LIFE CLAIM PAYMENT — MERIDIAN', kind: 'business',
    date: '11/19/1987', source: 'MERIDIAN LIFE ASSURANCE', tags: ['1987', 'MONEY'],
    html: () => `
      ${head('MERIDIAN LIFE ASSURANCE COMPANY', 'CLAIM SETTLEMENT ADVICE')}
      ${f('POLICY', 'ML 44-118-207')}
      ${f('INSURED', 'VANCE, ELIAS T.')}
      ${f('BENEFICIARY', 'VANCE, CLAIRE M. (SPOUSE)')}
      ${f('FACE AMOUNT', '$85,000.00')}
      ${f('CLAIM PAID', '11/19/1987')}
      <h3 class="p-h">UNDERWRITING NOTE</h3>
      <p>Policy was increased from $25,000 to $85,000 on <b>06/01/1987</b>, ten weeks prior to loss.
      Contestability period had not expired. The company <b>waived contest</b> following receipt of the
      coroner's finding and <b>a letter from the office of the United States Attorney</b> requesting
      expedition "in the interest of an ongoing federal matter."</p>
      <p>Letter is on file. <b>It bears no case number.</b></p>`
  },
  {
    id: 'd_ledger_1', title: 'PORT ALDEN LEDGER — 13 AUG 1987', kind: 'news',
    date: '08/13/1987', source: 'PORT ALDEN LEDGER', tags: ['1987', 'PRESS'],
    paperClass: 'news',
    html: () => `
      <div class="n-mast">The Port Alden Ledger</div>
      <div class="n-meta"><span>THURSDAY, AUGUST 13, 1987</span><span>VANDERMEER COUNTY</span><span>25¢</span></div>
      <div class="n-hed">Quarry Accountant Dies in Route Fire Hours Before Grand Jury</div>
      <div class="n-dek">Federal probe of Halloran Aggregate believed to hinge on his testimony</div>
      <div class="n-byline">By SIMONE ADAIR, Staff Writer</div>
      <div class="n-body">
        <p>Elias T. Vance, 38, of Kestrel Row, died Wednesday night when his car left Mercer Road and
        burned, county officials said. He was to have appeared before a federal grand jury Thursday
        morning.</p>
        <p>Mr. Vance had been employed for thirteen years as senior ledger accountant at the Halloran
        Aggregate and Quarry Company. Persons familiar with the matter said the grand jury was
        examining invoicing practices at the firm.</p>
        <p>Port Alden police said there were no witnesses and no other vehicles involved. Sgt. Doyle
        Brennick, who responded, said the alarm came in at 11:10 p.m.</p>
        <p>County dispatch records reviewed by the Ledger show a call reporting a fire on Mercer Road
        logged at <b>10:52 p.m.</b> — eighteen minutes before the time given by police. A dispatch
        supervisor said the earlier entry was "probably a clerical duplicate."</p>
        <p>Mr. Vance is survived by his wife, Claire. A spokesman for the United States Attorney
        declined to comment on the status of the investigation.</p>
      </div>`,
    highlight: ['10:52']
  },
  {
    id: 'd_ledger_2', title: 'PORT ALDEN LEDGER — 22 SEP 1987', kind: 'news',
    date: '09/22/1987', source: 'PORT ALDEN LEDGER', tags: ['1987', 'PRESS'],
    paperClass: 'news',
    html: () => `
      <div class="n-mast">The Port Alden Ledger</div>
      <div class="n-meta"><span>TUESDAY, SEPTEMBER 22, 1987</span><span>VANDERMEER COUNTY</span><span>25¢</span></div>
      <div class="n-hed">Halloran Inquiry Closed; No Charges</div>
      <div class="n-dek">Judge cites death of sole cooperating witness</div>
      <div class="n-byline">By STAFF REPORTS</div>
      <div class="n-body">
        <p>A federal grand jury investigation into the Halloran Aggregate and Quarry Company has been
        abated, court records show. No charges were returned.</p>
        <p>Jonas Halloran, the firm's president, said in a statement that the company had "cooperated
        fully and been vindicated by the process."</p>
        <p>Questions submitted by this newspaper to the Vandermeer County dispatch office regarding the
        timing of the alarm on Mercer Road were referred to the regional office of the National
        Criminal Intelligence Bureau, which declined to comment.</p>
        <p><i>Simone Adair has been reassigned to the features desk. County government coverage will be
        handled by staff.</i></p>
      </div>`
  },

  /* ═══════════ 1998 — THE QUARRY ═══════════ */
  {
    id: 'd_scene_98', title: 'SCENE REPORT — HALLORAN QUARRY', kind: 'report',
    date: '11/06/1998', source: 'NCIB EVIDENCE RESPONSE', tags: ['1998', 'QUARRY'],
    html: () => `
      ${head('NATIONAL CRIMINAL INTELLIGENCE BUREAU', 'FORM NC-30 · SCENE REPORT')}
      ${f('CASE', 'VC 98-1173')}
      ${f('LOCATION', 'HALLORAN QUARRY, OFF MERCER RD — SOUTH WATER')}
      ${f('DATE / TIME', '11/06/1998 · SECURED 21:14 HRS')}
      ${f('TECHNICIAN', 'PRYCE, O. B. — FT III')}
      <h3 class="p-h">RECOVERY</h3>
      <p>Adult male recovered from approximately 4 m of water, 11 m from the south shelf. Body was
      <b>weighted at the ankles with a length of chain and a section of steel plate</b>, both consistent with
      material stockpiled at the site.</p>
      <p>Immersion interval estimated at 24–60 hours. Water temperature 7°C.</p>
      <h3 class="p-h">CONDITION OF HANDS</h3>
      <p>Epidermis of both hands was sloughing. Technician applied the tissue-builder technique and
      recovered <b>usable ridge detail from the right thumb and right index</b>. Left hand
      unrecoverable.</p>
      <p>Latents lifted, coded <b>L-1</b> (R thumb) and <b>L-2</b> (R index). Forwarded to Terminal 04
      for index comparison.</p>
      <h3 class="p-h">OTHER</h3>
      <p>No wallet, no keys, no jewellery. <b>Clothing labels removed at the collar and waistband — cut,
      not torn.</b> Left trouser pocket contained <b>one brass key, unmarked</b>, of a warded pattern consistent
      with a padlock rather than a door.</p>
      <p>Tyre impressions on the south approach are inconsistent with the recovery vehicles. Cast taken.
      <b>Dual rear wheel, commercial pattern.</b></p>
      ${sig('O. B. Pryce', 'FORENSIC TECHNICIAN III')}`
  },
  {
    id: 'd_me_98', title: 'AUTOPSY PROTOCOL — VC 98-6612', kind: 'medical',
    date: '11/07/1998', source: 'VC MEDICAL EXAMINER', tags: ['1998', 'QUARRY'],
    html: () => `
      ${head('VANDERMEER COUNTY MEDICAL EXAMINER', 'AUTOPSY PROTOCOL (PRELIMINARY)')}
      ${f('FILE', 'VC 98-6612')}
      ${f('DECEDENT', 'UNIDENTIFIED ADULT MALE — "JOHN DOE 98-11"')}
      ${f('AGE ESTIMATE', '46–56 YEARS')}
      ${f('HEIGHT / WEIGHT', '5-11 · 186 LB')}
      ${f('MANNER', 'HOMICIDE')}
      ${f('CAUSE', 'GUNSHOT WOUND OF THE CHEST · PERFORATING')}
      <h3 class="p-h">FINDINGS</h3>
      <p>Single entrance wound, left anterior chest, 3 cm inferomedial to the nipple. <b>No soot, no
      stippling. Range beyond 90 cm.</b> Track anterior to posterior, slightly downward. Exit right
      posterior thorax.</p>
      <p><b>No projectile recovered from the body.</b></p>
      <p>Immersion changes moderate. Water in the airways is <b>absent</b> — the decedent did not
      breathe after entering the water.</p>
      <h3 class="p-h">IDENTIFYING FEATURES</h3>
      <p>Healed surgical scar, right knee, arthroscopic pattern, approximately 10–15 years old.
      Bilateral corrective lens wear (indentation, nasal bridge). Extensive restorative dentition
      including <b>fixed bridge #12–13</b> and healed extraction #21.</p>
      <h3 class="p-h">EXAMINER'S REMARK</h3>
      <p class="p-mono">This is the second set of remains to cross this table with a #12–13 bridge and
      a #21 extraction. The first was eleven years ago and I have never seen the file.
      I would like to see the file.</p>
      ${sig('I. C. Abaroa, M.D.', 'CHIEF MEDICAL EXAMINER')}`
  },
  {
    id: 'd_me_request', title: 'RECORDS REQUEST — DENIED', kind: 'memo',
    date: '02/14/1995', source: 'VC MEDICAL EXAMINER', tags: ['1987', 'BLOCKED'],
    html: () => `
      ${head('VANDERMEER COUNTY MEDICAL EXAMINER', 'INTER-AGENCY RECORDS REQUEST')}
      ${f('REQUESTOR', 'ABAROA, I. C., M.D. — CHIEF ME')}
      ${f('REQUESTED', 'VC CORONER FILE 87-4410 (VANCE) — COMPLETE, INCL. RADIOGRAPHS')}
      ${f('PURPOSE', 'HISTORIC IDENTIFICATION REVIEW PROGRAMME')}
      <div class="p-rule thin"></div>
      <p class="p-mono">— — — RESPONSE — — —

STATUS:   ARCHIVED OFFSITE — UNAVAILABLE
LOCATION: NOT ON FILE
RELEASED: NO

REQUEST CLOSED 03/01/1995.</p>
      <p class="handwrite">Offsite where? There is no offsite. — I.A.</p>
      <div class="p-foot">FOUR OTHER 1995 REVIEW REQUESTS WERE FILLED WITHIN NINE DAYS</div>`
  },
  {
    id: 'd_ballistics_98', title: 'FIREARMS EXAMINATION — CASING M-1', kind: 'forensic',
    date: '11/07/1998', source: 'NCIB LAB', tags: ['1998', 'MILL', 'BALLISTICS'],
    lockedBy: 'ev_casing',
    html: () => `
      ${head('NCIB REGIONAL LABORATORY', 'FIREARMS / TOOLMARK EXAMINATION')}
      ${f('EXHIBIT', 'M-1 — ONE (1) FIRED CARTRIDGE CASE, .38 SPECIAL')}
      ${f('RECOVERED', 'MARROW ST MILL, LOADING BAY 2, 11/07/1998')}
      ${f('EXAMINER', 'PRYCE, O. B.')}
      <h3 class="p-h">CLASS CHARACTERISTICS</h3>
      <p>Firing pin impression: circular, off-centre 0.4 mm at 2 o'clock. Breech face: parallel
      striae, 14 lines per mm, left-leaning. Extractor mark absent (revolver).</p>
      <h3 class="p-h">COMPARISON</h3>
      <p>Compared against the open-case reference set and the agency-issue reference set.</p>
      <table>
        <tr><th>REFERENCE</th><th>WEAPON</th><th>RESULT</th></tr>
        <tr><td>R-114</td><td>.38 SPL RH-44120 — REG. C. R. ANSEL 1995</td><td>ELIMINATED</td></tr>
        <tr><td>R-201</td><td>.38 SPL — VC SHERIFF SURPLUS LOT</td><td>ELIMINATED</td></tr>
        <tr><td>R-330</td><td>.38 SPL — NCIB INVENTORY 8841-D</td><td><b>IDENTIFICATION</b></td></tr>
      </table>
      <h3 class="p-h">REMARK</h3>
      <p>Reference R-330 is a test-fire held in the agency reference collection for an inventory
      weapon. Inventory 8841-D was reported <b>destroyed</b> per form NC-88 in 1994.</p>
      <p>A destroyed weapon has fired a round in Vandermeer County this week. The examiner declines to
      speculate and refers the matter upward.</p>
      ${sig('O. B. Pryce', 'FIREARMS EXAMINER')}`
  },
  {
    id: 'd_nc88_lease', title: 'NC-88 · ASSET DISPOSAL SCHEDULE 1994', kind: 'memo',
    date: '12/29/1994', source: 'NCIB REGIONAL — PROPERTY', tags: ['FINN', 'WEAPON'],
    html: () => `
      ${head('NATIONAL CRIMINAL INTELLIGENCE BUREAU — REGIONAL', 'FORM NC-88 · DISPOSAL OF CONTROLLED ASSETS')}
      ${f('SCHEDULE', 'Q4/1994 — LOT 12')}
      <table>
        <tr><th>INV. NO.</th><th>DESCRIPTION</th><th>METHOD</th><th>WITNESSED</th></tr>
        <tr><td>8839-D</td><td>.357 REVOLVER</td><td>FURNACE</td><td>YES</td></tr>
        <tr><td>8840-D</td><td>.38 SPL REVOLVER</td><td>FURNACE</td><td>YES</td></tr>
        <tr><td><b>8841-D</b></td><td><b>.38 SPL REVOLVER</b></td><td><b>FURNACE</b></td><td><b>—</b></td></tr>
        <tr><td>8842-D</td><td>12 GA SHOTGUN</td><td>FURNACE</td><td>YES</td></tr>
        <tr><td>8843-D</td><td>SURVEILLANCE VAN (VC-AMB-4)</td><td>AUCTION</td><td>YES</td></tr>
      </table>
      <p>One line on this schedule carries no witnessing initials. The authorising signature covers
      the schedule as a whole.</p>
      ${sig('W. R. Finn', 'AUTHORISING OFFICER — DEPUTY CHIEF')}`
  },

  /* ═══════════ VOSS ═══════════ */
  {
    id: 'd_nc71_voss', title: 'NC-71 · SEPARATION — VOSS, M. A.', kind: 'memo',
    date: '03/16/1998', source: 'NCIB REGIONAL — PERSONNEL', tags: ['VOSS', 'FINN'],
    html: () => `
      ${head('NATIONAL CRIMINAL INTELLIGENCE BUREAU — REGIONAL', 'FORM NC-71 · SEPARATION FROM SERVICE')}
      ${f('EMPLOYEE', 'VOSS, MARGARET ANNE — OPERATOR, TERMINAL 04')}
      ${f('TYPE', 'VOLUNTARY RESIGNATION')}
      ${f('EFFECTIVE', '03/16/1998')}
      ${f('NOTICE GIVEN', 'NONE — WAIVED')}
      ${f('EXIT INTERVIEW', 'WAIVED')}
      ${f('FORWARDING ADDRESS', '<i>none provided</i>')}
      ${f('CREDENTIALS RETURNED', 'NO — REPORTED LOST')}
      ${f('TERMINAL ACCESS REVOKED', '03/16/1998 &nbsp; 04:12 HRS')}
      <h3 class="p-h">EMPLOYEE STATEMENT</h3>
      <p class="p-mono">&lt;NONE ON FILE&gt;</p>
      <h3 class="p-h">EMPLOYEE SIGNATURE</h3>
      <p class="p-mono">&lt;NONE ON FILE — SIGNED ON BEHALF, AUTHORITY OF DEPUTY CHIEF&gt;</p>
      ${sig('W. R. Finn', 'DEPUTY CHIEF')}
      <p class="handwrite" style="margin-top:14px">04:12. She was on shift. Nobody resigns
      at four in the morning in the middle of a shift.</p>`
  },
  {
    id: 'd_effects_log', title: 'PERSONAL EFFECTS LOG — SUB-LEVEL 2', kind: 'ledger',
    date: '03/18/1998', source: 'NCIB FACILITIES', tags: ['VOSS'],
    html: () => `
      ${head('NCIB REGIONAL — FACILITIES', 'PERSONAL EFFECTS — UNCLAIMED PROPERTY LOG')}
      ${f('OWNER', 'VOSS, M. A. (SEPARATED)')}
      ${f('LOCATION', 'SUB-LEVEL 2, CAGE 3, BOX 11')}
      <table>
        <tr><th>ITEM</th><th>DESCRIPTION</th></tr>
        <tr><td>1</td><td>COFFEE MUG, CHIPPED, "WORLD'S OKAYEST OPERATOR"</td></tr>
        <tr><td>2</td><td>PHOTOGRAPH, FRAMED — TWO WOMEN AT A LAKE, UNDATED</td></tr>
        <tr><td>3</td><td>CARDIGAN, GREY, WOOL</td></tr>
        <tr><td>4</td><td>PAPERBACK — "THE ROAD WE DON'T TAKE", A. FEN, 1979. HEAVILY MARKED.</td></tr>
        <tr><td>5</td><td>SPARE SPECTACLES</td></tr>
        <tr><td>6</td><td>ASTHMA INHALER, HALF FULL</td></tr>
        <tr><td>7</td><td>HOUSE KEYS (3) ON A RING, PLASTIC FOB</td></tr>
        <tr><td>8</td><td>HANDBAG, LEATHER, BROWN — CONTAINS PURSE, CASH $41, LICENCE</td></tr>
      </table>
      <p class="p-mono">NOTE: Items 5–8 were on the desk at the time of separation.</p>
      <p class="handwrite">She left without her glasses, her keys, her purse and her inhaler.</p>`,
    highlight: ['THE ROAD WE DON\'T TAKE']
  },
  {
    id: 'd_solt_note', title: 'STAFFING NOTE — TERMINAL 04', kind: 'memo',
    date: '03/17/1998', source: 'NCIB REGIONAL', tags: ['VOSS', 'SOLT'],
    html: () => `
      ${head('NCIB REGIONAL — OFFICE OF THE DEPUTY CHIEF', 'INTERNAL NOTE')}
      ${f('TO', 'SOLT, G. E. — DUTY OFFICER, NIGHT WATCH')}
      ${f('FROM', 'FINN, W. R. — DEPUTY CHIEF')}
      <p>Graham,</p>
      <p>Terminal 04 is being restaffed. The previous operator resigned for personal reasons and I would
      ask that the matter not be discussed on the floor. She was under strain and I do not want
      speculation attaching to her name.</p>
      <p><b>The terminal itself is to be reimaged before the new operator sits down.</b> Property Branch has
      the work order.</p>
      <p>You have thirty years in this building, Graham. You know when a thing is better left alone.</p>
      ${sig('W. R. F.', 'DEPUTY CHIEF')}
      <p class="p-mono" style="margin-top:16px">[TERMINAL 04 REIMAGE WORK ORDER 98-2214 — <b>NOT EXECUTED</b>.
CLOSED "COMPLETE" 03/20/1998 BY REQUESTOR.]</p>`
  },

  /* ═══════════ MONEY / SHELLS ═══════════ */
  {
    id: 'd_llc_alden', title: 'CORPORATE FILING — ALDEN CIVIC HOLDINGS LLC', kind: 'business',
    date: '01/14/1994', source: 'VC COUNTY RECORDS', tags: ['MONEY', 'SHELL'],
    html: () => `
      ${head('VANDERMEER COUNTY — OFFICE OF THE CLERK', 'ARTICLES OF ORGANISATION · LIMITED LIABILITY COMPANY')}
      ${f('ENTITY', 'ALDEN CIVIC HOLDINGS LLC')}
      ${f('FILED', '01/14/1994')}
      ${f('PURPOSE', 'ACQUISITION AND MANAGEMENT OF SURPLUS MUNICIPAL PROPERTY')}
      ${f('REGISTERED AGENT', 'BELLAMY, HOWARD K. — 1 HARBOUR CREST, ASHVALE')}
      ${f('MEMBERS', '<i>not disclosed — permitted</i>')}
      ${f('CAPITAL', '$1,000')}
      <h3 class="p-h">PROPERTY HELD</h3>
      <table>
        <tr><th>ACQUIRED</th><th>PROPERTY</th><th>FROM</th></tr>
        <tr><td>03/1994</td><td>MARROW ST PAPER MILL (LEASEHOLD)</td><td>MERIDIAN PAPER (RECEIVER)</td></tr>
        <tr><td>06/1994</td><td>GRIEVE HILL STATE HOSPITAL — BLDGS B &amp; C (LEASEHOLD, 25 YR)</td><td>STATE OF VANDERMEER</td></tr>
        <tr><td>11/1994</td><td>LOT 44, HARBOUR ST</td><td>VC TAX SALE</td></tr>
        <tr><td>03/1998</td><td>ONE (1) DECOMMISSIONED AMBULANCE, VC-AMB-4</td><td>NCIB REGIONAL (AUCTION)</td></tr>
      </table>
      <p>Annual report filings are current. <b>The entity reports no employees and no revenue.
      It has paid $1.4 million in property costs since 1994.</b></p>`,
    highlight: ['GRIEVE HILL']
  },
  {
    id: 'd_lease_grieve', title: 'LEASE ABSTRACT — GRIEVE HILL BLDGS B & C', kind: 'business',
    date: '06/30/1994', source: 'VC COUNTY RECORDS', tags: ['GRIEVE', 'SHELL'],
    html: () => `
      ${head('STATE OF VANDERMEER — SURPLUS PROPERTY BOARD', 'LEASE ABSTRACT')}
      ${f('PREMISES', 'GRIEVE HILL STATE HOSPITAL — BUILDINGS B AND C')}
      ${f('LESSEE', 'ALDEN CIVIC HOLDINGS LLC')}
      ${f('TERM', '25 YEARS FROM 07/01/1994')}
      ${f('RENT', '<b>$1.00 PER ANNUM</b>')}
      ${f('PERMITTED USE', '<b>RECORDS STORAGE — NON-PUBLIC</b>')}
      ${f('PLAN — BLDG B', 'GROUND: ADMINISTRATION · FIRST FLOOR, NORTH WING: WARDS 11–18')}
      <h3 class="p-h">CONDITIONS</h3>
      <p>Lessee shall maintain the perimeter and shall not admit the public. The State shall have no
      right of entry except on ninety (90) days' written notice.</p>
      <p><b>Utilities to Building B are to be maintained live at lessee's cost.</b> Buildings A and D remain
      with the State and are disconnected.</p>
      <h3 class="p-h">METER NOTE (VANDERMEER POWER, 10/1998)</h3>
      <p class="p-mono">BLDG B  — ACTIVE — AVG 1,880 kWh/MONTH
BLDG C  — ACTIVE — AVG    40 kWh/MONTH
BLDG A  — DISCONNECTED 1989
BLDG D  — DISCONNECTED 1989

1,880 kWh IS A HEATED, LIT, OCCUPIED BUILDING.</p>`
  },
  {
    id: 'd_payroll_98', title: 'PAYROLL SUMMARY — HALLORAN AGGREGATE', kind: 'business',
    date: '10/31/1998', source: 'STATE DEPT. OF LABOUR', tags: ['MONEY'],
    html: () => `
      ${head('STATE OF VANDERMEER — DEPARTMENT OF LABOUR', 'QUARTERLY PAYROLL SUMMARY (EXTRACT)')}
      ${f('EMPLOYER', 'HALLORAN AGGREGATE & QUARRY CO. — EIN 44-1180229')}
      ${f('QUARTER', 'Q3 1998')}
      ${f('EMPLOYEES REPORTED', '14')}
      ${f('GROSS WAGES', '$412,900')}
      ${f('PRODUCTION REPORTED TO MINE SAFETY', '0 TONS (SITE INACTIVE SINCE 1994)')}
      <h3 class="p-h">EMPLOYEE SUMMARY</h3>
      <table>
        <tr><th>SSN (MASKED)</th><th>NAME</th><th>Q3 GROSS</th></tr>
        <tr><td>xxx-xx-2288</td><td>HALLORAN-KEEL, R. I.</td><td>$62,500</td></tr>
        <tr><td>xxx-xx-7752</td><td>ANSEL, C. R.</td><td>$47,200</td></tr>
        <tr><td>xxx-xx-1188</td><td>GAULT, P. W.</td><td>$38,900</td></tr>
        <tr><td>xxx-xx-<b>0917</b></td><td><b>MAULE, P. A.</b></td><td><b>$29,400</b></td></tr>
        <tr><td colspan="3" class="dim">— 10 further employees, $234,900 —</td></tr>
      </table>
      <p class="p-mono">SSN xxx-xx-0917 IS ALSO THE SSN OF RECORD FOR A DECEDENT
REGISTERED IN VANDERMEER COUNTY IN AUGUST 1987.</p>`,
    highlight: ['0917', 'MAULE']
  },
  {
    id: 'd_w2_98', title: 'W-2 TRACE — SSN 214-88-0917', kind: 'business',
    date: '11/06/1998', source: 'FEDERAL WAGE INDEX', tags: ['VANCE', 'MONEY'],
    html: () => `
      ${head('FEDERAL WAGE AND TAX INDEX — TRACE RESPONSE', 'RESTRICTED — LAW ENFORCEMENT USE')}
      ${f('SSN', '214-88-0917')}
      ${f('NAME ON RECORD', 'VANCE, ELIAS T. / MAULE, PETER A.')}
      ${f('DEATH INDICATOR', 'SET 08/1987 — <b>CLEARED 09/1987 BY MANUAL OVERRIDE</b>')}
      <table>
        <tr><th>YEAR</th><th>EMPLOYER</th><th>STATE</th><th>WAGES</th></tr>
        <tr><td>1988–1993</td><td>BRAEMOOR CO-OP</td><td>KELLAND</td><td>$18k–24k/yr</td></tr>
        <tr><td>1994–1997</td><td>BRAEMOOR CO-OP</td><td>KELLAND</td><td>$24k–27k/yr</td></tr>
        <tr><td>1998 Q1</td><td>BRAEMOOR CO-OP</td><td>KELLAND</td><td>$7,100</td></tr>
        <tr><td><b>1998 Q2–Q3</b></td><td><b>HALLORAN AGGREGATE &amp; QUARRY</b></td><td><b>VANDERMEER</b></td><td><b>$29,400</b></td></tr>
      </table>
      <p class="p-mono">A protected witness relocated to Sector 4 in 1987 was drawing a wage in his
original county, from the company he was to testify against, in the summer of 1998.

HE CAME HOME. SOMEBODY PUT HIM ON THE PAYROLL.</p>`
  },
  {
    id: 'd_manifest_98', title: 'HAULAGE MANIFESTS — GAULT & SON', kind: 'ledger',
    date: '10/1998', source: 'DOT WEIGHBRIDGE', tags: ['MONEY', 'MILL'],
    html: () => `
      ${head('STATE DEPARTMENT OF TRANSPORTATION', 'WEIGHBRIDGE LOG — RT 9 SOUTH STATION (EXTRACT)')}
      <table>
        <tr><th>DATE</th><th>UNIT</th><th>ORIGIN</th><th>DEST</th><th>GROSS</th><th>MANIFEST</th></tr>
        <tr><td>10/02</td><td>VC-119023</td><td>HALLORAN QRY</td><td>77 MARROW ST</td><td>28,400</td><td>FILL — MISC</td></tr>
        <tr><td>10/09</td><td>VC-119023</td><td>HALLORAN QRY</td><td>77 MARROW ST</td><td>28,150</td><td>FILL — MISC</td></tr>
        <tr><td>10/16</td><td>VC-119023</td><td>HALLORAN QRY</td><td>77 MARROW ST</td><td>28,380</td><td>FILL — MISC</td></tr>
        <tr><td>10/23</td><td>VC-119023</td><td>HALLORAN QRY</td><td>77 MARROW ST</td><td>28,220</td><td>FILL — MISC</td></tr>
        <tr><td>10/30</td><td>VC-119023</td><td>HALLORAN QRY</td><td>77 MARROW ST</td><td>28,310</td><td>FILL — MISC</td></tr>
      </table>
      <p><b>Tare weight for unit VC-119023 is 28,000 lb.</b> Every load out of a quarry that produces nothing
      weighs, to within 400 pounds, <b>exactly nothing</b>.</p>
      <p>Five trips a month. Something is being moved. It does not weigh very much.</p>`
  },
  {
    id: 'd_brennick_pay', title: 'CONSULTING PAYMENTS — D. BRENNICK', kind: 'business',
    date: '10/1998', source: 'VANDERMEER SAVINGS (SUBPOENA RETURN)', tags: ['PAID', '1987'],
    html: () => `
      ${head('VANDERMEER SAVINGS & LOAN', 'ACCOUNT ACTIVITY SUMMARY — SUBPOENA RETURN')}
      ${f('ACCOUNT HOLDER', 'BRENNICK, DOYLE S.')}
      ${f('PERIOD', '01/1994 – 10/1998')}
      <table>
        <tr><th>FREQUENCY</th><th>DESCRIPTION</th><th>AMOUNT</th><th>ORIGIN</th></tr>
        <tr><td>MONTHLY</td><td>PENSION — PORT ALDEN PD</td><td>$1,840</td><td>CITY OF PORT ALDEN</td></tr>
        <tr><td>MONTHLY</td><td>"CONSULTING"</td><td>$1,100</td><td>ALDEN CIVIC HOLDINGS LLC</td></tr>
        <tr><td>ONCE</td><td>DEPOSIT — CASHIER'S CHEQUE</td><td>$12,000</td><td>08/20/<b>1987</b></td></tr>
      </table>
      <p>The 1987 cashier's cheque was drawn on <b>the same branch and the same day</b> as a $12,000 cheque
      <b>deposited by A. M. SEIBOLD, D.D.S.</b></p>
      <p>Two cheques. Same day. Same branch. The officer who wrote the report and the dentist who made
      the identification.</p>`
  },
  {
    id: 'd_visitor_log', title: 'VISITOR LOG — HOLLIS UNIT, D-BLOCK', kind: 'ledger',
    date: '1991–1998', source: 'STATE CORRECTIONS', tags: ['FEARN'],
    html: () => `
      ${head('STATE CORRECTIONAL FACILITY — HOLLIS UNIT', 'VISITOR LOG EXTRACT · INMATE 88-40213 (FEARN, O.)')}
      <table>
        <tr><th>DATE</th><th>VISITOR</th><th>RELATION</th><th>DURATION</th></tr>
        <tr><td>04/1991</td><td>&lt;REDACTED AT FACILITY REQUEST&gt;</td><td>LEGAL</td><td>22 MIN</td></tr>
        <tr><td>04/1992</td><td>&lt;REDACTED AT FACILITY REQUEST&gt;</td><td>LEGAL</td><td>18 MIN</td></tr>
        <tr><td>04/1993</td><td>&lt;REDACTED AT FACILITY REQUEST&gt;</td><td>LEGAL</td><td>25 MIN</td></tr>
        <tr><td>04/1994</td><td>&lt;REDACTED AT FACILITY REQUEST&gt;</td><td>LEGAL</td><td>19 MIN</td></tr>
        <tr><td>04/1995–04/1998</td><td>&lt;REDACTED AT FACILITY REQUEST&gt;</td><td>LEGAL</td><td>15–24 MIN</td></tr>
      </table>
      <p><b>Once a year, every April, for eight years,</b> someone drives four hours to sit with Odis Fearn
      for twenty minutes and leaves.</p>
      <p><b>The redaction was requested by the visitor, not by the facility.</b> The facility retains the
      countersigned gate pass. It has not been asked for.</p>
      <p class="p-mono">GATE PASS SERIES: NC-VIS-0441 THROUGH NC-VIS-0448
PREFIX "NC-" IS ISSUED TO FEDERAL PERSONNEL ONLY.</p>`
  },
  {
    id: 'd_fearn_method', title: 'MO SUMMARY — FEARN, O. (ARSON)', kind: 'report',
    date: '1988', source: 'STATE POLICE — ARSON UNIT', tags: ['FEARN', 'ARSON'],
    html: () => `
      ${head('STATE POLICE — ARSON INVESTIGATION UNIT', 'MODUS OPERANDI SUMMARY')}
      ${f('SUBJECT', 'FEARN, ODIS L.')}
      ${f('CONFIRMED FIRES', 'FOUR (4) — 1983, 1985, 1986, 1988')}
      <h3 class="p-h">SIGNATURE ELEMENTS</h3>
      <ul style="margin-left:18px">
        <li>Accelerant siphoned <i>from the target vehicle itself</i>; no foreign accelerant ever recovered.</li>
        <li>Delayed ignition: lit cigarette inserted into a matchbook. 6–11 minute delay.</li>
        <li>Fires set <b>before</b> the staged event, to allow the setter to be elsewhere.</li>
        <li>Vehicle placed in position by hand or by a second person; ignition key left in the "on" position.</li>
      </ul>
      <h3 class="p-h">INVESTIGATIVE NOTE</h3>
      <p>In three of four confirmed fires, the earliest alarm call preceded the reported time of the
      collision or event by between 9 and 20 minutes. This has been the single most reliable indicator
      of Fearn's involvement.</p>
      <p>Where the timeline runs backwards, look for Fearn.</p>`,
    highlight: ['before', 'preceded']
  },
  {
    id: 'd_dispatch_98', title: 'DISPATCH LOG — VC SHERIFF (EXTRACT)', kind: 'ledger',
    date: '1998', source: 'VC SHERIFF', tags: ['MILL', '1998'],
    html: () => `
      ${head('VANDERMEER COUNTY SHERIFF', 'CAD LOG EXTRACT')}
      <p class="p-mono">05/19/98 02:41  CALLER: TREVINO, M. (555-0277)
                LOC: 77 MARROW ST
                "TRUCKS AT NIGHT, LIGHTS OFF, THREE OF THEM"
                DISP: NONE — ADVISED PRIVATE PROPERTY

08/03/98 03:12  CALLER: TREVINO, M. (555-0277)
                LOC: 77 MARROW ST
                "SOMEBODY IS LIVING IN THE OLD OFFICE. I SEE A LIGHT."
                DISP: NONE — REFERRED NCIB REGIONAL (REF: W.R.F.)

11/04/98 23:14  CALLER: ANONYMOUS (PAYPHONE, RT 9)
                LOC: HALLORAN QUARRY ACCESS
                "THERE'S A CAR DOWN HERE THAT SHOULDN'T BE."
                DISP: NONE — NO UNIT AVAILABLE

11/06/98 20:52  CALLER: TREVINO, M. (555-0277)
                LOC: HALLORAN QUARRY
                "THERE'S SOMETHING IN THE WATER."
                DISP: UNIT 4, NCIB NOTIFIED 21:02</p>
      <p>Three calls. Two years. One dispatch — and only when the thing in the water had stopped being
      deniable.</p>`
  },
  {
    id: 'd_ashvale_complaint', title: 'COMPLAINT (WITHDRAWN) — C. OSTERHOLT', kind: 'report',
    date: '04/09/1998', source: 'ASHVALE PD', tags: ['VANCE', '1998'],
    html: () => `
      ${head('ASHVALE POLICE DEPARTMENT', 'CITIZEN COMPLAINT — UNWANTED CONTACT')}
      ${f('COMPLAINANT', 'OSTERHOLT, CLAIRE M. — 6 WREN COURT')}
      ${f('DATE', '04/09/1998')}
      <h3 class="p-h">NARRATIVE</h3>
      <p>Complainant reports receiving three telephone calls at her home in the past week. On each
      occasion the caller did not speak. On the third occasion she states she heard <b>a man breathing
      and then a single word</b> before the line was disconnected.</p>
      <p>Complainant declined to state the word to the reporting officer. She became distressed and
      asked that the matter be dropped.</p>
      <p><b>04/14/1998 — COMPLAINT WITHDRAWN BY COMPLAINANT. NO FURTHER ACTION.</b></p>
      <p class="handwrite">She told me on the doorstep. The word was her name — the one
      only he used. Then she asked me to leave. — Ofc. Nunes</p>`
  },
  {
    id: 'd_ansel_lic', title: 'SECURITY LICENCE — ANSEL, C. R.', kind: 'business',
    date: '1994', source: 'STATE LICENSING BOARD', tags: ['ANSEL'],
    html: () => `
      ${head('STATE OF VANDERMEER — PRIVATE SECURITY LICENSING BOARD', 'LICENCE RECORD')}
      ${f('LICENSEE', 'ANSEL, CURTIS RAY')}
      ${f('LICENCE', 'PS-9941 — ARMED')}
      ${f('ISSUED', '02/1994')}
      ${f('CORPORATE SPONSOR', 'ALDEN CIVIC HOLDINGS LLC')}
      <h3 class="p-h">STATUTORY BAR — WAIVER</h3>
      <p>An applicant with a felony conviction is barred. Applicant has one (1) felony conviction
      (1981, assault 2nd) and one suspended sentence (1990, firearm by felon).</p>
      <p>Waiver granted on <b>the written recommendation of a federal law-enforcement officer</b> certifying
      the applicant's value as a source.</p>
      ${f('RECOMMENDING OFFICER', 'W. R. FINN — NCIB REGIONAL')}
      <p class="p-mono">THE BOARD DOES NOT INDEPENDENTLY VERIFY SUCH RECOMMENDATIONS.</p>`
  },
  {
    id: 'd_board_90', title: 'STATE DENTAL BOARD — CONSENT ORDER', kind: 'court',
    date: '06/14/1990', source: 'STATE DENTAL BOARD', tags: ['SEIBOLD'],
    html: () => `
      ${head('STATE BOARD OF DENTAL EXAMINERS', 'CONSENT ORDER · SURRENDER OF LICENCE')}
      ${f('RESPONDENT', 'SEIBOLD, ARTHUR M., D.D.S. — LIC. 4471-D')}
      <h3 class="p-h">FINDINGS</h3>
      <p>Respondent admits that on three occasions between 1985 and 1989 he <b>altered patient charts
      after the fact</b> to reflect treatment not performed, or to omit treatment performed.</p>
      <p>Respondent states the alterations were made "as a favour" and denies financial motive.
      The Board notes <b>deposits to respondent's accounts inconsistent with his reported practice
      income in 1987 and 1988</b> but makes no finding thereon, the matter being outside its jurisdiction.</p>
      <h3 class="p-h">ORDER</h3>
      <p>Licence surrendered. Respondent shall not practise. Practice records seized and retained by
      the Board.</p>`
  },
  {
    id: 'd_manual_extract', title: 'OPERATOR MANUAL — SECTION 9 (EXTRACT)', kind: 'manual',
    date: '1996', source: 'NCIB TRAINING BRANCH', tags: ['MANUAL', 'CIPHER'],
    html: () => `
      ${head('NCIB ANALYSIS OPERATOR MANUAL · 4TH EDITION', 'SECTION 9 — SECURE CORRESPONDENCE')}
      <h3 class="p-h">9.1 GENERAL</h3>
      <p>Operators are reminded that the wire is not secure. Any matter which would embarrass the
      Bureau if read by a third party must not be placed on the wire in clear text.</p>
      <h3 class="p-h">9.2 THE STANDING KEY</h3>
      <p>Where a shared secret is required and no key material has been issued, operators may agree a
      key from a commonly held text. The Bureau does not endorse this practice but recognises it.</p>
      <h3 class="p-h">9.3 REFERENCE CIPHER (PAGE · LINE · WORD)</h3>
      <p>A message may be expressed as a series of triples. Each triple identifies a page, a line on
      that page, and a word on that line, of an agreed book. The recipient reads the words in order.</p>
      <p>The strength of the method lies entirely in the obscurity of the book. A book chosen for
      sentimental reasons is a poor choice, as the sentiment is usually known.</p>
      <h3 class="p-h">9.4 POLYALPHABETIC SUBSTITUTION</h3>
      <p>Where a running key is used, the key word is repeated beneath the plain text and each letter
      shifted by the alphabetic position of the letter beneath it. Frequency analysis defeats a short
      key. Operators should assume any key shorter than the message will be broken.</p>
      <div class="p-foot">MANUAL COPY 04 · TERMINAL 04 · INSIDE COVER INSCRIBED IN INK</div>`
  }
  ];

  var byId = {};
  DOCS.forEach(function (d) { byId[d.id] = d; });

  function get(id) { return byId[id]; }
  function available() {
    var st = NW.state.s;
    return DOCS.filter(function (d) {
      if (d.clearance && st.operator.clearance < d.clearance && !st.docs[d.id]) return false;
      if (d.lockedBy && !st.evidence[d.lockedBy] && !st.docs[d.id]) return false;
      return !!st.docs[d.id];
    });
  }
  function search(q) {
    return available().filter(function (d) {
      return NW.util.matches([d.title, d.source, d.date, (d.tags || []).join(' ')].join(' '), q);
    });
  }

  NW.documents = { get: get, all: function () { return DOCS; }, available: available, search: search };
})(window.NW);

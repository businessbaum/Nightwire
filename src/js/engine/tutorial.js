/* NIGHTWIRE — engine/tutorial.js
   The first time a program is opened it explains itself once, in the voice of
   somebody who has sat at this desk for twenty years. After that it never
   speaks again unless asked (MANUAL → HOW TO WORK THIS DESK). */
(function (NW) {
  'use strict';
  var S = function () { return NW.state.s; };

  var CARDS = {
    wire: {
      title: 'WIRE',
      sub: 'THE MESSAGE BUS — EVERYTHING STARTS HERE',
      body: [
        'Channels are on the left. A red dot means unread traffic.',
        'When somebody wants an answer, a <b>request</b> appears at the bottom of this window with empty fields. You fill it from the other programs: open the right record and press <b>▸ TRANSMIT</b> on it, and it drops into the matching field.',
        'Some fields are a choice instead. Those are written out as statements — pick the one you are prepared to put your name to.',
        'A rejected report costs nothing but your standing with the field. It is still better to say <i>stand by</i> than to guess.',
        '<span class="dim">Click anywhere in the message log to let a long message land all at once.</span>'
      ]
    },
    registry: {
      title: 'REGISTRY',
      sub: 'CENTRAL PERSON & VEHICLE INDEX',
      body: [
        'Search on anything: a name, a date of birth, a street, a social security number, a plate, a tag.',
        '<b>An empty query returns the whole index.</b> Do that once per index and read it. You will remember a name four hours from now and be very glad you did.',
        'Cross references and linked documents at the bottom of a record are clickable. Grey ones are documents this terminal does not hold yet.',
        'The PERSONNEL index is our own people and needs clearance 2. It exists. You will need it.'
      ]
    },
    archive: {
      title: 'ARCHIVE',
      sub: 'CASE DOCUMENTS',
      body: [
        'Everything that has reached this terminal, filed by year.',
        'Somebody has been through these with a highlighter. <b>The marked passages are what matters</b> — you do not have to read every form end to end, but the marks are a summary, not the answer.',
        'The margin notes in a different hand are not ours. They were already on the paper.'
      ]
    },
    daktylo: {
      title: 'DAKTYLO',
      sub: 'RIDGE COMPARISON',
      body: [
        '<b>Check the pattern class first</b> — top right of each panel. An arch is never a whorl, and that alone kills half the candidate set before you touch a point.',
        'Then: click a <b>numbered</b> point on the latent, and the same ridge feature on the candidate card. <b>Hover over any point to magnify the ridges around it</b> — that is how you tell which is which.',
        'Two correct pairs establish the alignment. From there the program marks <span style="color:var(--green)">PREDICTED</span> on the candidate for whichever point you select, and the rest goes quickly.',
        'Six pairs supports an identification. If the points will not go together, <b>exclusion is a real and useful answer</b>.'
      ]
    },
    imagelab: {
      title: 'IMAGE LAB',
      sub: 'PHOTOGRAPHIC ENHANCEMENT',
      body: [
        'The detail you want is in the frame at a contrast the eye cannot resolve. <b>Push CONTRAST up</b> until the shadows separate — usually somewhere between 1.4× and 2.0×.',
        'Then <b>click directly on whatever appears</b>. The terminal answers you: <i>close</i> means you are in the right part of the frame, <i>under-exposed</i> means something is there and your settings are hiding it.',
        'Wheel to zoom, drag to pan. If the warning says the frame is clipping, you have gone too far and are destroying the thing you are looking for.'
      ]
    },
    audiolab: {
      title: 'AUDIO LAB',
      sub: 'TAPE ANALYSIS',
      body: [
        'A recording of a voice is also a recording of a room.',
        'Use the presets. <b>BELOW THE VOICE</b> and <b>ABOVE THE VOICE</b> strip the speech out and leave what was behind it — a siren, a bell, a machine, a horn.',
        'Watch the <b>spectrogram</b>, not just your ears. Things that are inaudible under a voice are perfectly visible as a shape.',
        'Then mark everything you can hear in the list at the bottom. Each one has a place and a timetable, and between them they draw you a map.'
      ]
    },
    cartograph: {
      title: 'CARTOGRAPH',
      sub: 'COUNTY MAP & CELLULAR TRIANGULATION',
      body: [
        'Drag to pan, wheel to zoom. Clicking a location pins it.',
        'With a trace loaded: press <b>PLOT RANGES</b>. Each cell site gives you a ring — a distance with a tolerance.',
        '<b>Click the map where all three rings overlap.</b> That is your fix. It is not a point; it is a circle with a building in it.'
      ]
    },
    cipher: {
      title: 'CIPHER DESK',
      sub: 'SHIFT · RUNNING KEY · SUBSTITUTION · REFERENCE',
      body: [
        'Pick the intercept on the left, then the method along the top.',
        'The <b>letter frequency chart</b> tells you which method you are looking at: one tall spike means a simple shift, a flat chart means a running key.',
        'For a shift, drag the dial or press SCAN ALL 25. For a running key you need the key word — it is always written down somewhere, in a note or a header or a phone call.',
        'When the output is English, press <b>ACCEPT PLAINTEXT</b>.'
      ]
    },
    casebook: {
      title: 'CASEBOOK',
      sub: 'CORK, PINS AND STRING',
      body: [
        'Evidence pins itself here as you find it. Drag the cards around.',
        '<b>Click one card, then another, to run string between them.</b> To cut a string, hover it until it lights up and click.',
        'The panel on the right lists the working theories. Each resolves when the right two ideas are joined — and the one-line description under each theory tells you which two.',
        'Wrong string costs nothing. Try things.'
      ]
    },
    timeline: {
      title: 'TIMELINE',
      sub: 'RECONSTRUCTION',
      body: [
        'Drag an event from the left onto the slot where the record actually supports it — or just click it, and it drops into the first free slot.',
        'Click a placed card to take it back off.',
        '<b>Two of the cards are false and belong nowhere.</b> Read the source line under each one.',
        'Use the time the evidence gives, not the time the report claims. That distinction is the entire point of the exercise.'
      ]
    },
    switchboard: {
      title: 'SWITCHBOARD',
      sub: 'THE OUTSIDE LINE',
      body: [
        'Every telephone number in this case is dialable, and they are printed on records, in documents and in evidence. The list on the left is what you have collected.',
        'People open up in stages. A topic that is greyed out becomes available once you hold the document that lets you ask about it — <b>so call the same person again after you have found something new</b>.',
        'Some of them will lie to you. Let them, then read them their own bank statement.'
      ]
    },
    shell: {
      title: 'SHELL',
      sub: 'THE LOCAL VOLUME',
      body: [
        'Type where the cursor is — the prompt sits at the end of the transcript, like any terminal. <code>HELP</code> gives the command list, and the up arrow walks back through what you have typed.',
        '<code>DIR</code> lists a directory — but <b><code>DIR /A</code> lists the hidden entries too</b>, and <code>FIND &lt;word&gt;</code> searches the whole volume.',
        '<code>CD</code> moves, <code>TYPE</code> prints a file, <code>DECRYPT</code> asks you for a passphrase.',
        'The operator before you did not get her terminal wiped. Everything she had is still under your login.'
      ]
    },
    microfilm: {
      title: 'MICROFILM',
      sub: 'COUNTY REEL READER',
      body: [
        'ADVANCE winds the reel. FOCUS is a real knob and it does stick — the middle of its travel is sharp.',
        'Most frames are an ordinary day in a small county. When you land on something, the panel underneath tells you what it is and offers to <b>copy the frame to the archive</b>.',
        'Watch the frame count against the reel length. A reel that is short is a reel somebody has cut.'
      ]
    },
    ballistics: {
      title: 'BALLISTICS',
      sub: 'COMPARISON MICROSCOPE',
      body: [
        'The questioned exhibit is on the left of the seam, the known reference on the right.',
        'Mount each reference in turn and <b>drag the STAGE TRAVERSE slider slowly</b>. When the striae run unbroken across the centre seam, you are on it.',
        'Three of the four references will never agree at any offset. That is what elimination looks like.'
      ]
    },
    notepad: {
      title: 'NOTEPAD',
      sub: 'YOUR OWN PAD',
      body: [
        'Nothing typed here is transmitted anywhere. In this building, that is the point.',
        'Underneath, the terminal collects every fact you have actually established, with the time you established it. That list is the spine of your case file.'
      ]
    },
    manual: {
      title: 'MANUAL',
      sub: 'COPY 04 — IT DOES NOT LEAVE THIS DESK',
      body: [
        'The operator\'s manual, twelve pages, plus a tab of practical notes on working this desk.',
        'Read section 9 if you get bored. Read the inside cover of page one whether you are bored or not.',
        '<b>It is also a book, and a book can be a key.</b>'
      ]
    },
    settings: {
      title: 'CONFIG',
      sub: 'PICTURE TUBE, SOUND, SHIFT RECORD',
      body: [
        'Scan lines, tube noise, flicker and curvature are all adjustable if the tube is tiring your eyes.',
        'KEYBOARD & MOUSE controls how loud the desk is.',
        'The shift saves itself automatically, but <b>SAVE</b> in the bottom right writes it immediately. If your browser refuses to store anything, use the <b>shift code</b> at the bottom of this window.'
      ]
    }
  };

  function show(id) {
    var c = CARDS[id];
    if (!c) return Promise.resolve();
    return NW.notify.overlay({
      title: c.title, sub: c.sub,
      body: c.body,
      buttons: [{ label: 'UNDERSTOOD', value: true }]
    });
  }

  /** Called on the first open of each program. Waits its turn if the story is
      already holding the screen. */
  function maybeShow(id) {
    if (!CARDS[id]) return;
    if (S().flags['tut_' + id]) return;
    NW.state.flag('tut_' + id, true);
    var tries = 0;
    (function pop() {
      if (NW.notify.overlayOpen() && tries++ < 60) { setTimeout(pop, 700); return; }
      setTimeout(function () { show(id); }, 380);
    })();
  }

  NW.tutorial = { show: show, maybeShow: maybeShow, cards: CARDS };
})(window.NW);

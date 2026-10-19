/* NIGHTWIRE — story/endings.js */
(function (NW) {
  'use strict';
  var U = NW.util;
  var S = function () { return NW.state.s; };

  function score() {
    var s = S(), sc = {
      correct: !!s.flags.case_filed,
      vossLocated: !!s.flags.th_voss || !!s.flags.cy_book_done,
      outside: !!s.flags.route_outside,
      chain: !!s.flags.route_chain,
      hold: !!s.flags.route_hold,
      deal: !!s.flags.finn_deal,
      ledger: !!s.evidence.ev_ledger_found,
      preserved: !!(s.flags.printed_all || s.flags.copy_out),
      meAlly: !!s.flags.me_ally,
      press: !!(s.flags.adair_helping || s.flags.went_public),
      delHurt: !!s.flags.del_hurt,
      soltAlly: !!s.flags.solt_ally,
      trevino: !!s.flags.trevino_safe,
      guided: !!s.flags.guided_well
    };
    return sc;
  }

  function pick() {
    var c = score();
    if (c.deal && !c.correct) return 'dead_air';
    if (!c.correct) return 'burn_notice';
    if (c.chain) return 'burn_notice';
    if (c.correct && c.vossLocated && (c.outside || (c.hold && c.ledger))) {
      return (c.preserved || c.meAlly || c.press) ? 'nightwire' : 'closed_case';
    }
    return 'closed_case';
  }

  var ENDINGS = {
    nightwire: {
      title: 'NIGHTWIRE',
      sub: 'BEST OUTCOME',
      lines: [
        'The padlock was nine months old and it came off in four blows.',
        'Reyes said afterwards that the room was warm, and that this was the worst part — that somebody had been keeping it warm.',
        'Margaret Voss weighed forty kilos and could not stand up. She had a notebook. She had been writing in it every day for two hundred and thirty-six days in a hand that got smaller as the pencil got shorter, and the first page said: <i>IF FOUND — THE OPERATOR AT TERMINAL 04 WILL KNOW WHAT TO DO WITH THIS.</i>',
        'She asked what day it was. Then she asked whether anyone had opened the partition.',
        '— — —',
        'Walter Finn was arrested at 06:40 at a fuel station on Route 9 north, with a suitcase and no plan, by two deputies who had no idea who he was. The ledger had been in the county Medical Examiner\'s safe for two hours and in the hands of the Marshals in Kelland for one, and by nine o\'clock it was being read aloud in a room he could not reach.',
        'Curtis Ansel was taken in Warrendale on the eleventh. Doyle Brennick met the car at his gate with his coat already on.',
        'The Port Alden Ledger ran it under a byline it had not printed since 1987.',
        '— — —',
        'You were interviewed nine times. Somebody from the fourth floor described your conduct as "irregular" in a memorandum that was later withdrawn.',
        'Graham Solt took his pension in the spring and does not answer letters.',
        'The night desk at Terminal 04 is still there. Somebody sits at it.',
        'On the inside cover of Copy 04 of the operator\'s manual there are now three lines of handwriting instead of two.'
      ]
    },

    closed_case: {
      title: 'CLOSED CASE',
      sub: 'THE FILE STANDS. THE COST STANDS WITH IT.',
      lines: [
        'The padlock came off at 04:51.',
        'Ward seventeen had a bed in it, and a bucket, and a notebook with two hundred and thirty-six dated entries, and the last one was eleven days old.',
        'The room was cold. Somebody had stopped paying for the heat.',
        '— — —',
        'The file was good. That is not nothing — the file was very good, and it held.',
        'Walter Finn was indicted on nineteen counts in the following March. He did not testify. He sat through the ledger being read into the record with his hands folded and, according to a reporter who watched him for four days, corrected the pronunciation of a name once.',
        'Elias Vance was buried a second time, under his own name, by a woman who had already done it once.',
        'Rennick Fearn was buried for the first time. Eleven people came. Nine of them were police.',
        '— — —',
        'They found Margaret Voss in April, in the ground behind Building C, wrapped in a decommissioned county ambulance blanket.',
        'The Medical Examiner put the date of death at somewhere in the last week of October.',
        'Two weeks, operator.',
        'You will do the arithmetic on that for the rest of your life and there is no arrangement of it that comes out well.'
      ]
    },

    burn_notice: {
      title: 'BURN NOTICE',
      sub: 'THE BUILDING CLOSED AROUND IT',
      lines: [
        'The file went up the chain at 04:31 and the chain did what a chain does.',
        'By six o\'clock the quarry decedent was "unidentified adult male, enquiries continuing". By eight, the fingerprint comparison had been flagged for re-examination by an examiner nobody could later name. By noon, the 1987 coroner file was gone from the county index and the microfilm reel had been sent for "conservation".',
        'Agent Reyes was placed on administrative duty pending a review of her conduct at the Marrow Street mill.',
        'Graham Solt worked nine more shifts and then took his pension four months early. He did not clear his desk. Somebody else did it for him.',
        '— — —',
        'Nobody was ever arrested for the death of Elias Vance.',
        'Nobody was ever charged over Rennick Fearn, whose name is still on a missing-person card in a drawer in Port Alden with a date of 1987 on it.',
        'Grieve Hill Building B was disconnected from the grid in December for "cost reasons". The lease remains in force until 2019.',
        '— — —',
        'You were transferred to Records in January. Days. Weekends off.',
        'It is a good job. It is genuinely a good job.',
        'The manual from Terminal 04 came with you in a box, which was not procedure, and on the inside cover there are two lines of handwriting, and the second one is a woman\'s, and you have read it more times than you are prepared to say.'
      ]
    },

    dead_air: {
      title: 'DEAD AIR',
      sub: 'YOU TOOK THE JOB',
      lines: [
        'You took the job.',
        'It was not a difficult decision at 03:40 in a basement with a man on the fourth floor being reasonable at you. It was the only decision that had a shape.',
        'The quarry file closed on the fourteenth as unidentified pending dental review. Dental review was never scheduled, because scheduling it was, by then, your desk.',
        '— — —',
        'Records is quiet. The building is warm. Your predecessor\'s terminal was reimaged on the Tuesday by an engineer who actually turned up, and the drawer that sticks was replaced.',
        'You saw Reyes twice. The first time she said hello. The second time she did not.',
        'You never found out what happened to Margaret Voss and you have been careful, in a way you would not be able to explain to anybody, never to be in a position where you could.',
        '— — —',
        'Twenty-six years is a long career. You will retire with a pension and a photograph and a leaving card signed by people whose names you had to check.',
        'And every so often, for no reason at all, you will think about a column of numbers you never resolved, in a file on a machine that no longer exists, and about the fact that you already know the answer, because there was only ever one book on that desk.',
        'Grieve. Hill. Ward. Seventeen. She. Is. Alive.',
        'The night desk at Terminal 04 is still there. Somebody sits at it.',
        'It is not you.'
      ]
    }
  };

  function statsBlock() {
    var s = S();
    var rows = [
      ['SHIFT LENGTH', U.fmtTime(s.clock) + ' — ' + (Math.round(((s.clock < 600 ? s.clock + 1440 : s.clock) - (22 * 60 + 41)) / 6) / 10) + ' hours on the desk'],
      ['REPORTS ACCEPTED', s.stats.correct],
      ['REPORTS REJECTED', s.stats.wrong],
      ['EXHIBITS HELD', Object.keys(s.evidence).length + ' of ' + Object.keys(NW.evidence.all()).length],
      ['RECORDS OPENED', Object.keys(s.records).length + ' of ' + NW.people.all().length],
      ['DOCUMENTS READ', Object.keys(s.docs).length + ' of ' + NW.documents.all().length],
      ['CALLS PLACED', s.stats.calls],
      ['DECIPHERMENTS', s.stats.decrypts],
      ['ASSISTS USED', s.stats.assists]
    ];
    var notes = [];
    if (s.flags.del_hurt) notes.push('Agent Nkemdirim was shot at the mill. He kept the shoulder.');
    else notes.push('Nobody was hurt at Marrow Street.');
    if (s.flags.trevino_safe) notes.push('Marcus Trevino was warned off the mill in time.');
    if (s.flags.solt_ally) notes.push('Graham Solt broke twenty-eight years of silence for you.');
    if (s.flags.me_ally) notes.push('A copy of the 1987 file left the building before the purge.');
    if (s.flags.adair_helping || s.flags.went_public) notes.push('Simone Adair got her story back.');
    if (s.flags.finn_deal) notes.push('You accepted the Records post.');
    if (s.flags.ledger_recovered) notes.push('The Vance ledger was recovered from locker eleven.');

    return '<div class="hr"></div><div style="font-size:10px;letter-spacing:.2em;color:var(--phos-dim);margin-bottom:8px">SHIFT RECORD</div>' +
      '<div style="display:grid;grid-template-columns:200px 1fr;gap:2px 14px;font-size:11.5px;margin-bottom:14px">' +
      rows.map(function (r) {
        return '<span style="color:var(--phos-dim);font-size:10px;letter-spacing:.14em">' + r[0] + '</span><span class="mono-hi">' + r[1] + '</span>';
      }).join('') + '</div>' +
      '<div style="font-size:11.5px;line-height:1.8;color:var(--phos)">' +
      notes.map(function (n) { return '· ' + U.esc(n); }).join('<br>') + '</div>';
  }

  function play(which) {
    var id = (!which || which === 'auto') ? pick() : which;
    var e = ENDINGS[id] || ENDINGS.closed_case;
    S().endingScore = { id: id, at: new Date().toISOString() };
    NW.state.flag('game_over', id);
    NW.clock.stop();
    NW.win.closeAll();

    var layer = NW.$('#overlay-layer');
    NW.clear(layer);
    layer.classList.remove('hidden');

    var card = NW.el('div.ov-card', { style: { maxWidth: '820px', maxHeight: '86vh', overflow: 'auto' } });
    card.innerHTML = '<h2>' + U.esc(e.title) + '</h2><div class="ov-sub">' + U.esc(e.sub) + '</div>';
    layer.appendChild(card);

    NW.audio.play(id === 'nightwire' ? 'unlock' : id === 'dead_air' ? 'lock' : 'thunk');

    var i = 0;
    function step() {
      if (i >= e.lines.length) {
        card.insertAdjacentHTML('beforeend', statsBlock());
        var acts = NW.el('div.ov-actions');
        var again = NW.el('button.ov-btn', { text: 'ANOTHER SHIFT' });
        NW.util.on(again, 'click', function () { NW.state.wipe(); location.reload(); });
        var stay = NW.el('button.ov-btn', { text: 'SIT WITH IT' });
        NW.util.on(stay, 'click', function () { layer.classList.add('hidden'); });
        acts.appendChild(again); acts.appendChild(stay);
        card.appendChild(acts);
        card.scrollTop = card.scrollHeight;
        return;
      }
      var line = e.lines[i++];
      if (line === '— — —') {
        card.appendChild(NW.el('div.hr'));
        card.scrollTop = card.scrollHeight;
        setTimeout(step, 500);
        return;
      }
      var p = NW.el('p');
      card.appendChild(p);
      var plain = line.replace(/<[^>]+>/g, '');
      NW.typer.type(p, plain, { cps: 160, cursor: false, sound: false }).then(function () {
        p.innerHTML = line;
        card.scrollTop = card.scrollHeight;
        setTimeout(step, 620);
      });
    }
    step();
    return new Promise(function () { /* terminal */ });
  }

  NW.endings = { play: play, pick: pick, all: ENDINGS };
})(window.NW);

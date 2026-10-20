/* NIGHTWIRE — data/filesystem.js — the terminal's local volume, as seen by SHELL */
(function (NW) {
  'use strict';

  /* Vigenère, so the ciphertexts here are always generated from the plaintext. */
  function vig(text, key, dir) {
    var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var out = '', ki = 0;
    key = String(key).toUpperCase().replace(/[^A-Z]/g, '');
    for (var i = 0; i < text.length; i++) {
      var c = text[i].toUpperCase();
      var p = A.indexOf(c);
      if (p < 0) { out += text[i]; continue; }
      var k = A.indexOf(key[ki % key.length]); ki++;
      out += A[(p + (dir < 0 ? -k + 26 : k)) % 26];
    }
    return out;
  }
  function block(s, n) {
    s = s.replace(/[^A-Za-z]/g, '').toUpperCase();
    var o = [], line = [];
    for (var i = 0; i < s.length; i += (n || 5)) {
      line.push(s.substr(i, n || 5));
      if (line.length === 8) { o.push(line.join(' ')); line = []; }
    }
    if (line.length) o.push(line.join(' '));
    return o.join('\n');
  }

  var VOSS_CIPHER_PLAIN =
    'I RAN THE WAGE INDEX AGAINST THE DECEDENT FILE BECAUSE THE MACHINE WOULD NOT LET ME ' +
    'CLOSE THE QUERY. A MAN DECLARED DEAD IN AUGUST OF EIGHTY SEVEN IS DRAWING A WAGE IN ' +
    'THIS COUNTY. THE DEATH INDICATOR ON HIS NUMBER WAS SET AND THEN CLEARED BY HAND FOUR ' +
    'WEEKS LATER. A HAND CLEARANCE REQUIRES A SUPERVISORY CODE. THERE ARE ELEVEN PEOPLE IN ' +
    'THIS BUILDING WITH THAT CODE AND I HAVE ELIMINATED TEN. I AM NOT WRITING THE ELEVENTH ' +
    'NAME IN A FILE ON A MACHINE HE CAN READ.';

  var CH5_CIPHER_PLAIN =
    'IF YOU ARE READING THIS I DID NOT COME BACK. THE LEDGER IS REAL. HE KEPT IT ELEVEN ' +
    'YEARS AND HE MEANT TO TRADE IT. LOOK WHERE THE NOISE IS. AND OPERATOR WHOEVER YOU ARE ' +
    'DO NOT SEND ANYTHING TO THE FOURTH FLOOR TONIGHT.';

  var FS = {
    'autoexec.bat': { t: 'file', c:
      '@ECHO OFF\r\nREM NCIB TERMINAL BOOTSTRAP — DO NOT EDIT\r\nSET NCIB=C:\\NCIB\r\n' +
      'LOADHIGH C:\\NCIB\\WIREDRV.SYS\r\nCALL C:\\NCIB\\MOUNT.BAT\r\nREM CALL C:\\USR\\VOSS\\NIGHTWIRE.BAT\r\n' +
      'CLS\r\nC:\\NCIB\\SHELL.EXE\r\n',
      note: 'One line is commented out and it is not one of ours.' },

    'ncib': { t: 'dir', c: {
      'shell.exe':   { t: 'bin' },
      'wiredrv.sys': { t: 'bin' },
      'mount.bat':   { t: 'file', c: 'MOUNT REGISTRY /RO\r\nMOUNT ARCHIVE /RO\r\nMOUNT CASE /RW\r\nMOUNT USR /RW /HIDDEN\r\n' },
      'motd.txt':    { t: 'file', c:
        '  NATIONAL CRIMINAL INTELLIGENCE BUREAU\r\n  REGIONAL ANALYSIS CENTER — PORT ALDEN\r\n\r\n' +
        '  This terminal is monitored. Queries are logged.\r\n' +
        '  You are reminded that the accuracy of a field agent\'s\r\n' +
        '  decision is bounded by the accuracy of yours.\r\n' }
    } },

    'case': { t: 'dir', c: {
      '98-1173': { t: 'dir', c: {
        'scene.txt':  { t: 'file', requires: 'ch1', c:
          'CASE 98-1173 — HALLORAN QUARRY\r\nSTATUS: OPEN\r\nLEAD: REYES, A.\r\n\r\n' +
          'DECEDENT UNIDENTIFIED. LATENTS L-1, L-2 FORWARDED TERMINAL 04.\r\n' },
        'latents': { t: 'dir', c: {
          'L-1.prn': { t: 'bin', note: 'RIDGE DETAIL — RIGHT THUMB — 12 MINUTIAE' },
          'L-2.prn': { t: 'bin', note: 'RIDGE DETAIL — RIGHT INDEX — PARTIAL, 4 MINUTIAE' }
        } }
      } }
    } },

    'usr': { t: 'dir', hidden: true, c: {
      'voss': { t: 'dir', hidden: true, c: {

        'index.wri': { t: 'file', c:
          'M. VOSS — TERMINAL 04 — PERSONAL\r\n' +
          '================================\r\n\r\n' +
          'If somebody who is not me is reading this, then either I got\r\n' +
          'careless or I got unlucky, and either way you should assume the\r\n' +
          'second one.\r\n\r\n' +
          'The working file is in .WIRE and it is enciphered. I am sorry\r\n' +
          'about that. It is not for you, it is for him.\r\n\r\n' +
          'The passphrase is THE ROAD, AND THE YEAR.\r\n' +
          'You will know which road by the time you need to know it.\r\n\r\n' +
          '  DECRYPT .WIRE\\<FILE>\r\n\r\n' +
          '                                        — M.V., 14 MAR 98\r\n' },

        'nightwire.bat': { t: 'file', c:
          '@ECHO OFF\r\nREM DEAD MAN SWITCH — DO NOT RUN MANUALLY\r\n' +
          'REM IF THIS FIRES I HAVE NOT LOGGED IN FOR 240 DAYS\r\n' +
          'WIRE /OPEN NIGHTWIRE\r\nWIRE /SEND .WIRE\\LAST.ENC\r\n',
          note: 'Two hundred and forty days from 16 March is 11 November. It is the sixth.' },

        '.wire': { t: 'dir', hidden: true, c: {
          'notes.enc': { t: 'enc', key: 'MERCER87', plain: VOSS_CIPHER_PLAIN,
            onDecrypt: { evidence: ['ev_voss_notes', 'ev_wagetrace'], doc: 'd_w2_98', flag: 'voss_notes_read' } },
          'trace.enc': { t: 'enc', key: 'MERCER87',
            plain: 'WAGE INDEX TRACE SSN TWO ONE FOUR EIGHT EIGHT ZERO NINE ONE SEVEN. ' +
                   'DEATH INDICATOR SET AUGUST EIGHTY SEVEN CLEARED SEPTEMBER EIGHTY SEVEN BY MANUAL ' +
                   'OVERRIDE. OVERRIDE CODE PREFIX NC DASH ZERO ZERO. THAT PREFIX BELONGS TO THE ' +
                   'OFFICE OF THE DEPUTY CHIEF.',
            onDecrypt: { evidence: ['ev_wagetrace'], flag: 'trace_read' } },
          'last.enc': { t: 'enc', key: 'MERCER87', plain: CH5_CIPHER_PLAIN, requires: 'ch5',
            onDecrypt: { evidence: ['ev_locker_hint'], flag: 'voss_last_read' } },
          'book.txt': { t: 'file', requires: 'ch5', dynamic: 'bookcipher',
            note: 'A column of numbers and nothing else.' }
        } },

        'personal': { t: 'dir', c: {
          'lake.jpg':   { t: 'bin', note: 'A photograph. Two women squinting into the sun on a jetty. One of them is laughing at whoever is holding the camera.' },
          'shift.log':  { t: 'file', c:
            'MAR 09 — quiet. Read four hundred pages of nothing.\r\n' +
            'MAR 10 — the machine will not close query 4471. It keeps\r\n' +
            '         handing it back to me like a dog with a shoe.\r\n' +
            'MAR 11 — ran it again. Same answer. A dead man has a job.\r\n' +
            'MAR 12 — telephoned an inspector in Kelland. He cried.\r\n' +
            '         An actual grown man on an actual telephone.\r\n' +
            'MAR 13 — asked Property Branch for the 87 coroner file.\r\n' +
            '         Told it is offsite. There is no offsite.\r\n' +
            'MAR 14 — somebody has been in this terminal. My window\r\n' +
            '         positions are wrong. I never move the wire window.\r\n' +
            'MAR 15 — going to write it all down properly tonight and\r\n' +
            '         take it to the Medical Examiner in the morning.\r\n' +
            '         She has been asking for the same file since 95.\r\n',
            onRead: { evidence: 'ev_voss_dir', fact: { c: 'VOSS', t: 'Voss\'s shift log ends on 15 March. She meant to take everything to the Medical Examiner the next morning.' } } }
        } }
      } }
    } },

    'var': { t: 'dir', c: {
      'spool': { t: 'dir', c: {
        'job0441.prn': { t: 'file', c: 'PRINT JOB 0441 — QUEUED 03/16/98 04:07 — CANCELLED 04:12\r\n' +
          'PAGES: 14\r\nOWNER: VOSS,M\r\nTITLE: "SUMMARY FOR THE MEDICAL EXAMINER"\r\n\r\n' +
          '*** SPOOL DATA OVERWRITTEN ***\r\n',
          onRead: { fact: { c: 'VOSS', t: 'A fourteen-page print job titled "Summary for the Medical Examiner" was cancelled five minutes before her access was revoked.' } } },
        'job0442.prn': { t: 'file', c: 'PRINT JOB 0442 — 03/16/98 04:12\r\nOWNER: FINN,W\r\nTITLE: "NC-71"\r\nPAGES: 1\r\nSTATUS: COMPLETE\r\n',
          onRead: { evidence: 'ev_lotreflection', fact: { c: 'VOSS', t: 'Her print job was cancelled at 04:12. His separation form printed at 04:12. He was in this building, at a terminal, at four in the morning.' } } }
      } },
      'log': { t: 'dir', c: {
        'access.log': { t: 'file', c:
          '03/16/98 03:58  LOGIN   VOSS,M      TERM04\r\n' +
          '03/16/98 04:02  QUERY   VOSS,M      WAGE-IDX 214880917\r\n' +
          '03/16/98 04:06  QUERY   VOSS,M      PERSONNEL-IDX *OVERRIDE-CODES\r\n' +
          '03/16/98 04:07  PRINT   VOSS,M      JOB0441 (14P)\r\n' +
          '03/16/98 04:09  LOGIN   FINN,W      TERM01  [4TH FLOOR]\r\n' +
          '03/16/98 04:11  QUERY   FINN,W      TERM04 SESSION STATUS\r\n' +
          '03/16/98 04:12  CANCEL  FINN,W      JOB0441\r\n' +
          '03/16/98 04:12  REVOKE  FINN,W      VOSS,M ALL ACCESS\r\n' +
          '03/16/98 04:12  PRINT   FINN,W      JOB0442 (1P)\r\n' +
          '03/16/98 04:31  DOOR    ——          SUB-LEVEL 2 SERVICE EXIT (NO BADGE)\r\n',
          requires: 'ch4',
          onRead: { evidence: 'ev_finn_voss_line', flag: 'access_log_read',
            fact: { c: 'VOSS', t: 'Access log, 16 March: Finn watched her session, cancelled her print, revoked her access and printed her resignation — in three minutes. The service exit opened at 04:31 with no badge.' } } }
      } }
    } },

    'tmp': { t: 'dir', c: {
      'wire.tmp': { t: 'bin' },
      'crash0311.dmp': { t: 'file', c: 'FAULT AT 0x4F2A — WIREDRV.SYS\r\nLAST QUERY: WAGE-IDX 214880917\r\nRETRY: 4\r\n' }
    } }
  };

  /* ── navigation helpers ── */
  function norm(p) {
    return String(p).replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }
  function resolve(cwd, p) {
    p = String(p).replace(/\\/g, '/');
    var parts = (p[0] === '/' ? p : norm(cwd) + '/' + p).split('/').filter(Boolean);
    var out = [];
    parts.forEach(function (s) {
      if (s === '.') return;
      if (s === '..') { out.pop(); return; }
      out.push(s);
    });
    return '/' + out.join('/');
  }
  function node(path) {
    var parts = norm(path).split('/').filter(Boolean);
    var cur = { t: 'dir', c: FS };
    for (var i = 0; i < parts.length; i++) {
      if (cur.t !== 'dir') return null;
      var key = Object.keys(cur.c).filter(function (k) { return k.toLowerCase() === parts[i].toLowerCase(); })[0];
      if (!key) return null;
      cur = cur.c[key];
    }
    return cur;
  }
  function listing(path, showHidden) {
    var n = node(path);
    if (!n || n.t !== 'dir') return null;
    return Object.keys(n.c).filter(function (k) {
      var e = n.c[k];
      if (e.hidden && !showHidden && !NW.state.has('fs_reveal')) return false;
      if (e.requires && !NW.state.has(e.requires)) return false;
      return true;
    }).map(function (k) { return { name: k, node: n.c[k] }; });
  }

  NW.fs = {
    root: FS, node: node, listing: listing, resolve: resolve, norm: norm,
    vig: vig, block: block
  };
})(window.NW);

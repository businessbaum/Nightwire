/* NIGHTWIRE — apps/shell.js — DOS-style shell over the terminal's local volume */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  function build(body, win) {
    var v = { cwd: S().shellCwd || '/', prompt: null, hist: S().shellHistory || [], hi: -1 };

    var out = el('div.sh-out');
    // keystrokes go to an off-screen input; the prompt line and caret are drawn
    var input =el('input.sh-hidden', { spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off' });
    var lineEl = null;
    body.appendChild(el('div.app', null, [out, input]));

    function w(text, cls) {
      var d = el('div', { class: cls || '', text: text });
      out.insertBefore(d, lineEl);
      out.scrollTop = out.scrollHeight;
      return d;
    }
    function wraw(html, cls) {
      var d = el('div', { class: cls || '', html: html });
      out.insertBefore(d, lineEl);
      out.scrollTop = out.scrollHeight;
    }

    function promptLabel() { return v.prompt ? v.prompt.label + ' ' : dosPath(v.cwd); }

    /** Draw the live line: prompt, what has been typed, and a block caret. */
    function paintLine() {
      if (!lineEl) return;
      var val = input.value;
      var shown = (v.prompt && v.prompt.mask) ? new Array(val.length + 1).join('*') : val;
      var caret = input.selectionStart === null || input.selectionStart === undefined
        ? shown.length : Math.min(input.selectionStart, shown.length);
      U.clear(lineEl);
      lineEl.appendChild(el('span.sh-prompt', { text: promptLabel() }));
      lineEl.appendChild(el('span', { text: shown.slice(0, caret) }));
      lineEl.appendChild(el('span.sh-caret', { text: shown.charAt(caret) || ' ' }));
      lineEl.appendChild(el('span', { text: shown.slice(caret + 1) }));
      out.scrollTop = out.scrollHeight;
    }

    function newLine() {
      lineEl = el('div.sh-line');
      out.appendChild(lineEl);
      paintLine();
    }

    function dosPath(p) {
      return 'C:' + (p === '/' ? '\\' : p.replace(/\//g, '\\')) + '>';
    }
    function setPrompt() { paintLine(); }

    var BANNER = [
      'NCIB TERMINAL SHELL  VERSION 3.11',
      '(C) 1994 NATIONAL CRIMINAL INTELLIGENCE BUREAU',
      '',
      'Volume in drive C is TERM04',
      'Volume Serial Number is 3312-4471',
      '',
      "Type HELP for the command list.",
      ''
    ];

    var CMDS = {
      help: function () {
        wraw([
          '<span class="sh-ok">COMMAND     PURPOSE</span>',
          'DIR [/A]    list the current directory  (/A includes hidden entries)',
          'CD <dir>    change directory  (CD .. to go up)',
          'TYPE <file> print a file',
          'FIND <str>  search the whole volume for a name',
          'DECRYPT <f> decrypt an enciphered file (you will be asked for the passphrase)',
          'RUN <file>  execute a batch file',
          'TREE        print the directory structure',
          'ATTRIB      show hidden attributes in this directory',
          'WHOAMI      current session',
          'LOG         recent session log',
          'CLS         clear the screen',
          'VER         version',
          'EXIT        close the shell',
          '',
          '<span class="sh-dim">TAB completes a file name · UP / DOWN recalls earlier commands</span>'
        ].join('\n'));
      },
      ver: function () { w('NCIB TERMINAL SHELL 3.11 — WIREDRV.SYS 2.04 — TERM04'); },
      cls: function () { U.clear(out); },
      whoami: function () {
        wraw([
          'SESSION   ' + S().operator.name + '  (BADGE ' + S().operator.badge + ')',
          'TERMINAL  04 — SUB-LEVEL 2',
          'CLEARANCE ' + (NW.state.has('clearance2') ? 2 : S().operator.clearance),
          'PREVIOUS  <span class="sh-dim">VOSS,M — LAST LOGIN 03/16/98 03:58 — SESSION NOT CLOSED</span>'
        ].join('\n'));
      },
      log: function () {
        wraw([
          '<span class="sh-dim">' + U.fmtDate(S().date) + ' ' + U.fmtTime(S().clock) + '  LOGIN   ' + S().operator.name + '   TERM04</span>',
          '<span class="sh-dim">' + U.fmtDate(S().date) + ' ' + U.fmtTime(S().clock) + '  MOUNT   REGISTRY ARCHIVE CASE</span>',
          '<span class="sh-err">03/16/98 04:12  REVOKE  VOSS,M ALL ACCESS  [BY FINN,W]</span>',
          '<span class="sh-dim">03/16/98 03:58  LOGIN   VOSS,M    TERM04</span>'
        ].join('\n'));
      },
      exit: function () { NW.win.close('shell'); },

      dir: function (args) {
        var showHidden = args.some(function (a) { return /^\/a/i.test(a); });
        var target = args.filter(function (a) { return a[0] !== '/'; })[0];
        var path = target ? NW.fs.resolve(v.cwd, target) : v.cwd;
        var l = NW.fs.listing(path, showHidden);
        if (!l) { w('Directory not found.', 'sh-err'); return; }
        w(' Directory of ' + dosPath(path).slice(0, -1));
        w('');
        var dirs = 0, files = 0;
        if (showHidden && l.some(function (e) { return e.node.hidden; })) NW.state.flag('fs_reveal', true);
        l.forEach(function (e) {
          var isDir = e.node.t === 'dir';
          // written as HTML, so <DIR> must be escaped
          var size =isDir ? '&lt;DIR&gt;       ' : U.pad(U.hash(e.name) % 90000 + 200, 6) + '      ';
          var hidden = e.node.hidden ? '  <span class="sh-dim">[H]</span>' : '';
          wraw(' ' + e.name.toUpperCase().padEnd(16) + size + hidden, isDir ? 'sh-ok' : '');
          if (isDir) dirs++; else files++;
        });
        w('');
        w('        ' + files + ' file(s)      ' + dirs + ' dir(s)');
        if (!showHidden) {
          var all = NW.fs.listing(path, true) || [];
          if (all.length > l.length) w('  (some entries are hidden — try DIR /A)', 'sh-dim');
        }
        NW.audio.play('disk');
      },

      cd: function (args) {
        if (!args[0]) { w(dosPath(v.cwd).slice(0, -1)); return; }
        var p = NW.fs.resolve(v.cwd, args[0]);
        var n = NW.fs.node(p);
        if (!n || n.t !== 'dir') { w('The system cannot find the path specified.', 'sh-err'); return; }
        v.cwd = p; S().shellCwd = p; setPrompt();
      },

      type: function (args) {
        if (!args[0]) { w('Syntax: TYPE <file>', 'sh-err'); return; }
        var p = NW.fs.resolve(v.cwd, args[0]);
        var n = NW.fs.node(p);
        if (!n || (n.requires && !NW.state.has(n.requires))) { w('File not found.', 'sh-err'); return; }
        if (n.t === 'dir') { w('Access denied — that is a directory.', 'sh-err'); return; }
        if (n.t === 'bin') { w('  ' + (n.note || 'Binary file. The terminal will not print it.'), 'sh-dim'); return; }
        if (n.t === 'enc') {
          w('▓▒░ ' + NW.fs.block(NW.fs.vig(n.plain, n.key, 1), 5).split('\n').slice(0, 4).join('\n') + ' …', 'sh-dim');
          w('File is enciphered. Use DECRYPT.', 'sh-err');
          return;
        }
        if (n.dynamic === 'bookcipher') {
          var trip = NW.manual.encodeBook(NW.manual.SECRET);
          w(trip.join('\n'));
          w('');
          w('(no other content)', 'sh-dim');
          NW.state.flag('have_cy_book', true);
          NW.state.addEvidence('ev_bookcipher');
          return;
        }
        NW.audio.play('print');
        w(n.c || '');
        if (n.note) w('  ' + n.note, 'sh-dim');
        if (n.onRead) applyGrant(n.onRead);
      },

      find: function (args) {
        if (!args[0]) { w('Syntax: FIND <string>', 'sh-err'); return; }
        var needle = args.join(' ').toLowerCase();
        var hits = [];
        (function walk(path) {
          var l = NW.fs.listing(path, true) || [];
          l.forEach(function (e) {
            var full = (path === '/' ? '' : path) + '/' + e.name;
            if (e.name.toLowerCase().indexOf(needle) !== -1) hits.push({ p: full, h: e.node.hidden });
            if (e.node.t === 'dir') walk(full);
          });
        })('/');
        NW.audio.play('scan');
        if (!hits.length) { w('No matches.', 'sh-dim'); return; }
        hits.forEach(function (h) {
          wraw('  ' + ('C:' + h.p.replace(/\//g, '\\')) + (h.h ? '   <span class="sh-dim">[HIDDEN]</span>' : ''), 'sh-ok');
        });
        if (hits.some(function (h) { return h.h; })) NW.state.flag('fs_reveal', true);
      },

      attrib: function () {
        var l = NW.fs.listing(v.cwd, true) || [];
        l.forEach(function (e) {
          wraw((e.node.hidden ? '  <span class="sh-err">   H</span>  ' : '   A    ') + e.name.toUpperCase());
        });
        NW.state.flag('fs_reveal', true);
      },

      tree: function () {
        (function walk(path, depth) {
          var l = NW.fs.listing(path, NW.state.has('fs_reveal')) || [];
          l.forEach(function (e) {
            wraw(new Array(depth + 1).join('│  ') + (e.node.t === 'dir' ? '├─ ' : '│  ') + e.name.toUpperCase(),
              e.node.t === 'dir' ? 'sh-ok' : 'sh-dim');
            if (e.node.t === 'dir' && depth < 4) walk((path === '/' ? '' : path) + '/' + e.name, depth + 1);
          });
        })('/', 0);
      },

      decrypt: function (args) {
        if (!args[0]) { w('Syntax: DECRYPT <file>', 'sh-err'); return; }
        var p = NW.fs.resolve(v.cwd, args[0]);
        var n = NW.fs.node(p);
        if (!n) { w('File not found.', 'sh-err'); return; }
        if (n.t !== 'enc') { w('That file is not enciphered.', 'sh-err'); return; }
        if (n.requires && !NW.state.has(n.requires)) { w('File not found.', 'sh-err'); return; }
        w('Enciphered volume — ' + args[0].toUpperCase());
        v.prompt = {
          label: 'PASSPHRASE:',
          mask: true,
          fn: function (val) {
            // "the road, and the year": accept MERCER87, MERCER 1987, MERCER ROAD 87, MERCER RD 1987…
            var key = String(val).toUpperCase().replace(/[^A-Z0-9]/g, '')
              .replace(/(ROAD|RD)(?=\d)/, '').replace(/19(\d\d)$/, '$1');
            var ok = key === n.key.toUpperCase();
            if (!ok) {
              NW.audio.play('error');
              w('DECRYPT FAILED — key rejected.', 'sh-err');
              NW.state.bump('decrypt_fail');
              if (NW.state.count('decrypt_fail') === 3) w('  (she wrote it down. "THE ROAD, AND THE YEAR.")', 'sh-dim');
              return;
            }
            NW.audio.play('unlock');
            w('KEY ACCEPTED. DECIPHERING…', 'sh-ok');
            setTimeout(function () {
              w('');
              w(wrapText(n.plain, 62));
              w('');
              if (n.onDecrypt) applyGrant(n.onDecrypt);
              NW.state.flag('voss_partition_open', true);
              NW.state.addEvidence('ev_voss_partition_key');
            }, 700);
          }
        };
        setPrompt();
      },

      run: function (args) {
        if (!args[0]) { w('Syntax: RUN <file>', 'sh-err'); return; }
        var p = NW.fs.resolve(v.cwd, args[0]);
        var n = NW.fs.node(p);
        if (!n || n.t !== 'file') { w('File not found.', 'sh-err'); return; }
        if (/nightwire/i.test(args[0])) {
          if (!NW.state.has('ch5')) { w('WIRE /OPEN NIGHTWIRE', 'sh-dim'); w('  relay 3312 not accepting — trigger date not reached.', 'sh-err'); return; }
          w('WIRE /OPEN NIGHTWIRE', 'sh-dim');
          w('  relay 3312 — OPEN', 'sh-ok');
          NW.state.flag('nightwire_manual', true);
          return;
        }
        w('  batch complete.', 'sh-dim');
      }
    };
    CMDS.ls = CMDS.dir; CMDS.cat = CMDS.type; CMDS.clear = CMDS.cls;

    function wrapText(s, n) {
      var words = s.split(' '), line = '', outp = [];
      words.forEach(function (word) {
        if ((line + word).length > n) { outp.push(line.trim()); line = ''; }
        line += word + ' ';
      });
      outp.push(line.trim());
      return outp.join('\n');
    }

    function applyGrant(gr) {
      if (gr.evidence) [].concat(gr.evidence).forEach(function (e) { NW.state.addEvidence(e); });
      if (gr.doc) { NW.state.unlock('docs', gr.doc, true); NW.notify.push({ head: 'FILED TO ARCHIVE', body: NW.documents.get(gr.doc).title, kind: 'good' }); }
      if (gr.flag) NW.state.flag(gr.flag, true);
      if (gr.fact) NW.state.addFact(gr.fact.c, gr.fact.t);
    }

    /** Tab: complete the last word against the directory it points into. */
    function complete() {
      if (v.prompt) return;
      var m = input.value.match(/^(.*?)(\S*)$/);
      var head = m[1], tok = m[2];
      var cut = Math.max(tok.lastIndexOf('\\'), tok.lastIndexOf('/'));
      var dirPart = tok.slice(0, cut + 1), stem = tok.slice(cut + 1).toLowerCase();
      var dir = dirPart ? NW.fs.resolve(v.cwd, dirPart) : v.cwd;
      var hits = (NW.fs.listing(dir, false) || []).filter(function (e) {
        return e.name.toLowerCase().indexOf(stem) === 0;
      });
      if (!hits.length) { NW.audio.play('error'); return; }
      var names = hits.map(function (e) { return e.name.toUpperCase(); });
      var common = names.reduce(function (a, b) {
        var i = 0; while (i < a.length && a[i] === b[i]) i++;
        return a.slice(0, i);
      });
      if (hits.length === 1) common += hits[0].node.t === 'dir' ? '\\' : ' ';
      else if (common.length <= stem.length) {
        // nothing more to fill in: list the candidates above the prompt
        w(names.join('   '), 'sh-dim');
      }
      input.value = head + dirPart + common;
      paintLine();
    }

    function exec(raw) {
      var line = raw.trim();

      // freeze the typed line into the transcript
      var label = promptLabel();
      var echoed = (v.prompt && v.prompt.mask) ? new Array(raw.length + 1).join('*') : raw;
      if (lineEl && lineEl.parentNode) lineEl.parentNode.removeChild(lineEl);
      lineEl = null;
      wraw('<span class="sh-cmd">' + U.esc(label + echoed) + '</span>');

      if (v.prompt) {
        var fn = v.prompt.fn;
        v.prompt = null;
        fn(line);
        newLine();
        return;
      }
      if (!line) { newLine(); return; }
      v.hist.push(line); S().shellHistory = v.hist.slice(-40); v.hi = -1;
      var parts = line.split(/\s+/);
      var cmd = parts.shift().toLowerCase();
      var fn2 = CMDS[cmd];
      if (!fn2) {
        w("'" + cmd.toUpperCase() + "' is not recognised as an internal or external command.", 'sh-err');
        newLine();
        return;
      }
      try { fn2(parts); } catch (e) { w('General failure.', 'sh-err'); console.error(e); }
      newLine();
    }

    U.on(input, 'keydown', function (e) {
      if (e.key === 'Enter') {
        var val = input.value; input.value = '';
        exec(val);
        return;
      }
      if (e.key === 'Tab') { e.preventDefault(); complete(); return; }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!v.hist.length) return;
        v.hi = v.hi < 0 ? v.hist.length - 1 : Math.max(0, v.hi - 1);
        input.value = v.hist[v.hi];
        paintLine();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (v.hi < 0) return;
        v.hi = Math.min(v.hist.length - 1, v.hi + 1);
        input.value = v.hist[v.hi];
        paintLine();
        return;
      }
      // the caret has not moved yet at keydown time
      setTimeout(paintLine, 0);
    });
    U.on(input, 'input', paintLine);
    U.on(input, 'keyup', paintLine);
    U.on(input, 'select', paintLine);
    U.on(input, 'blur', function () { if (lineEl) lineEl.classList.add('unfocused'); paintLine(); });
    U.on(input, 'focus', function () { if (lineEl) lineEl.classList.remove('unfocused'); });
    U.on(body, 'mouseup', function () {
      // let the operator select transcript text; only grab focus on a bare click
      if (String(window.getSelection())) return;
      input.focus();
    });
    win.listen('win:focus', function (w2) { if (w2 && w2.id === 'shell') input.focus(); });

    BANNER.forEach(function (l) { w(l, l.indexOf('NCIB') === 0 ? 'sh-ok' : ''); });
    newLine();
    setTimeout(function () { input.focus(); }, 60);
  }

  NW.apps.define({
    id: 'shell', name: 'SHELL', short: 'SHELL', icon: 'shell',
    hint: 'local volume',
    win: { w: 700, h: 500, min: [520, 320] },
    build: build
  });
})(window.NW);

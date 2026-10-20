/* NIGHTWIRE — apps/registry.js — central person & vehicle index */
(function (NW) {
  'use strict';
  var U = NW.util, el = U.el;
  var S = function () { return NW.state.s; };

  var INDICES = [
    { id: 'crim', label: 'CRIMINAL' },
    { id: 'civ',  label: 'CIVIL' },
    { id: 'per',  label: 'PERSONNEL', clearance: 2 },
    { id: 'wit',  label: 'FEDERAL/SEALED', clearance: 3 },
    { id: 'veh',  label: 'VEHICLE' }
  ];

  var st = { index: 'crim', q: '', sel: null, selVeh: null };

  function clearance() {
    var c = S().operator.clearance;
    if (NW.state.has('clearance2') && c < 2) c = 2;
    if (NW.state.has('clearance3') && c < 3) c = 3;
    return c;
  }

  // result-list mugshots are expensive to draw, so keep them per theme
  var thumbs = {};
  function thumb(p) {
    var key = p.id + ':' + NW.theme.current();
    if (!thumbs[key]) {
      var face = NW.gfx.make(34, 42);
      NW.gfx.portrait(face, p.id, Object.assign({ levels: 3 }, p.face || {}, { plate: null }));
      thumbs[key] = face;
    }
    return thumbs[key];
  }

  function build(body, win, arg) {
    var keepScroll = false;
    var shown = null;          // what the record pane shows: {kind:'person', id} | {kind:'vehicle', v}
    var search = el('div.reg-search');
    var input = el('input.input', { placeholder: 'NAME, DOB, ADDRESS, SSN, PLATE, TAG…', value: st.q });
    var go = el('button.btn', { text: 'QUERY' });
    var tabs = el('div.toolbar');
    var results = el('div.reg-results');
    var view = el('div.grow.scroll.rec-view');

    search.appendChild(input); search.appendChild(go);
    var left = el('div.sidebar.wide.col', null, [search, results]);
    body.appendChild(el('div.app', null, [tabs, el('div.app-row', null, [left, view])]));

    function renderTabs() {
      U.clear(tabs);
      tabs.appendChild(el('span.tb-title', { text: 'INDEX' }));
      INDICES.forEach(function (ix) {
        var locked = ix.clearance && clearance() < ix.clearance;
        var b = el('button.btn', { text: ix.label + (locked ? ' 🔒' : ''), class: st.index === ix.id ? 'on' : '' });
        if (locked) b.disabled = true;
        U.on(b, 'click', function () { st.index = ix.id; NW.audio.play('click'); renderTabs(); doSearch(); });
        tabs.appendChild(b);
      });
      tabs.appendChild(el('span', { class: 'dim', style: { marginLeft: 'auto', fontSize: '9px' },
        text: 'CLEARANCE ' + clearance() + (NW.state.has('clearance2') ? ' (UPLIFT ACTIVE)' : '') }));
    }

    function doSearch() {
      st.q = input.value;
      U.clear(results);
      NW.audio.play('disk');
      if (st.index === 'veh') return renderVehicles();
      var hits = NW.people.search(st.q, { index: st.index, clearance: clearance() });
      results.appendChild(el('div.sec-h', { text: hits.length + ' RECORD' + (hits.length === 1 ? '' : 'S') }));
      if (!hits.length) results.appendChild(el('div.empty', { text: 'NO MATCH IN THIS INDEX' }));
      hits.forEach(function (p) {
        var row = el('div.reg-hit', { class: st.sel === p.id ? 'sel' : '' }, [
          el('span.rh-face', null, thumb(p)),
          el('div', null, [el('div.rh-n', { text: p.name }), el('div.rh-m', { text: p.dob + ' · ' + statusShort(p) })])
        ]);
        U.on(row, 'click', function () { open(p.id); });
        results.appendChild(row);
      });
    }

    function renderVehicles() {
      U.clear(results);
      var hits = NW.vehicles.search(st.q);
      results.appendChild(el('div.sec-h', { text: hits.length + ' VEHICLE' + (hits.length === 1 ? '' : 'S') }));
      if (!hits.length) results.appendChild(el('div.empty', { text: 'NO MATCH' }));
      hits.forEach(function (v) {
        var row = el('div.reg-hit', { class: st.selVeh === v.id ? 'sel' : '' }, [
          el('div', null, [el('div.rh-n', { text: v.plate }), el('div.rh-m', { text: v.year + ' ' + v.make + ' ' + v.model + ' · ' + v.color })])
        ]);
        U.on(row, 'click', function () { st.selVeh = v.id; NW.audio.play('click'); renderVehicle(v); renderVehicles(); });
        results.appendChild(row);
      });
    }

    function statusShort(p) {
      return (p.status || '').split('—')[0].trim().slice(0, 26);
    }

    function open(id) {
      st.sel = id;
      NW.state.unlock('records', id, true);
      NW.state.flag('read_' + id, true);
      NW.audio.play('open');
      renderRecord(NW.people.get(id));
      doSearch();
    }

    function showVehicle(v) {
      st.index = 'veh'; st.q = v.plate; input.value = v.plate; st.selVeh = v.id;
      renderTabs(); doSearch(); renderVehicle(v);
    }

    function renderRecord(p) {
      U.clear(view);
      if (!p) return;
      shown = { kind: 'person', id: p.id };
      if ((p.clearance || 1) > clearance() && !S().records[p.id]) {
        view.appendChild(el('div.sealed', { text: 'RECORD SEALED — CLEARANCE ' + p.clearance + ' REQUIRED' }));
        return;
      }

      var photo = NW.gfx.make(108, 134);
      NW.gfx.portrait(photo, p.id, Object.assign({ levels: 4 }, p.face || {}));
      view.appendChild(el('div.rec-hdr', null, [
        el('div.rec-photo', null, [photo, el('div.rp-cap', { text: 'VC-' + U.hash(p.id).toString().slice(0, 6) })]),
        el('div.grow', null, [
          el('div.rec-name', { text: p.name }),
          el('div.rec-sub', { text: p.occupation || '' }),
          statusTag(p),
          el('dl.kv', { style: { marginTop: '8px' } }, [
            el('dt', { text: 'DOB' }), el('dd', { text: p.dob + '  (' + age(p.dob) + ')' }),
            el('dt', { text: 'SEX / HT / WT' }), el('dd', { text: p.sex + ' · ' + p.ht + ' · ' + p.wt }),
            el('dt', { text: 'EYES / HAIR' }), el('dd', { text: p.eyes + ' / ' + p.hair }),
            el('dt', { text: 'SSN' }), el('dd', { text: p.ssn || '—' }),
            el('dt', { text: 'ADDRESS' }), el('dd', { text: p.addr }),
            p.phone ? el('dt', { text: 'TELEPHONE' }) : null,
            p.phone ? el('dd', null, [phoneLink(p.phone)]) : null,
            p.plate ? el('dt', { text: 'VEHICLE' }) : null,
            p.plate ? el('dd', null, [plateLink(p.plate)]) : null
          ])
        ])
      ]));

      if ((p.aka || []).length) {
        view.appendChild(section('ALSO KNOWN AS', el('div', null,
          p.aka.map(function (a) { return el('span.tag.cyan', { text: a }); }))));
      }

      if ((p.priors || []).length) {
        var tbl = el('div');
        p.priors.forEach(function (pr) {
          tbl.appendChild(el('div', { style: { marginBottom: '6px', fontSize: '11.5px' } }, [
            el('span', { class: 'dim', style: { display: 'inline-block', width: '86px' }, text: pr.d }),
            el('span', { class: 'mono-hi', text: pr.o }),
            el('div', { class: 'dim', style: { paddingLeft: '86px', fontSize: '10px' }, text: pr.dp + ' → ' + pr.r })
          ]));
        });
        view.appendChild(section('RECORD OF ARREST & DISPOSITION', tbl));
      } else {
        view.appendChild(section('RECORD OF ARREST & DISPOSITION', el('div', { class: 'dim', text: 'NO ENTRIES' })));
      }

      view.appendChild(section('ANALYST NOTES', el('div.rec-note', { text: p.notes || '' })));

      if ((p.xref || []).length) {
        var xr = el('div');
        p.xref.forEach(function (id) {
          var o = NW.people.get(id);
          if (!o) return;
          if ((o.clearance || 1) > clearance() && !S().records[id]) return;
          var s = el('span.xref', { text: o.name });
          U.on(s, 'click', function () { st.index = o.index; renderTabs(); open(id); });
          xr.appendChild(s); xr.appendChild(document.createTextNode('   '));
        });
        if (xr.childNodes.length) view.appendChild(section('CROSS REFERENCE', xr));
      }

      if ((p.docs || []).length) {
        var dl = el('div');
        p.docs.forEach(function (id) {
          var d = NW.documents.get(id);
          if (!d) return;
          var known = S().docs[id];
          var s = el('span.tag' + (known ? '.green' : ''), {
            text: (known ? '▣ ' : '▢ ') + d.title,
            title: known ? 'Open in the archive' : 'Not held yet — this document has not reached your terminal.'
          });
          if (known) {
            s.style.cursor = 'pointer';
            U.on(s, 'click', function () { NW.audio.play('page'); NW.apps.open('archive', id); });
          } else {
            s.style.opacity = '.45';
          }
          dl.appendChild(s);
        });
        view.appendChild(section('LINKED DOCUMENTS', dl));
      }

      var actions = el('div.rec-section');
      if (NW.request.wants('person')) {
        var tr = el('button.btn.good', { text: '▸ TRANSMIT THIS RECORD' });
        U.on(tr, 'click', function () { NW.request.transmit('person', p.id, p.name); });
        actions.appendChild(tr);
      }
      var bd = el('button.btn', { text: '＋ PIN TO CASEBOOK' });
      U.on(bd, 'click', function () {
        NW.casebook.addCustom({ id: 'pin_' + p.id, kind: 'person', title: p.name, desc: p.occupation || '' });
        NW.notify.push({ head: 'PINNED', body: p.name, kind: 'info' });
      });
      actions.appendChild(bd);
      if (p.printSeed) {
        var pb = el('button.btn', { text: '◈ SEND PRINT CARD TO DAKTYLO' });
        U.on(pb, 'click', function () { NW.apps.open('daktylo', { candidate: p.id }); });
        actions.appendChild(pb);
      }
      if (p.phone) {
        var cb = el('button.btn', { text: '☏ DIAL ' + p.phone });
        U.on(cb, 'click', function () { NW.apps.open('switchboard', p.phone); });
        actions.appendChild(cb);
      }
      view.appendChild(actions);
      if (!keepScroll) view.scrollTop = 0;
      NW.bus.emit('registry:open', p.id);
    }

    function rerenderRecord() {
      if (!shown) return;
      var y = view.scrollTop;
      keepScroll = true;
      if (shown.kind === 'person') renderRecord(NW.people.get(shown.id));
      else renderVehicle(shown.v);
      keepScroll = false;
      view.scrollTop = y;
    }

    // documents and requests arriving while a record is open update it in place
    win.listen('unlock', function (d) { if (d.kind === 'docs') rerenderRecord(); });
    win.listen('request:open', rerenderRecord);
    win.listen('request:close', rerenderRecord);
    win.listen('flag', function (d) { if (d.key === 'clearance2' || d.key === 'clearance3') { renderTabs(); doSearch(); } });

    function renderVehicle(v) {
      U.clear(view);
      shown = { kind: 'vehicle', v: v };
      var o = v.ownerId ? NW.people.get(v.ownerId) : null;
      view.appendChild(el('div.rec-hdr', null, [
        el('div.grow', null, [
          el('div.rec-name', { text: v.plate }),
          el('div.rec-sub', { text: v.year + ' ' + v.make + ' ' + v.model }),
          el('dl.kv', { style: { marginTop: '8px' } }, [
            el('dt', { text: 'COLOR' }), el('dd', { text: v.color }),
            el('dt', { text: 'VIN' }), el('dd', { text: v.vin }),
            el('dt', { text: 'REG. OWNER' }), el('dd', { text: v.owner }),
            el('dt', { text: 'STATUS' }), el('dd', { text: v.status })
          ])
        ])
      ]));
      view.appendChild(section('NOTES', el('div.rec-note', { text: v.notes || '' })));
      var acts = el('div.rec-section');
      if (o) {
        var b = el('button.btn', { text: '▸ OPEN OWNER RECORD' });
        U.on(b, 'click', function () { st.index = o.index; renderTabs(); open(o.id); });
        acts.appendChild(b);
      }
      if (NW.request.wants('vehicle')) {
        var t = el('button.btn.good', { text: '▸ TRANSMIT VEHICLE' });
        U.on(t, 'click', function () { NW.request.transmit('vehicle', v.plate, v.plate + ' ' + v.make); });
        acts.appendChild(t);
      }
      view.appendChild(acts);
    }

    function section(title, node) {
      return el('div.rec-section', null, [el('h4', { text: title }), node]);
    }
    function statusTag(p) {
      var m = { dec: 'red', wanted: 'red', jail: 'red', warn: 'cyan', sealed: 'violet', ok: 'green' };
      return el('span.tag', { class: m[p.statusKind] || '', text: p.status });
    }
    function age(dob) {
      var y = parseInt(String(dob).slice(-4), 10);
      return isNaN(y) ? '—' : (1998 - y) + ' YRS';
    }
    function phoneLink(n) {
      var s = el('span.xref', { text: n });
      U.on(s, 'click', function () { NW.apps.open('switchboard', n); });
      return s;
    }
    function plateLink(pl) {
      var s = el('span.xref', { text: pl });
      U.on(s, 'click', function () {
        var v = NW.vehicles.get(pl);
        if (v) showVehicle(v);
        else { st.index = 'veh'; st.q = pl; input.value = pl; renderTabs(); doSearch(); }
      });
      return s;
    }

    U.on(go, 'click', doSearch);
    U.on(input, 'keydown', function (e) { NW.audio.play('key'); if (e.key === 'Enter') doSearch(); });

    /** Show a person (by id) or a vehicle (by plate). */
    win.registryOpen = function (id) {
      var p = NW.people.get(id);
      if (p) { st.index = p.index; renderTabs(); open(id); return true; }
      var v = NW.vehicles.get(id);
      if (v) { showVehicle(v); return true; }
      return false;
    };

    renderTabs();
    if (!(arg && typeof arg === 'string' && win.registryOpen(arg))) {
      doSearch();
      view.appendChild(el('div.empty', { html: 'CENTRAL PERSON INDEX<br><br>ENTER A NAME, DATE OF BIRTH, ADDRESS,<br>SOCIAL SECURITY NUMBER OR PLATE.<br><br><span style="opacity:.6">AN EMPTY QUERY RETURNS THE WHOLE INDEX.</span>' }));
    }
  }

  NW.apps.define({
    id: 'registry', name: 'REGISTRY', short: 'INDEX', icon: 'registry',
    hint: 'central person & vehicle index',
    win: { w: 860, h: 560, min: [640, 380] },
    build: build,
    onFocus: function (win, arg) { if (arg && typeof arg === 'string' && win.registryOpen) win.registryOpen(arg); }
  });
})(window.NW);

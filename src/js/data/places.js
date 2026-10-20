/* NIGHTWIRE — data/places.js — map data for CARTOGRAPH, on a 0..1000 grid */
(function (NW) {
  'use strict';

  var PLACES = [
    { id: 'pl_office',   name: 'NCIB REGIONAL OFFICE',      x: 470, y: 610, kind: 'gov',   sub: '2 CIVIC PLAZA, PORT ALDEN' },
    { id: 'pl_quarry',   name: 'HALLORAN QUARRY',           x: 700, y: 250, kind: 'site',  sub: 'OFF MERCER RD — CLOSED 1994' },
    { id: 'pl_mercer',   name: 'MERCER ROAD (MILE 4)',      x: 612, y: 337, kind: 'road',  sub: 'FIRE SCENE 08/12/1987' },
    { id: 'pl_mill',     name: 'MARROW STREET PAPER MILL',  x: 372, y: 470, kind: 'site',  sub: '77 MARROW ST — CLOSED 1994' },
    { id: 'pl_motel',    name: 'BLUE LARKSPUR MOTEL',       x: 815, y: 545, kind: 'biz',   sub: 'RT 9, PORT ALDEN' },
    { id: 'pl_grieve',   name: 'GRIEVE HILL STATE HOSPITAL', x: 236, y: 168, kind: 'site', sub: 'CLOSED 1989 — BLDGS A–D',
      hidden: true },
    { id: 'pl_docks',    name: 'PORT ALDEN DOCKS',          x: 500, y: 800, kind: 'site',  sub: 'HARBOUR ST' },
    { id: 'pl_ashvale',  name: 'ASHVALE',                   x: 205, y: 640, kind: 'town',  sub: 'POP. 4,180' },
    { id: 'pl_portalden',name: 'PORT ALDEN',                x: 500, y: 690, kind: 'town',  sub: 'POP. 22,401' },
    { id: 'pl_warrendale',name:'WARRENDALE',                x: 850, y: 780, kind: 'town',  sub: 'POP. 1,902' },
    { id: 'pl_cedarrest',name: 'CEDAR REST HOME',           x: 250, y: 600, kind: 'biz',   sub: 'ASHVALE' },
    { id: 'pl_hollis',   name: 'HOLLIS CORRECTIONAL UNIT',  x: 120, y: 880, kind: 'gov',   sub: 'STATE FACILITY' },
    { id: 'pl_courthouse',name:'VC COURTHOUSE & RECORDS',   x: 486, y: 640, kind: 'gov',   sub: 'COURTHOUSE SQ' },
    { id: 'pl_harbourcrest',name:'HARBOUR CREST',           x: 168, y: 700, kind: 'biz',   sub: 'ASHVALE — PRIVATE' },
    { id: 'pl_lowndes',  name: '4 LOWNDES ST',              x: 520, y: 660, kind: 'biz',   sub: 'PORT ALDEN — APT 3' }
  ];

  /* Cellular sites — used for the triangulation puzzle. */
  var TOWERS = [
    { id: 't_ald1', name: 'ALDEN CENTRAL — SITE 1',  x: 505, y: 665, radius: 380 },
    { id: 't_rt9',  name: 'ROUTE 9 NORTH — SITE 4',  x: 812, y: 470, radius: 420 },
    { id: 't_mrw',  name: 'MARROW HILL — SITE 7',    x: 330, y: 420, radius: 400 },
    { id: 't_ash',  name: 'ASHVALE WEST — SITE 2',   x: 190, y: 655, radius: 360 },
    { id: 't_qry',  name: 'MERCER RIDGE — SITE 9',   x: 690, y: 210, radius: 340 }
  ];

  /* Rivers / coast polylines for the map renderer */
  var WATER = [
    { kind: 'coast', pts: [[0, 950], [180, 905], [340, 880], [520, 895], [700, 862], [860, 890], [1000, 860]] },
    { kind: 'river', pts: [[640, 0], [620, 120], [660, 240], [612, 340], [580, 470], [530, 600], [500, 760], [500, 880]] }
  ];

  var ROADS = [
    { name: 'RT 9',        pts: [[500, 880], [640, 760], [760, 640], [815, 545], [840, 420], [830, 300], [790, 180]] },
    { name: 'MERCER RD',   pts: [[500, 690], [540, 560], [570, 460], [612, 337], [660, 290], [700, 250]] },
    { name: 'MARROW ST',   pts: [[500, 690], [440, 620], [400, 540], [372, 470], [340, 380], [300, 280], [236, 168]] },
    { name: 'ASHVALE RD',  pts: [[500, 690], [400, 680], [300, 665], [205, 640], [140, 690]] },
    { name: 'HARBOUR ST',  pts: [[500, 690], [500, 760], [500, 800], [520, 850]] },
    { name: 'COUNTY 40',   pts: [[205, 640], [230, 500], [250, 380], [236, 168]] },
    { name: 'WARREN PIKE', pts: [[500, 690], [640, 720], [760, 760], [850, 780]] }
  ];

  var byId = {};
  PLACES.forEach(function (p) { byId[p.id] = p; });

  function get(id) { return byId[id]; }
  function visible() {
    return PLACES.filter(function (p) { return !p.hidden || NW.state.has('place_' + p.id); });
  }

  NW.places = { all: function () { return PLACES; }, get: get, visible: visible,
                towers: TOWERS, water: WATER, roads: ROADS };
})(window.NW);

/* NIGHTWIRE — data/vehicles.js — county vehicle index */
(function (NW) {
  'use strict';

  var V = [
    { id: 'v_ktv418', plate: 'KTV-418', year: 1986, make: 'OLDSMOBILE', model: 'CUTLASS CIERA', color: 'BEIGE',
      vin: '1G3AJ51X6GD314772', owner: 'VANCE, ELIAS T.', ownerId: 'p_vance',
      status: 'REGISTRATION LAPSED 1988 — NEVER SURRENDERED',
      notes: 'Vehicle of record in VC Coroner 87-4410 (Mercer Road fire).\nSalvage certificate never issued. Hulk never presented for scrap.\nNOTE: a vehicle bearing this plate was photographed at the Blue Larkspur Motel, Rt. 9, on 11/04/1998.' },

    { id: 'v_vc227901', plate: 'VC-227901', year: 1991, make: 'GMC', model: 'SAFARI VAN', color: 'GREY',
      vin: '1GKEL19W2MB227901', owner: 'ALDEN CIVIC HOLDINGS LLC', ownerId: 'p_bellamy',
      status: 'CURRENT', notes: 'Operator of record: ANSEL, CURTIS R.\nInspection lapsed 05/1998. Two toll citations, Rt. 9 northbound, 11/04/1998 and 11/06/1998, both 23:0x.' },

    { id: 'v_vc119023', plate: 'VC-119023', year: 1984, make: 'MACK', model: 'R-SERIES TIPPER', color: 'RED',
      vin: '1M2N187C4EA119023', owner: 'GAULT & SON TRUCKING', ownerId: 'p_gault',
      status: 'CURRENT — COMMERCIAL', notes: 'Weighbridge log: 41 trips 01/1998–10/1998, quarry to Marrow St.\nAverage gross outbound weight 3,900 lb below rated fill capacity.' },

    { id: 'v_rxp206', plate: 'RXP-206', year: 1989, make: 'CHEVROLET', model: 'CAPRICE', color: 'BLUE',
      vin: '1G1BL51E5KR206441', owner: 'KRUSE, DIETER H.', ownerId: 'p_kruse',
      status: 'CURRENT', notes: 'Owner subject of active bench warrant VC 98-0912.' },

    { id: 'v_tdl771', plate: 'TDL-771', year: 1992, make: 'FORD', model: 'ECONOLINE E-150', color: 'WHITE',
      vin: '1FTEE14N0NHB07711', owner: 'DOWD, TERRENCE L.', ownerId: 'p_dowd',
      status: 'CURRENT', notes: 'Commercial use permit, Garnet St. deliveries.' },

    { id: 'v_jhm330', plate: 'JHM-330', year: 1994, make: 'HONDA', model: 'ACCORD LX', color: 'SILVER',
      vin: 'JHMCD5630RC033012', owner: 'IVERS, ROSALIND J.', ownerId: 'p_ivers',
      status: 'CURRENT', notes: 'No flags.' },

    { id: 'v_ncib11', plate: 'GOV-1104', year: 1996, make: 'FORD', model: 'CROWN VICTORIA', color: 'BLACK',
      vin: '2FALP71W1TX110402', owner: 'NCIB REGIONAL — MOTOR POOL', ownerId: null,
      status: 'ASSIGNED — REYES, A. / NKEMDIRIM, D.', notes: 'Unit 11. Car phone 555-0211.' },

    { id: 'v_ncib01', plate: 'GOV-1101', year: 1997, make: 'LINCOLN', model: 'TOWN CAR', color: 'BLACK',
      vin: '1LNLM81W7VY110188', owner: 'NCIB REGIONAL — MOTOR POOL', ownerId: null,
      status: 'ASSIGNED — DEP. CHIEF W. R. FINN',
      notes: 'Fuel card log 11/06/1998: two fills. 19:40 Ashvale. 23:58 Rt. 9 north — 61 miles from the office in the wrong direction for home.' },

    { id: 'v_amb4', plate: 'VC-AMB-4', year: 1988, make: 'FORD', model: 'E-350 AMBULANCE (DECOMM.)', color: 'WHITE',
      vin: '1FDKE30G4JHA40041', owner: 'ALDEN CIVIC HOLDINGS LLC', ownerId: 'p_bellamy',
      status: 'CURRENT — PRIVATE',
      notes: 'Decommissioned county unit sold at auction 03/1998, four days after the separation of M. VOSS.\nNo livery removal recorded. Garaged: 77 Marrow St.' }
  ];

  var byPlate = {};
  V.forEach(function (v) { byPlate[v.plate.replace(/-/g, '').toUpperCase()] = v; });

  function get(plate) {
    if (!plate) return null;
    return byPlate[String(plate).replace(/[-\s]/g, '').toUpperCase()] || null;
  }
  function search(q) {
    return V.filter(function (v) {
      return NW.util.matches([v.plate, v.make, v.model, v.color, v.owner, v.vin, v.notes].join(' '), q);
    });
  }

  NW.vehicles = { get: get, search: search, all: function () { return V; } };
})(window.NW);

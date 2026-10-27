// Area clienti — DEMO. Nessun dato viene inviato a un server.
(function () {
  'use strict';
  var D = JSON.parse(document.getElementById('portal-data').textContent);
  var t = D.t, LANG = D.lang;
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var B = '#12B5FB', V = '#A99EFF', O = '#FFB547', G = '#6BE3A0';
  var TODAY = new Date('2026-10-18T00:00:00');
  var RAW = [
    { id: 's1', cc: V, start: '2026-01-01', end: '2026-12-31', m: 890 },
    { id: 's2', cc: V, start: '2026-03-15', end: '2027-03-14', m: 240 },
    { id: 's3', cc: B, start: '2025-11-01', end: '2026-10-31', m: 49 },
    { id: 's4', cc: V, start: '2026-06-01', end: '2027-05-31', m: 320 },
    { id: 's5', cc: B, start: '2026-09-01', end: '2027-08-31', m: 159 }
  ];
  var st = { screen: 'login', tab: 'servizi', renewId: null, period: 'annuale', method: 'card', paid: false,
    auto: { s1: true, s2: true, s3: false, s4: true, s5: true } };
  var lastFocus = null;

  function fmt(d) { return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); }
  // somma mesi senza sforare (31/05 + 1 mese = 30/06, non 01/07)
  function addMonths(d, n) {
    var day = d.getDate(), r = new Date(d.getFullYear(), d.getMonth() + n, 1);
    var last = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
    r.setDate(Math.min(day, last)); return r;
  }
  function eur(n) { return '€ ' + n.toLocaleString(LANG === 'it' ? 'it-IT' : 'en-GB'); }
  function svc() {
    return RAW.map(function (r) {
      var s = new Date(r.start + 'T00:00:00'), e = new Date(r.end + 'T00:00:00');
      var pct = Math.max(0, Math.min(100, Math.round((TODAY - s) / (e - s) * 100)));
      var days = Math.ceil((e - TODAY) / 86400000);
      return { r: r, s: s, e: e, pct: pct, days: days, soon: days <= 30, on: !!st.auto[r.id], name: t.names[r.id] };
    });
  }

  function header() {
    return '<header class="dash-head"><div class="in">' +
      '<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">' +
      '<a href="' + D.home + '" aria-label="' + esc(t.backSite) + '"><img src="/img/logo-header.png" width="520" height="129" alt="Simplyx" style="height:40px;width:auto;display:block"></a>' +
      '<span class="mono" style="font-size:11px;letter-spacing:.16em;color:var(--dim);padding-left:18px;border-left:1px solid rgba(18,181,251,.25)">' + esc(t.area) + '</span>' +
      '<span class="demo-badge">' + esc(t.demo) + '</span></div>' +
      '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">' + document.querySelector('.lang').outerHTML +
      '<div style="text-align:right;line-height:1.3"><div style="font-size:14px;font-weight:500">Azienda Demo S.r.l.</div><div style="font-size:12px;color:var(--dim)">' + esc(t.clientNo) + ' #[000123]</div></div>' +
      '<span class="avatar" aria-hidden="true">AD</span>' +
      '<button type="button" class="btn-sm" data-act="logout">' + esc(t.logout) + '</button></div></div></header>';
  }

  function servizi(list) {
    var next = list.slice().sort(function (a, b) { return a.days - b.days; })[0];
    var total = RAW.reduce(function (a, r) { return a + r.m; }, 0);
    var rows = list.map(function (x) {
      var col = x.soon ? O : x.r.cc;
      return '<div class="trow">' +
        '<div style="display:flex;flex-direction:column;gap:6px"><span class="svc-name">' + esc(x.name) + '</span><span class="cat" style="color:' + x.r.cc + '">' + esc(t.cats[x.r.id]) + '</span></div>' +
        '<div style="display:flex;flex-direction:column;gap:8px"><span class="mono" style="font-size:13px;color:var(--soft)">' + fmt(x.s) + ' → ' + fmt(x.e) + '</span>' +
        '<span class="bar" role="progressbar" aria-valuenow="' + x.pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(t.elapsed) + '"><span style="width:' + x.pct + '%;background:' + col + ';box-shadow:0 0 8px ' + col + '"></span></span>' +
        '<span style="font-size:13px;color:var(--dim)">' + x.days + ' ' + esc(t.daysLeft) + ' · ' + x.pct + '% ' + esc(t.elapsed) + '</span></div>' +
        '<span class="status" style="border-color:' + (x.soon ? O : G) + ';color:' + (x.soon ? O : G) + '">' + esc(x.soon ? t.soon : t.active) + '</span>' +
        '<button type="button" class="toggle" data-act="toggle" data-id="' + x.r.id + '" aria-pressed="' + x.on + '" aria-label="' + esc(t.autoAria + ' — ' + x.name) + '"><span class="knob"></span>' + esc(x.on ? t.auto : t.manual) + '</button>' +
        '<span class="mono" style="font-size:14px">' + eur(x.r.m) + ' ' + esc(t.perMonth) + '</span>' +
        '<button type="button" class="btn-renew" data-act="renew" data-id="' + x.r.id + '">' + esc(t.renew) + '</button></div>';
    }).join('');
    return '<h1>' + esc(t.svcT) + '</h1><p class="mono" style="color:var(--dim);font-size:13px;margin-bottom:28px">' + esc(t.asOf) + ' ' + fmt(TODAY) + '</p>' +
      '<div class="grid g-220" style="gap:12px;margin-bottom:30px">' +
      '<div class="tile hud"><div class="k">' + esc(t.kActive) + '</div><div class="v">' + RAW.length + '</div></div>' +
      '<div class="tile warn"><div class="k">' + esc(t.kNext) + '</div><div class="v" style="font-size:20px">' + fmt(next.e) + '</div><div style="font-size:13px;color:var(--muted);margin-top:6px">' + esc(next.name) + ' · ' + next.days + ' ' + esc(t.days) + '</div></div>' +
      '<div class="tile"><div class="k">' + esc(t.kMonthly) + '</div><div class="v" style="font-size:28px">' + eur(total) + '</div></div>' +
      '<div class="tile"><div class="k">' + esc(t.kMethod) + '</div><div style="font-family:var(--head);font-size:22px;font-weight:600;margin-top:12px">Visa •••• 4242</div><div style="font-size:13px;color:var(--muted);margin-top:6px">' + esc(t.expires) + ' 08/28</div></div></div>' +
      '<div class="table"><div class="rows"><div class="trow head">' + t.cols.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>' + rows + '</div></div>';
  }

  function pagamenti() {
    var tx = [['01/10/2026', t.names.s1 + ' — ' + t.months[3], 'Visa •••• 4242', 890], ['01/10/2026', t.names.s4 + ' — ' + t.months[3], 'SEPA', 320], ['01/10/2026', t.names.s5 + ' — ' + t.months[3], 'PayPal', 159], ['15/09/2026', t.names.s2 + ' — ' + t.months[2], 'Visa •••• 4242', 240]];
    var card = function (k, extra, v, sub, def) {
      return '<div class="tile' + (def ? ' hud' : '') + '" style="display:flex;flex-direction:column;gap:10px;' + (def ? 'border-color:var(--blue)' : '') + '"><div style="display:flex;justify-content:space-between;gap:10px"><span class="mono" style="font-size:11px;color:' + (def ? 'var(--blue)' : 'var(--dim)') + '">' + esc(k) + '</span>' + extra + '</div><span style="font-family:var(--head);font-size:22px;font-weight:600">' + esc(v) + '</span><span style="font-size:13px;color:var(--dim)">' + esc(sub) + '</span></div>';
    };
    var setDef = '<a href="#" style="font-size:13px">' + esc(t.setDef) + '</a>';
    return '<h1>' + esc(t.payT) + '</h1><p style="color:var(--dim);margin-bottom:28px">' + esc(t.payP) + '</p>' +
      '<div class="grid g-260" style="gap:12px;margin-bottom:40px">' +
      card(t.cardDef, '<span style="font-size:13px;color:var(--dim)">' + esc(t.expires) + ' 08/28</span>', 'Visa •••• 4242', '3-D Secure', true) +
      card('SEPA', setDef, 'IT•• •••• 0981', t.mandate) + card('PAYPAL', setDef, t.linkedAcc, t.linked) + '</div>' +
      '<h2 style="font-family:var(--head);font-size:22px;font-weight:600;margin-bottom:16px">' + esc(t.addMethod) + '</h2>' +
      '<div class="grid g-170" style="gap:10px;margin-bottom:18px">' + t.methodsAll.map(function (m) { return '<button type="button" class="opt"><span style="font-weight:600;font-size:15px">' + esc(m[0]) + '</span><span style="font-size:13px;color:var(--dim)">' + esc(m[1]) + '</span></button>'; }).join('') + '</div>' +
      '<p style="font-size:14px;color:var(--dim);display:flex;gap:10px;align-items:center;margin-bottom:40px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#12B5FB" stroke-width="1.8" aria-hidden="true" style="flex:none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>' + esc(t.pci) + '</p>' +
      '<h2 style="font-family:var(--head);font-size:22px;font-weight:600;margin-bottom:16px">' + esc(t.txT) + '</h2>' +
      '<div class="table">' + tx.map(function (x) { return '<div class="list-row"><span class="mono" style="font-size:13px;color:var(--dim);min-width:96px">' + x[0] + '</span><span style="flex:1 1 240px">' + esc(x[1]) + '</span><span style="font-size:14px;color:var(--muted);min-width:150px">' + esc(x[2]) + '</span><span class="mono" style="font-size:14px;min-width:90px;text-align:right">' + eur(x[3]) + '</span><span class="mono" style="font-size:12px;color:var(--green);min-width:70px;text-align:right">' + esc(t.paidTag) + '</span></div>'; }).join('') + '</div>';
  }

  function fatture() {
    var inv = [['FT 2026/0412', '01/10/2026', 3, 1658], ['FT 2026/0371', '01/09/2026', 2, 1499], ['FT 2026/0330', '01/08/2026', 1, 1499], ['FT 2026/0289', '01/07/2026', 0, 1499]];
    return '<h1>' + esc(t.invT) + '</h1><p style="color:var(--dim);margin-bottom:28px">' + esc(t.invP) + '</p><div class="table">' +
      inv.map(function (i) { return '<div class="list-row"><span class="mono" style="font-size:13px;min-width:120px">' + i[0] + '</span><span class="mono" style="font-size:13px;color:var(--dim);min-width:96px">' + i[1] + '</span><span style="flex:1 1 200px">' + esc(t.fee + ' — ' + t.months[i[2]] + ' 2026') + '</span><span class="mono" style="font-size:14px;min-width:90px;text-align:right">' + eur(i[3]) + '</span><a href="#" class="btn-sm" style="display:inline-flex;align-items:center">' + esc(t.dl) + '</a></div>'; }).join('') + '</div>';
  }

  function modal(list) {
    var cur = list.filter(function (x) { return x.r.id === st.renewId; })[0];
    if (!cur) return '';
    var months = st.period === 'annuale' ? 12 : 1;
    var ne = addMonths(cur.e, months);
    var total = eur(cur.r.m * months);
    var inner;
    if (!st.paid) {
      inner = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px"><div><div class="mono" style="font-size:11px;letter-spacing:.16em;color:var(--blue);margin-bottom:8px">' + esc(t.renewK) + '</div><h2 id="dlgT" style="font-family:var(--head);font-size:24px;font-weight:600">' + esc(cur.name) + '</h2><div style="font-size:14px;color:var(--dim);margin-top:6px">' + esc(t.curExp) + ' ' + fmt(cur.e) + '</div></div>' +
        '<button type="button" class="icon-btn" data-act="close" aria-label="' + esc(t.closeL) + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div style="display:flex;flex-direction:column;gap:10px"><span class="label">' + esc(t.duration) + '</span><div class="grid g-2" style="gap:10px">' +
        [['mensile', t.monthly, eur(cur.r.m) + ' ' + t.perMonth], ['annuale', t.yearly, eur(cur.r.m * 12) + ' ' + t.perYear]].map(function (p) {
          return '<button type="button" class="choice period" data-act="period" data-id="' + p[0] + '" aria-pressed="' + (st.period === p[0]) + '"><span style="font-weight:600">' + esc(p[1]) + '</span><span style="font-size:13px;color:var(--muted)">' + esc(p[2]) + '</span></button>';
        }).join('') + '</div></div>' +
        '<div style="display:flex;flex-direction:column;gap:10px"><span class="label">' + esc(t.payWith) + '</span>' +
        ['card', 'paypal', 'wallet', 'sepa', 'bonifico'].map(function (id) {
          return '<button type="button" class="choice" data-act="method" data-id="' + id + '" aria-pressed="' + (st.method === id) + '"><span class="radio"></span><span style="display:flex;flex-direction:column;gap:2px"><span style="font-weight:600;font-size:15px">' + esc(t.m[id][0]) + '</span><span style="font-size:13px;color:var(--dim)">' + esc(t.m[id][1]) + '</span></span></button>';
        }).join('') + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding-top:18px;border-top:1px solid rgba(18,181,251,.16)"><span style="color:var(--muted)">' + esc(t.total) + '<br><span style="font-size:13px;color:var(--dim)">' + esc(t.newExp) + ' ' + fmt(ne) + '</span></span><span style="font-family:var(--display);font-size:28px">' + total + '</span></div>' +
        '<button type="button" class="btn btn-primary" data-act="pay">' + esc(t.payL[st.method]) + ' · ' + total + '</button>';
    } else {
      inner = '<div style="display:flex;flex-direction:column;align-items:flex-start;gap:16px"><span aria-hidden="true" style="width:56px;height:56px;border:2px solid var(--green);display:flex;align-items:center;justify-content:center"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6BE3A0" stroke-width="2.2"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span>' +
        '<h2 id="dlgT" style="font-family:var(--display);font-weight:400;font-size:22px">' + esc(t.doneT) + '</h2><p style="color:var(--muted);line-height:1.6">' + esc(cur.name + ' ' + t.doneA + ' ' + fmt(ne) + '. ' + t.doneB) + '</p>' +
        '<button type="button" class="btn btn-ghost" data-act="close">' + esc(t.backSvc) + '</button></div>';
    }
    return '<div class="modal" data-act="backdrop"><div class="dialog hud" role="dialog" aria-modal="true" aria-labelledby="dlgT">' + inner + '</div></div>';
  }

  function render() {
    var login = document.getElementById('login'), app = document.getElementById('app');
    if (st.screen === 'login') { login.hidden = false; app.hidden = true; app.innerHTML = ''; return; }
    login.hidden = true; app.hidden = false;
    var list = svc();
    var tabs = ['servizi', 'pagamenti', 'fatture'], counts = [RAW.length, 3, 4];
    var body = st.tab === 'servizi' ? servizi(list) : st.tab === 'pagamenti' ? pagamenti() : fatture();
    app.innerHTML = header() + '<div class="dash"><nav class="side" aria-label="' + esc(t.area) + '">' +
      tabs.map(function (id, i) { return '<button type="button" data-act="tab" data-id="' + id + '"' + (st.tab === id ? ' aria-current="page"' : '') + '>' + esc(t.tabs[i]) + '<span class="c">' + counts[i] + '</span></button>'; }).join('') +
      '<a href="#">' + esc(t.support) + '</a><a href="#">' + esc(t.profile) + '</a></nav>' +
      '<main class="dmain vlines" id="main">' + body + '</main></div>' + modal(list);
    var dlg = app.querySelector('.dialog');
    if (dlg) { var f = dlg.querySelector('button'); if (f) f.focus(); }
  }

  document.getElementById('loginForm').addEventListener('submit', function (e) { e.preventDefault(); st.screen = 'dash'; render(); window.scrollTo(0, 0); });
  document.querySelector('[data-login]').addEventListener('click', function () { st.screen = 'dash'; render(); window.scrollTo(0, 0); });

  document.getElementById('app').addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var act = el.getAttribute('data-act'), id = el.getAttribute('data-id');
    if (act === 'backdrop' && e.target !== el) return;
    if (act === 'logout') { st.screen = 'login'; st.renewId = null; }
    else if (act === 'tab') st.tab = id;
    else if (act === 'toggle') st.auto[id] = !st.auto[id];
    else if (act === 'renew') { lastFocus = id; st.renewId = id; st.paid = false; st.period = 'annuale'; st.method = 'card'; }
    else if (act === 'period') st.period = id;
    else if (act === 'method') st.method = id;
    else if (act === 'pay') st.paid = true;
    else if (act === 'close' || act === 'backdrop') { st.renewId = null; st.paid = false; }
    else return;
    if (el.tagName === 'A') e.preventDefault();
    render();
    if ((act === 'close' || act === 'backdrop') && lastFocus) { var b = document.querySelector('[data-act="renew"][data-id="' + lastFocus + '"]'); if (b) b.focus(); }
    if (act === 'toggle') { var tb = document.querySelector('[data-act="toggle"][data-id="' + id + '"]'); if (tb) tb.focus(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && st.renewId) { st.renewId = null; st.paid = false; render(); } });
  render();
})();

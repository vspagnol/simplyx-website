// SimplyX — comportamento del sito (senza librerie).
(function () {
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = doc.querySelector('[data-nav]');
  var menuBtn = doc.querySelector('[data-menu]');
  var mega = doc.getElementById('menu-soluzioni');
  var burger = doc.querySelector('[data-burger]');
  var mobile = doc.getElementById('menu-mobile');

  function setMega(open) {
    if (!menuBtn || !mega) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    mega.hidden = !open;
    nav.classList.toggle('is-open', open || (burger && burger.getAttribute('aria-expanded') === 'true'));
  }
  function setMobile(open) {
    if (!burger || !mobile) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    mobile.hidden = !open;
    nav.classList.toggle('is-open', open);
    doc.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMega(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('click', function (e) { if (!nav.contains(e.target)) setMega(false); });
    mega.addEventListener('click', function (e) { if (e.target.closest('a')) setMega(false); });
  }
  if (burger) {
    burger.addEventListener('click', function () { setMobile(burger.getAttribute('aria-expanded') !== 'true'); });
    mobile.addEventListener('click', function (e) { if (e.target.closest('a')) setMobile(false); });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (m) { if (m.matches) setMobile(false); });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menuBtn && menuBtn.getAttribute('aria-expanded') === 'true') { setMega(false); menuBtn.focus(); }
    if (burger && burger.getAttribute('aria-expanded') === 'true') { setMobile(false); burger.focus(); }
  });

  // metodo in quattro fasi: le animazioni girano solo quando la sezione è a schermo
  [].forEach.call(doc.querySelectorAll('[data-method]'), function (m) {
    if (reduce || !('IntersectionObserver' in window)) { m.classList.add('vista'); return; }
    new IntersectionObserver(function (en) { en.forEach(function (x) { m.classList.toggle('vista', x.isIntersecting); }); }, { threshold: .15 }).observe(m);
  });

  // comparsa allo scorrimento
  var items = [].slice.call(doc.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, sibs = [].slice.call(el.parentNode.children).filter(function (s) { return s.classList.contains('reveal'); });
        el.style.setProperty('--d', Math.min(sibs.indexOf(el), 5) * 80 + 'ms');
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  // leggero parallasse dell'immagine di apertura
  var par = doc.querySelector('[data-parallax]');
  if (par && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) par.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  // fondo animato delle sezioni chiare: puntini in movimento che si collegano con linee e formano triangoli
  (function () {
    var hosts = [].slice.call(doc.querySelectorAll('.sec-white, .phead:not(.phead-dark)'));
    if (!hosts.length || !window.requestAnimationFrame) return;
    var nets = [], rnd = Math.random, TAU = Math.PI * 2;
    function Net(host) {
      var cv = doc.createElement('canvas'); cv.className = 'mesh'; cv.setAttribute('aria-hidden', 'true');
      host.insertBefore(cv, host.firstChild);
      this.host = host; this.cv = cv; this.ctx = cv.getContext('2d'); this.visible = false; this.build();
    }
    Net.prototype.build = function () {
      var w = this.host.offsetWidth, h = this.host.offsetHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = w; this.h = h; this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.D = w < 700 ? 108 : 138;
      var n = Math.max(22, Math.min(150, Math.round(w * h / (w < 700 ? 6200 : 8200)))), P = [];
      for (var i = 0; i < n; i++) { var a = rnd() * TAU, v = 11 + rnd() * 20; P.push({ x: rnd() * (w + 80) - 40, y: rnd() * (h + 80) - 40, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 1.3 + rnd() * 1.7, hot: rnd() < .14, ph: rnd() * TAU }); }
      this.P = P;
    };
    Net.prototype.draw = function (t, dt) {
      var c = this.ctx, P = this.P, n = P.length, D = this.D, D2 = D * D, w = this.w, h = this.h, i, j, k, p, q, d2, nb = [], a;
      c.clearRect(0, 0, w, h);
      for (i = 0; i < n; i++) {
        p = P[i]; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -50) p.x = w + 50; else if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50; else if (p.y > h + 50) p.y = -50;
        nb.push([]);
      }
      c.lineWidth = 1;
      var n1 = [], n2 = [], b1 = [], b2 = [];
      for (i = 0; i < n; i++) { n1.push(-1); n2.push(-1); b1.push(1e12); b2.push(1e12); }
      for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
        p = P[i]; q = P[j]; d2 = (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y);
        if (d2 < b1[i]) { b2[i] = b1[i]; n2[i] = n1[i]; b1[i] = d2; n1[i] = j; } else if (d2 < b2[i]) { b2[i] = d2; n2[i] = j; }
        if (d2 < b1[j]) { b2[j] = b1[j]; n2[j] = n1[j]; b1[j] = d2; n1[j] = i; } else if (d2 < b2[j]) { b2[j] = d2; n2[j] = i; }
        if (d2 > D2) continue;
        nb[i].push(j); a = 1 - Math.sqrt(d2) / D;
        c.strokeStyle = 'rgba(0,113,227,' + (.08 + a * .36).toFixed(3) + ')';
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke();
      }
      // nessun puntino resta isolato: ognuno è sempre legato ai due più vicini
      c.strokeStyle = 'rgba(0,113,227,.1)'; c.beginPath();
      for (i = 0; i < n; i++) {
        if (n1[i] >= 0 && b1[i] > D2 && b1[i] < D2 * 6) { c.moveTo(P[i].x, P[i].y); c.lineTo(P[n1[i]].x, P[n1[i]].y); }
        if (n2[i] >= 0 && b2[i] > D2 && b2[i] < D2 * 6) { c.moveTo(P[i].x, P[i].y); c.lineTo(P[n2[i]].x, P[n2[i]].y); }
      }
      c.stroke();
      c.fillStyle = 'rgba(18,150,240,.03)';
      for (i = 0; i < n; i++) for (j = 0; j < nb[i].length; j++) for (k = j + 1; k < nb[i].length; k++) {
        p = P[nb[i][j]]; q = P[nb[i][k]];
        if ((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y) > D2 * .8) continue;
        c.beginPath(); c.moveTo(P[i].x, P[i].y); c.lineTo(p.x, p.y); c.lineTo(q.x, q.y); c.closePath(); c.fill();
      }
      for (i = 0; i < n; i++) {
        p = P[i];
        if (p.hot) { a = .5 + .5 * Math.sin(t * 1.4 + p.ph); c.fillStyle = 'rgba(18,181,251,' + (.13 * a).toFixed(3) + ')'; c.beginPath(); c.arc(p.x, p.y, p.r + 5 + a * 3, 0, TAU); c.fill(); c.fillStyle = 'rgba(18,181,251,' + (.55 + .4 * a).toFixed(3) + ')'; }
        else c.fillStyle = 'rgba(0,113,227,.42)';
        c.beginPath(); c.arc(p.x, p.y, p.hot ? p.r + .6 : p.r, 0, TAU); c.fill();
      }
    };
    hosts.forEach(function (h) { nets.push(new Net(h)); });
    if (reduce) { nets.forEach(function (m) { m.draw(0, 0); }); return; }
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (en) { en.forEach(function (x) { nets.forEach(function (m) { if (m.host === x.target) m.visible = x.isIntersecting; }); }); }, { rootMargin: '100px' });
      nets.forEach(function (m) { vio.observe(m.host); });
    } else nets.forEach(function (m) { m.visible = true; });
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(function () { nets.forEach(function (m) { if (Math.abs(m.host.offsetHeight - m.h) > 4 || m.host.offsetWidth !== m.w) m.build(); }); }); nets.forEach(function (m) { ro.observe(m.host); }); }
    var last = 0;
    (function loop(now) {
      requestAnimationFrame(loop);
      var dt = (now - last) / 1000;
      if (doc.hidden || dt < .033) return;
      last = now; if (dt > .1) dt = .1;
      for (var k = 0; k < nets.length; k++) if (nets[k].visible) nets[k].draw(now / 1000, dt);
    })(0);
  })();

  // cervello: i puntini arrivano da lontano, tracciano linee e triangoli e compongono la figura.
  // La scritta SIMPLYX fa parte della rete: i suoi tratti sono connessioni tra gli stessi puntini, poi ricalcate.
  (function () {
    var boxes = [].slice.call(doc.querySelectorAll('[data-brain]'));
    if (!boxes.length || !window.requestAnimationFrame) return;
    var TAU = Math.PI * 2, seed = 11;
    function R() { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; }
    var OUT = [[6,52],[4,44],[6,35],[10,27],[16,20],[24,14],[33,10],[43,7],[54,6],[64,8],[73,12],[81,17],[88,24],[93,32],[96,41],[96,50],[93,58],[88,64],[84,70],[76,75],[67,76],[60,73],[58,80],[60,90],[54,92],[50,82],[48,72],[40,70],[32,66],[26,60],[18,60],[10,58]];
    function inside(x, y) { for (var i = 0, j = OUT.length - 1, c = false; i < OUT.length; j = i++) { var a = OUT[i], b = OUT[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
    var V = OUT.map(function (p) { return [p[0], p[1]]; }), nOut = OUT.length, i, j, k;

    // lettere: tratti spezzati in pezzi corti, così ogni pezzo diventa una connessione della rete
    var GLY = { S: [5, [[5,0],[0,0],[0,3.5],[5,3.5],[5,7],[0,7]]], I: [0, [[0,0],[0,7]]], M: [6, [[0,7],[0,0],[3,4],[6,0],[6,7]]], P: [5, [[0,7],[0,0],[5,0],[5,3.5],[0,3.5]]], L: [4.6, [[0,0],[0,7],[4.6,7]]], Y: [5, [[0,0],[2.5,3.5],[5,0]], [[2.5,3.5],[2.5,7]]], X: [5, [[0,0],[2.5,3.5],[5,7]], [[5,0],[2.5,3.5],[0,7]]] };
    var WGAP = 2.5, WU = 1.42, WCY = 41, wTot = 0, wx = 0, WE = [], wordKey = {};
    'SIMPLYX'.split('').forEach(function (ch, li, arr) { wTot += GLY[ch][0] + (li < arr.length - 1 ? WGAP : 0); });
    function vid(x, y) { for (var z = nOut; z < V.length; z++) if (Math.abs(V[z][0] - x) < .02 && Math.abs(V[z][1] - y) < .02) return z; V.push([x, y]); return V.length - 1; }
    'SIMPLYX'.split('').forEach(function (ch, li) {
      var g = GLY[ch], order = 0;
      for (var st = 1; st < g.length; st++) for (var pi = 0; pi < g[st].length - 1; pi++) {
        var ax = 50 + (wx + g[st][pi][0] - wTot / 2) * WU, ay = WCY + (g[st][pi][1] - 3.5) * WU, bx = 50 + (wx + g[st][pi + 1][0] - wTot / 2) * WU, by = WCY + (g[st][pi + 1][1] - 3.5) * WU;
        var len = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay)), parts = Math.max(1, Math.round(len / 2.5)), prev = vid(ax, ay);
        for (var q = 1; q <= parts; q++) { var cur = vid(ax + (bx - ax) * q / parts, ay + (by - ay) * q / parts); WE.push({ a: prev, b: cur, blue: ch === 'X', wt: 4.5 + li * .26 + order * .035 }); wordKey[prev < cur ? prev + '_' + cur : cur + '_' + prev] = WE[WE.length - 1]; prev = cur; order++; }
      }
      wx += g[0] + WGAP;
    });
    var nWord = V.length;
    for (k = 0; k < 6000 && V.length < nWord + 70; k++) {
      var x = 4 + R() * 92, y = 6 + R() * 86, ok = inside(x, y);
      for (i = 0; ok && i < V.length; i++) { var lim = i < nOut ? 36 : i < nWord ? 17 : 62; if ((V[i][0] - x) * (V[i][0] - x) + (V[i][1] - y) * (V[i][1] - y) < lim) ok = false; }
      if (ok) V.push([x, y]);
    }
    function circ(a, b, c) { var d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])), a2 = a[0] * a[0] + a[1] * a[1], b2 = b[0] * b[0] + b[1] * b[1], c2 = c[0] * c[0] + c[1] * c[1], ux = (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / d, uy = (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / d; return [ux, uy, (a[0] - ux) * (a[0] - ux) + (a[1] - uy) * (a[1] - uy)]; }
    // piccolo spostamento per evitare punti perfettamente allineati nella triangolazione
    var J = V.map(function (p, idx) { return idx >= nOut && idx < nWord ? [p[0] + (R() - .5) * .02, p[1] + (R() - .5) * .02] : p; });
    var n = V.length, W = J.concat([[-900, -900], [1100, -900], [100, 1900]]), T = [{ v: [n, n + 1, n + 2], c: circ(W[n], W[n + 1], W[n + 2]) }];
    for (i = 0; i < n; i++) {
      var bad = [], keep = [], E = {};
      T.forEach(function (t) { ((W[i][0] - t.c[0]) * (W[i][0] - t.c[0]) + (W[i][1] - t.c[1]) * (W[i][1] - t.c[1]) < t.c[2] ? bad : keep).push(t); });
      bad.forEach(function (t) { for (var e = 0; e < 3; e++) { var a = t.v[e], b = t.v[(e + 1) % 3], key = a < b ? a + '_' + b : b + '_' + a; E[key] = E[key] ? null : [a, b]; } });
      T = keep;
      for (var key in E) if (E[key]) T.push({ v: [E[key][0], E[key][1], i], c: circ(W[E[key][0]], W[E[key][1]], W[i]) });
    }
    var TR = [], ED = [], seen = {}, adj = V.map(function () { return []; });
    function addEdge(a, b) { var key = a < b ? a + '_' + b : b + '_' + a; if (seen[key]) return seen[key]; var w = wordKey[key], e = { a: w ? w.a : a, b: w ? w.b : b, out: false, word: !!w, blue: !!(w && w.blue), wt: w ? w.wt : 0, t0: 1 + (Math.min(V[a][0], V[b][0]) / 100) * 1.9 + R() * .35 }; seen[key] = e; ED.push(e); adj[a].push(b); adj[b].push(a); return e; }
    T.forEach(function (t) {
      var v = t.v; if (v[0] >= n || v[1] >= n || v[2] >= n) return;
      if (!inside((V[v[0]][0] + V[v[1]][0] + V[v[2]][0]) / 3, (V[v[0]][1] + V[v[1]][1] + V[v[2]][1]) / 3)) return;
      TR.push({ v: v, lit: R() < .3, ph: R() * TAU, sp: .5 + R() * .7 });
      for (var e = 0; e < 3; e++) addEdge(v[e], v[(e + 1) % 3]);
    });
    for (i = 0; i < nOut; i++) addEdge(i, (i + 1) % nOut).out = true;
    var missing = 0; WE.forEach(function (w) { var key = w.a < w.b ? w.a + '_' + w.b : w.b + '_' + w.a; if (!seen[key]) { missing++; addEdge(w.a, w.b); } });
    var isWord = V.map(function (p, idx) { return idx >= nOut && idx < nWord; });
    var N = V.map(function (p, idx) { return { tx: p[0], ty: p[1], out: idx < nOut, word: isWord[idx], r: idx < nOut ? .9 + R() * .7 : isWord[idx] ? .42 : .55 + R() * .75, big: !isWord[idx] && R() < .13, d: p[0] / 100 * 1.2 + R() * .5, ph: R() * TAU, ph2: R() * TAU, sa: R() * TAU, sr: 70 + R() * 70, x: 0, y: 0 }; });
    var SIG = []; for (i = 0; i < 9; i++) { var a0 = Math.floor(R() * nOut); SIG.push({ a: a0, b: adj[a0][0], p: R(), sp: .9 + R() * 1.1 }); }
    var FREE = []; for (i = 0; i < 26; i++) { var an = R() * TAU, sv = 2.5 + R() * 4.5; FREE.push({ x: -20 + R() * 140, y: -15 + R() * 126, vx: Math.cos(an) * sv, vy: Math.sin(an) * sv, r: .35 + R() * .5 }); }
    var CYCLE = 20, FORM = 3.8, OUTAT = 16.2;
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(v) { v = clamp(v); return 1 - Math.pow(1 - v, 3); }

    function Brain(box) { this.box = box; this.cv = box.querySelector('canvas'); this.ctx = this.cv.getContext('2d'); this.visible = false; this.t0 = null; this.size(); }
    Brain.prototype.size = function () {
      var w = this.cv.clientWidth || this.box.clientWidth, h = this.cv.clientHeight || this.box.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = w; this.h = h; this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr); this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.s = Math.min(w / 124, h / 116); this.ox = (w - 100 * this.s) / 2; this.oy = (h - 98 * this.s) / 2;
    };
    Brain.prototype.draw = function (t, dt, frozen) {
      var c = this.ctx, s = this.s, ox = this.ox, oy = this.oy, i, p, e, a, f, q;
      var F = frozen ? 1 : clamp((t - FORM + .6) / .8) * (1 - clamp((t - OUTAT) / .9));
      var fade = frozen ? 1 : 1 - clamp((t - OUTAT) / 1.1);
      c.clearRect(0, 0, this.w, this.h);
      for (i = 0; i < N.length; i++) {
        p = N[i];
        var k = frozen ? 1 : t < OUTAT ? ease((t - p.d) / 2.1) : 1 - Math.pow(clamp((t - OUTAT - p.d * .35) / 2.2), 2);
        var sx = 50 + Math.cos(p.sa) * p.sr, sy = 48 + Math.sin(p.sa) * p.sr * .8, wob = p.word ? .12 : .7;
        var tx = p.tx + Math.sin(t * .7 + p.ph) * wob, ty = p.ty + Math.cos(t * .6 + p.ph2) * wob;
        p.x = ox + (sx + (tx - sx) * k) * s; p.y = oy + (sy + (ty - sy) * k) * s;
      }
      for (i = 0; i < TR.length; i++) {
        var tr = TR[i]; a = tr.lit ? .05 + .11 * Math.max(0, Math.sin(t * tr.sp + tr.ph)) : .028;
        c.fillStyle = 'rgba(60,160,255,' + (a * F).toFixed(3) + ')';
        c.beginPath(); c.moveTo(N[tr.v[0]].x, N[tr.v[0]].y); c.lineTo(N[tr.v[1]].x, N[tr.v[1]].y); c.lineTo(N[tr.v[2]].x, N[tr.v[2]].y); c.closePath(); c.fill();
      }
      // connessioni della rete (i tratti delle lettere sono connessioni come le altre)
      c.lineCap = 'round'; c.lineJoin = 'round';
      for (i = 0; i < ED.length; i++) {
        e = ED[i]; f = frozen ? 1 : clamp((t - e.t0) / .55); if (f <= 0 || fade <= 0) continue;
        p = N[e.a]; q = N[e.b];
        c.strokeStyle = 'rgba(150,215,255,' + ((e.out ? .95 : e.word ? .5 : .4) * fade).toFixed(3) + ')'; c.lineWidth = e.out ? Math.max(1.4, s * .42) : Math.max(.8, s * .16);
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f); c.stroke();
      }
      // puntini liberi che si collegano alla figura
      c.lineWidth = 1;
      for (i = 0; i < FREE.length; i++) {
        p = FREE[i]; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -22) p.x = 122; else if (p.x > 122) p.x = -22; if (p.y < -18) p.y = 114; else if (p.y > 114) p.y = -18;
        var fx = ox + p.x * s, fy = oy + p.y * s, lim2 = 17 * s;
        for (var m = 0; m < nOut; m++) { q = N[m]; var dd = Math.sqrt((q.x - fx) * (q.x - fx) + (q.y - fy) * (q.y - fy)); if (dd < lim2) { c.strokeStyle = 'rgba(120,200,255,' + ((1 - dd / lim2) * .4).toFixed(3) + ')'; c.beginPath(); c.moveTo(fx, fy); c.lineTo(q.x, q.y); c.stroke(); } }
        for (m = i + 1; m < FREE.length; m++) { q = FREE[m]; var gx = ox + q.x * s, gy = oy + q.y * s, d3 = Math.sqrt((gx - fx) * (gx - fx) + (gy - fy) * (gy - fy)); if (d3 < lim2 * 1.3) { c.strokeStyle = 'rgba(120,200,255,' + ((1 - d3 / (lim2 * 1.3)) * .3).toFixed(3) + ')'; c.beginPath(); c.moveTo(fx, fy); c.lineTo(gx, gy); c.stroke(); } }
        c.fillStyle = 'rgba(170,225,255,.75)'; c.beginPath(); c.arc(fx, fy, Math.max(1, p.r * s), 0, TAU); c.fill();
      }
      // ricalco della scritta: le stesse connessioni si accendono una dopo l'altra
      if (fade > 0) for (var pass = 0; pass < 2; pass++) for (i = 0; i < ED.length; i++) {
        e = ED[i]; if (!e.word) continue;
        f = frozen ? 1 : clamp((t - e.wt) / .32); if (f <= 0) continue;
        p = N[e.a]; q = N[e.b];
        if (pass === 0) { c.strokeStyle = (e.blue ? 'rgba(18,181,251,' : 'rgba(110,195,255,') + (.2 * fade).toFixed(3) + ')'; c.lineWidth = Math.max(5, 2.5 * s); }
        else { c.strokeStyle = (e.blue ? 'rgba(45,180,255,' : 'rgba(242,250,255,') + fade.toFixed(3) + ')'; c.lineWidth = Math.max(2, .85 * s); }
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f); c.stroke();
      }
      // nodi luminosi
      c.globalCompositeOperation = 'lighter';
      for (i = 0; i < N.length; i++) {
        p = N[i]; var rr = Math.max(p.word ? .9 : 1.1, (p.big ? p.r * 1.9 : p.r) * s), pulse = .6 + .4 * Math.sin(t * 1.6 + p.ph);
        if (!p.word) { c.fillStyle = 'rgba(60,170,255,' + ((p.big ? .22 : .12) * pulse).toFixed(3) + ')'; c.beginPath(); c.arc(p.x, p.y, rr * (p.big ? 3.6 : 2.8), 0, TAU); c.fill(); }
        c.fillStyle = 'rgba(190,232,255,' + (p.word ? .85 : .75 + .25 * pulse).toFixed(3) + ')'; c.beginPath(); c.arc(p.x, p.y, rr, 0, TAU); c.fill();
      }
      // segnali che corrono lungo le connessioni
      if (F > 0) for (i = 0; i < SIG.length; i++) {
        var g = SIG[i]; g.p += g.sp * dt;
        if (g.p >= 1) { var nx = adj[g.b], pick = nx[Math.floor(Math.random() * nx.length)]; if (pick === g.a && nx.length > 1) pick = nx[(nx.indexOf(pick) + 1) % nx.length]; g.a = g.b; g.b = pick; g.p = 0; }
        p = N[g.a]; q = N[g.b]; var gxx = p.x + (q.x - p.x) * g.p, gyy = p.y + (q.y - p.y) * g.p;
        c.fillStyle = 'rgba(90,200,255,' + (.3 * F).toFixed(3) + ')'; c.beginPath(); c.arc(gxx, gyy, 2.6 * s, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,' + (.95 * F).toFixed(3) + ')'; c.beginPath(); c.arc(gxx, gyy, Math.max(1.4, .75 * s), 0, TAU); c.fill();
      }
      c.globalCompositeOperation = 'source-over';
    };
    var brains = boxes.map(function (b) { return new Brain(b); });
    if (reduce) { brains.forEach(function (b) { b.draw(8, 0, true); }); return; }
    if ('IntersectionObserver' in window) {
      var bio = new IntersectionObserver(function (en) { en.forEach(function (x) { brains.forEach(function (b) { if (b.box === x.target) { b.visible = x.isIntersecting; if (x.isIntersecting && b.t0 === null) b.t0 = performance.now(); } }); }); }, { threshold: .15 });
      brains.forEach(function (b) { bio.observe(b.box); });
    } else brains.forEach(function (b) { b.visible = true; b.t0 = performance.now(); });
    if ('ResizeObserver' in window) { var bro = new ResizeObserver(function () { brains.forEach(function (b) { b.size(); }); }); brains.forEach(function (b) { bro.observe(b.box); }); }
    var lastB = 0;
    (function loop(now) {
      requestAnimationFrame(loop);
      var dt = (now - lastB) / 1000;
      if (doc.hidden || dt < .025) return;
      lastB = now; if (dt > .1) dt = .1;
      brains.forEach(function (b) { if (b.visible && b.t0 !== null) b.draw(((now - b.t0) / 1000) % CYCLE, dt, false); });
    })(0);
  })();

  // modulo contatti: prepara un'email, non invia nulla
  var form = doc.querySelector('[data-contact]');
  if (form) {
    var tema = new URLSearchParams(location.search).get('tema');
    var sel = form.elements.tema;
    if (tema && [].some.call(sel.options, function (o) { return o.value === tema; })) sel.value = tema;
    var err = form.querySelector('.form-err'), ok = form.querySelector('.form-ok'), fb = form.querySelector('[data-fallback]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, bad = null;
      [f.nome, f.messaggio].forEach(function (el) {
        var empty = !el.value.trim();
        el.setAttribute('aria-invalid', String(empty));
        if (empty && !bad) bad = el;
      });
      err.hidden = !bad; ok.hidden = true;
      if (bad) { bad.focus(); return; }
      var topic = sel.options[sel.selectedIndex].text;
      var lines = [f.messaggio.value.trim(), '', '—', f.nome.value.trim()];
      if (f.azienda.value.trim()) lines.push(f.azienda.value.trim());
      if (f.telefono.value.trim()) lines.push('Tel. ' + f.telefono.value.trim());
      var via = (e.submitter && e.submitter.getAttribute('data-via')) || 'email';
      var href = via === 'wa'
        ? 'https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(['Richiesta dal sito — ' + topic, ''].concat(lines).join('\n'))
        : 'mailto:' + form.dataset.to + '?subject=' + encodeURIComponent('Richiesta dal sito — ' + topic) + '&body=' + encodeURIComponent(lines.join('\n'));
      form.dataset.mailto = href; fb.href = href; ok.hidden = false;
      if (!form.hasAttribute('data-no-open')) location.href = href;
    });
  }
  // SimplyX Notoria: una rete di puntini si raccoglie e compone la parola "notoria", poi si scioglie e ricomincia.
  (function () {
    var boxes = [].slice.call(doc.querySelectorAll('[data-noto]'));
    if (!boxes.length || !window.requestAnimationFrame) return;
    var COL = ['#ffffff', '#ffbe0b', '#ff5a1f', '#ffffff'], FAM = '"Bricolage Grotesque","Avenir Next","Segoe UI",system-ui,sans-serif', CICLO = 14000;
    function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function Noto(box) { this.box = box; this.cv = box.querySelector('canvas'); this.cx = this.cv.getContext('2d'); this.visible = false; this.ready = false; this.pts = []; }
    Noto.prototype.build = function () {
      var W = this.box.clientWidth, H = this.box.clientHeight; if (!W || !H) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2); this.W = W; this.H = H;
      this.cv.width = W * dpr; this.cv.height = H * dpr; this.cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var o = doc.createElement('canvas'); o.width = W; o.height = H; var c = o.getContext('2d'), px = Math.round(H * .86);
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '800 ' + px + 'px ' + FAM;
      var lw = c.measureText('notoria').width; if (lw > W * .94) { px = Math.floor(px * W * .94 / lw); c.font = '800 ' + px + 'px ' + FAM; }
      c.fillText('notoria', W / 2, H / 2 + px * .05);
      var d = c.getImageData(0, 0, W, H).data, step = Math.max(4.2, W / 109), out = [], x, y, k = 0, s = this.s = W / 980;
      for (y = step / 2; y < H; y += step) for (x = step / 2; x < W; x += step) if (d[((y | 0) * W + (x | 0)) * 4 + 3] > 120) {
        out.push({ tx: x + (Math.random() - .5) * step * .33, ty: y + (Math.random() - .5) * step * .33, sx: Math.random() * W, sy: Math.random() * H, fa: Math.random() * 6.28, ve: .3 + Math.random() * .6, r: Math.max(k % 9 === 0 ? 1.7 : 1.05, (k % 9 === 0 ? 3.2 : 1.9) * s), c: COL[k % 4], rit: Math.random() * .35 }); k++;
      }
      this.pts = out; this.link = step * step * 4.1; this.ready = true;
    };
    Noto.prototype.draw = function (ms, still) {
      if (!this.ready) return;
      var cx = this.cx, P = this.pts, s = Math.max(.45, this.s), f = (ms % CICLO) / CICLO, k, i, j, p, pos = [];
      if (still) k = 1; else if (f < .42) k = 1; else if (f < .58) k = 1 - (f - .42) / .16; else if (f < .68) k = 0; else k = (f - .68) / .32;
      cx.clearRect(0, 0, this.W, this.H);
      for (i = 0; i < P.length; i++) {
        p = P[i]; var kk = ease(Math.max(0, Math.min(1, (k - p.rit) / .65)));
        var vx = p.sx + Math.cos(p.fa + ms * .0004 * p.ve) * 46 * s, vy = p.sy + Math.sin(p.fa * 1.3 + ms * .0005 * p.ve) * 34 * s;
        var mx = p.tx + Math.cos(p.fa + ms * .002) * 1.2 * s, my = p.ty + Math.sin(p.fa + ms * .002) * 1.2 * s;
        pos.push([vx + (mx - vx) * kk, vy + (my - vy) * kk]);
      }
      cx.lineWidth = 1;
      for (i = 0; i < pos.length; i++) for (j = i + 1; j < Math.min(pos.length, i + 26); j++) {
        var dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1], q = dx * dx + dy * dy;
        if (q < this.link) { cx.strokeStyle = 'rgba(255,214,150,' + (.42 * (1 - q / this.link)).toFixed(3) + ')'; cx.beginPath(); cx.moveTo(pos[i][0], pos[i][1]); cx.lineTo(pos[j][0], pos[j][1]); cx.stroke(); }
      }
      for (i = 0; i < pos.length; i++) { p = P[i]; cx.fillStyle = p.c; cx.beginPath(); cx.arc(pos[i][0], pos[i][1], p.r, 0, 6.2832); cx.fill(); }
    };
    var all = boxes.map(function (b) { return new Noto(b); }), started = false;
    function start() {
      if (started) return; started = true;
      all.forEach(function (n) { n.build(); n.draw(0, true); });
      if ('ResizeObserver' in window) { var ro = new ResizeObserver(function () { all.forEach(function (n) { if (n.box.clientWidth !== n.W) { n.build(); n.draw(0, true); } }); }); all.forEach(function (n) { ro.observe(n.box); }); }
      if (reduce || !('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (en) { en.forEach(function (x) { all.forEach(function (n) { if (n.box === x.target) { n.visible = x.isIntersecting; if (x.isIntersecting && !n.t0) n.t0 = performance.now(); } }); }); }, { threshold: .05 });
      all.forEach(function (n) { io.observe(n.box); });
      (function loop(now) { all.forEach(function (n) { if (n.visible) n.draw(now - n.t0, false); }); requestAnimationFrame(loop); })(performance.now());
    }
    // il carattere del marchio Notoria si scarica solo qui; se non arriva, la scritta usa il carattere di sistema
    var url = boxes[0].getAttribute('data-font');
    if (window.FontFace && doc.fonts && url) { new FontFace('Bricolage Grotesque', 'url(' + url + ') format("woff2")', { weight: '200 800' }).load().then(function (ff) { doc.fonts.add(ff); start(); }, start); setTimeout(start, 2500); } else start();
  })();
  // SimplyX Notoria, integrazioni: fili e puntini dei due schemi animati (stessa logica del sito notoria-ai.com).
  (function () {
    var NS = 'http://www.w3.org/2000/svg';
    if (!doc.querySelector('.flusso')) return;
  function crea(nome, attr){ var e = doc.createElementNS(NS, nome); for (var k in attr) e.setAttribute(k, attr[k]); return e; }
    function n1(v){ return Math.round(v * 10) / 10; }

    function disegna(box){
      var svg = box.querySelector('.fili'), o = box.getBoundingClientRect(), k = 0;
      if (!o.width) return;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('viewBox', '0 0 ' + n1(o.width) + ' ' + n1(o.height));
      function R(nome){ var e = box.querySelector('[data-n="' + nome + '"]').getBoundingClientRect(); return { l: n1(e.left - o.left), t: n1(e.top - o.top), r: n1(e.right - o.left), b: n1(e.bottom - o.top), cx: n1((e.left + e.right) / 2 - o.left), cy: n1((e.top + e.bottom) / 2 - o.top) }; }
      function filo(d, classe, quanti, durata, sfasa){
        svg.appendChild(crea('path', { d: d, 'class': classe }));
        if (reduce) return;
        for (var i = 0; i < quanti; i++) {
          var c = crea('circle', { r: 4.5, 'class': 'p' + (k++ % 3) });
          c.appendChild(crea('animateMotion', { dur: durata + 's', begin: '-' + n1(sfasa + i * durata / quanti) + 's', repeatCount: 'indefinite', path: d }));
          svg.appendChild(c);
        }
      }
      (box.getAttribute('data-flusso') || '').split(',').filter(Boolean).forEach(function(coppia, i){
        var p = coppia.split('>'), a = R(p[0]), b = R(p[1]), m, d;
        if (b.l >= a.r - 2) { m = n1((b.l - a.r) / 2); d = 'M' + a.r + ',' + a.cy + ' C' + (a.r + m) + ',' + a.cy + ' ' + (b.l - m) + ',' + b.cy + ' ' + b.l + ',' + b.cy; }
        else { m = n1((b.t - a.b) / 2); d = 'M' + a.cx + ',' + a.b + ' C' + a.cx + ',' + (a.b + m) + ' ' + b.cx + ',' + (b.t - m) + ' ' + b.cx + ',' + b.t; }
        filo(d, 'f', 2, 2.8, i * 0.45);
      });
      var rit = box.getAttribute('data-ritorno');
      if (rit) {
        var q = rit.split('>'), a = R(q[0]), b = R(q[1]), r = 16, d, y, x;
        if (a.l >= b.r - 2) { y = n1(o.height - 24); d = 'M' + a.cx + ',' + a.b + ' L' + a.cx + ',' + (y - r) + ' Q' + a.cx + ',' + y + ' ' + (a.cx - r) + ',' + y + ' L' + (b.cx + r) + ',' + y + ' Q' + b.cx + ',' + y + ' ' + b.cx + ',' + (y - r) + ' L' + b.cx + ',' + b.b; }
        else { x = 10; d = 'M' + a.l + ',' + a.cy + ' L' + (x + r) + ',' + a.cy + ' Q' + x + ',' + a.cy + ' ' + x + ',' + (a.cy - r) + ' L' + x + ',' + (b.cy + r) + ' Q' + x + ',' + b.cy + ' ' + (x + r) + ',' + b.cy + ' L' + b.l + ',' + b.cy; }
        filo(d, 'f torna', 3, 7.5, 1);
      }
      var an = box.getAttribute('data-anello');
      if (an) {
        var z = an.split('>'), s = R(z[0]), e = R(z[1]), g = parseFloat(getComputedStyle(box).getPropertyValue('--g')) || 48, d2;
        if (e.l >= s.r - 2) d2 = 'M' + s.cx + ',' + (s.cy - g) + ' L' + e.cx + ',' + (e.cy - g) + ' A' + g + ',' + g + ' 0 0 1 ' + e.cx + ',' + (e.cy + g) + ' L' + s.cx + ',' + (s.cy + g) + ' A' + g + ',' + g + ' 0 0 1 ' + s.cx + ',' + (s.cy - g) + ' Z';
        else d2 = 'M' + (s.cx + g) + ',' + s.cy + ' L' + (e.cx + g) + ',' + e.cy + ' A' + g + ',' + g + ' 0 0 1 ' + (e.cx - g) + ',' + e.cy + ' L' + (s.cx - g) + ',' + s.cy + ' A' + g + ',' + g + ' 0 0 1 ' + (s.cx + g) + ',' + s.cy + ' Z';
        filo(d2, 'f', 8, 11, 0);
      }
    }

    var schemi = Array.prototype.slice.call(doc.querySelectorAll('.flusso'));
    schemi.forEach(function(box){
      var attesa = 0;
      function rifai(){ cancelAnimationFrame(attesa); attesa = requestAnimationFrame(function(){ disegna(box); }); }
      rifai();
      if ('ResizeObserver' in window) new ResizeObserver(rifai).observe(box);
      else window.addEventListener('resize', rifai);
      if ('IntersectionObserver' in window && !reduce) new IntersectionObserver(function(es){ es.forEach(function(x){ var s = box.querySelector('.fili'); if (s.pauseAnimations) { if (x.isIntersecting) s.unpauseAnimations(); else s.pauseAnimations(); } }); }, { rootMargin: '80px' }).observe(box);
    });

    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function(){ schemi.forEach(function (b) { disegna(b); }); });
    window.addEventListener('load', function () { schemi.forEach(function (b) { disegna(b); }); });
  })();
})();

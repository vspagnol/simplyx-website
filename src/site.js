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

  // cervello: puntini che arrivano da lontano, tracciano linee e formano triangoli fino a comporre la figura; poi si scompone e ricomincia
  (function () {
    var boxes = [].slice.call(doc.querySelectorAll('[data-brain]'));
    if (!boxes.length || !window.requestAnimationFrame) return;
    var TAU = Math.PI * 2, seed = 11;
    function R() { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; }
    var OUT = [[6,52],[4,44],[6,35],[10,27],[16,20],[24,14],[33,10],[43,7],[54,6],[64,8],[73,12],[81,17],[88,24],[93,32],[96,41],[96,50],[93,58],[88,64],[84,70],[76,75],[67,76],[60,73],[58,80],[60,90],[54,92],[50,82],[48,72],[40,70],[32,66],[26,60],[18,60],[10,58]];
    function inside(x, y) { for (var i = 0, j = OUT.length - 1, c = false; i < OUT.length; j = i++) { var a = OUT[i], b = OUT[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
    var V = OUT.map(function (p) { return [p[0], p[1]]; }), nOut = OUT.length, i, j, k;
    for (k = 0; k < 5000 && V.length < 96; k++) {
      var x = 4 + R() * 92, y = 6 + R() * 86, ok = inside(x, y);
      for (i = 0; ok && i < V.length; i++) if ((V[i][0] - x) * (V[i][0] - x) + (V[i][1] - y) * (V[i][1] - y) < (i < nOut ? 36 : 64)) ok = false;
      if (ok) V.push([x, y]);
    }
    function circ(a, b, c) { var d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])), a2 = a[0] * a[0] + a[1] * a[1], b2 = b[0] * b[0] + b[1] * b[1], c2 = c[0] * c[0] + c[1] * c[1], ux = (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / d, uy = (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / d; return [ux, uy, (a[0] - ux) * (a[0] - ux) + (a[1] - uy) * (a[1] - uy)]; }
    var n = V.length, W = V.concat([[-900, -900], [1100, -900], [100, 1900]]), T = [{ v: [n, n + 1, n + 2], c: circ(W[n], W[n + 1], W[n + 2]) }];
    for (i = 0; i < n; i++) {
      var bad = [], keep = [], E = {};
      T.forEach(function (t) { ((W[i][0] - t.c[0]) * (W[i][0] - t.c[0]) + (W[i][1] - t.c[1]) * (W[i][1] - t.c[1]) < t.c[2] ? bad : keep).push(t); });
      bad.forEach(function (t) { for (var e = 0; e < 3; e++) { var a = t.v[e], b = t.v[(e + 1) % 3], key = a < b ? a + '_' + b : b + '_' + a; E[key] = E[key] ? null : [a, b]; } });
      T = keep;
      for (var key in E) if (E[key]) T.push({ v: [E[key][0], E[key][1], i], c: circ(W[E[key][0]], W[E[key][1]], W[i]) });
    }
    var TR = [], ED = [], seen = {}, adj = V.map(function () { return []; });
    T.forEach(function (t) {
      var v = t.v; if (v[0] >= n || v[1] >= n || v[2] >= n) return;
      if (!inside((V[v[0]][0] + V[v[1]][0] + V[v[2]][0]) / 3, (V[v[0]][1] + V[v[1]][1] + V[v[2]][1]) / 3)) return;
      TR.push({ v: v, lit: R() < .34, ph: R() * TAU, sp: .5 + R() * .7 });
      for (var e = 0; e < 3; e++) { var a = v[e], b = v[(e + 1) % 3], key = a < b ? a + '_' + b : b + '_' + a; if (seen[key]) continue; seen[key] = 1; ED.push({ a: a, b: b, out: false, t0: 1 + (Math.min(V[a][0], V[b][0]) / 100) * 1.9 + R() * .35 }); adj[a].push(b); adj[b].push(a); }
    });
    for (i = 0; i < nOut; i++) { j = (i + 1) % nOut; var kk = i < j ? i + '_' + j : j + '_' + i; if (!seen[kk]) { seen[kk] = 1; ED.push({ a: i, b: j, out: true, t0: 1 + V[i][0] / 100 * 1.9 }); adj[i].push(j); adj[j].push(i); } else ED.forEach(function (e) { if ((e.a === i && e.b === j) || (e.a === j && e.b === i)) e.out = true; }); }
    var N = V.map(function (p, idx) { return { tx: p[0], ty: p[1], out: idx < nOut, r: idx < nOut ? .9 + R() * .7 : .55 + R() * .75, big: R() < .13, d: p[0] / 100 * 1.2 + R() * .5, ph: R() * TAU, ph2: R() * TAU, sa: R() * TAU, sr: 70 + R() * 70, x: 0, y: 0, k: 0 }; });
    var SIG = []; for (i = 0; i < 9; i++) { var a0 = Math.floor(R() * n); SIG.push({ a: a0, b: adj[a0][0], p: R(), sp: .9 + R() * 1.1 }); }
    var FREE = []; for (i = 0; i < 26; i++) { var an = R() * TAU, sv = 2.5 + R() * 4.5; FREE.push({ x: -20 + R() * 140, y: -15 + R() * 126, vx: Math.cos(an) * sv, vy: Math.sin(an) * sv, r: .35 + R() * .5 }); }
    var CYCLE = 18, FORM = 3.8, OUTAT = 14.5;
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(v) { v = clamp(v); return 1 - Math.pow(1 - v, 3); }

    function Brain(box) {
      this.box = box; this.cv = box.querySelector('canvas'); this.ctx = this.cv.getContext('2d'); this.visible = false; this.t0 = null; this.size();
    }
    Brain.prototype.size = function () {
      var w = this.box.clientWidth, h = this.box.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = w; this.h = h; this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr); this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.s = Math.min(w / 136, h / 128); this.ox = (w - 100 * this.s) / 2; this.oy = (h - 98 * this.s) / 2;
    };
    Brain.prototype.draw = function (t, dt, frozen) {
      var c = this.ctx, s = this.s, ox = this.ox, oy = this.oy, i, p, e, a, f, q;
      var F = frozen ? 1 : clamp((t - FORM + .6) / .8) * (1 - clamp((t - OUTAT) / .9));
      c.clearRect(0, 0, this.w, this.h);
      for (i = 0; i < N.length; i++) {
        p = N[i];
        var k = frozen ? 1 : t < OUTAT ? ease((t - p.d) / 2.1) : 1 - Math.pow(clamp((t - OUTAT - p.d * .35) / 2.2), 2);
        var sx = 50 + Math.cos(p.sa) * p.sr, sy = 48 + Math.sin(p.sa) * p.sr * .8;
        var tx = p.tx + Math.sin(t * .7 + p.ph) * .7, ty = p.ty + Math.cos(t * .6 + p.ph2) * .7;
        p.k = k; p.x = ox + (sx + (tx - sx) * k) * s; p.y = oy + (sy + (ty - sy) * k) * s;
      }
      // triangoli
      for (i = 0; i < TR.length; i++) {
        var tr = TR[i]; a = tr.lit ? .05 + .11 * Math.max(0, Math.sin(t * tr.sp + tr.ph)) : .028;
        c.fillStyle = 'rgba(60,160,255,' + (a * F).toFixed(3) + ')';
        c.beginPath(); c.moveTo(N[tr.v[0]].x, N[tr.v[0]].y); c.lineTo(N[tr.v[1]].x, N[tr.v[1]].y); c.lineTo(N[tr.v[2]].x, N[tr.v[2]].y); c.closePath(); c.fill();
      }
      // linee che si tracciano
      c.lineCap = 'round';
      for (i = 0; i < ED.length; i++) {
        e = ED[i]; f = frozen ? 1 : clamp((t - e.t0) / .55); if (f <= 0) continue;
        a = (e.out ? .95 : .42) * (frozen ? 1 : 1 - clamp((t - OUTAT) / 1.1)); if (a <= 0) continue;
        p = N[e.a]; q = N[e.b];
        c.strokeStyle = 'rgba(150,215,255,' + a.toFixed(3) + ')'; c.lineWidth = e.out ? Math.max(1.4, s * .42) : Math.max(.8, s * .16);
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f); c.stroke();
      }
      // puntini liberi che si collegano alla figura
      c.lineWidth = 1;
      for (i = 0; i < FREE.length; i++) {
        p = FREE[i]; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < -22) p.x = 122; else if (p.x > 122) p.x = -22; if (p.y < -18) p.y = 114; else if (p.y > 114) p.y = -18;
        var fx = ox + p.x * s, fy = oy + p.y * s, lim = 17 * s;
        for (var m = 0; m < N.length; m += 1) { q = N[m]; var dd = Math.sqrt((q.x - fx) * (q.x - fx) + (q.y - fy) * (q.y - fy)); if (dd < lim) { c.strokeStyle = 'rgba(120,200,255,' + ((1 - dd / lim) * .4).toFixed(3) + ')'; c.beginPath(); c.moveTo(fx, fy); c.lineTo(q.x, q.y); c.stroke(); } }
        for (m = i + 1; m < FREE.length; m++) { q = FREE[m]; var gx = ox + q.x * s, gy = oy + q.y * s, d3 = Math.sqrt((gx - fx) * (gx - fx) + (gy - fy) * (gy - fy)); if (d3 < lim * 1.3) { c.strokeStyle = 'rgba(120,200,255,' + ((1 - d3 / (lim * 1.3)) * .3).toFixed(3) + ')'; c.beginPath(); c.moveTo(fx, fy); c.lineTo(gx, gy); c.stroke(); } }
        c.fillStyle = 'rgba(170,225,255,.75)'; c.beginPath(); c.arc(fx, fy, Math.max(1, p.r * s), 0, TAU); c.fill();
      }
      // nodi luminosi
      c.globalCompositeOperation = 'lighter';
      for (i = 0; i < N.length; i++) {
        p = N[i]; var rr = Math.max(1.1, (p.big ? p.r * 1.9 : p.r) * s), pulse = .6 + .4 * Math.sin(t * 1.6 + p.ph);
        c.fillStyle = 'rgba(60,170,255,' + ((p.big ? .22 : .12) * pulse).toFixed(3) + ')'; c.beginPath(); c.arc(p.x, p.y, rr * (p.big ? 3.6 : 2.8), 0, TAU); c.fill();
        c.fillStyle = 'rgba(190,232,255,' + (.75 + .25 * pulse).toFixed(3) + ')'; c.beginPath(); c.arc(p.x, p.y, rr, 0, TAU); c.fill();
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
      var href = 'mailto:' + form.dataset.to + '?subject=' + encodeURIComponent('Richiesta dal sito — ' + topic) + '&body=' + encodeURIComponent(lines.join('\n'));
      form.dataset.mailto = href; fb.href = href; ok.hidden = false;
      if (!form.hasAttribute('data-no-open')) location.href = href;
    });
  }
})();

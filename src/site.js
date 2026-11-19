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

  // fondo animato delle sezioni chiare: rete di punti e linee che formano triangoli di misure diverse
  (function () {
    var hosts = [].slice.call(doc.querySelectorAll('.sec-white, .phead:not(.phead-dark)'));
    if (!hosts.length || !window.requestAnimationFrame) return;
    var meshes = [], rnd = Math.random, TAU = Math.PI * 2;
    function steps(len, min, max) { var a = [-60], x = -60; while (x < len + 60) { x += min + rnd() * (max - min); a.push(x); } return a; }
    function Mesh(host) {
      var cv = doc.createElement('canvas'); cv.className = 'mesh'; cv.setAttribute('aria-hidden', 'true');
      host.insertBefore(cv, host.firstChild);
      this.host = host; this.cv = cv; this.ctx = cv.getContext('2d'); this.visible = false; this.build();
    }
    Mesh.prototype.build = function () {
      var w = this.host.offsetWidth, h = this.host.offsetHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = w; this.h = h; this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var small = w < 700, xs = steps(w, small ? 70 : 90, small ? 170 : 240), ys = steps(h, small ? 70 : 90, small ? 170 : 230);
      var cols = xs.length, pts = [], tris = [], edges = [], i, j;
      for (j = 0; j < ys.length; j++) for (i = 0; i < cols; i++) {
        var sx = (xs[Math.min(i + 1, cols - 1)] - xs[Math.max(i - 1, 0)]) / 2, sy = (ys[Math.min(j + 1, ys.length - 1)] - ys[Math.max(j - 1, 0)]) / 2;
        pts.push({ x0: xs[i] + (rnd() - .5) * sx * .55, y0: ys[j] + (rnd() - .5) * sy * .55, ax: 8 + rnd() * 20, ay: 8 + rnd() * 20, px: rnd() * TAU, py: rnd() * TAU, vx: .12 + rnd() * .22, vy: .12 + rnd() * .22, r: 1.2 + rnd() * 1.6, hot: rnd() < .12, ph: rnd() * TAU, x: 0, y: 0 });
      }
      for (j = 0; j < ys.length - 1; j++) for (i = 0; i < cols - 1; i++) {
        var a = j * cols + i, b = a + 1, c = a + cols, d = c + 1, flip = rnd() < .5;
        edges.push([a, b], [a, c], flip ? [a, d] : [b, c]);
        (flip ? [[a, b, d], [a, d, c]] : [[a, b, c], [b, d, c]]).forEach(function (t) { tris.push({ p: t, lit: rnd() < .22, ph: rnd() * TAU, v: .25 + rnd() * .35 }); });
      }
      this.pts = pts; this.tris = tris; this.edges = edges;
    };
    Mesh.prototype.draw = function (t) {
      var c = this.ctx, P = this.pts, i, p, e, tr, a;
      c.clearRect(0, 0, this.w, this.h);
      for (i = 0; i < P.length; i++) { p = P[i]; p.x = p.x0 + Math.sin(t * p.vx + p.px) * p.ax; p.y = p.y0 + Math.cos(t * p.vy + p.py) * p.ay; }
      for (i = 0; i < this.tris.length; i++) {
        tr = this.tris[i]; if (!tr.lit) continue;
        a = Math.sin(t * tr.v + tr.ph); if (a <= 0) continue;
        c.fillStyle = 'rgba(18,150,240,' + (a * .075).toFixed(3) + ')';
        c.beginPath(); c.moveTo(P[tr.p[0]].x, P[tr.p[0]].y); c.lineTo(P[tr.p[1]].x, P[tr.p[1]].y); c.lineTo(P[tr.p[2]].x, P[tr.p[2]].y); c.closePath(); c.fill();
      }
      c.strokeStyle = 'rgba(0,113,227,.2)'; c.lineWidth = 1; c.beginPath();
      for (i = 0; i < this.edges.length; i++) { e = this.edges[i]; c.moveTo(P[e[0]].x, P[e[0]].y); c.lineTo(P[e[1]].x, P[e[1]].y); }
      c.stroke();
      for (i = 0; i < P.length; i++) {
        p = P[i];
        if (p.hot) { a = .5 + .5 * Math.sin(t * 1.4 + p.ph); c.fillStyle = 'rgba(18,181,251,' + (.12 * a).toFixed(3) + ')'; c.beginPath(); c.arc(p.x, p.y, p.r + 5 + a * 3, 0, TAU); c.fill(); c.fillStyle = 'rgba(18,181,251,' + (.55 + .4 * a).toFixed(3) + ')'; }
        else c.fillStyle = 'rgba(0,113,227,.38)';
        c.beginPath(); c.arc(p.x, p.y, p.hot ? p.r + .6 : p.r, 0, TAU); c.fill();
      }
    };
    hosts.forEach(function (h) { meshes.push(new Mesh(h)); });
    if (reduce) { meshes.forEach(function (m) { m.draw(0); }); return; }
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (en) { en.forEach(function (x) { meshes.forEach(function (m) { if (m.host === x.target) m.visible = x.isIntersecting; }); }); }, { rootMargin: '100px' });
      meshes.forEach(function (m) { vio.observe(m.host); });
    } else meshes.forEach(function (m) { m.visible = true; });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { meshes.forEach(function (m) { if (m.host.offsetWidth !== m.w || m.host.offsetHeight !== m.h) m.build(); }); }, 200); });
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(function () { meshes.forEach(function (m) { if (Math.abs(m.host.offsetHeight - m.h) > 4) m.build(); }); }); meshes.forEach(function (m) { ro.observe(m.host); }); }
    var last = 0;
    (function loop(now) {
      requestAnimationFrame(loop);
      if (doc.hidden || now - last < 33) return;
      last = now;
      for (var k = 0; k < meshes.length; k++) if (meshes[k].visible) meshes[k].draw(now / 1000);
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

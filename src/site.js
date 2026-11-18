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

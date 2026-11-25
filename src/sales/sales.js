/* Simplyx Sales: accesso e navigazione. I contenuti arrivano cifrati (contenuti.enc.json) e si aprono solo
   con utente e password: in questo file non c'è nessun testo riservato e nessuna password. */
(function () {
  'use strict';
  var D = null, busta = null, scheda = 'breve';
  var $ = function (i) { return document.getElementById(i); };
  var da64 = function (s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
  var a64 = function (x) { var a = new Uint8Array(x), s = ''; for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); };
  var ricorda = function (v) { try { if (v) sessionStorage.setItem('sales-k', v); else sessionStorage.removeItem('sales-k'); } catch (e) {} };
  var ricordata = function () { try { return sessionStorage.getItem('sales-k'); } catch (e) { return null; } };

  function carica() {
    if (busta) return Promise.resolve(busta);
    return fetch('contenuti.enc.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('rete'); return r.json(); }).then(function (j) { busta = j; return j; });
  }
  function deriva(utente, password, b) {
    var testo = new TextEncoder().encode(utente.trim().toLowerCase() + ':' + password);
    return crypto.subtle.importKey('raw', testo, 'PBKDF2', false, ['deriveBits'])
      .then(function (k) { return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: da64(b.salt), iterations: b.iter }, k, 256); });
  }
  function apri(bits, b) {
    return crypto.subtle.importKey('raw', bits, 'AES-GCM', false, ['decrypt'])
      .then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: da64(b.iv) }, k, da64(b.ct)); })
      .then(function (x) { return JSON.parse(new TextDecoder().decode(x)); });
  }

  function mostra() {
    if (!D) return;
    var v = (location.hash || '').slice(1); if (!D.nav.some(function (x) { return x[0] === v; })) v = 'inizio';
    $('nav').innerHTML = D.nav.map(function (x) { return '<a href="#' + x[0] + '"' + (x[0] === v ? ' aria-current="page"' : '') + '>' + x[1] + '</a>'; }).join('');
    var h = D.viste[v]; if (typeof h !== 'string') h = h[scheda] || h.breve;
    $('app').innerHTML = '<div class="vista">' + h + '</div>';
    var att = document.querySelector('#nav [aria-current]'); if (att && att.scrollIntoView) att.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function entra(dati) {
    D = dati; var e = $('entra'); if (e) e.remove();
    $('nav').hidden = false; $('esci').hidden = false; $('app').hidden = false; mostra();
  }

  var modulo = $('accesso'), err = $('err');
  modulo.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var u = $('u').value, p = $('p').value, b = modulo.querySelector('button');
    var no = function (m) { err.textContent = m; err.hidden = false; b.disabled = false; };
    if (!u.trim() || !p) return no('Scrivi utente e password.');
    if (!window.crypto || !crypto.subtle) return no('Questo browser non permette l\'accesso: apri la pagina con un browser aggiornato.');
    err.hidden = true; b.disabled = true;
    carica().then(function (bu) {
      return deriva(u, p, bu).then(function (bits) { return apri(bits, bu).then(function (d) { ricorda(a64(bits)); entra(d); }); })
        .catch(function () { no('Utente o password non corretti.'); });
    }, function () { no('Non riesco a caricare i contenuti. Controlla la connessione e riprova.'); });
  });
  $('esci').addEventListener('click', function () { ricorda(null); location.hash = ''; location.reload(); });
  window.addEventListener('hashchange', function () { scheda = 'breve'; mostra(); window.scrollTo(0, 0); });
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-scheda]');
    if (t) { scheda = t.getAttribute('data-scheda'); mostra(); return; }
    var c = ev.target.closest('.copia'); if (!c) return;
    var testo = c.closest('.copione').querySelector('.testo');
    var fatto = function () { c.textContent = 'Copiato'; c.classList.add('fatto'); setTimeout(function () { c.textContent = 'Copia'; c.classList.remove('fatto'); }, 1600); };
    var seleziona = function () { var r = document.createRange(); r.selectNodeContents(testo); var s = getSelection(); s.removeAllRanges(); s.addRange(r); c.textContent = 'Selezionato: copia'; };
    try { navigator.clipboard.writeText(testo.textContent).then(fatto, seleziona); } catch (x) { seleziona(); }
  });

  // chi è già entrato in questa scheda del browser non deve riscrivere la password a ogni ricarica
  var k = ricordata();
  if (k && window.crypto && crypto.subtle) carica().then(function (bu) { return apri(da64(k), bu); }).then(entra).catch(function () { ricorda(null); });
})();

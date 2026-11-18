// Switch Aziende / PMI. La scelta resta nell'URL (?view=pmi) e nel browser.
(function () {
  'use strict';
  var KEY = 'simplyx.view';
  var VIEWS = ['aziende', 'pmi'];

  function read() {
    var q = new URLSearchParams(location.search).get('view');
    if (VIEWS.indexOf(q) >= 0) return q;
    try { var s = localStorage.getItem(KEY); if (VIEWS.indexOf(s) >= 0) return s; } catch (e) {}
    return 'aziende';
  }

  function apply(view, push) {
    document.querySelectorAll('[data-view]').forEach(function (el) {
      el.hidden = el.getAttribute('data-view') !== view;
    });
    document.querySelectorAll('[data-set-view]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-view') === view));
    });
    // il cambio lingua mantiene la vista scelta
    document.querySelectorAll('a[data-keep-view]').forEach(function (a) {
      var u = new URL(a.getAttribute('href'), location.href);
      if (view === 'pmi') u.searchParams.set('view', 'pmi'); else u.searchParams.delete('view');
      a.setAttribute('href', u.pathname + u.search);
    });
    try { localStorage.setItem(KEY, view); } catch (e) {}
    if (push) {
      var url = new URL(location.href);
      if (view === 'pmi') url.searchParams.set('view', 'pmi'); else url.searchParams.delete('view');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set-view]');
    if (!b) return;
    apply(b.getAttribute('data-set-view'), true);
    window.scrollTo({ top: 0 });
  });

  apply(read(), false);
})();

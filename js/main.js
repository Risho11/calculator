/* CalcAnything — Shared JS */

(function () {
  'use strict';
  var toggle  = document.querySelector('.sidebar-toggle');
  var sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        sidebar.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
    });
  }
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
    if (a.getAttribute('href') === page) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });
  document.querySelectorAll('.advanced-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls') || 'adv-panel');
      if (!panel) return;
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });
})();

function showResult(cardEl, mainVal, label, rows) {
  if (!cardEl) return;
  cardEl.hidden = false;
  var mainEl = cardEl.querySelector('.calc-result-main'), labelEl = cardEl.querySelector('.calc-result-label'), rowsEl = cardEl.querySelector('.calc-result-rows');
  if (mainEl)  mainEl.textContent  = mainVal;
  if (labelEl) labelEl.textContent = label || '';
  if (rowsEl && rows) {
    rowsEl.innerHTML = '';
    rows.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'calc-result-row';
      div.innerHTML = '<span class="label">' + r[0] + '</span><span class="value">' + r[1] + '</span>';
      rowsEl.appendChild(div);
    });
  }
}

function fmtNum(n, decimals) {
  if (isNaN(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals !== undefined ? decimals : 2 });
}

function copyText(text, feedbackEl) {
  var done = function () { if (!feedbackEl) return; feedbackEl.textContent = 'Copied!'; setTimeout(function () { feedbackEl.textContent = ''; }, 2000); };
  if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); }); }
  else { fallbackCopy(text, done); }
}
function fallbackCopy(text, done) {
  var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;';
  document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch(e) {} document.body.removeChild(ta); if (done) done();
}

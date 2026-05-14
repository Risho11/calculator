(function () {
  'use strict';

  var tabs   = document.querySelectorAll('.disc-tab');
  var panels = document.querySelectorAll('.disc-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add('active');
    });
  });

  // Panel 1: original price + % off
  var calc1 = document.getElementById('calc-1');
  if (calc1) {
    calc1.addEventListener('click', function () {
      var orig = parseFloat(document.getElementById('d1-orig') && document.getElementById('d1-orig').value);
      var pct  = parseFloat(document.getElementById('d1-pct')  && document.getElementById('d1-pct').value);
      if (isNaN(orig) || isNaN(pct)) return;
      var saved = orig * pct / 100;
      var final = orig - saved;
      showResult(document.getElementById('result-1'), '$' + final.toFixed(2), 'Price after ' + pct + '% discount', [
        ['Original price', '$' + orig.toFixed(2)],
        ['Discount', pct + '% off'],
        ['You save', '$' + saved.toFixed(2)],
        ['Final price', '$' + final.toFixed(2)]
      ]);
    });
  }

  // Panel 2: what % off given original + sale price
  var calc2 = document.getElementById('calc-2');
  if (calc2) {
    calc2.addEventListener('click', function () {
      var orig = parseFloat(document.getElementById('d2-orig') && document.getElementById('d2-orig').value);
      var sale = parseFloat(document.getElementById('d2-sale') && document.getElementById('d2-sale').value);
      if (isNaN(orig) || isNaN(sale) || orig <= 0) return;
      var saved = orig - sale;
      var pct   = (saved / orig) * 100;
      showResult(document.getElementById('result-2'), pct.toFixed(2) + '% off', 'Discount from $' + orig + ' to $' + sale, [
        ['Original price', '$' + orig.toFixed(2)],
        ['Sale price', '$' + sale.toFixed(2)],
        ['Amount saved', '$' + saved.toFixed(2)],
        ['Discount', pct.toFixed(2) + '%']
      ]);
    });
  }

  // Panel 3: original price given sale price + % off
  var calc3 = document.getElementById('calc-3');
  if (calc3) {
    calc3.addEventListener('click', function () {
      var sale = parseFloat(document.getElementById('d3-sale') && document.getElementById('d3-sale').value);
      var pct  = parseFloat(document.getElementById('d3-pct')  && document.getElementById('d3-pct').value);
      if (isNaN(sale) || isNaN(pct) || pct >= 100) return;
      var orig  = sale / (1 - pct / 100);
      var saved = orig - sale;
      showResult(document.getElementById('result-3'), '$' + orig.toFixed(2), 'Original price (before ' + pct + '% off)', [
        ['Original price', '$' + orig.toFixed(2)],
        ['Discount', pct + '%'],
        ['Amount saved', '$' + saved.toFixed(2)],
        ['Sale price', '$' + sale.toFixed(2)]
      ]);
    });
  }
})();

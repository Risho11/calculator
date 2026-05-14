(function () {
  'use strict';

  var billEl   = document.getElementById('tip-bill');
  var tipEl    = document.getElementById('tip-pct');
  var splitEl  = document.getElementById('tip-split');
  var calcBtn  = document.getElementById('calc-btn');
  var resultCard = document.getElementById('result-card');

  document.querySelectorAll('[data-tip]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (tipEl) tipEl.value = btn.dataset.tip;
      if (calcBtn) calcBtn.click();
    });
  });

  function calculate() {
    var bill  = parseFloat(billEl && billEl.value) || 0;
    var tipPct= parseFloat(tipEl  && tipEl.value)  || 0;
    var split = parseInt(splitEl  && splitEl.value) || 1;
    if (bill <= 0) return;
    var tipAmt  = bill * tipPct / 100;
    var total   = bill + tipAmt;
    var perPerson = total / split;
    var tipPer    = tipAmt / split;

    showResult(resultCard, '$' + perPerson.toFixed(2) + ' / person', 'Bill: $' + bill.toFixed(2) + ' + ' + tipPct + '% tip', [
      ['Bill', '$' + bill.toFixed(2)],
      ['Tip (' + tipPct + '%)', '$' + tipAmt.toFixed(2)],
      ['Total', '$' + total.toFixed(2)],
      ['Split', split + ' ' + (split === 1 ? 'person' : 'people')],
      ['Per person', '$' + perPerson.toFixed(2)],
      ['Tip per person', '$' + tipPer.toFixed(2)]
    ]);
  }

  calcBtn && calcBtn.addEventListener('click', calculate);
  [billEl, tipEl, splitEl].forEach(function (el) {
    el && el.addEventListener('input', function () { if (billEl && parseFloat(billEl.value) > 0) calculate(); });
  });
})();

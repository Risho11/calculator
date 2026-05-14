(function () {
  'use strict';

  var principalEl = document.getElementById('loan-principal');
  var rateEl      = document.getElementById('loan-rate');
  var termEl      = document.getElementById('loan-term');
  var termUnitEl  = document.getElementById('loan-term-unit');
  var calcBtn     = document.getElementById('calc-btn');
  var resultCard  = document.getElementById('result-card');

  function calculate() {
    var P = parseFloat(principalEl && principalEl.value);
    var r = parseFloat(rateEl && rateEl.value) / 100 / 12;  // monthly rate
    var termVal  = parseFloat(termEl && termEl.value);
    var termUnit = termUnitEl ? termUnitEl.value : 'years';
    var n = termUnit === 'years' ? termVal * 12 : termVal; // months

    if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || n <= 0) return;

    var monthly, totalPayment, totalInterest;

    if (r === 0) {
      monthly      = P / n;
      totalPayment = P;
      totalInterest = 0;
    } else {
      monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      totalPayment  = monthly * n;
      totalInterest = totalPayment - P;
    }

    showResult(resultCard, '$' + monthly.toFixed(2) + '/mo', 'Monthly payment on $' + fmtNum(P, 0) + ' loan', [
      ['Principal', '$' + fmtNum(P, 2)],
      ['Annual interest rate', (parseFloat(rateEl.value)).toFixed(2) + '%'],
      ['Loan term', termVal + ' ' + termUnit],
      ['Monthly payment', '$' + monthly.toFixed(2)],
      ['Total payment', '$' + fmtNum(totalPayment, 2)],
      ['Total interest', '$' + fmtNum(totalInterest, 2)]
    ]);
  }

  calcBtn && calcBtn.addEventListener('click', calculate);
  [principalEl, rateEl, termEl, termUnitEl].forEach(function (el) {
    el && el.addEventListener('input', function () {
      if (principalEl && rateEl && termEl && parseFloat(principalEl.value) > 0 && parseFloat(rateEl.value) >= 0 && parseFloat(termEl.value) > 0) calculate();
    });
  });
})();

(function () {
  'use strict';

  var birthEl   = document.getElementById('age-birth');
  var asOfEl    = document.getElementById('age-asof');
  var calcBtn   = document.getElementById('calc-btn');
  var resultCard= document.getElementById('result-card');

  // Default as-of to today
  if (asOfEl && !asOfEl.value) asOfEl.value = new Date().toISOString().slice(0, 10);

  function calculate() {
    if (!birthEl || !birthEl.value) return;
    var birth = new Date(birthEl.value);
    var asOf  = asOfEl && asOfEl.value ? new Date(asOfEl.value) : new Date();
    if (isNaN(birth) || isNaN(asOf)) return;
    if (birth > asOf) {
      showResult(resultCard, '—', 'Birth date is in the future', []);
      return;
    }

    var y = asOf.getFullYear() - birth.getFullYear();
    var m = asOf.getMonth() - birth.getMonth();
    var d = asOf.getDate() - birth.getDate();
    if (d < 0) { m--; var daysInPrevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate(); d += daysInPrevMonth; }
    if (m < 0) { y--; m += 12; }

    var totalDays  = Math.floor((asOf - birth) / 86400000);
    var totalWeeks = Math.floor(totalDays / 7);
    var totalMonths= y * 12 + m;
    var nextBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= asOf) nextBirthday.setFullYear(asOf.getFullYear() + 1);
    var daysUntil = Math.ceil((nextBirthday - asOf) / 86400000);

    showResult(resultCard, y + ' years', 'Age as of ' + asOf.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), [
      ['Years', y],
      ['Months & days', y + ' yrs, ' + m + ' mo, ' + d + ' days'],
      ['Total months', fmtNum(totalMonths, 0)],
      ['Total weeks', fmtNum(totalWeeks, 0)],
      ['Total days', fmtNum(totalDays, 0)],
      ['Next birthday in', daysUntil + ' days']
    ]);
  }

  calcBtn && calcBtn.addEventListener('click', calculate);
  birthEl && birthEl.addEventListener('change', function () { if (calcBtn) {}  });
})();

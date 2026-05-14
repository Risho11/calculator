(function () {
  'use strict';

  var tabs   = document.querySelectorAll('.dc-tab');
  var panels = document.querySelectorAll('.dc-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add('active');
    });
  });

  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Panel 1: days between dates
  var calc1 = document.getElementById('calc-1');
  if (calc1) {
    calc1.addEventListener('click', function () {
      var d1 = new Date(document.getElementById('dc-from') && document.getElementById('dc-from').value);
      var d2 = new Date(document.getElementById('dc-to')   && document.getElementById('dc-to').value);
      if (isNaN(d1) || isNaN(d2)) return;
      var diff  = Math.abs(d2 - d1);
      var days  = Math.floor(diff / 86400000);
      var weeks = (days / 7).toFixed(2);
      var months= (days / 30.4375).toFixed(2);
      var years = (days / 365.25).toFixed(2);
      showResult(document.getElementById('result-1'), days + ' days', 'Between ' + d1.toLocaleDateString('en-US') + ' and ' + d2.toLocaleDateString('en-US'), [
        ['Days', fmtNum(days, 0)],
        ['Weeks', weeks],
        ['Months (approx)', months],
        ['Years (approx)', years]
      ]);
    });
  }

  // Panel 2: add/subtract days
  var calc2 = document.getElementById('calc-2');
  if (calc2) {
    calc2.addEventListener('click', function () {
      var base  = new Date(document.getElementById('dc-base') && document.getElementById('dc-base').value);
      var n     = parseInt(document.getElementById('dc-n') && document.getElementById('dc-n').value) || 0;
      var mode  = document.querySelector('input[name="dc-mode"]:checked');
      var mult  = mode && mode.value === 'sub' ? -1 : 1;
      if (isNaN(base)) return;
      var result = new Date(base.getTime() + mult * n * 86400000);
      var fmt = result.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      showResult(document.getElementById('result-2'), fmt, (mult > 0 ? 'Add ' : 'Subtract ') + n + ' days', [
        ['Start date', base.toLocaleDateString('en-US')],
        ['Days', (mult > 0 ? '+' : '-') + n],
        ['Result', result.toLocaleDateString('en-US')],
        ['Day of week', DAYS[result.getDay()]]
      ]);
    });
  }

  // Panel 3: weekday finder
  var calc3 = document.getElementById('calc-3');
  if (calc3) {
    calc3.addEventListener('click', function () {
      var d = new Date(document.getElementById('dc-day-date') && document.getElementById('dc-day-date').value);
      if (isNaN(d)) return;
      showResult(document.getElementById('result-3'), DAYS[d.getDay()], d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), [
        ['Date', d.toLocaleDateString('en-US')],
        ['Day', DAYS[d.getDay()]],
        ['Month', MONTHS[d.getMonth()]],
        ['Week of year', Math.ceil((((d - new Date(d.getFullYear(),0,1)) / 86400000) + new Date(d.getFullYear(),0,1).getDay() + 1) / 7)]
      ]);
    });
  }
})();

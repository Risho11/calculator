(function () {
  'use strict';

  function getVal(id) { var el = document.getElementById(id); return el ? parseFloat(el.value) : NaN; }
  function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }

  // Tab switching
  var tabs = document.querySelectorAll('.perc-tab');
  var panels = document.querySelectorAll('.perc-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add('active');
    });
  });

  // Panel 1: X% of Y
  var calc1 = document.getElementById('calc-1');
  if (calc1) {
    calc1.addEventListener('click', function () {
      var pct = getVal('p1-pct'), of = getVal('p1-of');
      if (isNaN(pct) || isNaN(of)) return;
      var r = pct / 100 * of;
      showResult(document.getElementById('result-1'), fmtNum(r), pct + '% of ' + of, [
        ['Percentage', pct + '%'],
        ['Base value', fmtNum(of)],
        ['Result', fmtNum(r)]
      ]);
    });
  }

  // Panel 2: X is what % of Y
  var calc2 = document.getElementById('calc-2');
  if (calc2) {
    calc2.addEventListener('click', function () {
      var x = getVal('p2-x'), y = getVal('p2-y');
      if (isNaN(x) || isNaN(y) || y === 0) return;
      var r = (x / y) * 100;
      showResult(document.getElementById('result-2'), fmtNum(r, 4) + '%', x + ' is what % of ' + y, [
        ['Value', fmtNum(x)],
        ['Base', fmtNum(y)],
        ['Percentage', fmtNum(r, 4) + '%']
      ]);
    });
  }

  // Panel 3: % change
  var calc3 = document.getElementById('calc-3');
  if (calc3) {
    calc3.addEventListener('click', function () {
      var from = getVal('p3-from'), to = getVal('p3-to');
      if (isNaN(from) || isNaN(to) || from === 0) return;
      var r = ((to - from) / Math.abs(from)) * 100;
      var dir = r >= 0 ? 'increase' : 'decrease';
      showResult(document.getElementById('result-3'), fmtNum(Math.abs(r), 2) + '% ' + dir, 'Change from ' + from + ' to ' + to, [
        ['From', fmtNum(from)],
        ['To', fmtNum(to)],
        ['Change', (r >= 0 ? '+' : '') + fmtNum(r, 2) + '%']
      ]);
    });
  }

  // Panel 4: add/remove % from value
  var calc4 = document.getElementById('calc-4');
  if (calc4) {
    calc4.addEventListener('click', function () {
      var val = getVal('p4-val'), pct = getVal('p4-pct');
      var mode = document.querySelector('input[name="p4-mode"]:checked');
      if (isNaN(val) || isNaN(pct)) return;
      var r = mode && mode.value === 'remove' ? val * (1 - pct / 100) : val * (1 + pct / 100);
      showResult(document.getElementById('result-4'), fmtNum(r), (mode && mode.value === 'remove' ? 'Remove ' : 'Add ') + pct + '% to ' + val, [
        ['Original', fmtNum(val)],
        ['Percentage', pct + '%'],
        ['Result', fmtNum(r)]
      ]);
    });
  }
})();

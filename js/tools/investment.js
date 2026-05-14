(function () {
  'use strict';

  var PRESETS = {
    sp500:        { rate: 10.0  },
    nasdaq:       { rate: 13.5  },
    world:        { rate: 8.0   },
    ustotal:      { rate: 10.5  },
    em:           { rate: 7.0   },
    moderate:     { rate: 7.0   },
    conservative: { rate: 4.5   },
    custom:       { rate: 0     }
  };

  var myChart = null;

  function calcGrowth(principal, monthly, years, netRate) {
    var mRate   = netRate / 100 / 12;
    var points  = [];
    var val     = principal;
    var contrib = principal;

    points.push({ year: 0, val: val, contrib: contrib });

    for (var y = 1; y <= years; y++) {
      for (var m = 0; m < 12; m++) {
        val     = (val + monthly) * (1 + mRate);
        contrib += monthly;
      }
      points.push({ year: y, val: Math.round(val), contrib: Math.round(contrib) });
    }
    return { points: points, finalVal: val, totalContrib: contrib };
  }

  function fmtMoney(n) {
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function getEl(id) { return document.getElementById(id); }

  function calculate() {
    var principal  = parseFloat((getEl('inv-principal') || {}).value) || 0;
    var monthly    = parseFloat((getEl('inv-monthly')   || {}).value) || 0;
    var years      = Math.min(Math.max(parseInt((getEl('inv-years') || {}).value) || 20, 1), 60);
    var presetKey  = (getEl('inv-preset') || {}).value || 'sp500';
    var annualRate = presetKey === 'custom'
      ? (parseFloat((getEl('inv-custom-rate') || {}).value) || 0)
      : PRESETS[presetKey].rate;
    var expRatio   = parseFloat((getEl('inv-expense') || {}).value) || 0;
    var inflOn     = !!(getEl('inv-inflation') || {}).checked;
    var inflRate   = 3.0;
    var netRate    = annualRate - expRatio;

    if (principal <= 0 && monthly <= 0) {
      alert('Please enter an initial investment or monthly contribution.');
      return;
    }

    var result  = calcGrowth(principal, monthly, years, netRate);
    var gain    = result.finalVal - result.totalContrib;
    var gainPct = result.totalContrib > 0 ? (gain / result.totalContrib * 100) : 0;
    var realFinal = inflOn ? result.finalVal / Math.pow(1 + inflRate / 100, years) : null;

    // Update stat cards
    var statFinal   = getEl('stat-final');
    var statContrib = getEl('stat-contrib');
    var statGain    = getEl('stat-gain');
    var statReal    = getEl('stat-real');
    var statRealRow = getEl('stat-real-row');

    if (statFinal)   statFinal.textContent   = fmtMoney(result.finalVal);
    if (statContrib) statContrib.textContent = fmtMoney(result.totalContrib);
    if (statGain)    statGain.textContent    = fmtMoney(gain) + '  (' + gainPct.toFixed(0) + '% total return)';
    if (statRealRow) statRealRow.style.display = inflOn ? '' : 'none';
    if (statReal && inflOn) statReal.textContent = fmtMoney(realFinal) + " in today's dollars";

    var resultSec = getEl('result-section');
    if (resultSec) resultSec.hidden = false;

    // Build chart data
    var labels   = result.points.map(function (p) { return 'Yr ' + p.year; });
    var vals     = result.points.map(function (p) { return p.val; });
    var contribs = result.points.map(function (p) { return p.contrib; });
    var realVals = inflOn ? result.points.map(function (p) {
      return p.year === 0 ? p.val : Math.round(p.val / Math.pow(1 + inflRate / 100, p.year));
    }) : null;

    var datasets = [
      {
        label: 'Portfolio Value',
        data: vals,
        borderColor: '#1a56a8',
        backgroundColor: 'rgba(26,86,168,0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: years <= 15 ? 3 : 0,
        borderWidth: 2.5
      },
      {
        label: 'Amount Invested',
        data: contribs,
        borderColor: '#94b8d8',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0,
        pointRadius: 0,
        borderWidth: 1.5,
        borderDash: [6, 4]
      }
    ];

    if (realVals) {
      datasets.push({
        label: 'Inflation-Adjusted Value',
        data: realVals,
        borderColor: '#5e8fc0',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 1.5,
        borderDash: [3, 3]
      });
    }

    var canvas = getEl('invest-chart');
    if (!canvas) return;

    if (myChart) myChart.destroy();

    myChart = new Chart(canvas, {
      type: 'line',
      data: { labels: labels, datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: {
              font: { family: "'Plus Jakarta Sans', system-ui, sans-serif", size: 12 },
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#c4d6ea',
            borderWidth: 1,
            titleColor: '#101828',
            bodyColor: '#506070',
            padding: 10,
            callbacks: {
              label: function (ctx) {
                return ' ' + ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { size: 11 }, maxTicksLimit: 11 }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              font: { size: 11 },
              callback: function (v) {
                if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
                if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'K';
                return '$' + v;
              }
            }
          }
        }
      }
    });
  }

  // Preset select
  var presetEl   = getEl('inv-preset');
  var customGrp  = getEl('custom-rate-group');
  if (presetEl && customGrp) {
    presetEl.addEventListener('change', function () {
      customGrp.style.display = presetEl.value === 'custom' ? '' : 'none';
    });
  }

  // Quick preset buttons
  document.querySelectorAll('[data-preset-key]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (presetEl) { presetEl.value = btn.dataset.presetKey; if (customGrp) customGrp.style.display = 'none'; }
      var resultSec = getEl('result-section');
      if (resultSec && !resultSec.hidden) calculate();
    });
  });

  var calcBtn = getEl('calc-btn');
  calcBtn && calcBtn.addEventListener('click', calculate);

  // Live recalc after first calculate
  ['inv-principal','inv-monthly','inv-years','inv-custom-rate','inv-expense'].forEach(function (id) {
    var el = getEl(id);
    el && el.addEventListener('input', function () {
      var rs = getEl('result-section');
      if (rs && !rs.hidden) calculate();
    });
  });

  var inflEl = getEl('inv-inflation');
  inflEl && inflEl.addEventListener('change', function () {
    var rs = getEl('result-section');
    if (rs && !rs.hidden) calculate();
  });
})();

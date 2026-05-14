(function () {
  'use strict';

  var unitEl   = document.getElementById('bmi-unit');
  var metricEl = document.getElementById('metric-group');
  var imperEl  = document.getElementById('imperial-group');
  var calcBtn  = document.getElementById('calc-btn');
  var resultCard = document.getElementById('result-card');

  function toggleUnit() {
    var metric = unitEl && unitEl.value === 'metric';
    if (metricEl) metricEl.style.display = metric ? '' : 'none';
    if (imperEl)  imperEl.style.display  = metric ? 'none' : '';
  }
  unitEl && unitEl.addEventListener('change', toggleUnit);
  toggleUnit();

  function bmiCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25)   return 'Normal weight';
    if (bmi < 30)   return 'Overweight';
    return 'Obese';
  }

  function calculate() {
    var metric = !unitEl || unitEl.value === 'metric';
    var bmi, heightStr, weightStr;

    if (metric) {
      var h = parseFloat(document.getElementById('bmi-height-cm') && document.getElementById('bmi-height-cm').value);
      var w = parseFloat(document.getElementById('bmi-weight-kg') && document.getElementById('bmi-weight-kg').value);
      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return;
      bmi = w / ((h / 100) ** 2);
      heightStr = h + ' cm';
      weightStr = w + ' kg';
    } else {
      var ft   = parseFloat(document.getElementById('bmi-height-ft') && document.getElementById('bmi-height-ft').value) || 0;
      var inch = parseFloat(document.getElementById('bmi-height-in') && document.getElementById('bmi-height-in').value) || 0;
      var lbs  = parseFloat(document.getElementById('bmi-weight-lbs') && document.getElementById('bmi-weight-lbs').value);
      if (isNaN(lbs) || lbs <= 0 || (ft === 0 && inch === 0)) return;
      var totalInches = ft * 12 + inch;
      bmi = (lbs / (totalInches ** 2)) * 703;
      heightStr = ft + "'" + inch + '"';
      weightStr = lbs + ' lbs';
    }

    var cat = bmiCategory(bmi);
    var idealLow  = metric ? (18.5 * ((parseFloat(document.getElementById('bmi-height-cm') && document.getElementById('bmi-height-cm').value) / 100) ** 2)).toFixed(1) : '—';
    var idealHigh = metric ? (24.9 * ((parseFloat(document.getElementById('bmi-height-cm') && document.getElementById('bmi-height-cm').value) / 100) ** 2)).toFixed(1) : '—';

    showResult(resultCard, bmi.toFixed(1), cat, [
      ['Height', heightStr],
      ['Weight', weightStr],
      ['BMI', bmi.toFixed(2)],
      ['Category', cat],
      metric ? ['Healthy weight range', idealLow + ' – ' + idealHigh + ' kg'] : ['', '']
    ].filter(function (r) { return r[0]; }));
  }

  calcBtn && calcBtn.addEventListener('click', calculate);
})();

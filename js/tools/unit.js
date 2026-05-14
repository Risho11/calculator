(function () {
  'use strict';

  var CONVERSIONS = {
    length: {
      label: 'Length',
      units: ['Meter','Kilometer','Centimeter','Millimeter','Mile','Yard','Foot','Inch','Nautical mile'],
      toBase: [1, 1000, 0.01, 0.001, 1609.344, 0.9144, 0.3048, 0.0254, 1852]
    },
    weight: {
      label: 'Weight / Mass',
      units: ['Kilogram','Gram','Milligram','Pound','Ounce','Ton (metric)','Stone'],
      toBase: [1, 0.001, 0.000001, 0.453592, 0.0283495, 1000, 6.35029]
    },
    temp: {
      label: 'Temperature',
      units: ['Celsius','Fahrenheit','Kelvin'],
      toBase: null // special
    },
    volume: {
      label: 'Volume',
      units: ['Liter','Milliliter','US Gallon','US Cup','US Fluid oz','Cubic meter','Cubic foot'],
      toBase: [1, 0.001, 3.78541, 0.236588, 0.0295735, 1000, 28.3168]
    },
    area: {
      label: 'Area',
      units: ['Square meter','Square kilometer','Square foot','Square inch','Acre','Hectare'],
      toBase: [1, 1e6, 0.092903, 0.00064516, 4046.86, 10000]
    },
    speed: {
      label: 'Speed',
      units: ['m/s','km/h','mph','knot','ft/s'],
      toBase: [1, 0.277778, 0.44704, 0.514444, 0.3048]
    },
    time: {
      label: 'Time',
      units: ['Second','Minute','Hour','Day','Week','Month (avg)','Year'],
      toBase: [1, 60, 3600, 86400, 604800, 2629800, 31557600]
    },
    data: {
      label: 'Data',
      units: ['Byte','Kilobyte','Megabyte','Gigabyte','Terabyte','Bit','Kilobit','Megabit'],
      toBase: [1, 1024, 1048576, 1073741824, 1099511627776, 0.125, 128, 131072]
    }
  };

  var catEl    = document.getElementById('unit-cat');
  var fromEl   = document.getElementById('unit-from');
  var toEl     = document.getElementById('unit-to');
  var valEl    = document.getElementById('unit-val');
  var resultEl = document.getElementById('unit-result');
  var calcBtn  = document.getElementById('calc-btn');

  function populateUnits(cat) {
    var data = CONVERSIONS[cat];
    if (!data || !fromEl || !toEl) return;
    [fromEl, toEl].forEach(function (sel, i) {
      var prev = sel.value;
      sel.innerHTML = '';
      data.units.forEach(function (u, idx) {
        var opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = u;
        sel.appendChild(opt);
      });
      sel.value = prev && sel.querySelector('[value="' + prev + '"]') ? prev : (i === 1 ? '1' : '0');
    });
  }

  function toBase(val, fromIdx, cat) {
    var data = CONVERSIONS[cat];
    if (cat === 'temp') {
      if (fromIdx == 0) return val;             // C → C
      if (fromIdx == 1) return (val - 32) * 5 / 9; // F → C
      return val - 273.15;                      // K → C
    }
    return val * data.toBase[fromIdx];
  }

  function fromBase(base, toIdx, cat) {
    var data = CONVERSIONS[cat];
    if (cat === 'temp') {
      if (toIdx == 0) return base;
      if (toIdx == 1) return base * 9 / 5 + 32;
      return base + 273.15;
    }
    return base / data.toBase[toIdx];
  }

  function calculate() {
    var cat     = catEl ? catEl.value : 'length';
    var fromIdx = parseInt(fromEl && fromEl.value) || 0;
    var toIdx   = parseInt(toEl   && toEl.value)   || 0;
    var val     = parseFloat(valEl && valEl.value);
    if (isNaN(val)) return;
    var data    = CONVERSIONS[cat];
    if (!data) return;
    var base    = toBase(val, fromIdx, cat);
    var result  = fromBase(base, toIdx, cat);
    var fromUnit= data.units[fromIdx];
    var toUnit  = data.units[toIdx];
    if (resultEl) {
      resultEl.hidden = false;
      resultEl.querySelector('.calc-result-main').textContent = parseFloat(result.toPrecision(8)).toLocaleString('en-US', { maximumSignificantDigits: 8 }) + ' ' + toUnit;
      resultEl.querySelector('.calc-result-label').textContent = val + ' ' + fromUnit + ' = … ' + toUnit;
    }
  }

  catEl && catEl.addEventListener('change', function () { populateUnits(catEl.value); calculate(); });
  [fromEl, toEl, valEl].forEach(function (el) { el && el.addEventListener('change', calculate); el && el.addEventListener('input', calculate); });
  calcBtn && calcBtn.addEventListener('click', calculate);

  populateUnits(catEl ? catEl.value : 'length');
})();

(function () {
  'use strict';

  var expr   = '';
  var result = '0';
  var justEq = false;
  var degRad = 'deg';

  var exprEl  = document.getElementById('calc-expr');
  var resEl   = document.getElementById('calc-result');
  var degBtn  = document.getElementById('deg-btn');
  var radBtn  = document.getElementById('rad-btn');

  function update() {
    if (exprEl) exprEl.textContent = expr || '';
    if (resEl)  resEl.textContent  = result;
  }

  function toRad(x) { return degRad === 'deg' ? x * Math.PI / 180 : x; }

  function safeEval(str) {
    try {
      var prep = str
        .replace(/sin\(/g,  '(Math.sin(toRad(')
        .replace(/cos\(/g,  '(Math.cos(toRad(')
        .replace(/tan\(/g,  '(Math.tan(toRad(')
        .replace(/asin\(/g, '(Math.asin(')
        .replace(/acos\(/g, '(Math.acos(')
        .replace(/atan\(/g, '(Math.atan(')
        .replace(/sqrt\(/g, '(Math.sqrt(')
        .replace(/log\(/g,  '(Math.log10(')
        .replace(/ln\(/g,   '(Math.log(')
        .replace(/abs\(/g,  '(Math.abs(')
        .replace(/\^/g,     '**')
        .replace(/π/g,      String(Math.PI))
        .replace(/e(?![0-9])/g, String(Math.E));
      // close extra parens added by trig wrapping
      var opens  = (prep.match(/\(/g) || []).length;
      var closes = (prep.match(/\)/g) || []).length;
      for (var i = 0; i < opens - closes; i++) prep += ')';
      var r = Function('"use strict"; var toRad = ' + toRad.toString() + '; return (' + prep + ')')();
      if (!isFinite(r)) return 'Error';
      return String(parseFloat(r.toPrecision(12)));
    } catch (e) { return 'Error'; }
  }

  function handleBtn(val) {
    if (val === 'C') {
      expr = ''; result = '0'; justEq = false;
    } else if (val === '⌫') {
      if (!justEq) expr = expr.slice(0, -1);
      if (!expr) result = '0';
    } else if (val === '=') {
      if (expr) { result = safeEval(expr); if (result !== 'Error') expr = result; justEq = true; }
    } else if (val === '+/-') {
      if (result !== '0' && result !== 'Error') {
        result = result.startsWith('-') ? result.slice(1) : '-' + result;
        if (justEq) expr = result;
      }
    } else if (val === '%') {
      if (result !== 'Error') { result = String(parseFloat(result) / 100); if (justEq) expr = result; }
    } else if (val === 'x²') {
      expr += '**2'; justEq = false;
    } else if (val === '1/x') {
      expr = '1/(' + (expr || result) + ')'; justEq = false;
    } else if (val === 'x!') {
      var n = parseInt(result);
      if (n >= 0 && n <= 20) {
        var f = 1; for (var i = 2; i <= n; i++) f *= i;
        result = String(f); if (justEq) expr = result;
      }
    } else {
      if (justEq && /[\d.]/.test(val)) expr = '';
      justEq = false;
      expr += val;
      var p = safeEval(expr);
      if (p !== 'Error') result = p;
    }
    update();
  }

  document.querySelectorAll('.calc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { handleBtn(btn.dataset.val); });
  });

  if (degBtn) degBtn.addEventListener('click', function () { degRad = 'deg'; degBtn.classList.add('active'); if (radBtn) radBtn.classList.remove('active'); });
  if (radBtn) radBtn.addEventListener('click', function () { degRad = 'rad'; radBtn.classList.add('active'); if (degBtn) degBtn.classList.remove('active'); });

  document.addEventListener('keydown', function (e) {
    var map = { 'Enter': '=', 'Backspace': '⌫', 'Escape': 'C' };
    var k = map[e.key] || e.key;
    if (/^[\d+\-*/.()%^]$/.test(k) || ['=','⌫','C'].includes(k)) { e.preventDefault(); handleBtn(k); }
  });

  update();
})();

(function () {
  'use strict';

  var expr    = '';
  var result  = '0';
  var justEq  = false;

  var exprEl  = document.getElementById('calc-expr');
  var resEl   = document.getElementById('calc-result');

  function update() {
    if (exprEl) exprEl.textContent = expr || '';
    if (resEl)  resEl.textContent  = result;
  }

  function safeEval(str) {
    try {
      var r = Function('"use strict"; return (' + str + ')')();
      if (!isFinite(r)) return 'Error';
      return String(parseFloat(r.toPrecision(12)));
    } catch (e) {
      return 'Error';
    }
  }

  function handleBtn(val) {
    if (val === 'C') {
      expr = ''; result = '0'; justEq = false;
    } else if (val === 'CE') {
      result = '0'; expr = expr.replace(/[\d.]+$/, '') ; justEq = false;
    } else if (val === '⌫') {
      if (!justEq) {
        expr = expr.slice(0, -1);
        if (!expr) result = '0';
      }
    } else if (val === '=') {
      if (expr) {
        result = safeEval(expr);
        if (result !== 'Error') expr = result;
        justEq = true;
      }
    } else if (val === '+/-') {
      if (result !== '0' && result !== 'Error') {
        if (result.startsWith('-')) result = result.slice(1);
        else result = '-' + result;
        if (justEq) expr = result;
      }
    } else if (val === '%') {
      if (result !== 'Error') {
        result = String(parseFloat(result) / 100);
        if (justEq) expr = result;
      }
    } else {
      if (justEq && /[\d.]/.test(val)) { expr = ''; }
      justEq = false;
      expr += val;
      // live preview
      var preview = safeEval(expr);
      if (preview !== 'Error') result = preview;
    }
    update();
  }

  document.querySelectorAll('.calc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { handleBtn(btn.dataset.val); });
  });

  document.addEventListener('keydown', function (e) {
    var map = { 'Enter': '=', 'Backspace': '⌫', 'Escape': 'C', '%': '%' };
    var k = map[e.key] || e.key;
    if (/^[\d+\-*/.()%]$/.test(k) || ['=','⌫','C','CE'].includes(k)) {
      e.preventDefault();
      handleBtn(k);
    }
  });

  update();
})();

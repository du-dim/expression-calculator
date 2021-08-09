function eval() {
  // Do not use eval!!!
  return;
}
function expressionCalculator(expr) {
  function check_bracket(expr) {
    let exp = expr.replace(/[\d*\s*\+\-\*\/]/g, '');
    len_exp = exp.length;
    exp = exp.replace(/\([^\(^\)]*\)/g, "");
    return (exp.length === 0) ? true : (exp.length === len_exp) ? false : check_bracket(exp);
  }

  if (check_bracket(expr) === false) throw new Error("ExpressionError: Brackets must be paired");
  expr = expr.replace(/([\(\d]) *([\+\-\*\/])/g, "$1 $2 ");
  expr = "(" + expr.replace(/\s+/g, " ") + ")";
  let len_expr = expr.split(/[\+\/\*\-]/).length;
  let str_del = expr.replace(/\([^\(^\)]+\)/, "a");
  let str_del_after = str_del.replace(/.*a/, "");
  let str_del_before = str_del.replace(/a.*/, "");
  let strIn = expr.replace(str_del_before, "").replace(str_del_after, "").replace(/[\(\)]/g, ""); //содержимое в ()

  function bracket(str) {
    function multiply(str) {
      while (str.search(/\* ?-/) > 0) {
        str = str.replace(/([0-9]+\.?[0-9]*) ?\* - ?([0-9]+\.?[0-9]*)/g, "- $1 * $2").replace(/- -/g, "+").replace(/\+ -/g, "-");
      }
      len = str.split('*').length;
      if (len > 1) {
        str_del = str.replace(/\d*\.?\d* \* \d+\.?\d*/, "a");//находим x*y и меняем на букву а
        str_del_after = str_del.replace(/.*a/, ""); //содержимое после x*y
        str_del_before = str_del.replace(/a.*/, ""); //содержимое до x*y
        str = str.replace(str_del_before, "").replace(str_del_after, ""); // удаляем все кроме x*y
        str = str.replace(/ /g, "");
        mult = str.split('*').map(Number).reduce((a, b) => a * b);// получаем значение = x*y
        result = str_del_before + String(mult) + str_del_after;// вместо x*y ставим значение
        len_r = result.split('*').length;// определяем сколько осталось перемножить чисел
        if ((len_r === len) || (len_r === 1)) { //перемножаем пока все не перемножим
          return result;
        }
        else return multiply(result);
      }
      else return str;
    }

    function divide(str) {
      while (str.search(/\/ ?-/) > 0) {
        str = str.replace(/([0-9]+\.?[0-9]*) ?\/ - ?([0-9]+\.?[0-9]*)/g, "- $1 / $2").replace(/- -/g, "+").replace(/\+ -/g, "-");
      }
      len = str.split('/').length;
      if (len > 1) {
        str_del = str.replace(/\d*\.?\d* \/ \d+\.?\d*/, "a");
        str_del_after = str_del.replace(/.*a/, "");
        str_del_before = str_del.replace(/a.*/, "");
        str = str.replace(str_del_before, "").replace(str_del_after, "");
        str = str.replace(/ /g, "");
        div = str.split('/').map(Number).reduce((a, b) => a / b);
        if (div === Infinity) throw Error("TypeError: Division by zero.");
        result = str_del_before + String(div) + str_del_after;
        len_r = result.split('/').length;
        if ((len_r === len) || (len_r === 1)) return result;
        else return divide(result);
      }
      else return str;
    }

    function sum(str) {
      str = "+" + str;
      str = str.replace(/(- *)(\d+)/g, "-$2").replace(/(\+ *)(\d+)/g, "+$2");
      str = str.replace(/\+ *-/g, "-").replace(/- *-/g, "+").replace(/\+ *\+/g, "+").split(" ").map(Number).reduce((a, b) => a + b);
      return str;
    }
    return sum(multiply(divide(str)));
  }

  cal = bracket(strIn);
  let strNew = expr.replace(/\([^\(^\)]+\)/, cal);
  len_New = strNew.split(/[\+\/\*\-]/).length;
  if ((len_New === len_expr) || (len_New === 1) || (len_New === 2)) {
    strNew = strNew.replace(/[\(\)]/g, "");
    return Math.round((strNew) * 10000) / 10000;
  }
  else return expressionCalculator(strNew);
}

module.exports = {
  expressionCalculator
}




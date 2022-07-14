/**
 * @description If the Enter key is pressed on a form field activate the submitBtn function.
 * @param {Keyevent} e 
 */
 function inputKeyUp(e) {
  e = e.which || e.keyCode;
  if (e == 13) {
      submitBtn();
  }
}

/**
* @description convert number into a percentage (7 becomes 0.07)
* @param {number} num 
* @returns 
*/
function toPercent(num) {
  var num = num / 100;
  return num;
}

/**
* @description round the first perameter to a given place value (the second perameter)
* @param {number} num 
* @param {number} placeValue 
* @returns Rounded Number
*/
function round(num, placeValue) {
  var roundedNum = Number.parseFloat(num).toFixed(placeValue);
  return roundedNum;
}

/**
* @description Convert number to string in USA dolar format
* @param {number} num 
*/
function toDollars(num) {
  var num = "$" + round(num, 2);

  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) {
      num = "0";
  }

  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  cents = num % 100;
  num = Math.floor(num / 100).toString();

  if (cents < 10) {
      cents = "0" + cents;
  }
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  }

  return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}

/**
* @description When btnID is activated show / hide content within divID
* @param {element} divID 
* @param {element} btnID 
*/
function showHide(divID, btnID) {
  var divStuff = document.getElementById(divID);
  var buttonStuff = document.getElementById(btnID);

  if (buttonStuff.getAttribute('aria-expanded') === 'true') {
      buttonStuff.setAttribute('aria-expanded', false);
      divStuff.style.display = "none";
  } else {
      buttonStuff.setAttribute('aria-expanded', true);
      divStuff.style.display = "block";
  }

}
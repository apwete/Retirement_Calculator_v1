/* Global Variables */
let ageInput;
let retirementAgeInput;
let incomeInput;
let savedInput;
let saveRateInput;
let payIncreaseInput;
let aveInterestInput;

let cust_retIncomInput;
let cust_retBalanceInput;
let inflationInput;
let retInterestRateInput;
let year = 0;
let draw;

/**********************
 * Begin Utility Functions 
 *************************/

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
 * @returns Money String
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

    // return '$' + num;

    return num;
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

/**
 * @description set default show/hide and build default table
 */
function setDefault() {
    showHide('retIncomeInfo', 'retIncomeBtn');
    showHide('safeRetBalInfo', 'safeRetBalBtn');
    showHide('advOptions', 'advOptionsBtn');
    submitBtn();
}

/**
 * @description Collect form values
 */
function setInputs() {
    ageInput = parseInt(document.getElementById("currentAge").value);
    retirementAgeInput = parseInt(document.getElementById("retirementAge").value);
    incomeInput = parseInt(document.getElementById("currentIncome").value);
    savedInput = parseInt(document.getElementById("currentSaved").value);
    saveRateInput = toPercent(parseInt(document.getElementById("savingsRate").value));
    payIncreaseInput = toPercent(parseInt(document.getElementById("payIncrease").value));
    aveInterestInput = toPercent(parseInt(document.getElementById("aveInterest").value));

    cust_retIncomInput = parseInt(document.getElementById("cust_retIncom").value);
    cust_retBalanceInput = parseInt(document.getElementById("cust_retBalance").value);
    inflationInput = toPercent(parseInt(document.getElementById("inflation").value));
    retInterestRateInput = toPercent(parseInt(document.getElementById("retInterestRate").value));
}

/**
 * @description:  Get rid of the previous table
 */
function deletePerviousTable() {
    year = 0;
    var table = document.getElementById("dataTable");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
}
/**********************
 * End Utility Functions 
 ************************/

/**
 * @description: Actions to take when the user activates the submit button
 */
function submitBtn() {
    deletePerviousTable();
    setInputs();

    /** Variables */
    let income = incomeInput;
    let savingsBal = savedInput;
    let adjInterestRate = aveInterestInput - inflationInput //interest - inflation

    buildTable("dataTable");

    if (Number.isNaN(cust_retBalanceInput)) {
        mostBasicCalculation(income, savingsBal, adjInterestRate);
    } else {        
        cust_retBalCalc(income, savingsBal, adjInterestRate);
    }
}

/**
 * @description Update income to include a pay raise
 * 
 * New Income = Current Income + (Current income * Annual Raise)
 * @param {number} income 
 * @returns 
 */
function updateIncome(income) {
    var temp_pay_increase = (income * payIncreaseInput); //get this year's pay increase
    income = income + temp_pay_increase; // add pay increase to pay
    return income;
}

/**
 * @description Update savings balance to include current year's savings and interest
    1. Annual Savings = Income * Savings Rate
    2. New Savings Balance = Savings Balance + Annual Savings
    3. New Savings Balance = New Savings Balance + (New Savings Balance * Interest Rate)
 * @param {number} income 
 * @param {number} savingsBal 
 * @param {number} adjInterestRate 
 * @returns 
 */
function updateSavings(income, savingsBal, adjInterestRate) {
    var newSaved = income * saveRateInput //get this year's amount saved
    var temp_bal_increase = savingsBal + newSaved; //get last year's bal + new money saved
    savingsBal = temp_bal_increase + (temp_bal_increase * adjInterestRate); //add this year's interest to balance

    return savingsBal;
}

/**
 * @description Update amount drawn from retirement accounts
    1. New Annual Draw = Savings Balance / 25
 * @param {number} savingsBal 
 * @returns 
 */
function updateDraw(savingsBal) {
    draw = savingsBal / 25;
    return draw;
}

/** Nothing was changed under Adavnced Options */
function mostBasicCalculation(income, savingsBal, adjInterestRate) {
    income = income;
    savingsBal = savingsBal;
    adjInterestRate = adjInterestRate;
    console.log("mostBasicCalculation()")
    for (ageInput = ageInput + 1; ageInput <= retirementAgeInput; ageInput++) {

        income = updateIncome(income);
        savingsBal = updateSavings(income, savingsBal, adjInterestRate);
        year = year + 1;
        buildTable("dataTable", income, savingsBal);
    }
    /**Display results */
    document.getElementById("retIncome").innerHTML = toDollars(income - (income * saveRateInput));
    document.getElementById("safeRetBal").innerHTML = toDollars(savingsBal);
}

function cust_retBalCalc(income, savingsBal, adjInterestRate) {
    console.log("cust_retBalCalc()")
    for (ageInput = ageInput + 1; ageInput <= retirementAgeInput; ageInput++) {

        if (savingsBal >= cust_retBalanceInput) {
            break;
        } else {
            /**Incroment*/
            income = updateIncome(income);

            savingsBal = updateSavings(income, savingsBal, adjInterestRate);

            year = year + 1;

            buildTable("dataTable", income, savingsBal);
            console.log("Year: " + year + "\tIncome: " + income + "\tSavings Bal: " + savingsBal + "\n\n")
        }
    }
    /**Display results */
    document.getElementById("retIncome").innerHTML = toDollars(income - (income * saveRateInput));
    document.getElementById("safeRetBal").innerHTML = toDollars(savingsBal);
}

/**
 * @description Build the table rows for the amitorization table
 * @param {*} dataTable 
 * @param {*} income 
 * @param {*} savingsBal 
 */
function buildTable(dataTable, income, savingsBal) {
    let table = document.getElementById(dataTable);
    let row = table.insertRow(-1);
    let cell1 = row.insertCell(-1);
    let cell2 = row.insertCell(-1);
    let cell3 = row.insertCell(-1);
    let cell4 = row.insertCell(-1);

    /**Output*/
    cell1.innerHTML = year;
    cell2.innerHTML = ageInput;
    cell3.innerHTML = toDollars(income);
    cell4.innerHTML = toDollars(savingsBal);
}
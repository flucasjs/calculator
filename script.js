let input = document.getElementById("input");
let output = document.getElementById("output");
let currentNumber = 0;
let currentOperator = "";
let result = 0;
let expArr = [];
let numArr = [];
let state = 0;

operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
};

document.querySelector(".content").addEventListener("click", (event) => {

    let element = event.target.closest(".key");

    if (!element) return;
    if (!document.querySelector(".content").contains(element)) return;
    
    let value = element.id;
    let isOperator = element.dataset.isOperator;
    let isNumber = element.dataset.isNumber;
    let output = document.getElementById("output");
    let input = document.getElementById("input");

    if (value == "c") {

        location.reload();

    } else if (value == "ce") {
        
        location.reload();

    } else if (value == "=") {

        //To do

    }

    

    let state1 = ((expArr.length % 2) == 0);
    let state2 = ((expArr.length % 2) != 0);

    // Numbers
    if (isNumber) {

        // First value must be a number
        if (expArr.length == 0) {

            numArr.push(value);
            input.innerHTML += `${numArr[numArr.length-1]}`;

        // Following numbers produce an output every time a number is input
        } else {

            numArr.push(value);
            input.innerHTML += `${numArr[numArr.length-1]}`;

            output.innerHTML = operations[currentOperator](+currentNumber, +numArr.join(""));

        }
        
    // Operators
    } else if (isOperator && numArr.length != 0 && state1) {

        let num = numArr.join("");

        // First operator populated expression array with two value but produces no output.
        if (expArr.length == 0) {

            expArr.push(num);
            expArr.push(value)
           
    
            currentOperator = value;
            currentNumber = +num;
    
            

        // Following operators reduce the output of the previous opertion.
        // Expression array is repopulated with new values.
        } else {

            currentNumber = operations[currentOperator](+currentNumber, +num)
            
            currentOperator = value;
            expArr = [currentNumber, currentOperator];
            
        }

        // Number array is cleared each time since we are inputing a new number after an operator.
        numArr = [];

        // Display the result in the input display.
        input.innerHTML += `${expArr[expArr.length-1]}`;
    }
});

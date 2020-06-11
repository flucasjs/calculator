// ---------- GLOBAL VARIABLES ---------- //

let input = document.getElementById("input");
let output = document.getElementById("output");
let currentNumber = 0;
let currentOperator = "";
let result = "";
let expArr = [];
let numArr = [];
let state = 0;

let operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
};

// ---------- EVENT LISTENERS ---------- //

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

        result = "";
        numArr = [];
        expArr = [];
        
        input.innerHTML = "";
        output.innerHTML = "";

    } else if (value == "ce") {
        
        if (numArr.length == 0) return;
        
        input.innerHTML = input.innerHTML.slice(0, -numArr.length);
        output.innerHTML = "";

        numArr = [];

    }

    let state1 = ((expArr.length % 2) == 0);
    let state2 = ((expArr.length % 2) != 0);

    // Numbers
    if (isNumber) {

        // First value must be a number
        if (expArr.length == 0) {

            result = "";
            numArr = [];
            numArr.push(value);
            input.innerHTML += `${numArr[numArr.length-1]}`;
            output.innerHTML = "";

        // Following numbers produce an output every time a number is input
        } else {

            numArr.push(value);
            input.innerHTML += `${numArr[numArr.length-1]}`;

            output.innerHTML = operations[currentOperator](+currentNumber, +numArr.join(""));

        }
        
    // Operators
    } else if (isOperator && numArr.length != 0 && state1) {

        let num = numArr.join("");
        
        // First operator populates expression array with two value but produces no output.
        if (expArr.length == 0) {
            
            
            
            if (value == "=") {

                return;

            } else {

                currentOperator = value;
                expArr.push(num);
                expArr.push(value);
                
            }
            
            currentNumber = +num;

            // Number array is cleared each time since we are inputing a new number after an operator.
            numArr = [];

            if (result != "") {

                input.innerHTML += `${result}${expArr[expArr.length-1]}`;
                result = "";

            } else {

                input.innerHTML += `${expArr[expArr.length-1]}`;

            }
            

        // Following operators reduce the output of the previous opertion.
        // Expression array is repopulated with new values.
        } else {

            if (value == "=") {

                result = operations[currentOperator](+currentNumber, +num);
                input.innerHTML = "";                

                expArr = [];
                numArr = result.toString(10).split("").map((str) => parseInt(str));

            } else {

                currentNumber = operations[currentOperator](+currentNumber, +num);
                currentOperator = value;
    
                expArr = [currentNumber, currentOperator];

                // Number array is cleared each time since we are inputing a new number after an operator.
                numArr = [];

                // Display the result in the input display.
                input.innerHTML += `${expArr[expArr.length-1]}`;

            }
            
        }

    }
});

// ---------- CLASS DEFINITIONS ---------- //

class Token {

    constructor(type, value) {

        this.type = type;
        this.value = value;

    }

}

// ---------- FUNCTION DEFINITIONS ---------- //

function tokenize(str) {

  var result = []; //array of tokens    
  str = buffer(str);
  
  
  str.forEach((char) => {
  
    if (isDigit(char)) {
  
      result.push(new Token("Literal", char));
  
    } else if (isLetter(char) && char.length == 1) {
  
      result.push(new Token("Variable", char));
  
    } else if (isOperator(char)) {
  
      result.push(new Token("Operator", char));
  
    } else if (isLeftParenthesis(char)) {
  
      result.push(new Token("Left Parenthesis", char));
  
    } else if (isRightParenthesis(char)) {
  
      result.push(new Token("Right Parenthesis", char));
  
    } else if (isComma(char)) {
  
      result.push(new Token("Function Argument Separator", char));
  
    } else if (isFunction(char)) {
    
          result.push(new Token("Function", char));
    
        } else if (isSeperator(char)) {
  
      result.push(new Token("Function Argument Seperator", char));
  
    }	
  
  });
  
  return result;
  
}

function buffer(str) {

  let numberBuffer = [];
  let letterBuffer = [];
  let result = [];
  
  str = str.replace(/\s+/g, "");
  str = str.split("");
  
  for (let i = 0; i < str.length; i++) {
  
    let ch = str[i];
  
    if (isDigit(ch)){
    
      numberBuffer.push(ch);
      
    } else if (isDecimal(ch)) {
    
      numberBuffer.push(ch);
    
    } else if (isLetter(ch)) {
    
      if (numberBuffer.length > 0) {
      
        result.push(numberBuffer.join(""));
        numberBuffer = [];
        
        result.push("*");
      
      }
      
      letterBuffer.push(ch);
    
    } else if (isOperator(ch)) {
    
      if (numberBuffer.length) {
      
        result.push(numberBuffer.join(""));
        numberBuffer = [];
      
      }
      
      if (letterBuffer.length) {
      
        for (let i = 0; i < letterBuffer.length; i++) {
  
          result.push(letterBuffer[0]);
  
        }
  
        letterBuffer = [];
      
      }
      
      result.push(ch);
    
    } else if (isLeftParenthesis(ch)) {
    
        if (letterBuffer.length > 0) {
  
          result.push(letterBuffer.join(""));
          letterBuffer = [];
          
         } 
         
         if (numberBuffer.length > 0) {
      
          result.push(numberBuffer.join(""));
          numberBuffer = [];
  
          result.push("*");
        }
        
        result.push(ch);
      
    } else if (isRightParenthesis(ch)) {
    
      if (letterBuffer.length > 0) {
      
        for (let i = 0; i < letterBuffer.length; i++) {
  
          result.push(letterBuffer[i]);
  
        }
      
        letterBuffer = [];
      
      } 
      
      if (numberBuffer.length > 0) {
      
        result.push(numberBuffer.join(""));
        numberBuffer = [];
      
      }
      
      result.push(ch);
    
    } else if (isComma(ch)) {
    
      result.push(numberBuffer.join(""));
      numberBuffer = [];
      
      
      for (let i = 0; i < letterBuffer.length; i++) {
      
        result.push(letterBuffer[i]);
      
      }
      
      letterBuffer = [];
      
      result.push(ch);
    
    }
    
  }
  
  if (letterBuffer.length > 0) {
      
        for (let i = 0; i < letterBuffer.length; i++) {
  
          result.push(letterBuffer[i]);
  
        }
      
        letterBuffer = [];
      
      } 
      
  if (numberBuffer.length > 0) {
  
    result.push(numberBuffer.join(""));
    numberBuffer = [];
  
  }
  
  return result;
  
}

function parse(inp) {

  Array.prototype.peek = function() { return this.slice(-1)[0]; };
  
  let outQueue = [];
  let opStack = [];
  
  let assoc = {  "^" : "right",  "*" : "left",  "/" : "left",  "+" : "left",  "-" : "left" };
  
  let prec = {  "^" : 4,  "*" : 3,  "/" : 3,  "+" : 2,  "-" : 2 };
  
  Token.prototype.precedence = function() { return prec[this.value]; };
  
  Token.prototype.associativity = function() { return assoc[this.value]; };
  
  let tokens = tokenize(inp);
  
  tokens.forEach( function(tkn) {
  
    console.log("token: " + tkn.value);
    
    if (opStack.length) {
    
    let x = opStack.map((item)=>item.value).join(",");
    
    console.log("op: " + x);
    
    } else {
    
    console.log("op: ");
    
    }
    
    if (outQueue.length) {
    
    let x = outQueue.map((item)=>item.value).join(",");
    
    console.log("out: " + x);
    
    } else {
    
    console.log("out: ");
    
    }
    
  
    if (tkn.type == "Literal" || tkn.type == "Letter") {
    
    
      outQueue.push(tkn);
    
    } else if (tkn.type == "Function") {
    
      opStack.push(tkn);
    
    } else if (tkn.type == "Function Argument Seperator") {
    
      if (opStack.length) {
      
        while (opStack.peek().value != "(") {
  
          outQueue.push(opStack.pop());
  
        }
      
      }
      
    
    } else if (tkn.type == "Operator") {
    
      if (opStack.length) {
        
        if (opStack.peek().type == "Operator") {
          
          let cond1 = (tkn.associativity() == "left") && ((tkn.precedence() < opStack.peek().precedence()) || (tkn.precedence() == opStack.peek().precedence()));
          let cond2 = (tkn.associativity() == "right") && (tkn.precedence() < opStack.peek().precedence());
  
          if (cond1 || cond2) {
  
            outQueue.push(opStack.pop());
  
          }
  
        }
      
      }
    
      opStack.push(tkn);
    
    } else if (tkn.type == "Left Parenthesis") {
    
      opStack.push(tkn);
    
    } else if (tkn.type == "Right Parenthesis") {
    
      if (opStack.length) {
      
          while (opStack.peek().value != "(") {
  
          outQueue.push(opStack.pop());
  
          }
      
      }
      
      
      opStack.pop();
    
    } else if (opStack.length && opStack.peek().type == "Left Parenthesis") {
    
      outQueue.push(opStack.pop);
    
    }
    
  });
  
  return outQueue.concat(opStack.reverse()).map((item)=>item.value).join(" ");
  
}

function isComma(ch) {

  return (ch === ",");
  
}
  
  function isDigit(ch) {
  
  return /\d/.test(ch);
  
}
  
  function isLetter(ch) {
  
  return /[a-z]/i.test(ch);
  
}
  
  function isOperator(ch) {
  
  return /\+|-|\*|\/|\^/.test(ch);
  
}
  
  function isLeftParenthesis(ch) {
  
  return (ch === "(");
  
}
  
  function isRightParenthesis(ch) {
  
  return (ch == ")");
  
}
  
  function isDecimal(ch) {
  
  return /\./.test(ch);
  
}
  
  function isFunction(ch) {
  
  return /sin|cos|tan|min|max/.test(ch);
  
}
  
  function isSeperator(ch) {
  
  return /,/.test(ch);
  
}










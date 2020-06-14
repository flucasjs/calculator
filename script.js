// ---------- GLOBAL VARIABLES ---------- //

let input = document.getElementById("input");
let output = document.getElementById("output");
let currentNumber = 0;
let currentOperator = "";
let result = "";
let expArr = [];
let numArr = [];
let state = 0;
let string = "";
let x = 0;

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
    
    string += value;
    
    result = parse(string);
    result = evaluate(result);

    if (value == "=") {

      string = result;

    } else if (value == "c") {

      string = "";
      result = "";

    }

    input.innerHTML = string;

    if (isNaN(value)) {

      output.innerHTML = "";

    } else {

      output.innerHTML = result;

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

  let assoc = {  "^": "right",  "*": "left",  "/": "left", "%": "left",  "+": "left",  "-": "left" };

  let prec = {  "^": 4,  "*": 3,  "/": 3, "%": 3,  "+": 2,  "-": 2 };

  Token.prototype.precedence = function() { return prec[this.value]; };

  Token.prototype.associativity = function() { return assoc[this.value]; };

  let tokens = tokenize(inp);

  tokens.forEach( function(tkn) {
    
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

  //return outQueue.concat(opStack.reverse()).map((item)=>item.value).join(" ");

  return outQueue.concat(opStack.reverse());

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

  return /\+|-|\*|\/|\^|\%/.test(ch);

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

function evaluate(rpnArr) {

  let numStack = [];

  let operations = {

      "+": (a, b) => +a + +b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": (a, b) => a / b,
      "^": (a, b) => a ** b,
      "%": (a, b) => a % b,

  };

  rpnArr.forEach( (tkn) => {

    if (tkn.type == "Literal") {
    
      numStack.push(tkn.value);
    
    } else if (tkn.type == "Operator") {
    
      let num2 = numStack.pop();
      let num1 = numStack.pop();

      numStack.push(operations[tkn.value](num1, num2));
    
    }
    
  });

  return numStack.pop();

}
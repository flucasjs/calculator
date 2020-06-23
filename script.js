// -------------------------------------------------- CLASS DEFINITIONS -------------------------------------------------- //


class Token {

  constructor(type, value) {

      this.type = type;
      this.value = value;

  }

}

class Calculator {

  constructor(expDisplay, ioDisplay) {

    this.expDisplay = expDisplay;
    this.ioDisplay = ioDisplay;
    this.input = "";
    this.output = "";
    this.previousInput = "";
    this.rpnTokenArray = [];
    this.expArray = [];
    //this.negateState = false;
    
  }

 
    // if ((isOperator(value) && isOperator(c.input.slice(-1))) || (prevInput == "ce" && value == "ce") || (c.input == "" && value == "ce")) {
      
    //   return;

    // } else if ((prevInput == "/" && value == "0")) {

    //   outputElement.innerHTML = "Cannot divide by zero ";
    //   divideByZeroError = true;
    //   return;

    // } else if (input == "" && isOperator(value)) {

    //   value = "0" + value;

    // }

    //   if (value == "ce") {

    //   c.input += value
      
    //   if (prevInput) {

    //     let replace = `${prevInput}${value}`
    //     c.input = c.input.replace(replace, '');

    //     c.output = evaluate(parse(c.input));
    //     inputElement.innerHTML = c.input;
      
    //   }

    // }



  newEntry(value) {

    if (isOperator(value) && this.input == "") {

      if (value == "-") {

        this.input += value;

      } else {

        this.input = "0" + value;
        this.previousInput = 0;

      }
      
    } else {
      
      this.input += value;
      this.previousInput += value;

      if (isOperator(this.previousInput.slice(-2)[0]) && isDigit(value)) {

        this.previousInput = value;

      }

    }

    this.expArr = tokenize(this.input);
    this.rpnTokenArray = parse(this.expArr);
    
  }

  calculate() {

    
    this.output = evaluate(this.rpnTokenArray);

  }

  updateExpressionDisplay() {


    if (this.rpnTokenArray.length > 1 || (this.input == "")) {

      this.expDisplay.innerHTML = this.expArr.map((item)=>item.value).join("");

    }

    
  }

  updateIODisplay() {

    if (this.expArr.slice(-1)[0] == undefined) {

      this.ioDisplay.innerHTML = "";

    } else if (this.expArr.slice(-1)[0].value == "=") {

      this.ioDisplay.innerHTML = this.input;

    } else if (!isOperator(this.expArr.slice(-1)[0].value)) {
      
      this.ioDisplay.innerHTML = this.expArr.slice(-1)[0].value;

    }

  }

  updateDisplay() {

    this.updateExpressionDisplay();
    this.updateIODisplay();

  }

  clear() {

    this.input = "";
    this.output = "";
    this.previousInput = "";
    this.negatesState = false;
    this.rpnTokenArray = [];
    this.expArr = [];

    this.updateDisplay();

  }

  equal() {


    this.calculate();
    this.input = this.output;
    this.output = "";
    this.expArr.push(new Token("Operator", "="));

    this.updateDisplay();

    this.expArr = [new Token("Literal", this.output)];

  }

  // negate() {

  //   this.negateState = this.negateState ? false : true;

  //   if (this.negateState == true) {

  //     this.input = this.input.splice((this.input.length - this.previousInput.length), this.previousInput.length, `-${this.previousInput}`);
  //     this.updateDisplay();

  //   } else {
      
  //     this.input = this.input.splice((this.input.length - this.previousInput.length - 1), this.previousInput.length + 1, `${this.previousInput}`);
  //     this.updateDisplay();

  //   }
    
  //}
  
}

// -------------------------------------------------- GLOBAL VARIABLES -------------------------------------------------- //

let expDisplay = document.getElementById("exp");
let ioDisplay = document.getElementById("io");

let c = new Calculator(expDisplay, ioDisplay);

let prevInput = "";

let operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
};

// -------------------------------------------------- EVENT LISTENERS -------------------------------------------------- //

document.querySelector(".content").addEventListener("click", (event) => {

    let element = event.target.closest(".key");

    if (!element) return;
    if (!document.querySelector(".content").contains(element)) return;

    let value = element.id;
    
    if (value == "c") {

      c.clear();
      return;

    }

    if (value == "=") {

      c.equal();
      return;

    }

    if (value == "+/-") {

      c.negate();
      return;

    }

    c.newEntry(value);
    c.updateDisplay();

});

// -------------------------------------------------- FUNCTION DEFINITIONS -------------------------------------------------- //

function tokenize(str) {

  var result = []; //array of tokens    
  tokenArr = buffer(str);

  prevInput = tokenArr.slice(-1)[0];

  tokenArr.forEach((char) => {

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
      
      } else {

        if (isNegative(ch)) {

          numberBuffer.push(ch);
          continue;

        }

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

function parse(tokenArr) {

  Array.prototype.peek = function() { return this.slice(-1)[0]; };

  let outQueue = [];
  let opStack = [];

  let assoc = {  "^": "right",  "*": "left",  "/": "left", "%": "left",  "+": "left",  "-": "left" };

  let prec = {  "^": 4,  "*": 3,  "/": 3, "%": 3,  "+": 2,  "-": 2 };

  Token.prototype.precedence = function() { return prec[this.value]; };

  Token.prototype.associativity = function() { return assoc[this.value]; };

  tokenArr.forEach( function(tkn) {
    
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

function isNegative(ch) {

  return /-/.test(ch);

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

      if (numStack.length) {

        let num2 = numStack.pop();

        numStack.push(operations[tkn.value](numStack.pop(), num2));

      } else if (isNegative(tkn.value)) {

        numStack.push(tkn.value);

      }
    
      

    }
    
  });

  return numStack.pop();

}

// if (!String.prototype.splice) {

//   String.prototype.splice = function(start, delCount, newSubStr) {
//       return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
//   };

// }

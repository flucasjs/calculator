// -------------------------------------------------- CLASS DEFINITIONS -------------------------------------------------- //


class Token {

  constructor(type, value, valid) {

      this.type = type;
      this.value = value;
      this.valid = valid;

  }

}

class Calculator {

  constructor(expDisplay, ioDisplay) {

    this.expDisplay = expDisplay;
    this.ioDisplay = ioDisplay;
    this.input = "";
    this.output = "";
    this.rpnTokenArray = [];
    this.expArr = [];
    
  }


  newEntry(value) {

    if (this.divisionErrorFlag == 1) {

      this.divisionErrorFlag = 0;
      this.clear();

    }

    if (isOperator(value)) {

      if (this.expArr.length == 0) {

        this.input = "0" + value;

      } else if (this.expArr.length == 1 && this.output != 0) {

        if (this.input.slice(-1) == ".") { 

          this.input = this.input.slice(0, -1) + value;

        } else {

          this.input = this.output + value;

        }

      } else if (this.expArr.slice(-1)[0].type == "Operator") {

        if (this.input.slice(0, 1) == 0) {

          this.input = "0" + value;

        } else if (this.expArr.slice(-1)[0].value != value) {

          this.input = this.input.slice(0, this.input.length - 1) + value;

          this.expArr.pop();

        } else {
          
          if ((this.expArr.slice(-2)[0].value) != this.ioDisplay.innerHTML) {

            return;

          } else {

            return;

          }
        }

      } else {

        this.input += value;

      }
      
    } else {

      if (this.input.slice(-1) == "." && value == ".") { return; }

      if (value == ".") {

        if (this.expArr.length != 0 && this.expArr.slice(-1)[0].type != "Operator" && Number(this.ioDisplay.innerHTML) == this.ioDisplay.innerHTML && this.ioDisplay.innerHTML % 1 != 0) { return; };

        if (this.input.slice(-1) == ".") {

          return;

        } else if (this.expArr != undefined && (this.expArr.length == 0 || this.expArr.length % 2 == 0) ) {

          this.input += "0";

        }

      }

      if (this.expArr.length != 0 && this.expArr.slice(-1)[0].value.toString().slice(0, 1) == "0" && value != "." && this.output % 1 == 0 && this.ioDisplay.innerHTML != "0." || !isFinite(this.output)) {
        
        if (value == "0") {

          return;

        } else {

          this.input = this.input.slice(0, this.input.length - 1);

        }

      }
      
      this.input += value;

    }

    this.expArr = tokenize(this.input);
    this.rpnTokenArray = parse(this.expArr);
    
  }

  calculate() {

    this.output = Number(evaluate(this.rpnTokenArray));

  }

  updateExpressionDisplay() {

      if (this.expArr.length == 1) {

        if (this.expArr[0].type == "Literal") {

          this.expDisplay.innerHTML = "";

        }
        
      } else if (this.expArr.length % 2 != 0) {

        let temp = this.expArr.pop();

        this.expDisplay.innerHTML = this.expArr.map((item)=>item.value).join(" ");

        this.expArr.push(temp);

      } else {

        this.expDisplay.innerHTML = this.expArr.map((item)=>item.value).join(" ");

      }

  }

  updateIODisplay() {

    if (this.divisionErrorFlag == 1) { 
      
      this.ioDisplay.innerHTML = "Cannot Divide By Zero"; 

    } else if (this.expArr.length == 0 ) {

      this.ioDisplay.innerHTML = "0"; 

    } else if (this.expArr.slice(-1)[0].value == "=") {
      
      if (this.output % 1 != 0) {

        let num1 = (this.expArr.slice(-4)[0].value).toString();
        let num2 = (this.expArr.slice(-2)[0].value).toString();
      
        let num1P = num1.length - 1;
        let num2P = num2.length - 1;

        if (num1P > num2P) {

          this.output = Number(parseFloat(this.output).toPrecision(num1P));

        } else {

          this.output = Number(parseFloat(this.output).toPrecision(num2P));

        }

      }

      this.ioDisplay.innerHTML = this.output;
      
    } else if (this.expArr.length > 0 && this.expArr.length < 3) {
      
      this.ioDisplay.innerHTML = this.expArr[0].value;

    } else if (this.expArr.length % 2 != 0) {

      this.ioDisplay.innerHTML = this.expArr[this.expArr.length - 1].value;

    } else if (this.expArr.length % 2 == 0) {

      this.ioDisplay.innerHTML = this.output;

    }

  }

  updateDisplay() {

    this.updateExpressionDisplay();
    this.updateIODisplay();

  }

  clear() {

    this.input = "";
    this.output = "";
    this.rpnTokenArray = [];
    this.expArr = [];
    this.divisionErrorFlag = 0;
    this.updateDisplay();

  }

  clearExpression() {

    if (this.expArr.length == 0 || this.expArr.slice(-1)[0].type == "Operator") { 
      
      if (this.ioDisplay.innerHTML != "0") {

        this.newEntry(0);
        this.calculate();
        this.updateDisplay();

      }

      return; 

    } else if (this.divisionErrorFlag == 1) {

      this.clear();
      return;
    
    };

    let entryLen = this.expArr.slice(-1)[0].value.toString().length

    let newLen = this.input.length - entryLen;
    
    this.expArr.pop();

    this.rpnTokenArray = parse(this.expArr);

    this.input = this.input.slice(0, newLen);

    this.newEntry(0);

    this.calculate();

    this.updateDisplay();

  }

  equal() {

    if (this.expArr.length == 0) { 

      this.expArr.push(new Token("Literal", 0, 1));
      this.expArr.push(new Token("Equal", "=", 0));
      this.updateDisplay();
      this.expArr = [];
      return;

    } else if (this.expArr[this.expArr.length - 1].value.toString().slice(-1) == ".") {

      this.input = this.input.slice(0, -1);
      this.expArr[this.expArr.length - 1] = new Token("Literal", this.expArr[this.expArr.length - 1].value.slice(0, -1), 1);
      this.updateDisplay();

    } else if (this.expArr.slice(-1)[0].type == "Operator") {

      this.expArr.push(new Token("Literal", 0, 1));

    }

    this.calculate();
    this.input = "";
    this.expArr.push(new Token("Equal", "=", 0));

    if (this.output == "Infinity" || this.output == "-Infinity") { 

      this.divisionErrorFlag = 1;
    
    }

    this.updateDisplay();

    this.expArr = [new Token("Literal", Number(this.output), 1)];

  }

  negate() {

    if (this.expArr.slice(-1)[0].type == "Literal") {

      let temp = this.expArr[this.expArr.length - 1].value;

      if (this.expArr.slice(-1)[0].value == "0.") {

        this.expArr[this.expArr.length - 1].value = "-" + temp

      } else {

        this.expArr[this.expArr.length - 1].value *= -1;

      }
      

      this.input = this.expArr.map(item=>item.value).join(" ");

    }

  }
  
}

// -------------------------------------------------- GLOBAL VARIABLES -------------------------------------------------- //

let expDisplay = document.getElementById("exp");
let ioDisplay = document.getElementById("io");

let c = new Calculator(expDisplay, ioDisplay);

let operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "÷": (a, b) => a / b,
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

    if (value == "ce") {

      c.clearExpression();
      return;

    }

    if (value == "negate") {

      c.negate();
      value = "";

    }

    c.newEntry(value);
    c.calculate();
    c.updateDisplay();

});

// -------------------------------------------------- FUNCTION DEFINITIONS -------------------------------------------------- //

function tokenize(str) {

  var result = []; //array of tokens    
  tokenArr = buffer(str);

  tokenArr.forEach((char, i) => {

    if (isDigit(char)) {

      result.push(new Token("Literal", char, 1));

    } else if (isLetter(char) && char.length == 1) {

      result.push(new Token("Variable", char, 1));

    } else if (isOperator(char)) {

      if (i+1 == tokenArr.length && isOperator(char)) {

        result.push(new Token("Operator", char, 0));
    
      } else {

        result.push(new Token("Operator", char, 1));

      }

    } else if (isEqualitySign(char)){

      result.push(new Token("Equal", char, 0));

    } else if (isLeftParenthesis(char)) {

      result.push(new Token("Left Parenthesis", char, 1));

    } else if (isRightParenthesis(char)) {

      result.push(new Token("Right Parenthesis", char, 1));

    } else if (isComma(char)) {

      result.push(new Token("Function Argument Separator", char, 1));

    } else if (isFunction(char)) {
    
          result.push(new Token("Function", char, 1));
    
        } else if (isSeperator(char)) {

      result.push(new Token("Function Argument Seperator", char, 1));

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
    
      if (numberBuffer.length == 0 && ch == "-") {
      
        numberBuffer.push(ch);
        continue;
      
      } else {

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

function parse(tokenArr) {

  Array.prototype.peek = function() { return this.slice(-1)[0]; };

  let outQueue = [];
  let opStack = [];

  let assoc = {  "^": "right",  "*": "left",  "/": "left", "%": "left",  "+": "left",  "-": "left" };

  let prec = {  "^": 4,  "*": 3,  "/": 3, "%": 3,  "+": 2,  "-": 2 };

  Token.prototype.precedence = function() { return prec[this.value]; };

  Token.prototype.associativity = function() { return assoc[this.value]; };

  tokenArr.forEach( function(tkn) {

    if (!tkn.valid) { tkn.valid = 1; return; }
    
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

  return /\+|-|\*|÷|\^|\%/.test(ch);

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

function isEqualitySign(ch) {

  return /=/.test(ch);

}

function evaluate(rpnArr) {

  let numStack = [];

  let operations = {

      "+": (a, b) => +a + +b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "÷": (a, b) => a / b,
      "^": (a, b) => a ** b,
      "%": (a, b) => a % b,

  };

  rpnArr.forEach( (tkn) => {

    if (tkn.type == "Literal") {
    
      numStack.push(tkn.value);
    
    } else if (tkn.type == "Operator") {

      if (numStack.length >= 2) {

        let num2 = numStack.pop();

        numStack.push(operations[tkn.value](numStack.pop(), num2));

      }

    }
    
  });

  return numStack.pop();

}

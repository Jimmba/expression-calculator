function eval() {
    // Do not use eval!!!
    return;
}
function expressionCalculator(expr) {
    // write your solution here
    expr=deleteSpaces(expr);
    if (checkExpression(expr) == true){
      expr=calculateExpression(expr);
    }
    return expr;
}

function deleteSpaces(expr){
  let count = expr.indexOf(" ");
  while (count!=-1){
    expr=changeExpression(expr, count, count, "");
    count = expr.indexOf(" ");
    //console.log(expr);
  }
  return expr;
}

function changeExpression(expression, startPosition, endPosition, newExpression){
  let firstPart=expression.slice(0,startPosition);
  let secondPart=expression.slice(endPosition+1, expression.length);
  return firstPart+newExpression+secondPart;
}

function checkExpression(expr){
  let check=true;
  let chkBr=checkBrackets(expr);
  let chkDevZero=checkDevisionByZero(expr);

  if (chkBr ==true){
    if(chkDevZero!= true){
      check=chkDevZero;
    }
  }else{
    check=chkBr;
  }
  // if (checkBrackets(expr)!=false || checkDevisionByZero(expr)==false){
  //   check=false;
  // }
  return check;
}

function checkBrackets(expr){
  let check=true;
  let bracketsStack=[];
  for (let i=0; i<expr.length; i++){
    let symbol=expr[i];
    if (symbol=="("){
      bracketsStack.push("(");
    }
    if (symbol==")"){
      if (bracketsStack.length==0){
        throw new Error("ExpressionError: Brackets must be paired");
      }else{
        bracketsStack.pop();
      }
    }
  }
  if (bracketsStack.length>0){
    throw new Error("ExpressionError: Brackets must be paired");
  }
  return check;
}

function checkDevisionByZero(expr){
  let check=true;
  if (expr.indexOf("/0")!=-1){
    throw new Error("TypeError: Division by zero.");
  }
  return check;
}

function calculateExpression(expr){
  let newExpression;
  let brackets=getBrackets(expr);
  while(brackets[0]!=-1){
    newExpression=calculateBrackets(expr.slice(brackets[0]+1, brackets[1]));
    expr=changeExpression(expr, brackets[0], brackets[1], newExpression);
    brackets=getBrackets(expr);
  }
  expr=+calculateBrackets(expr);
  //console.log("RESULT " + expr);
  return expr;
}

function getBrackets(expr){
  let plus=true;
  let endBracket=expr.indexOf(")");
  let startBracket=expr.lastIndexOf("(", endBracket);
  return [startBracket, endBracket];
}

function calculateBrackets(expr){
  //console.log("Вычисление " + expr);
  expr=calcMultiplyDivision(expr);
  expr=calcAdditionSubstraction(expr);
  return expr;
}

function calcMultiplyDivision(expr){
    let position, num, elements=[];
    multiplyPosition=expr.indexOf("*");
    divisionPosition=expr.indexOf("/");
    while (multiplyPosition!=-1 || divisionPosition !=-1){
        if ((multiplyPosition<divisionPosition && multiplyPosition!=-1)|| divisionPosition==-1){
            position=expr.indexOf("*");
            elements=getElements(expr, position);
            num=elements[0]*elements[1];
            expr=changeExpression(expr, elements[2], elements[3], num);
        }else{
            position=expr.indexOf("/");
            elements=getElements(expr, position);
            //num=elements[0]/elements[1];
            if(Math.abs(elements[1]/elements[0])>1000000000){
              num=0;
            }else{
              num=elements[0]/elements[1];
            }
            expr=changeExpression(expr, elements[2], elements[3], num);
            position=expr.indexOf("/");
        }
        multiplyPosition=expr.indexOf("*");
        divisionPosition=expr.indexOf("/");
    }
  return expr;
}

function calcAdditionSubstraction(expr){
    let position, num, elements=[];
    while(expr.indexOf("+")!=-1 || expr.indexOf("-",1)!=-1){
        additionPosition=expr.indexOf("+");
        substractionPosition=expr.indexOf("-",1);
        if ((substractionPosition<additionPosition && substractionPosition!=-1) || additionPosition==-1){
            //Substraction
            position=expr.indexOf("-",1);
            elements=getElements(expr, position);
            num=elements[0]-elements[1];
            expr=changeExpression(expr, elements[2], elements[3], num);
        }else{
            //Addition
            position=expr.indexOf("+");
            elements=getElements(expr, position);
            num=+(elements[0])+(+elements[1]);
            expr=changeExpression(expr, elements[2], elements[3], num);
        }
    }
  return expr;
}

function getElements(expr, pos){
    let firstNumber, secondNumber, startPosition, endPosition;
    let counter=1;
  
    while (((pos-counter)!= 0)&&(expr[pos-counter]!="+") && (expr[pos-counter]!="-") && (expr[pos-counter]!="*") && (expr[pos-counter]!="/")){
        counter++;
    }
    if (pos==counter){
        startPosition=0;
    }else{
        startPosition=pos-counter+1;
    }

    firstNumber=expr.slice(startPosition, pos);

    //end position
    if (expr[pos+1]=="-"){
        counter=2;
    }else{
        counter=1;
    }
    while (expr[pos+counter]!="+" && expr[pos+counter]!="-" && expr[pos+counter]!="*" && expr[pos+counter]!="/" && pos+counter!=expr.length){
        counter++;
    }
    endPosition=pos+counter;
    secondNumber=expr.slice(pos+1, endPosition);
    endPosition--;
    return [firstNumber, secondNumber, startPosition, endPosition];
}


module.exports = {
    expressionCalculator
}
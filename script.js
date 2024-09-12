console.log("hi");
console.log(operate("+", 7, 4));
console.log(operate("-", 7, 4));
console.log(operate("/", 7, 4));
console.log(operate("*", 7, 4));
console.log(operate("^", 7, 4));

function operate(operator, firstOperand, secondOperand) {
    switch(operator) {
        case '+':
            return add(firstOperand, secondOperand);
            break;
        case '-':
            return sub(firstOperand, secondOperand);
            break;
        case '/':
            return div(firstOperand, secondOperand);
            break;
        case '*':
            return mul(firstOperand, secondOperand);
        case '^':
            return exp(firstOperand, secondOperand);
    }
}

function add(first, second){
    return first + second;
}

function sub(first, second){
    return first - second;
}

function mul(first, second){
    return first * second;
}

function div(first, second){
    return first / second;
}

function exp(operand, exponent){
    return operand ** exponent;
}
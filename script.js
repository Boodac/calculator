const DISPLAY = { negation:"—", toptext:"", bottomtext:""};
const EQUAL = {symbol: "=", id: "equal", value: null};
const CLEAR = {symbol:"AC", id:"allclear", value: null};
const DEL = {symbol: "←", id:"backspace", value: null}
const MUL = {symbol:"*", id: "multiply", value: null};
const SUB = {symbol: "-", id: "subtract", value: null};
const DIV = {symbol: "/", id: "divide", value: null};
const EXP = {symbol: "^", id: "exponent", value: null};
const NEG = {symbol: "±", id: "signflip", value: null};
const ADD = {symbol: "+", id: "add", value: null};
const DEC = {symbol: ".", id: "decimal", value: "."};
const ONE = {symbol: "1", id: "1", value: 1};
const TWO = {symbol: "2", id: "2", value: 2};
const THREE = {symbol: "3", id: "3", value: 3};
const FOUR = {symbol: "4", id: "4", value: 4};
const FIVE = {symbol: "5", id: "5", value: 5};
const SIX = {symbol: "6", id: "6", value: 6};
const SEVEN = {symbol: "7", id: "7", value: 7};
const EIGHT = {symbol: "8", id: "8", value: 8};
const NINE = {symbol: "9", id: "9", value: 9};
const ZERO = {symbol: "0", id: "0", value: 0};
let isNegative = 0;
let globalLastOp = {};

// b_ constants for buttons
const b_1 = document.getElementById(ONE.id);
b_1.textContent = ONE.symbol;
b_1.addEventListener("click", (e) => update(ONE));

const b_2 = document.getElementById(TWO.id);
b_2.textContent = TWO.symbol;
b_2.addEventListener("click", (e) => update(TWO));

const b_3 = document.getElementById(THREE.id);
b_3.textContent = THREE.symbol
b_3.addEventListener("click", (e) => update(THREE));

const b_4 = document.getElementById(FOUR.id);
b_4.textContent = FOUR.symbol;
b_4.addEventListener("click", (e) => update(FOUR));

const b_5 = document.getElementById(FIVE.id);
b_5.textContent = FIVE.symbol;
b_5.addEventListener("click", (e) => update(FIVE));

const b_6 = document.getElementById(SIX.id);
b_6.textContent = SIX.symbol;
b_6.addEventListener("click", (e) => update(SIX));

const b_7 = document.getElementById(SEVEN.id);
b_7.textContent = SEVEN.symbol;
b_7.addEventListener("click", (e) => update(SEVEN));

const b_8 = document.getElementById(EIGHT.id);
b_8.textContent = EIGHT.symbol;
b_8.addEventListener("click", (e) => update(EIGHT));

const b_9 = document.getElementById(NINE.id);
b_9.textContent = NINE.symbol;
b_9.addEventListener("click", (e) => update(NINE));

const b_0 = document.getElementById(ZERO.id);
b_0.textContent = ZERO.symbol;
b_0.addEventListener("click", (e) => update(ZERO))

const b_ac = document.getElementById(CLEAR.id);
b_ac.textContent = CLEAR.symbol;
b_ac.addEventListener("click", (e) => update(CLEAR));

const b_c = document.getElementById(DEL.id);
b_c.textContent = DEL.symbol;
b_c.addEventListener("click", (e) => update(DEL));

const b_dec = document.getElementById(DEC.id);
b_dec.textContent = DEC.symbol;
b_dec.addEventListener("click", (e) => update(DEC));

const b_mul = document.getElementById(MUL.id);
b_mul.textContent = MUL.symbol; 
b_mul.addEventListener("click", (e) => update(MUL));

const b_div = document.getElementById(DIV.id);
b_div.textContent = DIV.symbol;
b_div.addEventListener("click", (e) => update(DIV));

const b_add = document.getElementById(ADD.id);
b_add.textContent = ADD.symbol;
b_add.addEventListener("click", (e) => update(ADD));

const b_sub = document.getElementById(SUB.id);
b_sub.textContent = SUB.symbol;
b_sub.addEventListener("click", (e) => update(SUB));

const b_eq = document.getElementById(EQUAL.id);
b_eq.textContent = EQUAL.symbol;
b_eq.addEventListener("click", (e) => update(EQUAL));

const b_neg = document.getElementById(NEG.id);
b_neg.textContent = NEG.symbol;
b_neg.addEventListener("click", (e) => update(NEG));

const b_exp = document.getElementById(EXP.id);
b_exp.textContent = EXP.symbol;
b_exp.addEventListener("click", (e) => update(EXP));

// d_ constants for display elements, these will be set by refresh();
const d_top = document.getElementById("opDisplay");
const d_bot = document.getElementById("currDisplay");
const d_negation = document.getElementById("negation");
d_negation.style.visibility = "hidden";

/** PROGRAM LOGIC  */

refresh();

//DISPLAY FUNCTIONS

function refresh(){
    //this handles any leading zeros.
    for(let i = 0; i < DISPLAY.bottomtext.split("").length;i++){
        if(DISPLAY.bottomtext.split("")[0] === "0" && 
            DISPLAY.bottomtext.split("")[1] && 
            DISPLAY.bottomtext.split("")[1] !== "."){
                DISPLAY.bottomtext = DISPLAY.bottomtext.substring(1);
        }
        else break;
    }
    d_top.textContent=DISPLAY.toptext;
    d_bot.textContent=DISPLAY.bottomtext;
}

function assembleNumber(pressed) { 
    if(DISPLAY.bottomtext.length > 28) return;
    if(pressed.id === "decimal") {
        if(DISPLAY.bottomtext.indexOf(".") !== -1) {
            console.error("Decimal key pressed. Ignored as there is already a floating point.")
            return;
        }
        else {
            if(DISPLAY.bottomtext.length === 0) {
                DISPLAY.bottomtext += ZERO.value + pressed.value;                
                return;
            }
        }
    }
    DISPLAY.bottomtext+=pressed.value;
    refresh();
}

//BUTTON FUNCTIONS

function update(pressed){
    if(pressed.value !== null){
        console.log(pressed);
        assembleNumber(pressed);
    };
    switch(pressed.id) {
        case MUL.id:
            break;
        case SUB.id:
            break;
        case DEL.id:
            DISPLAY.bottomtext = DISPLAY.bottomtext.slice(0, -1);
            break;
        case CLEAR.id:
            DISPLAY.toptext = '';
            DISPLAY.bottomtext = '';
            globalLastOp = {};
            break;
        case EQUAL.id:
            break;
        case DIV.id:
            break;
        case EXP.id:
            break;
        case NEG.id:
            if(!isNegative) { d_negation.style.visibility = "visible"; isNegative = 1; }
            else { d_negation.style.visibility = "hidden"; isNegative = 0; }
        case ADD.id:
            break;
    }
    globalLastOp = pressed;
    refresh();
}

// MATH FUNCTIONS

function operate(operator, secondOperand, firstOperand = 0) {
    switch(operator) {
        case ADD:
            return add(firstOperand, secondOperand);
            break;
        case SUB:
            return sub(firstOperand, secondOperand);
            break;
        case DIV:
            return div(firstOperand, secondOperand);
            break;
        case MUL:
            return mul(firstOperand, secondOperand);
            break;
        case EXP:
            return exp(firstOperand, secondOperand);
            break;
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
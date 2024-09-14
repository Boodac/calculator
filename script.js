// Hey stranger!  Current version: v0.32

const marquee = document.getElementById("marquee");
const DISPLAY = { currSign:"",negation:"—", toptext:"", bottomtext:"", isError : '' };
const NEGATIVE = "-";
const EQUAL = {symbol: "=", id: "equal", value: null, code: ["Equal", "NumpadEnter"]};
const CLEAR = {symbol:"AC", id:"allclear", value: null, code: ["KeyC", "Escape"]};
const DEL = {symbol: "←", id:"backspace", value: null, code: ["Backspace", "Delete"]}
const MUL = {symbol:"*", id: "multiply", value: null, code: ["NumpadMultiply"]};
const SUB = {symbol: "-", id: "subtract", value: null, code: ["Minus", "NumpadSubtract"]};
const DIV = {symbol: "÷", id: "divide", value: null, code: ["Slash", "NumpadDivide"]};
const EXP = {symbol: "^", id: "exponent", value: null, code: [""]};
const NEG = {symbol: "±", id: "signflip", value: null, code: [""]};
const ADD = {symbol: "+", id: "add", value: null, code: ["NumpadAdd"]};
const DEC = {symbol: ".", id: "decimal", value: ".", code: ["Period", "NumpadDecimal"]};
const ONE = {symbol: "1", id: "1", value: 1, code: ["Digit1", "Numpad1"]};
const TWO = {symbol: "2", id: "2", value: 2, code: ["Digit2", "Numpad2"]};
const THREE = {symbol: "3", id: "3", value: 3, code: ["Digit3", "Numpad3"]};
const FOUR = {symbol: "4", id: "4", value: 4, code: ["Digit4", "Numpad4"]};
const FIVE = {symbol: "5", id: "5", value: 5, code: ["Digit5", "Numpad5"]};
const SIX = {symbol: "6", id: "6", value: 6, code: ["Digit6", "Numpad6"]};
const SEVEN = {symbol: "7", id: "7", value: 7, code: ["Digit7", "Numpad7"]};
const EIGHT = {symbol: "8", id: "8", value: 8, code: ["Digit8", "Numpad8"]};
const NINE = {symbol: "9", id: "9", value: 9, code: ["Digit9", "Numpad9"]};
const ZERO = {symbol: "0", id: "0", value: 0, code: ["Digit0", "Numpad0"]};
let globalLastOp = {};

let errFlag = 0;

DISPLAY.isError = function () {
    if(Number.isNaN(DISPLAY.toptext)) return true;
    if(DISPLAY.toptext > Number.MAX_SAFE_INTEGER) return true;
    else if (DISPLAY.toptext && DISPLAY.bottomtext && !DISPLAY.currSign) return true;
    else return false;
}

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
d_negation.textContent = DISPLAY.negation;
d_negation.style.visibility = "hidden";
d_negation.toggle = function () {
    if(!DISPLAY.toptext && d_negation.style.visibility === "visible") { d_negation.style.visibility = "hidden"; }
    else if(!DISPLAY.toptext && d_negation.style.visibility === "hidden") { d_negation.style.visibility = "visible"; }
    else if(DISPLAY.toptext && !DISPLAY.bottomtext) {
        if(DISPLAY.toptext.toString().charAt(0) === NEGATIVE) {
            DISPLAY.toptext = DISPLAY.toptext.substring(1);
        }
        else DISPLAY.toptext = NEGATIVE + DISPLAY.toptext;
    }
    else if(DISPLAY.toptext && DISPLAY.bottomtext) {
        if(DISPLAY.bottomtext.charAt(0) === NEGATIVE) {
            DISPLAY.bottomtext = DISPLAY.bottomtext.substring(1);
        }
        else DISPLAY.bottomtext = NEGATIVE + DISPLAY.bottomtext;
    }
    refresh();
}
d_negation.isShown = function () {
    return d_negation.style.visibility === "visible";
}
const d_currOp = document.getElementById("currOp");

// INITIATE MAIN PROGRAM

refresh(); // lol

// DISPLAY FUNCTIONS

function assembleOperand(pressed) {
    if(DISPLAY.bottomtext.length > 20) { 
        marquee.textContent = "Yeah, this isn't that kind of calculator. Calm down.";
        return; }
    if((DISPLAY.toptext || DISPLAY.toptext === 0) && (!DISPLAY.bottomtext && DISPLAY.bottomtext !== 0) && !DISPLAY.currSign) {
        marquee.textContent = "I'm pretty sure you want an operator here...";
        return; }
    if(DISPLAY.bottomtext === ZERO.symbol && pressed === ZERO) {
        marquee.textContent = "I have no idea what you plan to do with that many zeroes.";
        return; }
    if(pressed === DEC) {
        if(DISPLAY.bottomtext.indexOf(".") !== -1) { 
            marquee.textContent = "Are you trying to type in an IP address or something?";
            return; }
        if((!DISPLAY.bottomtext && DISPLAY.bottomtext !== 0)) {
            marquee.textContent = "Floating points, eh? Well, alright...";
            DISPLAY.bottomtext = ZERO.symbol + DEC.symbol;
            refresh(); return;
        } else {
            if(DISPLAY.bottomtext.length === 0) {
                DISPLAY.bottomtext += ZERO.value + pressed.value;
                refresh(); return;
            }
        }
    }
    DISPLAY.bottomtext += pressed.value;
    marquee.textContent = "Building...";
    refresh();
}

function refresh(){
    d_top.textContent = DISPLAY.toptext;
    d_bot.textContent = DISPLAY.bottomtext;
    d_currOp.textContent = DISPLAY.currSign;
    if(DISPLAY.isError()) error();
    // these are memes
    if(DISPLAY.toptext === "69") marquee.textContent = "Nice.";
    if(DISPLAY.toptext === "5318008") marquee.textContent = "Quick! Flip your screen!";
    if(DISPLAY.toptext === Math.E) marquee.textContent = "Euler's number?! That's impressive.";
    // memes complete
}

function error() {
    errFlag = 1;
    d_top.textContent = "HOW MUCH TIME";
    d_bot.textContent = "DO YOU HAVE?";
    marquee.textContent = "Uh oh! Press any key to reset.";
}

//BUTTON FUNCTIONS

function update(pressed){
    marquee.textContent = "Executing...";
    if(pressed === DEL) { backspace(); return; } // grab the backspace key
    if(pressed === CLEAR) { reset(); refresh(); return; } // grab the AC key
    if(errFlag) { reset(); errFlag = 0; refresh(); return; }; // break display on infinity
    if(pressed.value !== null) { assembleOperand(pressed); return; } // if 0-9 or a decimal, populate the display
    if(pressed === NEG) { d_negation.toggle(); return; } // allow user to toggle negation with a blank screen
    if((!DISPLAY.bottomtext && DISPLAY.bottomtext !== 0) && (!DISPLAY.toptext && DISPLAY.toptext !== 0)) return; // operators don't work until the display is populated
    if(pressed === EQUAL) { equalOut(); return; } // equals sign
    if((DISPLAY.toptext || DISPLAY.toptext === 0) && 
        (DISPLAY.bottomtext || DISPLAY.bottomtext === 0) && 
        DISPLAY.currSign) { // this triggers a calculation when you use a new operator as an equals sign for a previous operation
        DISPLAY.toptext = operate(globalLastOp, DISPLAY.bottomtext, DISPLAY.toptext);
        DISPLAY.bottomtext = "";
        DISPLAY.currSign = pressed.symbol;
        globalLastOp = pressed;
    }
    if(!DISPLAY.toptext && DISPLAY.toptext !== 0) { // this handles the first operation pressed
        if(negation.isShown()) { DISPLAY.bottomtext = NEGATIVE + DISPLAY.bottomtext; negation.toggle(); }
        DISPLAY.toptext = DISPLAY.bottomtext; 
        if(pressed !== EQUAL) DISPLAY.currSign = pressed.symbol; 
        DISPLAY.bottomtext = "";
    }
    if((!DISPLAY.bottomtext && DISPLAY.bottomtext !== 0)) { // this is changing operators when all else has failed
        DISPLAY.currSign = pressed.symbol; globalLastOp = pressed; 
    }
    refresh();
}

function equalOut() { 
    if((DISPLAY.toptext || DISPLAY.toptext === 0) && (!DISPLAY.bottomtext && DISPLAY.bottomtext !== 0)) return;
    if((DISPLAY.toptext || DISPLAY.toptext === 0) && (DISPLAY.bottomtext || DISPLAY.bottomtext == 0) && !DISPLAY.currSign) return;
    if ((!DISPLAY.toptext && DISPLAY.toptext !== 0)) {
        if(d_negation.isShown()) {
            DISPLAY.bottomtext = NEGATIVE + DISPLAY.bottomtext;
            d_negation.toggle();
        }
        DISPLAY.toptext = DISPLAY.bottomtext;
        DISPLAY.bottomtext = "";
    }
    else if((DISPLAY.toptext || DISPLAY.toptext === 0) && (DISPLAY.bottomtext || DISPLAY.bottomtext === 0) && DISPLAY.currSign) {
        DISPLAY.currSign = "";
        DISPLAY.toptext = operate(globalLastOp, DISPLAY.bottomtext, DISPLAY.toptext);
        DISPLAY.bottomtext = "";
    }
    else {
        DISPLAY.toptext = operate(globalLastOp, DISPLAY.bottomtext, DISPLAY.toptext);
        DISPLAY.bottomtext = "";
        DISPLAY.currSign = globalLastOp.symbol;
    }
    refresh();
    return;
}

function reset() {
    console.clear();
    console.log("All clear!");
    DISPLAY.toptext = '';
    DISPLAY.bottomtext = '';
    DISPLAY.currSign = "";
    d_negation.style.visibility = "hidden";
    globalLastOp = {};
    marquee.textContent = "All Clear! Enter a number to continue.";
}

function backspace() {
    if(errFlag) {
        console.error ("Nah, it's messed up. Resetting instead!");
        reset(); errFlag=0; return;
    }
    if( DISPLAY.toptext > Number.MAX_SAFE_INTEGER ||
        DISPLAY.bottomtext > Number.MAX_SAFE_INTEGER) { 
        console.error("We're gonna assume you meant to clear it.");
        reset(); return; 
    }
    if(DISPLAY.bottomtext) DISPLAY.bottomtext = DISPLAY.bottomtext.toString().slice(0, -1);
    else if(DISPLAY.currSign) {
        DISPLAY.currSign = "";
        DISPLAY.bottomtext = DISPLAY.toptext;
        DISPLAY.toptext = "";
    }
    else if(DISPLAY.toptext) DISPLAY.toptext = DISPLAY.toptext.toString().slice(0, -1);
    marquee.textContent = "Undoing...";
    refresh();
}

// MATH FUNCTIONS

function operate(operator, firstOperand, secondOperand) {
    let expectedPrecision = 0;
    if(firstOperand.toString().includes(DEC.symbol)) {
        expectedPrecision = firstOperand.toString().split(DEC.symbol)[1].length;
    }
    if(secondOperand.toString().includes(DEC.symbol)) {
        if(secondOperand.toString().split(DEC.symbol)[1].length > expectedPrecision){
            expectedPrecision = secondOperand.toString().split(DEC.symbol)[1].length;
        }
    }
    if(expectedPrecision > 0) {
        switch(operator) {
            case ADD:
                return add(firstOperand, secondOperand).toFixed(expectedPrecision);
            case SUB:
                return sub(secondOperand, firstOperand).toFixed(expectedPrecision);
            case DIV:
                return div(secondOperand, firstOperand).toFixed(expectedPrecision);
            case MUL:
                return mul(firstOperand, secondOperand).toFixed(expectedPrecision);
            case EXP:
                return exp(secondOperand, firstOperand).toFixed(expectedPrecision);
        }
    } else {
        switch(operator) {
            case ADD:
                return add(Number(firstOperand), Number(secondOperand));
            case SUB:
                return sub(Number(secondOperand), Number(firstOperand));
            case DIV:
                return div(Number(secondOperand), Number(firstOperand));
            case MUL:
                return mul(Number(firstOperand), Number(secondOperand));
            case EXP:
                return exp(Number(secondOperand), Number(firstOperand));
        }
    }
}


function add(first, second){
    return Number(first) + Number(second);
}

function sub(first, second){
    return Number(first) - Number(second);
}

function mul(first, second){
    return Number(first) * Number(second);
}

function div(first, second){
    return Number(first) / Number(second);
}

function exp(operand, exponent){
    return Number(operand) ** Number(exponent);
}

// KEYPRESS HANDLING

document.addEventListener("keyup", (e) => handleKeypress(e));

function handleKeypress(event) {
    switch(event.code) {
        case ONE.code[0]: update(ONE);
            break;
        case TWO.code[0]: update(TWO);
            break;
        case THREE.code[0]: update(THREE);
            break;
        case FOUR.code[0]: update(FOUR);
            break;
        case FIVE.code[0]: update(FIVE);
            break;
        case SIX.code[0]: update(SIX);
            break;
        case SEVEN.code[0]: update(SEVEN);
            break;
        case EIGHT.code[0]: update(EIGHT);
            break;
        case NINE.code[0]: update(NINE);
            break;
        case ZERO.code[0]: update(ZERO);
            break;
        case EQUAL.code[0]: update(EQUAL);
            break;
        case EQUAL.code[1]: update(EQUAL);
            break;
        case EQUAL.code[2]: update(EQUAL);
            break;
        case EQUAL.code[3]: update(EQUAL);
            break;
        case CLEAR.code[0]: update(CLEAR);
            break;
        case CLEAR.code[1]: update(CLEAR);
            break;
        case DEL.code[0]: update(DEL);
            break; 
        case DEL.code[1]: update(DEL);
            break;
        case MUL.code[0]: update(MUL);
            break;
        case SUB.code[0]: update(SUB);
            break;
        case DIV.code[0]: update(DIV);
            break;
        case EXP.code[0]: update(EXP);
            break;
        case NEG.code[0]: update(NEG);
            break;
        case ADD.code[0]: update(ADD);
            break;
        case DEC.code[0]: update(DEC);
            break;
        default: return;
    }
}
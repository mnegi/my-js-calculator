const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-display');
var operator = '';
var operand1 = '';
var operand2 = '';
var args = 0;

function resetValues(){
    operator = '';
    operand1 = '';
    operand2 = '';
    args = 0;
}
const calculate = (operator, operand1, operand2) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                var data = JSON.parse(xmlhttp.responseText);
                display.textContent = data.result;
                resetValues();
                operand1 = data.result;
            }
            else {
                display.textContent = 'Error';
            }
        }
    };

    var endPoint = 'http://calctest.iesim.biz/';
    endPoint = endPoint + operator;

    if (operand1 && operand1 != null) {
        endPoint = endPoint + '?op1=' + operand1;
    }
    if (operand2) {
        endPoint = endPoint + '&op2=' + operand2;
    }
    xmlhttp.open("GET", endPoint, true);
    xmlhttp.send();
}

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = display.textContent;

        if (!action) {
            if (displayedNum === '0') {
                display.textContent = keyContent;
            } else {
                display.textContent = displayedNum + keyContent;
            }
        } else {
            if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide' || action === 'power') {
                // Remove .is-depressed class from all keys
                Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
                key.classList.add('is-depressed');
                operand1 = displayedNum
                display.textContent = '0'
                operator = action
                args = 2
            } else if (action === 'square_root' || action === 'log10' || action === 'ln') {
                console.log(action);
                Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
                key.classList.add('is-depressed');
                resetValues();
                display.textContent = '0'
                operand1 = '0'
                operator = action
                args = 1
            } else if (action === 'pi' || action === 'e') {
                calculate(action);
                key.classList.remove('is-depressed');
            } else if (action === 'decimal') {
                if (!display.textContent.includes('.')) {
                    display.textContent = displayedNum + '.'
                }
            } else if (action === 'clear') {
                display.textContent = '0';
                resetValues();
            } else if (action === 'calculate') {
                if(args == 1){
                    calculate(operator, display.textContent);
                }else if(args == 2){
                    calculate(operator, operand1, display.textContent)
                }
                Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
            }
        }
    }
});

document.body.addEventListener('keydown', e => {
    var keyCode = e.keyCode;
    if (keyCode == 13 || keyCode == 71) {
        // enter
        if(args == 1){
            calculate(operator, display.textContent);
        }else if(args == 2){
            calculate(operator, operand1, display.textContent)
        }
        Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
    } else {
        const displayedNum = display.textContent;
        console.log(keyCode);

        if (keyCode >= 48 && keyCode <= 57) {
            // 0 - 9
            if (displayedNum === '0') {
                display.textContent = String.fromCharCode(keyCode);
            } else {
                display.textContent = displayedNum + String.fromCharCode(keyCode);
            }
        }

        if (keyCode == 27) {
            // esc
            display.textContent = '0';
            resetValues();
        }

       

    }
});
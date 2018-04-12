let operation = [];
let divByZero = false;
let calcWindow = document.querySelector('#display');
let buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
	button.addEventListener('click', () => buttoned(button));
});

document.addEventListener('keydown', (event) => {
  let keyName = event.key;
	if (keyName == Number(keyName)) {
		buttons.forEach((button) => {
			if (button.value == keyName) buttoned(button);
		});
	}
	switch (true) {
		case keyName == '.':
			buttoned(document.querySelector('#decimal'));
			break;
		case keyName == '+':
			buttoned(document.querySelector('#add'));
			break;
		case keyName == '/':
			buttoned(document.querySelector('#divide'));
			break;
		case keyName == '*':
			buttoned(document.querySelector('#multiply'));
			break;
		case keyName == '-':
			buttoned(document.querySelector('#subtract'));
			break;
		case keyName == 'Enter':
			buttoned(document.querySelector('#equals'));
			break;
		case keyName == 'Backspace':
		case keyName == 'Delete':
			buttoned(document.querySelector('#backspace'));
			break;
	}
});

function buttoned(button) {
	let isNumber = Number(button.value) ? true : false;
	let currentItem = operation[operation.length - 1];
	switch(true) {
		case button.id == 'decimal':
			//handling if decimal number is < 1
			if (!Number(currentItem)) {
				operation.push('0.');
				display();
				break;
			} else if (currentItem.indexOf(button.value) != -1) {
				alert('Only ONE decimal per number please!')
				break;
			}
		case isNumber:
		case button.value == 0:
			if (Number(currentItem) || Number(currentItem) == 0 || button.id == 'decimal') {
				currentItem += button.value;
				operation[operation.length - 1] = currentItem;
			} else operation.push(button.value);
			display();
			break;
			
		case button.id == 'equals':
			divByZero = false;
			if (!Number(currentItem) && currentItem != 0) break;
			multiDivide();
			if (divByZero == false) {
				addSubtract();
				
				if (operation[0] % 1 != 0) {
					operation[0] = operation[0].toFixed(2);
					if (operation[0].charAt(operation[0].length - 1) == '0') {
						operation[0] = operation[0].slice(0, -1);
					}
				}
				operation[0] = operation[0].toString();
				display();
			}
			break;
			
		case button.id == 'negate':
			if (Number(currentItem)) {
				operation[operation.length - 1] = (Number(currentItem) * -1).toString();
				display();
			}
			break;
			
		case button.id == 'clear':
			operation.splice(0, operation.length);
			calcWindow.textContent = '';
			break;
		
		case button.id == 'backspace':
			if (!operation[0]) break;
			if (Number(currentItem) < 0 && currentItem.length == 2) {
				operation[operation.length - 1] = currentItem.slice(0, -2);
				operation.pop();
			} else if (Number(currentItem)) {
				operation[operation.length - 1] = currentItem.slice(0, -1);
				if (operation[operation.length - 1] == '') operation.pop();
			} else operation.pop();
			display();
			break;
			
		default:
			if (!operation[0]) alert('Please enter a number first!');
			else if (!Number(currentItem) && currentItem != '0') {
				operation[operation.length - 1] = button.textContent;
				display();
			} else {
				operation.push(button.textContent);
				display();
			}
		}
	button.blur();
}

function operate(sign, x, y) {
	switch(sign) {
		case '+':
			return x + y;
			break;
		case '-':
			return x - y;
			break;
		case 'x':
			return x * y;
			break;
		case '/':
			return x / y;
			break;
	}
}

function display() {
	calcWindow.textContent = '';
	operation.forEach((item) => {
		if (Number(item) || item == '0') calcWindow.textContent += addComma(item);
		else calcWindow.textContent += ' ' + item + ' ';
	});
}

function addComma(num) {
	let decimalPortion = '';
	let i = 0;
	let numArray = [];
	let isNegative = false;
	
	if (num < 0) {
		num *= -1;
		num = num.toString();
		isNegative = true;
	}
	
	while (i < num.length) {
		if (num.charAt(i) == '.') {
			decimalPortion = num.slice(i);
			break;
		}
		numArray.push(num.charAt(i));
		i++;
	}
	
	let commaPlace = numArray.length - 3;
	while (commaPlace > 0) {
		numArray.splice(commaPlace, 0, ',');
		commaPlace -= 3;
	}
	
	if (num.length >= 4) num = numArray.join('') + decimalPortion;
	if (isNegative) return '-' + num;
	else return num;
}

function multiDivide() {
	while(areThere('x', '/') == true) {
		for (let i = 0; i < operation.length; i++) {
			if (operation[i] == 'x' || operation[i] == '/') {
				if (operation[i] == '/' && operation[i + 1] == 0) {
					alert('You can\'t divide by zero!');
					divByZero = true;
					return false;
				}
				let newOperand = operate(operation[i], Number(operation[i - 1]), Number(operation[i + 1]));
				operation.splice(i - 1, 3, newOperand);
			}
		}
	}
	display();
}

function addSubtract() {
	while(areThere('+', '-') == true) {
		for (let i = 0; i < operation.length; i++) {
			if (operation[i] == '+' || operation[i] == '-') {
				let newOperand = operate(operation[i], Number(operation[i - 1]), Number(operation[i + 1]));
				operation.splice(i - 1, 3, newOperand);
			}
		}
	}
	display();
}

function areThere() {
	for (let key in arguments) {
		for (let i = 0; i < operation.length; i++) {
			if (operation[i] == arguments[key]) return true;
		}
	}
	return false;
}
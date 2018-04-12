let operation = [];
let operand = '';
let calcWindow = document.querySelector('#display');
let buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
	button.addEventListener('click', () => buttoned(button));
});
document.addEventListener('keypress', (event) => {
  const keyName = event.key;
	if (event.key === Number(event.key)) buttoned(event.key)
	switch (true) {
		event.key == '.':
		event.key == '+':
		event.key == '/':
		event.key == '*':
		event.key == '-':
			buttoned(event.key);
			break;
		event.key == 'Enter':
			buttoned('equals');
			break;
		event.key == 'Backspace':
		event.key == 'Delete':
			buttoned('backspace');
			break;
	}
});

function buttoned(button) {
	let isNumber = Number(button.value) ? true : false;
	switch(true) {
		case button.id == 'decimal':
			if (operand.indexOf(button.value) != -1) {
				alert('Only ONE decimal per number please!')
				break;
			}
		case isNumber:
		case button.id == 0:
			operand = operand.concat(button.value);
			display(button.value);
			break;
			
		case button.id == "equals": 
			if (operand == '') break;
			else {
				operation.push(operand);
				for (let i = 0; i < operation.length; i++) {
					if (operation[i] == 'x' || operation[i] == '/') {
						let newOperand = operate(operation[i], Number(operation[i - 1]), Number(operation[i + 1]));
						operation.splice(i - 1, 3, newOperand);
					} 
				}
				for (let i = 0; i < operation.length; i++) {
					if (operation[i] == '+' || operation[i] == '-') {
						let newOperand = operate(operation[i], Number(operation[i - 1]), Number(operation[i + 1]));
						operation.splice(i - 1, 3, newOperand);
					}
				}
				display(operation[0], 'solution');
			}
			break;
			
		case button.id == 'negate':
			if (operand) {
				let negOperand = Number(operand) * -1;
				negOperand = negOperand.toString();
				let position = calcWindow.textContent.lastIndexOf(operand);
				calcWindow.textContent = calcWindow.textContent.slice(0, position);
				calcWindow.textContent += negOperand;
				operand = negOperand;
			}
			break;
			
		case button.id == 'clear':
			operand = '';
			operation.splice(0, operation.length);
			calcWindow.textContent = '';
			break;
			
		case button.id == 'backspace':
			if((!operation[0]) && (!operand)) break;
			if(operand) {
				operand = operand.slice(0, -1);
				calcWindow.textContent = '';
				for (let x in operation) {
					display(x);
				}
				display(operand);
			} else {
				calcWindow.textContent = calcWindow.textContent.slice(0, -3);
				operation.pop();
				operand = operation.pop();
			}
			break;
			
		default:
			if (operand == '') {
				alert('You need to enter a number first!');
			} else {
				operation.push(operand);
				operation.push(button.textContent);
				operand = '';
				display(button.textContent);
			}
		}
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

function display(thing, isSolution) {
	if (isSolution) {
			thing = Number(thing);
			if (thing % 1 != 0) {
				thing = thing.toFixed(2);
				if(thing.charAt(thing.length - 1) == '0') thing = thing.slice(0, -1);
			}
			calcWindow.textContent = thing;
			operation.splice(0, 1);
			operand = thing.toString();
	} else {
		if (Number(thing) || thing == 0 || thing == '.') {
			thing = addComma(operand);
			calcWindow.textContent = thing;
		}
		else calcWindow.textContent += ' ' + thing + ' ';
	}
}

function addComma(num) {
	let decimalPortion = '';
	let i = 0;
	let numArray = [];
	while (i < num.length) {
		if (num.charAt(i) == '.') {
			decimalPortion = num.slice(i);
			break;
		}
		numArray.push(num.charAt(i));
		i++;
	}
	if (numArray.length < 4) return num;
	
	let commaPlace = numArray.length - 3;
	while (commaPlace > 0) {
		numArray.splice(commaPlace, 0, ',');
		commaPlace -= 3;
	}
	num = numArray.join('') + decimalPortion;
	return num;
}
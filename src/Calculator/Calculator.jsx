import React, { Component } from 'react';
import './Calculator.css';
import buttonContent from '../Data/Button.json';

export default class Calculator extends Component {
	state = {
		displayValue: '',
		waitingForNextOperand: false,
		value: null,
		operator: null,
	};

	calculatingMethods = {
		'+': (valuePrev, valueNext) => valuePrev + valueNext,
		'-': (valuePrev, valueNext) => valuePrev - valueNext,
		'*': (valuePrev, valueNext) => valuePrev * valueNext,
		'/': (valuePrev, valueNext) => valuePrev / valueNext,
		'=': (valuePrev, valueNext) => valueNext,
	};

	//[AC]
	clearIndicator = () => {
		this.setState({
			displayValue: '',
			waitingForNextOperand: false,
			value: null,
			operator: null,
		});
	};

	//[±]
	toggleSign = () => {
		const { displayValue } = this.state;
		const newValue = parseFloat(displayValue) * -1;

		this.setState({
			displayValue: String(newValue),
		});
	};

	//[%]
	handlePercent = () => {
		const { displayValue } = this.state;
		const currentValue = parseFloat(displayValue);

		if (currentValue === 0) return;

		const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
		const newValue = parseFloat(displayValue) / 100;

		this.setState({
			displayValue: String(newValue.toFixed(fixedDigits.length + 2)),
		});
	};

	//[.]
	handleDot = () => {
		const { displayValue } = this.state;

		if (!/\./.test(displayValue)) {
			this.setState({
				displayValue: displayValue + '.',
				waitingForOperand: false,
			});
		}
	};

	//[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
	handleNumber = (item) => {
		const { displayValue, waitingForNextOperand } = this.state;

		if (waitingForNextOperand) {
			this.setState({
				displayValue: item.content,
				waitingForNextOperand: false,
			});
		} else {
			this.setState({
				displayValue:
					displayValue === '0'
						? item.content
						: displayValue + item.content,
			});
		}
	};

	//[+, -, *, /]
	handleOperator = (item) => {
		const { value, displayValue, operator } = this.state;
		const valueNext = parseFloat(displayValue);

		this.setState({
			operator: item.content,
		});

		if (value === null){
			this.setState({
				value: valueNext,
			});
		} else if (operator){
			const valuePrev = value || 0;
			const newValue = this.calculatingMethods[operator](valuePrev,valueNext)
			this.setState({
				value: newValue,
				displayValue: String(newValue),
			})
		}

		this.setState({
			waitingForNextOperand: true,
		});
	};

	handleClick = (item) => {
		switch (item.content) {
			case 'AC':
				this.clearIndicator();
				break;
			case '±':
				this.toggleSign();
				break;
			case '%':
				this.handlePercent();
				break;
			case '.':
				this.handleDot();
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
				this.handleNumber(item);
				break;
			default:
				this.handleOperator(item);
		}
	};

	renderButtons = () => {
		return buttonContent.map((item, index) => {
			return (
				<div
					className={
						'btnContainer col-3 mt-2' +
						(item.content === '0' ? ' zero' : '')
					}
					key={index}
				>
					<button
						onClick={() => {
							this.handleClick(item);
						}}
						className={
							'calcBtn' + (item.content === '0' ? ' zero' : '')
						}
					>
						{item.content}
					</button>
				</div>
			);
		});
	};

	render() {
		return (
			<div className="calcBoard">
				<div className="calcBoard__content">
					<div className="colorLayer_0" />
					<div className="colorLayer_1" />
					<div className="colorLayer_2" />
					<div className="text">
						<input
							id="indicator"
							type="text"
							placeholder="0"
							value={this.state.displayValue}
							readOnly
						/>
						<button className="calcBtn scope">
							{this.state.operator}
						</button>
					</div>
					<div className="btnArray mt-1 container-fluid">
						<div className="row">{this.renderButtons()}</div>
					</div>
				</div>
			</div>
		);
	}
}

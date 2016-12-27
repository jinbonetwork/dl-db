import React, {Component, PropTypes} from 'react';

class DateForm extends Component {
	handleChangeYear(event){
		let year = parseInt(event.target.value);
		if(year >= 0){
			year %= 10000;
		} else {
			year = '';
		}
		this.props.onChange({year: year, month: this.props.value.month});
	}
	handleChangeMonth(event){
		let month = parseInt(event.target.value);
		if(month >= 0){
			month %= 100;
			if(month > 12) month = 12;
		} else {
			month = '';
		}
		this.props.onChange({year: this.props.value.year, month: month});
	}
	render(){
		return (
			<div className="dateform">
				<input className="dateform__year" type="text" value={this.props.value.year}
					onChange={this.handleChangeYear.bind(this)}
				/>
				<span>년</span>
				<input className="dateform_month" type="text" value={this.props.value.month}
					onChange={this.handleChangeMonth.bind(this)}
				/>
				<span>월</span>
			</div>
		);
	}
}
DateForm.propTypes = {
	fname: PropTypes.string.isRequired,
	value: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired
};

export default DateForm;

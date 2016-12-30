import React, {Component, PropTypes} from 'react';

class DateForm extends Component {
	componentDidMount(){
		if(this.props.focus) this.refs.year.focus();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) this.refs.year.focus();
	}
	handleChangeYear(event){
		const today = new Date();
		const year = event.target.value;
		if(0 <= year && year <= today.getFullYear()){
			this.props.onChange({year: year, month: this.props.value.month});
		}
	}
	handleChangeMonth(event){
		const month = event.target.value;
		if(0 <= month && month <= 12){
			this.props.onChange({year: this.props.value.year, month: month});
		}
	}
	handleBlur(){
		if(this.props.onBlur) this.props.onBlur();
	}
	render(){
		return (
			<div className="dateform">
				<input className="dateform__year" type="text" ref="year" value={this.props.value.year}
					onChange={this.handleChangeYear.bind(this)} onBlur={this.handleBlur.bind(this)}
				/>
				<span>년</span>
				<input className="dateform_month" type="text" value={this.props.value.month}
					onChange={this.handleChangeMonth.bind(this)} onBlur={this.handleBlur.bind(this)}
				/>
				<span>월</span>
			</div>
		);
	}
}
DateForm.propTypes = {
	value: PropTypes.object.isRequired,
	focus: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func
};

export default DateForm;

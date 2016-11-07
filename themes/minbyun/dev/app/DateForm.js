import React, {Component, PropTypes} from 'react';
/*
class DateForm extends Component {
	componentWillMount(){
		let year = parseInt(this.props.value / 100);
		let month  = this.props.value % 100;
		this.setState({
			year: (year > 0 ? year : ''),
			month: (month > 0 ? month : '')
		})
	}
	handleChangeYear(event){
		let year = (event.target.value > 0 ? parseInt(event.target.value) : 0 );
		let month = (this.state.month > 0 ? this.state.month : 0);
		this.setState({year: (year > 0 ? year : '')});
		this.props.updateFields({['f'+this.props.field.fid]: year*100 + month});
	}
	handleChangeMonth(event){
		let year = (this.state.year > 0 ? this.state.year : 0);
		let month = (event.target.value > 0 ? parseInt(event.target.value) : 0 );
		this.setState({month: (month > 0 ? month : '')});
		this.props.updateFields({['f'+this.props.field.fid]: year*100 + month});
	}
	render(){
		return (
			<div>
				<input type="text" value={this.state.year} onChange={this.handleChangeYear.bind(this)} />년{' '}
				<input type="text" value={this.state.month} onChange={this.handleChangeMonth.bind(this)} />월
			</div>
		);
	}
}
*/
class DateForm extends Component {
	handleChangeYear(event){
		let year = parseInt(event.target.value);
		if(year >= 0){
			year %= 10000;
		} else {
			year = '';
		}
		this.props.updateSingleField(this.props.field, this.props.index, {
			year: year, month: this.props.value.month
		});
	}
	handleChangeMonth(event){
		let month = parseInt(event.target.value);
		if(month >= 0){
			month %= 100;
			if(month > 12) month = 12;
		} else {
			month = '';
		}
		this.props.updateSingleField(this.props.field, this.props.index, {
			year: this.props.value.year, month: month
		});
	}
	render(){
		return (
			<div>
				<input type="text" value={this.props.value.year} onChange={this.handleChangeYear.bind(this)} />년{' '}
				<input type="text" value={this.props.value.month} onChange={this.handleChangeMonth.bind(this)} />월
			</div>
		);
	}
}
DateForm.propTypes = {
	field: PropTypes.object.isRequired,
	value: PropTypes.object.isRequired,
	index: PropTypes.number,
	updateSingleField: PropTypes.func.isRequired
};

export default DateForm;

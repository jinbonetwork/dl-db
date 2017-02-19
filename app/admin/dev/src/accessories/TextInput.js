import React, {Component, PropTypes} from 'react';
import {_wrap} from './functions';

class TextInput extends Component {
	componentDidMount(){
		if(this.props.focus) this.refs.text.focus();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) this.refs.text.focus();
	}
	handleChange(event){
		if(this.props.type == 'phone'){
			let isValid = _wrap(() => {
				let phone = event.target.value.split('-');
				if(phone.length > 3) return false;
				for(let index in phone){
					if(phone[index] >= 0); else return false;
					if(phone.length > 1 && phone[index].length > 4) return false;
					if(phone.length == 1 && phone[index].length > 11) return false;
				}
				return true;
			});
			if(isValid) this.props.onChange(event.target.value);
		}
		else if(this.props.type == 'date'){
			let isValid = _wrap(() => {
				let date = event.target.value.split('-');
				if(date.length > 3) return false;
				for(let index in date){
					if(0 <= date[index] && date[index] <= 9999); else return false;
				}
				/*
				if(date.length == 1){
					if(0 <= date[0] && date[0] <= 9999); else return false;
				}
				else if(date.length == 2){
					if(0 <= date[0] && date[0] <= 9999); else return false;
					if(0 <= date[1] && date[1] <= 31); else return false;
				}
				else if(date.length == 3){
					if(0 <= date[0] && date[0] <= 9999); else return false;
					if(0 <= date[1] && date[1] <= 12); else return false;
					if(0 <= date[2] && date[2] <= 31); else return false;
				}
				*/
				return true;
			});
			if(isValid) this.props.onChange(event.target.value);

		}
		else {
			this.props.onChange(event.target.value);
		}
	}
	handleBlur(){
		if(this.props.onBlur) this.props.onBlur();
	}
	render(){
		const type = (['text', 'email', 'password'].indexOf(this.props.type) >= 0 ? this.props.type : 'text');
		return (
			<input ref="text"
				type={type} value={this.props.value} placeholder={this.props.placeholder}
				onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
			/>
		);
	}
}
TextInput.propTypes = {
	type: PropTypes.string,
	value: PropTypes.string,
	placeholder: PropTypes.string,
	focus: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func
};
TextInput.defaultProps = {
	type: 'text',
	value: ''
}
export default TextInput;

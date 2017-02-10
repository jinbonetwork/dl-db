import React, {Component, PropTypes} from 'react';

class TextInput extends Component {
	componentDidMount(){
		if(this.props.focus) this.refs.text.focus();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) this.refs.text.focus();
	}
	handleChange(event){
		this.props.onChange(event.target.value);
	}
	handleBlur(){
		if(this.props.onBlur) this.props.onBlur();
	}
	render(){
		const value = (this.props.value ? this.props.value : '');
		const type = (this.props.type ? this.props.type : 'text');
		return (
			<input type={type} ref="text" value={value} placeholder={this.props.placeholder}
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

export default TextInput;

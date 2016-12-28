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
	render(){
		const value = (this.props.value ? this.props.value : '');
		const type = (this.props.type ? this.props.type : 'text');
		return (
			<input type={type} ref="text" value={value} onChange={this.handleChange.bind(this)} placeholder={this.props.placeholder} />
		);
	}
}
TextInput.propTypes = {
	type: PropTypes.string,
	value: PropTypes.string,
	placeholder: PropTypes.string,
	focus: PropTypes.bool,
	onChange: PropTypes.func.isRequired
};

export default TextInput;

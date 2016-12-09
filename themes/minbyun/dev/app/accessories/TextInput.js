import React, {Component, PropTypes} from 'react';

class TextInput extends Component {
	constructor(){
		super();
		this.state = {
			value: '',
			firstFocused: false
		};
	}
	componentWillMount(){
		if(this.props.value) this.setState({value: this.props.value});
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.value) this.setState({value: nextProps.value});
	}
	componentDidUpdate(prevProps, prevState){
		if(this.state.firstFocused && prevState.value != this.state.value && this.props.onChange){
			this.props.onChange({target: {value: this.state.value}});
		}
	}
	handleChange(event){
		this.setState({value: event.target.value});
	}
	handleKeyDown(event){
		if(this.props.onKeyDown) this.props.onKeyDown(event);
	}
	handleKeyUp(event){
		if(this.props.onKeyUp) this.props.onKeyUp(event);
	}
	handleFocus(event){
		if(!this.state.firstFocused) this.setState({firstFocused: true});
		if(this.props.onFocus) this.props.onFocus(event);
	}
	handleBlur(event){
		if(this.props.onBlur) this.props.onBlur(event);
	}
	render(){
		return (
			<input type="text" value={this.state.value}
				onChange={this.handleChange.bind(this)}
				onKeyDown={this.handleKeyDown.bind(this)}
				onKeyUp={this.handleKeyUp.bind(this)}
				onFocus={this.handleFocus.bind(this)}
				onBlur={this.handleBlur.bind(this)}
			/>
		);
	}
}
TextInput.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	onKeyDown: PropTypes.func,
	onKeyUp: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func
};

export default TextInput;

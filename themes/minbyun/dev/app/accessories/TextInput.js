import React, {Component, PropTypes} from 'react';
import jQ from 'jquery';

class TextInput extends Component {
	constructor(){
		super();
		this.state = {
			value: '',
			firstKeyDown: false
		};
	}
	componentWillMount(){
		if(this.props.value) this.setState({value: this.props.value});
	}
	componentDidMount(){
		jQ(this.refs.input).keyup((event) => {console.log('----')});
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.value) this.setState({value: nextProps.value});
	}
	componentDidUpdate(prevProps, prevState){
		if(this.state.firstKeyDown && prevState.value != this.state.value && this.props.onChange){
			this.props.onChange(this.state.value);
		}
	}
	handleChange(event){
		this.setState({value: event.target.value});
	}
	handleKeyUp(event){
		console.log('key up');
	}
	handleKeyDown(event){ console.log('key down');
		if(!this.state.firstKeyDown) this.setState({firstKeyDown: true});
	}
	render(){
		return (
			<input type="text" value={this.state.value} ref="input"
				onChange={this.handleChange.bind(this)}
				onKeyDown={this.handleKeyDown.bind(this)}
				onKeyUp={this.handleKeyUp.bind(this)}
			/>
		);
	}
}
TextInput.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	onKeyDown: PropTypes.func,
	onKeyUp: PropTypes.func,
};

export default TextInput;

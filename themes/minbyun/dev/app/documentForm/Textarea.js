import React, {Component, PropTypes} from 'react';

class Textarea extends Component {
	componentDidMount(){
		if(this.props.focus) this.refs.textarea.focus();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) this.refs.textarea.focus();
	}
	handleChange(event){
		this.props.onChange(event.target.value);
	}
	render(){
		return(
			<div className="textarea">
				<textarea ref="textarea" value={this.props.value} onChange={this.handleChange.bind(this)} />
				<div className="textarea__footer">
					{this.props.numOfWords && <span>* {this.props.numOfWords}자 내외로 작성해주세요.</span>}
					<span className="textarea__num-of-words">{this.props.value.length}자</span>
				</div>
			</div>
		);
	}
}
Textarea.propTypes = {
	fname: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	focus: PropTypes.bool,
	numOfWords: PropTypes.number,
	onChange: PropTypes.func.isRequired
};

export default Textarea;

import React, {Component, PropTypes} from 'react';

class Textarea extends Component {
	constructor(){
		super();
		this.state = {
			numOfWords: 0
		};
	}
	handleChange(event){
		this.setState({numOfWords: event.target.value.length});
		this.props.handleChange(this.props.field, this.props.index, event);
	}
	render(){
		let maxLength = (this.props.field.form > 0 ? this.props.field.form : null);
		return(
			<div className="textarea">
				<textarea value={this.props.value} maxLength={maxLength} onChange={this.handleChange.bind(this)} />
				<div className="textarea__footer">
					{maxLength && <span>* {maxLength}자 내외로 작성해주세요.</span>}
					<span>{this.state.numOfWords}자</span>
				</div>
			</div>
		);
	}
}
Textarea.propTypes = {
	field: PropTypes.object.isRequired,
	value: PropTypes.string.isRequired,
	index: PropTypes.number,
	handleChange: PropTypes.func.isRequired
};

export default Textarea;

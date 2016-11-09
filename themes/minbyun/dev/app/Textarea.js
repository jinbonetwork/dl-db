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
		this.props.updateSingleField(this.props.field, this.props.index, event.target.value);
	}
	render(){
		return(
			<div className="textarea">
				<textarea value={this.props.value} onChange={this.handleChange.bind(this)} />
				<div className="textarea__footer">
					{(this.props.field.form > 0) && <span>* {this.props.field.form}자 내외로 작성해주세요.</span>}
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
	updateSingleField: PropTypes.func.isRequired
};

export default Textarea;

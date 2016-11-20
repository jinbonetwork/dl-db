import React, {Component, PropTypes} from 'react';

class Textarea extends Component {
	handleChange(event){
		this.props.updateSingleField(this.props.fname, this.props.index, event.target.value);
	}
	render(){
		return(
			<div className="textarea">
				<textarea value={this.props.value} onChange={this.handleChange.bind(this)} />
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
	index: PropTypes.number,
	numOfWords: PropTypes.number,
	updateSingleField: PropTypes.func.isRequired
};

export default Textarea;

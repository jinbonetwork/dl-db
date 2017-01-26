import React, {Component, PropTypes} from 'react';
import {Editor, EditorState} from 'draft-js';

class Agreement extends Component {
	componentDidMount(){
		this.props.fetchAgreement();
	}
	render(){
		console.log(this.props.editorState.getCurrentContent());
		return (
			<Editor editorState={this.props.editorState} onChange={this.props.onChange.bind(this)} />
		);
	}
}
Agreement.propTypes = {
	editorState: PropTypes.any.isRequired,
	fetchAgreement: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
};

export default Agreement;

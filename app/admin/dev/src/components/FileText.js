import React, {Component, PropTypes} from 'react';

class FileText extends Component {
	componentDidMount(){
		const {docId, fileId} = this.props.params;
		if(this.props.openFileTexts[fileId]){
			this.props.onChange(this.props.openFileTexts[fileId]);
		} else {
			this.props.fetchFileText(docId, fileId, () => {
				this.props.onChange(this.props.openFileTexts[fileId]);
			});
		}
	}
	render(){
		console.log(this.props.fileText);
		return null;
	}
}
FileText.propTypes = {
	openFileTexts: PropTypes.object.isRequired,
	fileText: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	fetchFileText: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
};
export default FileText;

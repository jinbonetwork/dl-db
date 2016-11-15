import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import DocumentFormContainer from './documentForm/DocumentFormContainer';

class EditDocument extends Component {
	render(){
		return(
			<DocumentFormContainer
				formAttr={{header: '자료수정하기', submit: '수정', mode: 'modify'}}
				document={update(this.props.documentForm, {
					id: {$set: this.props.params.did},
					uid: {$set: this.props.userData.user.uid}
				})}
				documentFormData={this.props.documentFormData}
				documentFormOptions={this.props.documentFormOptions}
				apiUrl={this.props.apiUrl}
				openedDocuments={this.props.openedDocuments}
			/>
		);
	}
}
EditDocument.propTypes = {
	userData: PropTypes.object,
	documentForm: PropTypes.object,
	documentFormData: PropTypes.object,
	documentFormOptions: PropTypes.object,
	apiUrl: PropTypes.string,
	openedDocuments: PropTypes.object
};

export default EditDocument;

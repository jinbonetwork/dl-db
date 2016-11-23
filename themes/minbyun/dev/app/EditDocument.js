import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import DocumentFormContainer from './documentForm/DocumentFormContainer';
import {_emptyDocument} from './docSchema';

class EditDocument extends Component {
	render(){
		let document = update(_emptyDocument, {id: {$set: this.props.params.did}});
		return(
			<DocumentFormContainer
				formAttr={{header: '자료수정하기', submit: '수정', mode: 'modify'}}
				document={document}
				docData={this.props.docData}
				removeUserData={this.props.removeUserData}
			/>
		);
	}
}
EditDocument.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	removeUserData: PropTypes.func
};

export default EditDocument;

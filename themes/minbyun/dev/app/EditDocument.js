import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import DocumentFormContainer from './documentForm/DocumentFormContainer';

class EditDocument extends Component {
	render(){
		let document = update(this.props.docData.emptyDoc, {id: {$set: this.props.params.did}});
		return(
			<DocumentFormContainer
				formAttr={{header: '자료수정하기', submit: '수정', mode: 'modify'}}
				document={document}
				docData={this.props.docData}
				fetchData={this.props.fetchData}
				setMessage={this.props.setMessage}
			/>
		);
	}
}
EditDocument.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func
};

export default EditDocument;

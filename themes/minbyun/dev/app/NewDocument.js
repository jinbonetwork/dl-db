import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import DocumentFormContainer from './documentForm/DocumentFormContainer';
import {_emptyDocument} from './schema/docSchema';

class NewDocument extends Component {
	render(){
		let document = update(_emptyDocument, {uid: {$set: this.props.userData.user.uid}});
		return(
			<DocumentFormContainer
				formAttr={{header: '자료입력하기', submit: '등록', mode: 'add'}}
				document={document}
				docData={this.props.docData}
				fetchData={this.props.fetchData}
				setMessage={this.props.setMessage}
			/>
		);
	}
}
NewDocument.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func
};

export default NewDocument;

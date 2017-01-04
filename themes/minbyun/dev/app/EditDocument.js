import React, {Component, PropTypes} from 'react';
import DocumentFormContainer from './documentForm/DocumentFormContainer';
//import {_convertToDoc} from './schema/docSchema';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...

class EditDocument extends Component {
	render(){
		return(
			<DocumentFormContainer
				formAttr={{header: '자료수정하기', submit: '수정', mode: 'modify', id: this.props.params.did}}
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

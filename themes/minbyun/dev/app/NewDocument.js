import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import DocumentFormContainer from './documentForm/DocumentFormContainer';

class NewDocument extends Component {
	render(){
		return(
			<DocumentFormContainer
				formAttr={{header: '자료입력하기', submit: '등록', mode: 'add'}}
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

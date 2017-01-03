import React, {Component, PropTypes} from 'react';
import DocumentFormContainer from './documentForm/DocumentFormContainer';
import {_convertToDoc} from './schema/docSchema';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...

class EditDocument extends Component {
	componentWillMount(){
		this.setState({
			sDocument: null
		});
	}
	componentDidMount(){
		const unsetProc = this.props.setMessage(null);
		const api = '/api/document?id='+this.props.params.did;
		this.props.fetchData('get', api, (data) => { unsetProc(); if(data){
			this.setState({sDocument: data.document});
		}});
	}
	render(){
		let document;
		if(this.state.sDocument){
			document = _convertToDoc(this.state.sDocument, this.props.docData);
		} else {
			document = update(this.props.docData.emptyDoc, {id: {$set: this.props.params.did}});
		}
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

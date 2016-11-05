import React, {Component, PropTypes} from 'react';
import DocumentForm from './DocumentForm';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...

class NewDocument extends Component {
	componentWillMount(){
		//console.log('will mount');
		this.setState({
			document: update(this.props.documentForm, {
				id: {$set: Date.now()},
				uid: {$set: this.props.userData.user.uid}
			}),
			files: []
		});
	}
	/*
	componentDidMount(){
		console.log('did mount');
		console.log(this.props.documentFormData.fields[0].fid);
	}
	componentWillReceiveProps(){
		console.log('will receive props');
		console.log(this.props.documentFormData.fields[0].fid);
	}
	componentWillUpdate(){
		console.log('will update');
		console.log(this.props.documentFormData.fields[0].fid);
	}
	*/
	changeDocument(fid, value){
		if(fid > 0){
			this.setState({
				document: update(this.state.document, {
					custom: {
						['f'+fid]: {$set: value}
					}
				})
			});
		} else {
			this.setState({
				document: update(this.state.document, {
					'subject': {$set: value}
				})
			});
		}
		console.log(this.state.document);
	}
	handleChange(field, value){
		switch(field.form){
			case 'text':
			case 'search':
				this.changeDocument(field.fid, value);
				break;
			case 'select':
		}
	}
	render(){
		return(
			<DocumentForm
				submitLabel="등록"
				documentFormData={this.props.documentFormData}
				document={this.state.document}
				documentFormOptions={this.props.documentFormOptions}
				subjectField={this.props.subjectField}
				apiUrl={this.props.apiUrl}
				handleChange={this.handleChange.bind(this)}
			/>
		);
	}
}
NewDocument.propTypes = {
	userData: PropTypes.object,
	documentFormData: PropTypes.object,
	documentForm: PropTypes.object,
	documentFormOptions: PropTypes.object,
	subjectField: PropTypes.object,
	apiUrl: PropTypes.string
};

export default NewDocument;

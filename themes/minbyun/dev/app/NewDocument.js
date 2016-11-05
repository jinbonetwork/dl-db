import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import DocumentForm from './DocumentForm';

class NewDocument extends Component {
	/*
	componentWillMount(){
		//console.log('will mount');
	}
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
	render(){
		return(
			<DocumentForm
				submitLabel="등록"
				document={update(this.props.documentForm, {
					id: {$set: Date.now()},
					uid: {$set: this.props.userData.user.uid}
				})}
				documentFormData={this.props.documentFormData}
				documentFormOptions={this.props.documentFormOptions}
				subjectField={this.props.subjectField}
				apiUrl={this.props.apiUrl}
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

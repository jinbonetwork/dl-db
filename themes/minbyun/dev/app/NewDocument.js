import React, {Component, PropTypes} from 'react';
import DocumentForm from './DocumentForm';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...

class NewDocument extends Component {
	componentWillMount(){
		//console.log('will mount');
		this.setState(
			update(this.props.documentForm, {
				id: {$set: Date.now() }
			})
		);
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
	handleChange(field, value){
		if(field.iscolumn == 1){
			this.setState({ ['f'+field.fid]: value });
		} else {
			let custom = update(this.state.custom, {
				$set: { [field.fid]: value }
			});
			this.setState({ custom: custom });
		}
	}
	render(){
		return(
			<DocumentForm
				submitLabel="등록"
				documentFormData={this.props.documentFormData}
				document={this.state}
				handleChange={this.handleChange.bind(this)}
			/>
		);
	}
}
NewDocument.propTypes = {
	userData: PropTypes.object,
	documentFormData: PropTypes.object,
	documentForm: PropTypes.object
};

export default NewDocument;

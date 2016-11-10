import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import DocumentForm from './DocumentForm';

class DocumentFormContainer extends Component {
	componentWillMount(){
		this.setState(this.props.document);
	}
	updateFields(fields){ if(!fields) return;
		this.setState(update(this.state, {$merge: fields}));
	}
	updateSingleField(field, index, value){
		let fid = (field.fid > 0 ? 'f'+field.fid : field.fid);
		if(index === undefined){
			this.setState({[fid]: value});
		} else {
			this.setState(update(this.state, {
				[fid]: {[index]: {$set: value}
			}}));
		}
	}
	addValueToField(fid){
		this.setState(update(this.state, {
			['f'+fid]: {$push: [this.props.documentFormOptions.defaultValues[fid]]}
		}));
	}
	removeValueInField(fid, index){
		if(index !== undefined){
			if(this.state['f'+fid].length > 1){
				this.setState(update(this.state, {
					['f'+fid]: {$splice: [[index, 1]]}
				}));
			} else {
				this.setState(update(this.state, {
					['f'+fid]: {0: {$set: this.props.documentFormOptions.defaultValues[fid]}}
				}));
			}
		} else {
			this.setState({
				['f'+fid]: this.props.documentFormOptions.defaultValues[fid]
			});
		}
	}
	fieldValue(fid){
		return (fid > 0 ? this.state['f'+fid] : this.state[fid]);
	}
	render(){
		return(
			<DocumentForm
				label={this.props.label}
				document={this.state}
				info={{
					apiUrl: this.props.apiUrl,
					formData: this.props.documentFormData,
					formOptions: this.props.documentFormOptions,
				}}
				callBacks={{
					fieldValue: this.fieldValue.bind(this),
					updateSingleField: this.updateSingleField.bind(this),
					updateFields: this.updateFields.bind(this),
					addValueToField: this.addValueToField.bind(this),
					removeValueInField: this.removeValueInField.bind(this)
				}}
			/>
		);
	}
}
DocumentFormContainer.propTypes = {
	label: PropTypes.object.isRequired,
	documentFormData: PropTypes.shape({
		fields: PropTypes.array.isRequired,
		taxonomy: PropTypes.objectOf(PropTypes.array).isRequired
	}).isRequired,
	document: PropTypes.object.isRequired,
	documentFormOptions: PropTypes.object.isRequired,
	apiUrl: PropTypes.string.isRequired,
	openedDocuments: PropTypes.array
};

export default DocumentFormContainer;

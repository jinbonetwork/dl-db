import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import axios from 'axios';
import DocumentForm from './DocumentForm';
import func from '../functions';

class DocumentFormContainer extends Component {
	componentWillMount(){
		this.setState(this.props.document);
	}
	componentDidMount(){
		if(this.props.formAttr.mode == 'modify'){
			axios.get(this.props.apiUrl+'/document?id='+this.state.id)
			.then((response) => {
				if(response.statusText == 'OK'){
					if(response.data.error == 0){
						return response.data.document;
					} else {
						console.error(response.data.message);
					}
				} else {
					console.error('Server response was not OK');
				}
			})
			.then((document) => {
				this.setDocument(document);
			});
		}
	}
	setDocument(document){
		let newDocument = {};
		this.props.documentFormData.fields.forEach((f) => {
			let value;
			let fid = (f.fid > 0 ? 'f'+f.fid : f.fid);
			if(document[fid]){
				switch(f.type){
					case 'char': case 'date': case 'textarea':
						newDocument[fid] = document[fid]; break;
					case 'taxonomy':
						value = [];
						for(let p in document[fid]){
							value.push(p);
						}
						if(f.multiple != '1') value = value[0];
						newDocument[fid] = value;
						break;
					case 'image': case 'file':
						value = [];
						for(let p in document[fid]){
							document[fid][p].fid = p;
							value.push(document[fid][p]);
						}
						if(f.multiple != '1') value = value[0];
						newDocument[fid] = value;
						break;
				}
			} else {
				if(f.type != 'group') newDocument[fid] = this.state[fid];
			}
		});
		newDocument = update(document, {$merge: newDocument});
		this.setState(newDocument);
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
	hiddenFields(){
		let hiddenFields = [];
		for(let fid in this.props.documentFormOptions.actionShowInfo){
			let info = this.props.documentFormOptions.actionShowInfo[fid];
			let value =this.state['f'+fid];
			if(value != info.term) hiddenFields.push(info.field);
		}
		return hiddenFields;
	}
	render(){
		return(
			<DocumentForm
				formAttr={this.props.formAttr}
				document={this.state}
				info={{
					apiUrl: this.props.apiUrl,
					formData: this.props.documentFormData,
					formOptions: this.props.documentFormOptions,
					hiddenFields: this.hiddenFields()
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
	formAttr: PropTypes.object.isRequired,
	documentFormData: PropTypes.shape({
		fields: PropTypes.array.isRequired,
		taxonomy: PropTypes.objectOf(PropTypes.array).isRequired
	}).isRequired,
	document: PropTypes.object.isRequired,
	documentFormOptions: PropTypes.object.isRequired,
	apiUrl: PropTypes.string.isRequired,
	openedDocuments: PropTypes.object
};

export default DocumentFormContainer;

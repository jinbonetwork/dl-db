import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import axios from 'axios';
import DocumentForm from './DocumentForm';
import {_emptyDocument, _fieldAttrs, _convertToDoc} from '../docSchema';

class DocumentFormContainer extends Component {
	componentWillMount(){
		this.setState(this.props.document);
	}
	componentDidMount(){
		if(this.props.formAttr.mode == 'modify'){
			axios.get('/api/document?id='+this.state.id)
			.then((response) => {
				if(response.statusText == 'OK'){
					if(response.data.error == 0){
						this.setState(_convertToDoc(response.data.document));
					} else {
						console.error(response.data.message);
					}
				} else {
					console.error('Server response was not OK');
				}
			});
		}
	}
	updateFields(fields){ if(!fields) return;
		this.setState(update(this.state, {$merge: fields}));
	}
	updateSingleField(fname, index, value){
		if(index === undefined){
			this.setState({[fname]: value});
		} else {
			this.setState(update(this.state, {
				[fname]: {[index]: {$set: value}
			}}));
		}
	}
	addValueToField(fname){
		this.setState(update(this.state, {
			[fname]: {$push: [_emptyDocument[fname][0]]}
		}));
	}
	removeValueInField(fname, index){
		if(index !== undefined){
			if(this.state[fname].length > 1){
				this.setState(update(this.state, {
					[fname]: {$splice: [[index, 1]]}
				}));
			} else {
				this.setState(update(this.state, {
					[fname]: {0: {$set: _emptyDocument[fname][0]}}
				}));
			}
		} else {
			this.setState({
				[fname]: _emptyDocument[fname]
			});
		}
	}
	fieldValue(fname){
		return this.state[fname];
	}
	render(){
		return(
			<DocumentForm
				formAttr={this.props.formAttr}
				document={this.state}
				docData={this.props.docData}
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
	document: PropTypes.object.isRequired,
	docData: PropTypes.object
};

export default DocumentFormContainer;

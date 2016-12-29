import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...
import DocumentForm from './DocumentForm';
import {_convertToDoc} from '../schema/docSchema';

class DocumentFormContainer extends Component {
	componentWillMount(){
		this.setState({
			document: this.props.document,
			fieldWithFocus: this.firstField()
		});
	}
	componentDidMount(){
		if(this.props.formAttr.mode == 'modify'){
			this.props.fetchData('get', '/api/document?id='+this.state.document.id, (data) => { if(data){
				this.setState({document: _convertToDoc(data.document, this.props.docData)});
			}});
		}
	}
	firstField(){
		for(let fn in this.props.document){
			let fa = this.props.docData.fAttrs[fn];
			if(fa.type != 'meta'){
				return {fname: fn, index: (fa.multiple ? 0 : undefined)};
			}
		}
	}
	emptyFieldWithFocus(){
		return {fname: '', index: undefined};
	}
	updateFields(fields){ if(!fields) return;
		this.setState({
			document: update(this.state.document, {$merge: fields}),
			fieldWithFocus: this.emptyFieldWithFocus()
		});
	}
	updateSingleField(fname, index, value){
		if(index === undefined){
			this.setState({
				document: update(this.state.document, {[fname]: {$set: value}}),
				fieldWithFocus: this.emptyFieldWithFocus()
			});
		} else {
			this.setState({
				document: update(this.state.document, {[fname]: {[index]: {$set: value}}}),
				fieldWithFocus: this.emptyFieldWithFocus()
			});
		}
	}
	addValueToField(fname){
		this.setState({document: update(this.state.document, {
			[fname]: {$push: [this.props.docData.emptyDoc[fname][0]]}
		})});
	}
	removeValueInField(fname, index){
		if(index !== undefined){
			if(this.state.document[fname].length > 1){
				this.setState({document: update(this.state.document, {
					[fname]: {$splice: [[index, 1]]}
				})});
			} else {
				this.setState({document: update(this.state.document, {
					[fname]: {0: {$set: this.props.docData.emptyDoc[fname][0]}}
				})});
			}
		} else {
			this.setState({document: update(this.state.document, {[fname]: {$set: this.props.docData.emptyDoc[fname]}})});
		}
	}
	fieldValue(fname){
		return this.state.document[fname];
	}
	setFieldWithFocus(fname, index){
		this.setState({fieldWithFocus: {fname: fname, index: index}});
	}
	render(){
		return(
			<DocumentForm
				formAttr={this.props.formAttr}
				document={this.state.document}
				docData={this.props.docData}
				fieldWithFocus={this.state.fieldWithFocus}
				callBacks={{
					setFieldWithFocus: this.setFieldWithFocus.bind(this),
					fieldValue: this.fieldValue.bind(this),
					updateSingleField: this.updateSingleField.bind(this),
					updateFields: this.updateFields.bind(this),
					addValueToField: this.addValueToField.bind(this),
					removeValueInField: this.removeValueInField.bind(this),
					fetchData: this.props.fetchData,
					setMessage: this.props.setMessage
				}}
			/>
		);
	}
}
DocumentFormContainer.propTypes = {
	formAttr: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func
};

export default DocumentFormContainer;

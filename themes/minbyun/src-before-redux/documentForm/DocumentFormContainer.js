import React, {Component, PropTypes} from 'react';
import DocumentForm from './DocumentForm';
import {_convertToDoc} from '../schema/docSchema';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...

class DocumentFormContainer extends Component {
	constructor(){
		super();
		this.state = {
			sDocument: {},
			document: {},
			fieldWithFocus: {fname: 'title', index: undefined}
		};
	}
	componentWillMount(){
		this.setState({document: this.props.docData.emptyDoc});
	}
	componentDidMount(){
		if(this.props.formAttr.mode == 'modify'){
			const unsetProc = this.props.setMessage(null);
			const api = '/api/document?id='+this.props.formAttr.id;
			this.props.fetchData('get', api, (data) => { unsetProc(); if(data){
				const document = _convertToDoc(data.document, this.props.docData);
				this.setState({
					sDocument: data.document,
					document: document
				});
			}});
		}
	}
	componentWillReceiveProps(nextProps){
		if(JSON.stringify(this.props.docData) != JSON.stringify(nextProps.docData)){
			if(nextProps.formAttr.mode == 'modify'){
				this.setState({
					document: _convertToDoc(this.state.sDocument, nextProps.docData)
				});
			}
			else if(nextProps.formAttr.mode == 'add'){
				this.setState({
					document: nextProps.docData.emptyDoc
				});
			}
		}
	}
	updateFields(fields){ if(!fields) return;
		this.setState({
			document: update(this.state.document, {$merge: fields}),
			fieldWithFocus: {fname: '', index: undefined}
		});
	}
	updateSingleField(fname, index, value){
		if(index === undefined){
			this.setState({
				document: update(this.state.document, {[fname]: {$set: value}})
			});
		} else {
			this.setState({
				document: update(this.state.document, {[fname]: {[index]: {$set: value}}})
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
	unsetFieldWithFocus(){
		this.setState({fieldWithFocus: {fname: '', index: undefined}});
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
					unsetFieldWithFocus: this.unsetFieldWithFocus.bind(this),
					fieldValue: this.fieldValue.bind(this),
					updateSingleField: this.updateSingleField.bind(this),
					updateFields: this.updateFields.bind(this),
					addValueToField: this.addValueToField.bind(this),
					removeValueInField: this.removeValueInField.bind(this),
					fetchData: this.props.fetchData,
					setMessage: this.props.setMessage,
				}}
			/>
		);
	}
}
DocumentFormContainer.propTypes = {
	formAttr: PropTypes.object.isRequired,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func
};

export default DocumentFormContainer;

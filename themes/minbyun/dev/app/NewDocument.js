import React, {Component, PropTypes} from 'react';
import DocumentForm from './DocumentForm';

import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find() ...

class NewDocument extends Component {
	render(){
		return(
			<div>new document</div>
		);
	}
}

export default NewDocument;


/*
class NewDocument extends Component {
	componentWillMount(){
		this.setState({
			id: Date.now(),
			subject	: '',
			content: '',
			memo: '',
			custom: {},
			uid: 0,
			created: 0,
			f3: '',
			f4: '',
			f5: '',
			f6: '',
			f7: '',
			f9: {}
		});
	}
	setInitialState(){
		if(this.props.documentFormData){
			this.props.documentFormData.fields.forEach((field) => {
				if(field.type == 'taxonomy'){
					let minIdx = -1;
					let firstTermId;
					this.props.documentFormData.taxonomy_terms.forEach((term) => {
						if(term.cid == field.cid){
							if(minIdx < 0){
								minIdx = term.idx; firstTermId = term.tid;
							} else if(minIdx > 0 && term.idx < minIdx){
								minIdx = term.idx; firstTermId = term.tid;
							}
						}
					});
					this.changeState(field, firstTermId);
				}
			});
		}
	}
	changeState(field, value){
		if(field.iscolumn == 1){
			this.setState({ ['f'+field.fid]: value });
		} else {
			let custom = update(this.state.custom, {
				$set: { [field.fid]: value }
			});
			this.setState({ custom: custom });
		}
	}
	handleChange(field, value){
		changeState(field, value);
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
	user: PropTypes.object,
	documentFormData: PropTypes.objectOf(PropTypes.array)
};

export default NewDocument;
*/

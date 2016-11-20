import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import axios from 'axios';
import FieldsInHeader from './document/FieldsInHeader';
import FieldsInContents from './document/FieldsInContents';
import EditDocument from './EditDocument';
import LinkByRole from './LinkByRole';
import {Table, Row, Column} from './Table';
import {_fieldAttrs, _convertToDoc} from './docSchema';
import {_isEmpty} from './functions';

class Document extends Component {
	constructor(){
		super();
		this.state = null;
	}
	componentDidMount(){
		axios.get('/api/document?id='+this.props.params.did)
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
	isHiddenField(fname){
		if(fname == 'trial'){
			if(this.state.doctype == 1) return false;
			else return true;
		}
		else if(fname == 'access') return true;
		return false;
	}
	render(){
		if(!this.state) return null;
		let userRole = this.props.userData.role;

		let fieldsInHeader = {image: null, file: null, date: null};
		let fieldsInContents = [];
		for(let fn in this.state){
			let fAttr = _fieldAttrs[fn];
			if(!fAttr.parent && fn != 'title'){
				if(fn == 'image' || fn == 'file' || fn == 'date'){
					fieldsInHeader[fn] = !_isEmpty(this.state[fn]) && <FieldsInHeader fname={fn} document={this.state} userRole={userRole}/>
				}
				else if(!this.isHiddenField(fn)){
					fieldsInContents.push(<FieldsInContents key={fn} fname={fn} docData={this.props.docData} document={this.state} />);
				}
			}
		};
		return (
			<div className="document">
				<div className="document--back" onClick={this.props.router.goBack.bind(this)}>
					<i className="pe-7f-back pe-va"></i> <span>이전 페이지로</span>
				</div>
				<div className="document__wrap">
					<div className="document__header">
						{fieldsInHeader.image}
						<div className={(fieldsInHeader.image ? 'document__column' : '')}>
							<h1>{this.state.title}</h1>
							<div className="document__buttons">
								<button type="button"><i className="pe-7f-bookmarks pe-va"></i>{' '}북마크</button>
								<LinkByRole to={'/document/'+this.state.id+'/edit'} role={[1, 3]} userRole={userRole}>수정하기</LinkByRole>
							</div>
							<Table>
								{fieldsInHeader.date}
								{fieldsInHeader.file}
							</Table>
						</div>
					</div>
					<Table className="document__contents">
						{fieldsInContents}
					</Table>
				</div>
			</div>
		);
	}
}
Document.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	openedDocuments: PropTypes.object,
	router: PropTypes.shape({
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Document);

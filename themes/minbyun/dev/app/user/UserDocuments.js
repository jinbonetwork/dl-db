import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import DocListItem from '../documentList/DocListItem';
import Pagination from '../accessories/Pagination';
import {Table, Row, Column} from '../accessories/Table';
import {_convertToDoc} from '../schema/docSchema';
import {_displayDate} from '../accessories/functions';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...

class UserDocuments extends Component {
	constructor(){
		super();
		this.state = {
			sDocuments: [],
			numOfPages: 1
		};
	}
	componentDidMount(){
		if(!this.props.params.page) this.props.router.push('/user/documents/page/1');
		else this.fetchData(this.props.params.page);
	}
	componentWillReceiveProps(nextProps){
		if(!nextProps.params.page) nextProps.router.push('/user/documents/page/1');
		else if(nextProps.params.page != this.props.params.page){
			this.fetchData(nextProps.params.page);
		}
	}
	fetchData(page){
		let unsetProcessing = this.props.setMessage(null);
		this.props.fetchData('get', '/api/user/documents?page='+page, (data) => {
			unsetProcessing();
			if(data){
				if(data.result.cnt > 0){
					this.setState({
						sDocuments: data.documents,
						numOfPages: data.result.total_page
					});
				} else {
					this.setState({documents: null, numOfPages: 1});
				}
			}
		});
	}
	userDoc(doc){
		const docData = this.props.docData;
		const fAttrs = docData.fAttrs;
		const fieldsArray = ['doctype', 'date', 'committee'];
		const fieldsToMerge = {};
		fieldsArray.forEach((fn) => {if(fAttrs[fn] && doc[fn]){
			if(fAttrs[fn].type == 'taxonomy'){
				if(fAttrs[fn].multiple){
					 let fv = doc[fn].map((t) => {
						let term = docData.terms[t]; if(term) return term.name;
					}).join(', ');
					if(fv) fieldsToMerge[fn] = fv;
				} else {
					let term = docData.terms[doc[fn]];
					if(term) fieldsToMerge[fn] = term.name;
				}
			}
			else if(fAttrs[fn].type == 'date' && fAttrs[fn].form == 'Ym'){
				if(!fAttrs[fn].multiple){
					fieldsToMerge[fn] = _displayDate(doc[fn]);
				} else {
					fieldsToMerge[fn] = doc[fn].map((d) => _displayDate(d));
				}

			}
		}});
		return update(doc, {$merge: fieldsToMerge});
	}
	render(){
		const documents =  this.state.sDocuments.map((doc) => this.userDoc(_convertToDoc(doc, this.props.docData)));
		const page = parseInt(this.props.params.page);
		const numOfPages = this.state.numOfPages;

		const documentList = documents.map((doc) => (
			<DocListItem key={doc.id} document={doc} docData={this.props.docData} userRole={this.props.userData.role} />
		));
		return (
			<div className="userdocs">
				<div className="userdocs__doclist">
					{documentList}
				</div>
				<Pagination url="/user/documents/page/" page={page} numOfPages={numOfPages} />
			</div>
		);
	}
}
UserDocuments.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(UserDocuments);

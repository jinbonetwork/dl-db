import React, {Component, PropTypes} from 'react';
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
			documents: null,
			numOfPages: 1
		};
	}
	componentDidMount(){
		this.fetchData(this.props.params.page);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.params.page != this.props.params.page){
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
						documents: data.documents.map((doc) => this.userDoc(_convertToDoc(doc))),
						numOfPages: data.result.total_page
					});
				} else {
					this.setState({documents: null, numOfPages:1});
				}
			}
		});
	}
	userDoc(doc){
		return update(doc, {$merge: {
			doctype: this.props.docData.terms[doc.doctype],
			date: _displayDate(doc.date),
			commitee: this.props.docData.terms[doc.commitee],
		}});
	}
	render(){
		if(!this.state.documents) return null;
		let documents = this.state.documents && this.state.documents.map((doc) => (
			<DocListItem key={doc.id} document={doc} docData={this.props.docData} userRole={this.props.userData.role} />
		));
		return (
			<div className="userdocs">
				<div className="userdocs__doclist">
					{documents}
				</div>
				<Pagination url="/user/documents/page/" page={parseInt(this.props.params.page)} numOfPages={this.state.numOfPages} />
			</div>
		);
	}
}
UserDocuments.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	setMessage: PropTypes.func
};

export default UserDocuments;

import React, {Component, PropTypes} from 'react';
import DocumentList from '../documentList/DocumentList.js'
import {Table, Row, Column} from '../accessories/Table';
import {_convertToDoc} from '../schema/docSchema';

class UserDocuments extends Component {
	constructor(){
		super();
		this.state = {
			documents: [],
			page: 0,
			numOfPages: 0
		};
	}
	componentDidMount(){
		this.fetchData();
	}
	fetchData(query){
		let unsetProcessing = this.props.setMessage(null);
		this.props.fetchData('get', '/api/user/documents', (data) => { if(data){
			this.setState({
				documents: data.documents.map((doc) => _convertToDoc(doc)),
				page: data.result.page,
				numOfPages: data.result.total_page
			});
			unsetProcessing();
		}});
	}
	render(){
		if(this.state.documents.length == 0) return null;
		return (
			<div className="userdocs">
				<DocumentList
					documents={this.state.documents} page={this.state.page} numOfPages={this.state.numOfPages}
					userData={this.props.userData} docData={this.props.docData}
					fetchData={this.props.fetchData} setMessage={this.props.setMessage}
				/>
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

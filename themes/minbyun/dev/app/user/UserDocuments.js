import React, {Component, PropTypes} from 'react';
import DocListItem from '../documentList/DocListItem';
import Pagination from '../accessories/Pagination';
import {Table, Row, Column} from '../accessories/Table';
import {_convertToDoc} from '../schema/docSchema';

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
						documents: data.documents.map((doc) => _convertToDoc(doc)),
						numOfPages: data.result.total_page
					});
				} else {
					//this.props.setMessage('요청한 페이지가 존재하지 않습니다.', 'goBack');
				}
			}
		});
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

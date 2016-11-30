import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import DocListItem from './DocListItem';
import Pagination from '../accessories/Pagination';

class DocumentList extends Component {
	render(){
		let documents = this.props.documents.map((doc, index) => (
			<div key={index} className="doclist__item">
				{/*<div className="doclist__number"><span>{index+1}</span></div>*/}
				<DocListItem document={doc} docData={this.props.docData} userRole={this.props.userData.role} />
			</div>
		));
		return (
			<div className="doclist">
				<div>{documents}</div>
				<Pagination url="/search" page={this.props.page} numOfPages={this.props.numOfPages} />
			</div>
		);
	}
}
DocumentList.propTypes = {
	documents: PropTypes.arrayOf(PropTypes.object),
	page: PropTypes.number.isRequired,
	numOfPage: PropTypes.number,
	userData: PropTypes.object.isRequired,
	docData: PropTypes.object,
	fetchData: PropTypes.func.isRequired,
	setMessage: PropTypes.func.isRequired
};

export default DocumentList;

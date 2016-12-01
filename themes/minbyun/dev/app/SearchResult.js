import React, {Component, PropTypes} from 'react';
import DocListItem from './documentList/DocListItem';
import Pagination from './accessories/Pagination';
import {Table, Row, Column} from './accessories/Table';
import {_convertToDoc} from './schema/docSchema';
import {_params} from './accessories/functions';

class SearchResult extends Component {
	constructor(){
		super();
		this.state = {
			documents: null,
			numOfPages: 1
		};
	}
	componentDidMount(){
		this.fetchData(_params(this.props.location.query));
	}
	componentWillReceiveProps(nextProps){
		let thisUrlParams = _params(this.props.location.query);
		let nextUrlParams = _params(nextProps.location.query);
		if(thisUrlParams != nextUrlParams){
			this.fetchData(nextUrlParams);
		}
	}
	fetchData(params){ console.log(params);
		/*
		let unsetProcessing = this.props.setMessage(null);
		this.props.fetchData('get', '/api/search?page=1', (data) => { if(data){
			this.setState({
				documents: data.documents.map((doc) => _convertToDoc(doc)),
				page: data.result.page,
				numOfPages: data.result.total_page
			});
			unsetProcessing();
		}});
		*/
	}
	doctypeOptions(){
		let options = {};
		this.props.docData.taxonomy.doctype.forEach((value) => {
			options[value] = this.props.docData.terms[value];
		});
		return options;
	}
	render(){

		return null;


		let documents = this.state.documents.map((document, index) => (
			<div key={index} className="search-result__item">
				<div className="search-result__number"><span>{index+1}</span></div>
				<ResultItem document={document} docData={this.props.docData} userRole={this.props.userData.role} />
			</div>
		));
		return (
			<div className="search-result">
				<div>{documents}</div>
				<Pagination url="/search" page={this.state.page} numOfPages={this.state.numOfPages} />
			</div>
		);
	}
}
SearchResult.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	updateSearchQuery: PropTypes.func,
	setMessage: PropTypes.func
};

export default SearchResult;

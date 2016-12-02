import React, {Component, PropTypes} from 'react';
import DocListItem from './documentList/DocListItem';
import Pagination from './accessories/Pagination';
import {Table, Row, Column} from './accessories/Table';
import {_convertToDoc, _fname} from './schema/docSchema';
import {_params} from './accessories/functions';

const _convertToSearchedDoc = (ssDoc) => { if(ssDoc){
	let doc = _convertToDoc(ssDoc._source);
	doc.id = parseInt(ssDoc._id);
	return doc;
}};

class SearchResult extends Component {
	constructor(){
		super();
		this.state = {
			documents: null,
			numOfPages: 20
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
			this.updateSearchQuery(nextProps.location.query);
		}
	}
	fetchData(params){
		let unsetProcessing = this.props.setMessage(null);
		this.props.fetchData('get', '/api/search'+params, (data) => { unsetProcessing(); if(data){
			if(data.result.cnt > 0){
				this.setState({
					documents: data.documents.map((doc) => _convertToSearchedDoc(doc)),
					numOfPages: data.result.total_page
				});
			} else {
				this.setState({documents: null, numOfPages:1});
			}
		}});
	}
	updateSearchQuery(query){
		let searchQuery = {};
		for(let prop in query){
			if(prop == 'q'){
				searchQuery.keyword = decodeURIComponent(query[prop]);
			}
			else if(_fname[prop] == 'doctype'){
				let doctypes = query[prop].replace('{', '').replace('}', '');
				doctypes = doctype.split(',');
				searchQuery.doctypes = doctypes;
			}
			else if(_fname[prop] == 'date'){
				let period = decodeURIComponent(query[prop]).split('-');
				searchQuery.from = period[0];
				searchQuery.to = period[1];
			}
		}
		console.log(searchQuery);
	}
	render(){
		const query = this.props.location.query;
		const page = (query.page ? parseInt(query.page) : 1);

		if(!this.state.documents) return null;
		let documents = this.state.documents && this.state.documents.map((doc, index) => (
			<div key={index} className="search-result__item">
				<div className="search-result__number"><span>{index+1}</span></div>
				<div>
					<DocListItem key={doc.id} document={doc} docData={this.props.docData} userRole={this.props.userData.role} />
				</div>
			</div>
		));

		return (
			<div className="search-result">
				<div className="search-result__doclist">
					{documents}
				</div>
				<Pagination url={'/search'+_params(query, false)+'&page='} page={page} numOfPages={this.state.numOfPages} />
			</div>
		);
	}
}
SearchResult.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	searchQuery: PropTypes.object,
	fetchData: PropTypes.func,
	updateSearchQuery: PropTypes.func,
	setMessage: PropTypes.func
};

export default SearchResult;

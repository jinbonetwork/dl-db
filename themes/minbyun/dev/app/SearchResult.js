import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import DocListItem from './documentList/DocListItem';
import DocListHead from './documentList/DocListHead';
import Pagination from './accessories/Pagination';
import {_convertToDoc} from './schema/docSchema';
import {_searchQuery, _searchQueryEach, _query} from './schema/searchSchema';
import {_params, _isEmpty} from './accessories/functions';

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
			numOfPages: 1
		};
	}
	componentDidMount(){
		if(!_isEmpty(this.props.location.query)){
			let sQuery = _searchQuery(this.props.location.query, true);
			this.props.updateSearchQuery(sQuery);
			this.fetchData(_params(_query(sQuery)));
		};
	}
	componentWillReceiveProps(nextProps){
		let thisUrlParams = _params(this.props.location.query);
		let nextUrlParams = _params(nextProps.location.query);
		if(thisUrlParams != nextUrlParams){
			this.fetchData(nextUrlParams);
		}
	}
	fetchData(params){
		let unsetProcessing = this.props.setMessage(null);
		this.props.fetchData('get', '/api/search'+params, (data) => { unsetProcessing(); if(data){
			if(typeof data === 'string'){
				this.setState({documents: null, numOfPages: 1}); return;
			}
			if(data.result.cnt > 0){
				this.setState({
					documents: data.documents.map((doc) => _convertToSearchedDoc(doc)),
					numOfPages: data.result.total_page
				});
			} else {
				this.setState({documents: null, numOfPages: 1});
				this.props.setMessage('검색결과가 없습니다', 'goTo', '/');
			}
		}});
	}
	handleChange(which, arg1st, arg2nd){
		if(which == 'dochead'){
			which = arg1st; let value = arg2nd;
			if(which == 'doctypes'){
				this.props.updateSearchQuery('doctypes', value);
				let sQuery = _searchQuery(this.props.location.query);
				sQuery.doctypes = value;
				this.props.router.push('/search/'+_params(_query(sQuery)));

			}
		}
	}
	render(){
		const query = this.props.location.query;
		const page = (query.page ? parseInt(query.page) : 1);
		const doctypes = _searchQueryEach('doctypes', query);

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
				<DocListHead
					docData={this.props.docData} doctypes={doctypes}
					onChange={this.handleChange.bind(this, 'dochead')}
				/>
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
	setMessage: PropTypes.func,
	router: PropTypes.shape({push: PropTypes.func.isRequired}).isRequired
};

export default withRouter(SearchResult);

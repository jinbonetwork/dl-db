import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import DocListItem from './documentList/DocListItem';
import DocListHead from './documentList/DocListHead';
import Pagination from './accessories/Pagination';
import {_searchQuery, _query, _queryOf, _params} from './schema/searchSchema';
import {_isEmpty, _displayDate} from './accessories/functions';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...

class SearchResult extends Component {
	constructor(){
		super();
		this.state = {
			sDocuments: [],
			distribution: {},
			numOfPages: 1
		};
	}
	componentDidMount(){
		if(!_isEmpty(this.props.location.query)){
			this.updateSearchQueryAndFetchData();
		};
	}
	componentDidUpdate(prevProps, prevState){
		if(
			JSON.stringify(prevProps.location.query) != JSON.stringify(this.props.location.query) ||
			JSON.stringify(prevProps.docData) != JSON.stringify(this.props.docData)
		){
			this.updateSearchQueryAndFetchData();
		}
	}
	updateSearchQueryAndFetchData(){
		const query = this.props.location.query;
		const sQuery = this.searchQuery(query, true);
		const params = this.params(update(this.query(sQuery), {$merge: {
			orderby: query.orderby, page: query.page
		}}));
		this.props.updateSearchQuery(sQuery);
		this.fetchData(params);
	}
	query(sQuery){
		return _query(sQuery, this.props.docData.sFname);
	}
	queryOf(propOfSQuery, query){
		return _queryOf(propOfSQuery, query, this.props.docData.sFname);
	}
	params(params, excepts){
		return _params(params, this.props.docData.sFname, excepts)
	}
	searchQuery(query, correct){
		return _searchQuery(query, this.props.docData.fname, correct);
	}
	fetchData(params){
		const unsetProc = this.props.setMessage(null);
		this.props.fetchData('get', '/api/search'+params, (data) => { unsetProc(); if(data){
			if(typeof data === 'string'){
				this.setState({sDocuments: null, numOfPages: 1});
				this.props.setMessage(data, 'unset');
				return;
			}
			if(data.result.cnt > 0){
				this.setState({
					sDocuments: data.documents,
					distribution: data.result.taxonomy_cnt,
					numOfPages: data.result.total_page
				});
			} else {
				this.setState({sDocuments: [], distribution: {}, numOfPages: 1});
			}
		}});
	}
	handleChange(which, arg1st, arg2nd){
		if(which == 'dochead'){
			which = arg1st; let value = arg2nd, query;
			if(which == 'doctypes'){
				this.props.updateSearchQuery('doctypes', value);
				query = update(this.props.location.query, {$merge: this.query({doctypes: value})});
			}
			else if(which == 'orderby'){
				query = update(this.props.location.query, {$merge: {order: value}});
			}
			this.props.router.push('/search'+this.params(query));
		}
	}
	searched(sSearched){
		let searched = {};
		searched.id = sSearched._id;
		for(let fn in sSearched._source){
			let value = sSearched._source[fn];
			let fname = this.props.docData.fname[fn];
			if(fname == 'date') value = value.replace('-', '/');
			searched[fname] = value;
		}
		return searched;
	}
	keywords(query){
		let keywords = [];
		let kwd = this.searchQuery(this.queryOf('keyword', query)).keyword; if(!kwd) return '';
		kwd = kwd.replace(/[\&\!\+\"]/g, '');
		kwd.split(' ').forEach((k) => {
			if(k && kwd.match(new RegExp(k, 'g')).length === 1) keywords.push(k);
		});
		return keywords.join('|');
	}
	render(){
		const query = this.props.location.query;
		const page = (query.page ? parseInt(query.page) : 1);
		const paginationUrl = '/search'+this.params(query, ['page'])+'&page=';
		const doctypes = this.searchQuery(this.queryOf('doctypes', query)).doctypes || [];
		const orderby = (query.order ? query.order : 'score');
		const keywords = this.keywords(query);

		const documents = this.state.sDocuments.map((sDoc, index) => (
			<div key={index} className="search-result__item">
				<div className="search-result__number"><span>{index+1}</span></div>
				<div>
					<DocListItem key={index} docData={this.props.docData} userRole={this.props.userData.role}
						document={this.searched(sDoc)} keywords={keywords}
					/>
				</div>
			</div>
		));

		return (
			<div className="search-result">
				<DocListHead
					docData={this.props.docData} distribution={this.state.distribution} doctypes={doctypes} orderby={orderby}
					onChange={this.handleChange.bind(this, 'dochead')}
				/>
				<div className="search-result__doclist">
					{documents}
				</div>
				<Pagination url={paginationUrl} page={page} numOfPages={this.state.numOfPages} />
			</div>
		);
	}
}
SearchResult.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object,
	fetchData: PropTypes.func,
	updateSearchQuery: PropTypes.func,
	setMessage: PropTypes.func,
	router: PropTypes.shape({push: PropTypes.func.isRequired}).isRequired
};

export default withRouter(SearchResult);

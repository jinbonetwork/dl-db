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
			documents: [],
			distribution: {},
			numOfPages: 1
		};
	}
	componentDidMount(){
		if(!_isEmpty(this.props.location.query)){
			const sFname = this.props.docData.sFname;
			const query = this.props.location.query;
			const sQuery = _searchQuery(query, this.props.docData.fname, true);
			this.props.updateSearchQuery(sQuery);

			let params = _params(update(_query(sQuery, sFname), {$merge: {
				orderby: query.orderby, page: query.page
			}}), sFname);
			this.fetchData(params);
			if(params != _params(query, sFname)) this.props.router.push('/search'+params);
		};
	}
	componentWillReceiveProps(nextProps){
		const sFname = this.props.docData.sFname;
		let thisUrlParams = _params(this.props.location.query, sFname);
		let nextUrlParams = _params(nextProps.location.query, sFname);
		if(thisUrlParams != nextUrlParams){
			this.fetchData(nextUrlParams);
		}
	}
	fetchData(params){
		let unsetProcessing = this.props.setMessage(null);
		this.props.fetchData('get', '/api/search'+params, (data) => { unsetProcessing(); if(data){
			if(typeof data === 'string'){
				this.setState({documents: null, numOfPages: 1});
				this.props.setMessage(data, 'unset');
				return;
			}
			if(data.result.cnt > 0){
				this.setState({
					documents: data.documents.map((doc) => this.searched(doc)),
					distribution: data.result.taxonomy_cnt,
					numOfPages: data.result.total_page
				});
			} else {
				this.setState({documents: [], distribution: {}, numOfPages: 1});
			}
		}});
	}
	handleChange(which, arg1st, arg2nd){
		if(which == 'dochead'){
			const sFname = this.props.docData.sFname;
			which = arg1st; let value = arg2nd, query;
			if(which == 'doctypes'){
				this.props.updateSearchQuery('doctypes', value);
				query = update(this.props.location.query, {$merge: _query({doctypes: value}, sFname)});
			}
			else if(which == 'orderby'){
				query = update(this.props.location.query, {$merge: {order: value}});
			}
			this.props.router.push('/search'+_params(query, sFname));
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
		const sFname = this.props.docData.sFname;
		const fname = this.props.docData.fname;
		let keywords = [];
		let kwd = _searchQuery(_queryOf('keyword', query, sFname), fname).keyword; if(!kwd) return '';
		kwd = kwd.replace(/[\&\!\+\"]/g, '');
		kwd.split(' ').forEach((k) => {
			if(k && kwd.match(new RegExp(k, 'g')).length === 1) keywords.push(k);
		});
		return keywords.join('|');
	}
	render(){
		const sFname = this.props.docData.sFname;
		const fname = this.props.docData.fname;
		const query = this.props.location.query;
		const page = (query.page ? parseInt(query.page) : 1);
		const paginationUrl = '/search'+_params(query, sFname, ['page'])+'&page=';
		const doctypes = _searchQuery(_queryOf('doctypes', query, sFname), fname).doctypes || [];
		const orderby = (query.order ? query.order : 'score');
		const keywords = this.keywords(query);

		let documents = this.state.documents.map((doc, index) => (
			<div key={index} className="search-result__item">
				<div className="search-result__number"><span>{index+1}</span></div>
				<div>
					<DocListItem key={doc.id} docData={this.props.docData} userRole={this.props.userData.role}
						document={doc} keywords={keywords}
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

import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import DocListItem from './DocListItem';
import DocListHead from './DocListHead';
import Pagination from '../accessories/Pagination';
import {_searchQuery, _query, _queryOf, _params} from '../functions';
import {_isEmpty, _displayDate} from '../accessories/functions';
import {SCREEN} from '../constants';
import update from 'react-addons-update';

class SearchResult extends Component {
	componentDidMount(){ console.log();
		if(!_isEmpty(this.props.location.query)){
			this.updateSearchQueryAndFetchData();
		};
	}
	shouldComponentUpdate(nextProps){
		if(nextProps.location.query.page > nextProps.lastPage){
			let query = update(nextProps.location.query, {page: {$set: nextProps.lastPage}});
			this.props.router.push('/search'+this.params(query));
			return false;
		} else {
			return true;
		}
	}
	componentDidUpdate(prevProps){
		if(JSON.stringify(prevProps.location.query) != JSON.stringify(this.props.location.query)){
			this.updateSearchQueryAndFetchData();
		}
	}
	updateSearchQueryAndFetchData(){
		const query = this.props.location.query;
		const sQuery = this.searchQuery(query, true);
		const params = this.params(update(this.query(sQuery), {$merge: {
			order: query.order, page: query.page
		}}));
		this.props.changeQuery(sQuery);
		this.props.searchDocs(params);
	}
	query(sQuery){
		return _query(sQuery, this.props.fData.fID);
	}
	queryOf(propOfSQuery, query){
		return _queryOf(propOfSQuery, query, this.props.fData.fID);
	}
	params(params, excepts){
		return _params(params, this.props.fData.fID, excepts);
	}
	searchQuery(query, correct){
		return _searchQuery(query, this.props.fData.fSlug, correct);
	}
	handleChange(which, arg1st, arg2nd){
		if(which == 'dochead'){
			which = arg1st; let value = arg2nd, query;
			if(which == 'doctypes'){
				this.props.changeQuery({doctypes: value});
				query = update(this.props.location.query, {$merge: this.query({doctypes: value})});
			}
			else if(which == 'orderby'){
				query = update(this.props.location.query, {$merge: {order: value}});
			}
			this.props.router.push('/search'+this.params(query));
		}
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
		const documents = this.props.result.map((doc, index) => (
			<div key={index} className="search-result__item">
				<div className="search-result__number"><span>{index+1}</span></div>
				<div>
					<DocListItem key={index} idx={index+1} fData={this.props.fData} role={this.props.role} document={doc} keywords={keywords}
						onClickTitle={() => this.props.router.push('/document/'+doc.id)} showMessage={this.props.showMessage}
					/>
				</div>
			</div>
		));
		return (
			<div className="search-result">
				<DocListHead
					fData={this.props.fData} distribution={this.props.distribution} doctypes={doctypes} orderby={orderby}
					onChange={this.handleChange.bind(this, 'dochead')}
				/>
				<div className="search-result__doclist">
					{documents}
				</div>
				<Pagination url={paginationUrl} page={page} lastPage={this.props.lastPage}
					numOfPages={(this.props.window.width <= SCREEN.sMedium ? 5 : 10 )}
				/>
			</div>
		);
	}
}
SearchResult.propTypes = {
	role: PropTypes.arrayOf(PropTypes.string).isRequired,
	fData: PropTypes.object.isRequired,
	result: PropTypes.arrayOf(PropTypes.object).isRequired,
	distribution: PropTypes.object.isRequired,
	lastPage: PropTypes.number.isRequired,
	window: PropTypes.object.isRequired,
	searchDocs: PropTypes.func.isRequired,
	changeQuery: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	router: PropTypes.shape({push: PropTypes.func.isRequired}).isRequired
};

export default withRouter(SearchResult);

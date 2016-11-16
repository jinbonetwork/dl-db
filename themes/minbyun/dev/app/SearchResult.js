import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import ResultItem from './searchResult/ResultItem';
import func from './functions';

const _propMap = {
	id: 'id',
	subject: 'title',
	f1: 'doctype',
	content: 'content',
	f10: 'date',
	f8: 'commitee',
	f4: 'number',
	f13: 'author'
}
const _tidOfdocTypeCase = 1;

class SearchResult extends Component {
	constructor(){
		super();
		this.state = {
			items: [],
			page: 0,
			numOfPages: 0
		};
	}
	componentDidMount(){
		this.fetchData(this.props.location.query.page);
	}
	componentWillReceiveProps(nextProps){
		this.fetchData(nextProps.location.query.page);
	}
	fetchData(page){
		page = (page ? page : 1);
		axios.get(this.props.apiUrl+'/document?page='+page)
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					this.setDocuments(response.data);
				} else {
					console.error(response.data.message);
				}
			} else {
				console.error('Server response was not OK');
			}
		});
	}
	setDocuments(data){
		let items = data.documents.map((doc) => {
			let item = {}, isDocTypeCase = false, prop;
			for(let p in _propMap){
				prop = _propMap[p];
				if(!func.isEmpty(doc[p])){
					switch(prop){
						case 'doctype':
							for(let tid in doc[p]){
								item[prop] = doc[p][tid].name;
								if(tid == _tidOfdocTypeCase) isDocTypeCase = true;
							}
							break;
						case 'commitee':
							item[prop] = []
							for(let tid in doc[p]){
								item[prop].push(doc[p][tid].name);
								if(tid == _tidOfdocTypeCase) isDocTypeCase = true;
							}
							item[prop] = item[prop].join(', ');
							break;
						case 'date':
							item[prop] = func.displayDate(doc[p]);
							break;
						default:
							item[prop] = doc[p];
					}
				}
			}
			if(item.number && isDocTypeCase === false) delete item.number;
			return item;
		});
		this.setState({
			items: items,
			page: data.result.page,
			numOfPages: data.result.total_page
		});
	}
	pageOfPagination(page){
		if(page != 0){
			if(page != this.state.page){
				return <Link className="search-result__page" key={page} to={'/search?page='+page}>{page}</Link>
			} else {
				return <span className="search-result__page" key={page}>{page}</span>
			}
		} else {
			return <span className="search-result__page search-result_ellipsis" key={page}>...</span>
		}
	}
	pagination(){
		let maxPage = 10;
		let pagination = [];
		for(let i = 1; i <= this.state.numOfPages && i < maxPage; i++){
			pagination.push(this.pageOfPagination(i));
		}
		if(this.state.numOfPages > maxPage){
			pagination.push(this.pageOfPagination(0));
			pagination.push(this.pageOfPagination(this.state.numOfPages));
		}
		return pagination;
	}
	render(){
		let userRole = (this.props.userData ? this.props.userData.role : null);
		let items = this.state.items.map((item, index) => (
			<div key={index} className="search-result__item">
				<div className="search-result__number"><span>{index+1}</span></div>
				<ResultItem item={item} userRole={userRole} apiUrl={this.props.apiUrl} />
			</div>
		));
		return (
			<div className="search-result">
				<div>{items}</div>
				<div className="search-result__pagination">{this.pagination()}</div>
			</div>
		);
	}
}
SearchResult.propTypes = {
	userData: PropTypes.object,
	apiUrl: PropTypes.string
};

export default SearchResult;

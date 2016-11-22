import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import ResultItem from './searchResult/ResultItem';
import {_convertToDoc} from './docSchema';

class SearchResult extends Component {
	constructor(){
		super();
		this.state = {
			documents: [],
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
		axios.get('/api/document?page='+page)
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
		this.setState({
			documents: data.documents.map((doc) => _convertToDoc(doc)),
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
		let documents = this.state.documents.map((document, index) => (
			<div key={index} className="search-result__item">
				<div className="search-result__number"><span>{index+1}</span></div>
				<ResultItem document={document} docData={this.props.docData} userRole={this.props.userData.role} />
			</div>
		));
		return (
			<div className="search-result">
				<div>{documents}</div>
				<div className="search-result__pagination">{this.pagination()}</div>
			</div>
		);
	}
}
SearchResult.propTypes = {
	userData: PropTypes.object,
	docData: PropTypes.object
};

export default SearchResult;

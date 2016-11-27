import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

const _maxPage = 10;

class Pagination extends Component {
	componentWillMount(){
		let separator = (this.props.url.match(/\?/) ? '&' : '?');
		let paramName = (this.props.paramName ? this.props.paramName+'=' : 'page=');
		this.setState({
			url: this.props.url+separator+paramName
		});
	}
	page(page){
		if(page != 0){
			if(page != this.props.page){
				return <Link className="pagination__page" key={page} to={this.state.url+page}>{page}</Link>
			} else {
				return <span className="pagination__page" key={page}>{page}</span>
			}
		} else {
			return <span className="pagination__page pagination__ellipsis" key={page}>...</span>
		}
	}
	render(){
		let pagination = [];
		for(let i = 1; i <= this.props.numOfPages && i < _maxPage; i++){
			pagination.push(this.page(i));
		}
		if(this.props.numOfPages > _maxPage){
			pagination.push(this.page(0));
			pagination.push(this.page(this.props.numOfPages));
		}
		return <div className="pagination">{pagination}</div>
	}
}
Pagination.propTypes = {
	url: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	numOfPages: PropTypes.number.isRequired,
	paramName: PropTypes.string,
}

export default Pagination;

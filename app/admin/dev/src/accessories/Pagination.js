import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

const _numOfPages = 10;

class Pagination extends Component {
	page(page){
		if(page != this.props.page){
			return <Link className="pagination__page" key={page} to={this.props.url+page}>{page}</Link>
		} else {
			return <span className="pagination__page" key={page}>{page}</span>
		}
	}
	render(){
		let pagination = [];
		let from, to;
		if(this.props.lastPage <= _numOfPages){
			from = 1; to = this.props.lastPage;
		} else {
			let tempFrom = (this.props.page - 4 >= 1 ? this.props.page - 4 : 1);
			to = (tempFrom + _numOfPages - 1 <= this.props.lastPage ? tempFrom + _numOfPages - 1 : this.props.lastPage);
			from = to - _numOfPages + 1;
		}
		for(let i = from; i <= to; i++){
			pagination.push(this.page(i));
		}
		let prevPage = (this.props.page > 1 ? this.props.url + (this.props.page - 1) : null);
		let nextPage = (this.props.page < this.props.lastPage ? this.props.url + (this.props.page + 1) : null);
		return (
			<div className="pagination">
				<Link className="pagination__page pagination__arrow" to={prevPage}>{this.props.prevIcon}</Link>
				{pagination}
				<Link className="pagination__page pagination__arrow" to={nextPage}>{this.props.nextIcon}</Link>
			</div>
		);
	}
}
Pagination.propTypes = {
	url: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	lastPage: PropTypes.number.isRequired,
	prevIcon: PropTypes.element,
	nextIcon: PropTypes.element
}
Pagination.defaultProps = {
	prevIcon: <i className="pe-7s-angle-left pe-va"></i>,
	nextIcon: <i className="pe-7s-angle-right pe-va"></i>
};

export default Pagination;

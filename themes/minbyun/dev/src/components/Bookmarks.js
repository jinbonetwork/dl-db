import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import Pagination from '../accessories/Pagination';
import {_displayDateOfMilliseconds} from '../accessories/functions';

class Bookmarks extends Component {
	componentDidMount(){
		this.props.fetchBookmarks(this.props.params.page);
	}
	componentDidUpdate(prevProps){
		if(prevProps.params.page != this.props.params.page){
			this.props.fetchBookmarks(this.props.params.page);
		}
	}
	handleClick(which, arg){
		if(which == 'remove'){
			const {bmId, docId} = arg
			this.props.removeBookmark({bmId, docId: (this.props.openDocs[docId] ? docId : undefined),
				afterRemove: () => this.props.fetchBookmarks(this.props.params.page)
			});
		}
	}
	render(){
		const page = (this.props.params.page ?  parseInt(this.props.params.page) : 1);
		const rows = this.props.bookmarks && this.props.bookmarks.map((bmk) => (
			<div className="table__row" key={bmk.id}>
				<div className="table__col"><span>{bmk.regDate}</span></div>
				<div className="table__col">
					<Link to={'/document/'+bmk.id}><span>{bmk.title}</span></Link>
					<div className="bookmarks__btnwrap">
						<button type="button" className="bookmarks__remove" onClick={this.handleClick.bind(this, 'remove', {bmId: bmk.bid, docId: bmk.id})}>
							<i className="pe-7s-close-circle pe-va"></i>
						</button>
					</div>
				</div>
			</div>
		));
		return (
			<div className="bookmarks">
				<div className="bookmarks__content">
					<div className="table">
						<div className="table__row">
							<div className="table__col">저장일</div>
							<div className="table__col">{this.props.fData.fProps.title.dispName}</div>
						</div>
						{rows}
					</div>
				</div>
				<Pagination url="/user/bookmarks/page/" page={page} lastPage={this.props.lastPage} />
			</div>
		);
	}
}
Bookmarks.propTypes = {
	openDocs: PropTypes.object.isRequired,
	bookmarks: PropTypes.arrayOf(PropTypes.object).isRequired,
	lastPage: PropTypes.number.isRequired,
	fData: PropTypes.object.isRequired,
	fetchBookmarks: PropTypes.func.isRequired,
	removeBookmark: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired,
		replace: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Bookmarks);

import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import Pagination from '../accessories/Pagination';
import {Table, Row, Column} from '../accessories/Table';
import {_sFname, _fieldAttrs} from '../schema/docSchema';
import {_displayDateOfMilliseconds} from '../accessories/functions';

class Bookmarks extends Component {
	constructor(){
		super();
		this.state = {
			bookmarks: null,
			numOfPages: 1
		};
	}
	componentDidMount(){
		this.fetchData(this.props.params.page ? this.props.params.page : 1);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.params.page != this.props.params.page){
			this.fetchData(nextProps.params.page);
		}
	}
	fetchData(page){
		let unsetProcessing = this.props.setMessage(null);
		this.props.fetchData('get', '/api/user/bookmark?page='+page, (data) => {
			unsetProcessing();
			if(data){
				if(data.result.cnt > 0){
					this.setState({
						bookmarks: data.bookmarks.map((sBmk) => this.bookmark(sBmk)),
						numOfPages: data.result.total_page
					});
				} else {
					this.setState({bookmarks: null, numOfPages: 1});
				}
			}
		});
	}
	bookmark(sBookmark){
		return {
			id: sBookmark[_sFname['id']],
			bid: sBookmark.bid,
			regDate: _displayDateOfMilliseconds(sBookmark.regdate*1000),
			title: sBookmark[_sFname['title']]
		};
	}
	handleClick(which, arg){
		if(which == 'remove'){
			const bid = arg;
			this.props.fetchData('post', '/api/user/bookmark?mode=delete&bid='+bid, null, (data) => {if(data){
				this.fetchData(this.props.params.page ? this.props.params.page : 1);
			}});
		}
	}
	render(){
		const page = (this.props.params.page ?  parseInt(this.props.params.page) : 1);
		const rows = this.state.bookmarks && this.state.bookmarks.map((bmk) => (
			<Row key={bmk.id}>
				<Column><span>{bmk.regDate}</span></Column>
				<Column>
					<Link to={'/document/'+bmk.id}><span>{bmk.title}</span></Link>
					<div className="bookmarks__btnwrap">
						<button type="button" className="bookmarks__remove" onClick={this.handleClick.bind(this, 'remove', bmk.bid)}>
							<i className="pe-7s-close-circle pe-va"></i>
						</button>
					</div>
				</Column>
			</Row>
		));
		return (
			<div className="bookmarks">
				<div className="bookmarks__content">
					<Table>
						<Row>
							<Column>저장일</Column>
							<Column>{_fieldAttrs['title'].displayName}</Column>
						</Row>
						{rows}
					</Table>
				</div>
				<Pagination url="/user/bookmarks/page/" page={page} numOfPages={this.state.numOfPages} />
			</div>
		);
	}
}
Bookmarks.propTypes = {
	fetchData: PropTypes.func,
	setMessage: PropTypes.func,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired,
		replace: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Bookmarks);

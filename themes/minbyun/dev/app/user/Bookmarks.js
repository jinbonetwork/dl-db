import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Pagination from '../accessories/Pagination';
import {Table, Row, Column} from '../accessories/Table';
import {_sFname, _fieldAttrs} from '../schema/docSchema';

class Bookmarks extends Component {
	constructor(){
		super();
		this.state = {
			bookmarks: null,
			numOfPages: 1
		};
	}
	componentDidMount(){
		this.fetchData(this.props.params.page);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.params.page != this.props.params.page){
			this.fetchData(nextProps.params.page);
		}
	}
	fetchData(page){
		if(!page) page = 1;
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
					this.setState({documents: null, numOfPages: 1});
				}
			}
		});
	}
	bookmark(sBookmark){
		let regDate = new Date(sBookmark.regdate*1000);
		let year = regDate.getFullYear();
		let month = regDate.getMonth()+1; if(month < 10) month = '0'+month;
		let date = regDate.getDate(); if(date < 10) date = '0'+date;
		return {
			id: sBookmark[_sFname['id']],
			regDate: year+'/'+month+'/'+date,
			title: sBookmark[_sFname['title']]
		};
	}
	render(){
		const page = (this.props.params.page ? parseInt(this.props.params.page) : 1);
		const rows = this.state.bookmarks && this.state.bookmarks.map((bmk) => (
			<Row key={bmk.id}>
				<Column><span>{bmk.regDate}</span></Column>
				<Column><Link to={'/document/'+bmk.id}><span>{bmk.title}</span></Link></Column>
			</Row>
		));
		return (
			<div className="bookmarks">
				<Table>
					<Row>
						<Column>저장일</Column>
						<Column>{_fieldAttrs['title'].displayName}</Column>
					</Row>
					{rows}
				</Table>
				<Pagination url="/user/bookmarks/page/" page={page} numOfPages={this.state.numOfPages} />
			</div>
		);
	}
}

export default Bookmarks;

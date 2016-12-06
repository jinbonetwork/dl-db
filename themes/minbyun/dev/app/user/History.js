import React, {Component, PropTypes} from 'react';
import {withRouter, Link} from 'react-router';
import Pagination from '../accessories/Pagination';
import {Table, Row, Column} from '../accessories/Table';
import {_displayDateOfMilliseconds} from '../accessories/functions';
import {_sFname} from '../schema/docSchema';

class History extends Component {
	constructor(){
		super();
		this.state = {
			history: [],
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
		this.props.fetchData('get', '/api/user/history?page='+page, (data) => {
			unsetProcessing();
			if(data){
				if(data.result.cnt > 0){
					this.setState({
						history: data.histories.map((item) => this.history(item)),
						numOfPages: data.result.total_page
					});
				} else {
					this.setState({history: null, numOfPages: 1});
				}
			}
		});
	}
	history(item){
		const period = item.options[_sFname['date']];
		return {
			hid: item.hid,
			searchDate: _displayDateOfMilliseconds(item.search_date*1000),
			keyword: item.query,
			doctypes: item.options[_sFname['doctype']],
			from: (period && period.from ? period.from : ''),
			to: (period && period.to ? period.to : ''),
			params: item.query_string
		}
	}
	handleClick(which, arg){
		if(which == 'remove'){
			const hid = arg;
			this.props.fetchData('post', '/api/user/history?mode=delete&hid='+hid, null, (data) => { if(data){
				this.fetchData(this.props.params.page ? this.props.params.page : 1);
			}});
		}
	}
	render(){
		const page = (this.props.params.page ?  parseInt(this.props.params.page) : 1);
		const rows = this.state.history.map((item) => (
			<Row key={item.hid}>
				<Column><span>{item.searchDate}</span></Column>
				<Column>
					<div className="history__keyword">
						<Link to={'/search?'+item.params}>{item.keyword}</Link>
					</div>
					<div>
						{item.doctypes && <span className="history__doctypes">
							<i className="pe-7s-edit pe-va"></i>
							<span>{item.doctypes}</span>
						</span>}
						{(item.from || item.to) && <span className="history__period">
							<span>{item.from || '_'}</span>
							<span><i className="pe-7s-right-arrow pe-va"></i></span>
							<span>{item.to || '_'}</span>
						</span>}
					</div>
					<div className="history__btnwrap">
						<button type="button" className="history__remove" onClick={this.handleClick.bind(this, 'remove', item.hid)}>
							<i className="pe-7s-close-circle pe-va"></i>
						</button>
					</div>
				</Column>
			</Row>
		));
		return (
			<div className="history">
				<div className="history__content">
					<Table>
						<Row>
							<Column>검색일</Column>
							<Column>검색어</Column>
						</Row>
						{rows}
					</Table>
				</div>
				<Pagination url="/user/hisotry/page/" page={page} numOfPages={this.state.numOfPages} />
			</div>
		);
	}
}
History.propTypes = {
	fetchData: PropTypes.func,
	setMessage: PropTypes.func,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(History);

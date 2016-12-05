import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import Pagination from '../accessories/Pagination';
import {Table, Row, Column} from '../accessories/Table';
import {_displayDateOfMilliseconds} from '../accessories/functions';

class History extends Component {
	constructor(){
		super();
		this.state = {
			history: null,
			numOfPages: 1
		};
	}
	componentDidMount(){
		if(!this.props.params.page) this.props.router.push('/user/history/page/1');
		else this.fetchData(this.props.params.page);
	}
	componentWillReceiveProps(nextProps){
		if(!nextProps.params.page) nextProps.router.push('/user/history/page/1');
		else if(nextProps.params.page != this.props.params.page){
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
		return {
			hid: item.hid,
			searchDate: _displayDateOfMilliseconds(item.search_date*1000),
			keyword: item.query,
			doctypes: '판결문, 기타',
			period: ['2015.01', '2016.07']
		}
	}
	handleClick(which, arg){
		if(which == 'remove'){
			const hid = arg;
			this.props.fetchData('post', '/api/user/history?mode=delete&hid='+hid, null, (data) => { if(data){
				this.props.router.push('/user/history');
			}});
		}
	}
	render(){
		const page = parseInt(this.props.params.page);
		const rows = this.state.history && this.state.history.map((item) => (
			<Row key={item.hid}>
				<Column><span>{item.searchDate}</span></Column>
				<Column>
					<div className="history__keyword"><span>{item.keyword}</span></div>
					<div>
						<span className="history__doctypes">
							<i className="pe-7s-edit pe-va"></i>
							<span>{item.doctypes}</span>
						</span>
						<span className="history__period">
							<span>{item.period[0]}</span>
							<span><i className="pe-7s-right-arrow pe-va"></i></span>
							<span>{item.period[1]}</span>
						</span>
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

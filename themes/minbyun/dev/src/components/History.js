import React, {Component, PropTypes} from 'react';
import {withRouter, Link} from 'react-router';
import Pagination from '../accessories/Pagination';
import {_displayDateOfMilliseconds} from '../accessories/functions';

class History extends Component {
	componentDidMount(){
		this.props.fetchHistory(this.props.params.page);
	}
	componentDidUpdate(prevProps){
		if(prevProps.params.page != this.props.params.page){
			this.props.fetchHistory(this.props.params.page);
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
						lastPage: data.result.total_page
					});
				} else {
					this.setState({history: [], lastPage: 1});
				}
			}
		});
	}
	history(item){
		const sFname = this.props.docData.sFname;
		const period = item.options[sFname['date']];
		return {
			hid: item.hid,
			searchDate: _displayDateOfMilliseconds(item.search_date*1000),
			keyword: item.query,
			doctypes: item.options[sFname['doctype']],
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
		const fProps = this.props.fData.fProps;
		const page = (this.props.params.page ?  parseInt(this.props.params.page) : 1);
		const rows = this.props.history.map((item) => (
			<div className="table__row" key={item.hid}>
				<div className="table__col"><span>{item.searchDate}</span></div>
				<div className="table__col">
					<div className="history__keyword">
						<Link to={'/search?'+item.params}>{item.keyword}</Link>
					</div>
					<div>
						{(fProps.doctype && item.doctypes) && <span className="history__doctypes">
							<i className="pe-7s-edit pe-va"></i>
							<span>{item.doctypes}</span>
						</span>}
						{(fProps.date && (item.from || item.to)) && <span className="history__period">
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
				</div>
			</div>
		));
		return (
			<div className="history">
				<div className="history__content">
					<div className="table">
						<div className="table__row">
							<div className="table__col">검색일</div>
							<div className="table__col">검색어</div>
						</div>
						{rows}
					</div>
				</div>
				<Pagination url="/user/history/page/" page={page} lastPage={this.props.lastPage} />
			</div>
		);
	}
}
History.propTypes = {
	fData: PropTypes.object.isRequired,
	history: PropTypes.arrayOf(PropTypes.object).isRequired,
	lastPage: PropTypes.number.isRequired,
	fetchHistory: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(History);

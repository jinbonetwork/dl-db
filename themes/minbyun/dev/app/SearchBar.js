import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import DoctypeSelect from './searchBar/DoctypeSelect';

//import {DdSelect, DsItem} from './accessories/DdSelect';
//import {DdHead, DdArrow} from './accessories/Dropdown';

import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import {Table, Row, Column} from './accessories/Table';
import {_fieldAttrs, _sFname} from './schema/docSchema';
import {_isEmpty, _params} from './accessories/functions';

class SearchBar extends Component {
	constructor(){
		super();
		this.state = {
			style: {keyword: {marginLeft: null}}
		};
	}
	doctypeOptions(){
		let options = {};
		this.props.docData.taxonomy.doctype.forEach((value) => {
			options[value] = this.props.docData.terms[value];
		});
		return options;
	}
	period(){
		let period=[];
		if(this.props.query.from == '.') period.push(''); else period.push(this.props.query.from);
		if(this.props.query.to && this.props.query.to != '.') period.push(this.props.query.to);
		period = period.map((date, index) => {
			date = date.split('.');
			date = {year: date[0], month: date[1]};
			if(date.year && date.year < 1900) date.year = '1900';
			if(date.month){
				if(date.month.length < 2) date.month = '0'+date.month;
			} else if(date.year) {
				if(index == 0) date.month = '01';
				else if(index == 1) date.month = '12';
			}
			return date;
		});
		if(period.length > 1){
			if((period[0].year > period[1].year) || (period[0].year == period[1].year && period[0].month > period[1].month)){
				let temp = period[0];
				period[0] = period[1];
				period[1] = temp;
			}
		}
		period = period.map((date) => (!_isEmpty(date) ? date.year+'.'+date.month : ''));
		return period;
	}
	handleChange(which, arg){
		switch(which){
			case 'doctype': this.props.update(which, arg); break;
			case 'keyword': this.props.update(which, arg.target.value); break;
			case 'from': case 'to':
				let now = new Date();
				let date = arg.target.value.split('.');
				if(date.length <= 2 && (!date[0] || (date[0] > 0 && date[0] <= now.getFullYear()))){
					if((date.length == 2 && (!date[1] || (date[1] > 0 && date[1] <= 12))) || date.length == 1){
						this.props.update(which, arg.target.value);
					}
				}
				break;
			default:
		}
	}
	handleKeyDown(event){
		if(event.key === 'Enter'){
			this.handleclick('search');
		}
	}
	handleResize(which, size){
		if(which == 'doctype' && size){
			this.setState({style: update(this.state.style, {keyword: {$set: {marginLeft: size.width}}})});
		}
	}
	handleclick(which, arg){
		if(which == 'search'){
			let period = this.period();
			let params = {
				q: encodeURIComponent(this.props.query.keyword),
				[_sFname['doctype']]: (this.props.query.doctypes.length ? '{'+this.props.query.doctypes.join(',')+'}' : ''),
				[_sFname['date']]: encodeURIComponent(period.join('-'))
			};
			this.setState({from: period[0], to: (period[1] ? period[1] : '')});
			let urlParams = _params(params);
			if(urlParams) this.props.router.push('/search'+urlParams);
		}
	}
	render(){
		let className = (this.props.mode == 'content' ? 'searchbar searchbar--content' : 'searchbar');
		let searchBar = (
			<div className="searchbar__bar">
				<div>
					<DoctypeSelect displayName={_fieldAttrs['doctype'].displayName}
						values={this.props.query.doctypes} options={this.doctypeOptions()}
						handleChange={this.handleChange.bind(this, 'doctype')} handleResize={this.handleResize.bind(this, 'doctype')}
					/>
					<div className="searchbar__keyword" style={this.state.style.keyword}>
						<div><i className="pe-7f-search pe-va"></i></div>
						<div>
							<input type="text" value={this.props.query.keyword} placeholder="검색어를 입력하세요"
								onChange={this.handleChange.bind(this, 'keyword')} onKeyDown={this.handleKeyDown.bind(this)}
							/>
						</div>
					</div>
				</div>
				<div>
					<div className="searchbar__period">
						<input type="text" value={this.props.query.from} placeholder="1988.5"
							onChange={this.handleChange.bind(this, 'from')} onKeyDown={this.handleKeyDown.bind(this)}
						/>
						<div><i className="pe-7s-right-arrow pe-va"></i></div>
						<input type="text" value={this.props.query.to} placeholder="2015.11"
							onChange={this.handleChange.bind(this, 'to')} onKeyDown={this.handleKeyDown.bind(this)}
						/>
					</div>
					<button className="searchbar__button" onClick={this.handleclick.bind(this, 'search')}>검색</button>
				</div>
			</div>
		);
		if(this.props.mode == 'content'){
			return(
				<div className={className}>
					<div className="searchbar__header"><span>민변 디지털 도서관</span></div>
					{searchBar}
					<div className="searchbar__helper">
						<div>
							<div className="searchbar__helper-title"><span>※ 검색 연산자 안내</span></div>
							<Table>
								<Row>
									<Column><span>AND 검색</span></Column>
									<Column><span>이사회 & 감사</span></Column>
								</Row>
								<Row>
									<Column><span>OR 검색</span></Column>
									<Column><span>이사회 + 감사</span></Column>
								</Row>
								<Row>
									<Column><span>NOT 검색</span></Column>
									<Column>
										<div><span>이사회 ! 감사</span></div>
										<div><span>(* 검색어는 '이사회', 제외어는 '감시'일 경우)</span></div>
									</Column>
								</Row>
								<Row>
									<Column>EQUAL 검색</Column>
									<Column><span>"이사와 감사의 선출"</span></Column>
								</Row>
							</Table>
						</div>
					</div>


					{/*<DdSelect>
						<DdItem><span>Q & A</span></DdItem>
						<DdItem><span>이주의 변론</span></DdItem>
						<DdItem><span>소송도우미</span></DdItem>
					</DdSelect>*/}


				</div>
			);
		} else {
			return(
				<div className={className}>
					{searchBar}
				</div>
			);
		}
	}
}
SearchBar.propTypes = {
	mode: PropTypes.string,
	query: PropTypes.object.isRequired,
	update: PropTypes.func.isRequired,
	docData: PropTypes.object.isRequired,
	router: PropTypes.shape({push: PropTypes.func.isRequired}).isRequired
}

export default withRouter(SearchBar);

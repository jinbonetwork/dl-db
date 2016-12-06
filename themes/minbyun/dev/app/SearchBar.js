import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {DdSelect, DdItem, DdHead, DdArrow} from './accessories/DdSelect';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import {Table, Row, Column} from './accessories/Table';
import {_fieldAttrs, _sFname, _termsOf} from './schema/docSchema';
import {_query, _period} from './schema/searchSchema';
import {_isEmpty, _params, _mapO} from './accessories/functions';

class SearchBar extends Component {
	constructor(){
		super();
		this.state = {
			keywordMarginLeft: null
		};
	}
	handleChange(which, arg){
		switch(which){
			case 'doctypes': this.props.update(which, arg); break;
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
	handleclick(which, arg){
		if(which == 'search'){
			if(!this.props.query.keyword){ this.props.setMessage('검색어를 입력하세요.', 'unset'); return; }
			let period = _period(this.props.query.from, this.props.query.to);
			let from = (period[0] ? period[0] : '');
			let to = (period[1] ? period[1] : '');
			this.props.update({from: from, to: to});

			let query = _query({keyword: this.props.query.keyword, doctypes: this.props.query.doctypes, from: from, to: to });
			let params = _params(query);
			if(params) this.props.router.push('/search'+params);
		}
	}
	handleResize(which, size){
		if(which == 'doctypes'){
			this.setState({keywordMarginLeft: size.width});
		}
	}
	render(){
		let className = (this.props.mode == 'content' ? 'searchbar searchbar--content' : 'searchbar');
		let doctypeItems = _mapO(_termsOf('doctype', this.props.docData), (tid, tname) => (
			<DdItem key={tid} value={tid}><span>{tname}</span></DdItem>
		));
		let searchBar = (
			<div className="searchbar__bar">
				<div>
					<DdSelect selected={this.props.query.doctypes} onResize={this.handleResize.bind(this, 'doctypes')} onChange={this.handleChange.bind(this, 'doctypes')}>
						<DdHead>
							<span>{_fieldAttrs['doctype'].displayName}</span>
							<DdArrow><i className="pe-7s-angle-down pe-va"></i></DdArrow>
						</DdHead>
						{doctypeItems}
					</DdSelect>
					<div className="searchbar__keyword" style={{marginLeft: this.state.keywordMarginLeft}}>
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
	router: PropTypes.shape({push: PropTypes.func.isRequired}).isRequired,
	setMessage: PropTypes.func.isRequired
}

export default withRouter(SearchBar);

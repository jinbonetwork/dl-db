import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import DdSelect from './accessories/DdSelect';
import Item from './accessories/Item';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import {Table, Row, Column} from './accessories/Table';
import {_fieldAttrs, _sFname, _termsOf} from './schema/docSchema';
import {_query, _period, _params} from './schema/searchSchema';
import {_screen} from './schema/screenSchema';
import {_isEmpty, _mapO, _interpolate, _notNull} from './accessories/functions';

class SearchBar extends Component {
	constructor(){
		super();
		this.state = {
			keywordMarginLeft: null,
			isPeriodVisible: false,
			isPeriodFocused: false,
			isHelperVisible: false,
			isKeywordFocused: false
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
			this.handleClick('search');
		}
	}
	handleClick(which, arg){
		if(which == 'search'){
			if(!this.props.query.keyword){ this.props.setMessage('검색어를 입력하세요.', () => {this.refs.keyword.focus();}); return; }
			let period = _period(this.props.query.from, this.props.query.to);
			let from = (period[0] ? period[0] : '');
			let to = (period[1] ? period[1] : '');
			this.props.update({from: from, to: to});

			let query = _query({keyword: this.props.query.keyword, doctypes: this.props.query.doctypes, from: from, to: to });
			let params = _params(query);
			if(params) this.props.router.push('/search'+params);
		}
		else if(which == 'togglePeriod'){
			this.setState({isPeriodVisible: !this.state.isPeriodVisible});
		}
	}
	handleFocus(which){
		let newState = {isHelperVisible: true};
		if(which == 'keyword') newState.isKeywordFocused = true;
		else if(which == 'from' || which == 'to') newState.isPeriodFocused = true;
		this.setState(update(this.state, {$merge: newState}));
	}
	handleBlur(which){
		let newState = {};
		if(which == 'keyword') newState.isKeywordFocused = false;
		else if(which == 'from' || which == 'to') newState.isPeriodFocused = false;
		this.setState(update(this.state, {$merge: newState}));
	}
	handleResize(which, size){
		if(which == 'doctypes'){
			this.setState({keywordMarginLeft: size.width});
		}
	}
	period(prsRsp){
		let className = (this.state.isPeriodFocused ? 'searchbar__period searchbar__period--focused' : 'searchbar__period');
		const period = (
			<div className={className} style={prsRsp.style.period}>
				<input type="text" value={this.props.query.from} placeholder="1988.5" style={prsRsp.style.from}
					onChange={this.handleChange.bind(this, 'from')} onKeyDown={this.handleKeyDown.bind(this)}
					onFocus={this.handleFocus.bind(this, 'from')} onBlur={this.handleBlur.bind(this, 'from')}
				/>
				<div><i className="pe-7s-right-arrow pe-va"></i></div>
				<input type="text" value={this.props.query.to} placeholder="2015.11" style={prsRsp.style.to}
					onChange={this.handleChange.bind(this, 'to')} onKeyDown={this.handleKeyDown.bind(this)}
					onFocus={this.handleFocus.bind(this, 'to')} onBlur={this.handleBlur.bind(this, 'to')}
				/>
			</div>
		);
		if(this.props.window.width > _screen.medium){
			return period;
		} else {
			if(this.props.mode == 'content'){
				return period;
			} else {
				let className = (this.state.isPeriodVisible ? 'searchbar__period-wrap searchbar__period--visible' : 'searchbar__period-wrap');
				return (
					<div className={className}>
						<div>{period}</div>
						<div className="searchbar__toggle-period" onClick={this.handleClick.bind(this, 'togglePeriod')}>
							<i className="pe-7s-date pe-va"></i>
						</div>
					</div>
				);
			}
		}
	}
	doctypeHead(){
		if(this.props.mode != 'content' && this.props.window.width <= _screen.medium){
			return {
				head: <span><i className="pe-7s-edit pe-va"></i></span>,
				arrow: null
			}
		} else {
			return {
				head: <span>{_fieldAttrs['doctype'].displayName}</span>,
				arrow: <i className="pe-7s-angle-down pe-va"></i>
			}
		}
	}
	propsForResponsivity(){
		const wWidth = this.props.window.width;
		const buttonWidth = _interpolate(wWidth, 4, 8, _screen.mmLarge, _screen.large, 'em');
		const sndPartWidth = _notNull([
			(wWidth <= _screen.medium ? '8em' : null),
			_interpolate(wWidth, 16, 20, _screen.mmLarge, _screen.large, 'em')
		]);
		const fromMargin = _notNull([
			_interpolate(wWidth, 1.5, 2.5, _screen.smallest, _screen.small, 'em'),
			_interpolate(wWidth, 0.5, 4, _screen.small, _screen.medium, 'em')
		]);
		const inMenu = {
			style: {
				wrap: {
					marginRight: _interpolate(wWidth, 14, 15.5, _screen.mmLarge, _screen.large, 'em')
				},
				button: {
					width: buttonWidth
				},
				period: {
					marginRight: _notNull([(wWidth <= _screen.medium ? 0 : null) ,buttonWidth])
				},
				firstPart: {
					marginRight: sndPartWidth
				},
				secondPart: {
					width: sndPartWidth
				}
			}
		};
		const inContent = {
			style: {
				from: {
					marginRight: fromMargin
				},
				to: {
					marginLeft: fromMargin
				},
				header: {
					fontSize: _interpolate(wWidth, 2.4, 3.4, _screen.smallest, 460, 'em')
				}
			}
		};
		return (this.props.mode == 'content' ? inContent : inMenu);
	}
	render(){
		const prsRsp = this.propsForResponsivity();
		const className = (this.props.mode == 'content' ? 'searchbar searchbar--content' : 'searchbar');
		const doctypeHead = this.doctypeHead();
		const doctypeItems = _mapO(_termsOf('doctype', this.props.docData), (tid, tname) => (
			<Item key={tid} value={tid}><span>{tname}</span></Item>
		));
		let searchBar = (
			<div className="searchbar__bar">
				<div style={prsRsp.style.firstPart}>
					<DdSelect selected={this.props.query.doctypes} head={doctypeHead.head} arrow={doctypeHead.arrow} window={this.props.window}
						onResize={this.handleResize.bind(this, 'doctypes')} onChange={this.handleChange.bind(this, 'doctypes')}
						onFocus={this.handleFocus.bind(this, 'doctypes')}
					>
						{doctypeItems}
					</DdSelect>
					<div className={'searchbar__keyword'+(this.state.isKeywordFocused ? ' searchbar__keyword--focused' : '')} style={{marginLeft: this.state.keywordMarginLeft}}>
						<div><i className="pe-7f-search pe-va"></i></div>
						<div>
							<input type="text" ref="keyword" value={this.props.query.keyword} placeholder="검색어를 입력하세요"
								onChange={this.handleChange.bind(this, 'keyword')} onKeyDown={this.handleKeyDown.bind(this)}
								onFocus={this.handleFocus.bind(this, 'keyword')} onBlur={this.handleBlur.bind(this, 'keyword')}
							/>
						</div>
					</div>
				</div>
				<div style={prsRsp.style.secondPart}>
					{this.period(prsRsp)}
					<button className="searchbar__button" style={prsRsp.style.button} onClick={this.handleClick.bind(this, 'search')}>검색</button>
				</div>
			</div>
		);
		if(this.props.mode == 'content'){
			let helperClassName = (this.state.isHelperVisible ? 'searchbar__helper searchbar__helper--visible' : 'searchbar__helper');
			return(
				<div className={className} style={prsRsp.style.wrap}>
					<div className="searchbar__header"><span style={prsRsp.style.header}>민변 디지털 도서관</span></div>
					{searchBar}
					<div className={helperClassName}>
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
				<div className={className} style={prsRsp.style.wrap}>
					{searchBar}
				</div>
			);
		}
	}
}
SearchBar.propTypes = {
	mode: PropTypes.string,
	query: PropTypes.object.isRequired,
	window: PropTypes.object.isRequired,
	update: PropTypes.func.isRequired,
	docData: PropTypes.object.isRequired,
	router: PropTypes.shape({push: PropTypes.func.isRequired}).isRequired,
	setMessage: PropTypes.func.isRequired
}

export default withRouter(SearchBar);

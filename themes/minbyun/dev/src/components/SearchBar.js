import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import DdSelect from '../accessories/DdSelect';
import Item from '../accessories/Item';
import update from 'react-addons-update';
import {_query, _period, _params} from '../functions';
import {SCREEN} from '../constants';
import {_isEmpty, _mapO, _interpolate, _notNull, _padNumber} from '../accessories/functions';

class SearchBar extends Component {
	constructor(){
		super();
		this.countIntv = undefined;
	}
	componentDidMount(){
		this.setCounter();
	}
	componentDidUpdate(){
		this.setCounter();
	}
	componentWillUnmount(){
		if(this.props.mode == 'content'){
			clearInterval(this.countIntv);
		}
	}
	setCounter(){
		if(this.countIntv === undefined && this.props.mode == 'content' && this.props.fData.numOfDocs > 0){
			const numOfDocs = this.props.fData.numOfDocs;
			const duration = 600;
			const minInterval = 10;
			let increment = 1;
			let interval = Math.ceil(duration / parseInt(numOfDocs));
			if(interval < minInterval){
				interval = minInterval;
				increment = Math.ceil(numOfDocs/duration*interval);
			}
			this.countIntv = setInterval(() => {
				if(numOfDocs > this.props.count){
					let newCount = parseInt(this.props.count) + increment;
					if(newCount > numOfDocs) newCount = numOfDocs;
					this.props.changeSearchBarState({count: _padNumber(newCount, 5)});
				} else {
					clearInterval(this.countIntv);
				}
			}, interval);
		}
	}
	query(sQuery){
		return _query(sQuery, this.props.fData.fID);
	}
	params(params, excepts){
		return _params(params, this.props.fData.fID, excepts)
	}
	handleChange(which, arg){
		switch(which){
			case 'doctypes': this.props.onChange({[which]: arg}); break;
			case 'keyword': this.props.onChange({[which]: arg.target.value}); break;
			case 'from': case 'to':
				let now = new Date();
				let date = arg.target.value.split('.');
				if(date.length <= 2 && (!date[0] || (date[0] > 0 && date[0] <= now.getFullYear()))){
					if((date.length == 2 && (!date[1] || (date[1] > 0 && date[1] <= 12))) || date.length == 1){
						this.props.onChange({[which]: arg.target.value});
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
			if(!this.props.keyword){ this.props.showMessage('검색어를 입력하세요.', () => {this.refs.keyword.focus();}); return; }
			let period = _period(this.props.from, this.props.to);
			let from = (period[0] ? period[0] : '');
			let to = (period[1] ? period[1] : '');
			this.props.onChange({from: from, to: to});

			let query = this.query({keyword: this.props.keyword, doctypes: this.props.doctypes, from: from, to: to });
			let params = this.params(query);
			if(params) this.props.router.push('/search'+params);
		}
		else if(which == 'togglePeriod'){
			this.props.changeSearchBarState({isPeriodVisible: !this.props.isPeriodVisible});
		}
	}
	handleFocus(which){
		let newState = {isHelperVisible: true};
		if(which == 'keyword') newState.isKeywordFocused = true;
		else if(which == 'from' || which == 'to') newState.isPeriodFocused = true;
		this.props.changeSearchBarState(newState);
	}
	handleBlur(which){
		let newState = {};
		if(which == 'keyword') newState.isKeywordFocused = false;
		else if(which == 'from' || which == 'to') newState.isPeriodFocused = false;
		this.props.changeSearchBarState(newState);
	}
	handleResize(which, size){
		if(which == 'doctypes'){
			this.props.changeSearchBarState({keywordMarginLeft: size.width});
		}
	}
	period(prsRsp){
		let className = (this.props.isPeriodFocused ? 'searchbar__period searchbar__period--focused' : 'searchbar__period');
		const period = (
			<div className={className} style={prsRsp.style.period}>
				<input type="text" value={this.props.from} placeholder="1988.5" style={prsRsp.style.from}
					onChange={this.handleChange.bind(this, 'from')} onKeyDown={this.handleKeyDown.bind(this)}
					onFocus={this.handleFocus.bind(this, 'from')} onBlur={this.handleBlur.bind(this, 'from')}
				/>
				<div><i className="pe-7s-right-arrow pe-va"></i></div>
				<input type="text" value={this.props.to} placeholder="2015.11" style={prsRsp.style.to}
					onChange={this.handleChange.bind(this, 'to')} onKeyDown={this.handleKeyDown.bind(this)}
					onFocus={this.handleFocus.bind(this, 'to')} onBlur={this.handleBlur.bind(this, 'to')}
				/>
			</div>
		);
		if(this.props.window.width > SCREEN.medium){
			return period;
		} else {
			if(this.props.mode == 'content'){
				return period;
			} else {
				let className = (this.props.isPeriodVisible ? 'searchbar__period-wrap searchbar__period--visible' : 'searchbar__period-wrap');
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
	propsForResponsivity(){
		const fProps = this.props.fData.fProps;
		const wWidth = this.props.window.width;
		const buttonWidth = _interpolate(wWidth, 4, 8, SCREEN.mmLarge, SCREEN.large, 'em');
		const secondPartWidth = _notNull([
			(wWidth <= SCREEN.medium ? '8em' : null),
			_interpolate(wWidth, 16, 20, SCREEN.mmLarge, SCREEN.large, 'em')
		]);
		const fromMargin = _notNull([
			_interpolate(wWidth, 1.5, 2.5, SCREEN.smallest, SCREEN.small, 'em'),
			_interpolate(wWidth, 0.5, 4, SCREEN.small, SCREEN.medium, 'em')
		]);
		const inMenu = {
			style: {
				wrap: {
					marginRight: _interpolate(wWidth, 14, 15.5, SCREEN.mmLarge, SCREEN.large, 'em')
				},
				button: {
					width: buttonWidth
				},
				period: {
					marginRight: _notNull([(wWidth <= SCREEN.medium ? 0 : null) ,buttonWidth])
				},
				firstPart: {
					marginRight: (fProps.date ? secondPartWidth : buttonWidth)
				},
				secondPart: {
					width: (fProps.date ? secondPartWidth : buttonWidth)
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
					fontSize: _interpolate(wWidth, 2.4, 3.4, SCREEN.smallest, 460, 'em')
				}
			}
		};
		return (this.props.mode == 'content' ? inContent : inMenu);
	}
	docTypeSelect(){
		let doctypeHead;
		if(this.props.mode != 'content' && this.props.window.width <= SCREEN.medium){
			doctypeHead = {
				head: <span><i className="pe-7s-edit pe-va"></i></span>,
				arrow: null
			};
		} else {
			doctypeHead = {
				head: <span>{this.props.fData.fProps.doctype.dispName}</span>,
				arrow: <i className="pe-7s-angle-down pe-va"></i>
			};
		}

		const doctypeItems = this.props.fData.taxonomy.doctype.map((tid) =>
			<Item key={tid} value={tid}><span>{this.props.fData.terms[tid].name}</span></Item>
		);

		return (
			<DdSelect selected={this.props.doctypes} head={doctypeHead.head} arrow={doctypeHead.arrow} window={this.props.window}
				onResize={this.handleResize.bind(this, 'doctypes')} onChange={this.handleChange.bind(this, 'doctypes')}
				onFocus={this.handleFocus.bind(this, 'doctypes')}
			>
				{doctypeItems}
			</DdSelect>
		);
	}
	displayCount(){
		return this.props.count.split('').map((digit, index) => (
			<div key={index} className="counter__digit">
				<img src={site_base_uri+'/themes/minbyun/images/count.png'} />
				<span>{digit}</span>
			</div>
		));
	}
	render(){
		const fProps = this.props.fData.fProps;
		const prsRsp = this.propsForResponsivity();
		const className = (this.props.mode == 'content' ? 'searchbar searchbar--content' : 'searchbar');
		const docTypeSelect = (fProps.doctype ? this.docTypeSelect() : null);
		const period = (fProps.date ? this.period(prsRsp) : null);
		let searchBar = (
			<div className="searchbar__bar">
				<div className={(!fProps.date ? 'searchbar__1st-part--no-period' : null)} style={prsRsp.style.firstPart}>
					{docTypeSelect}
					<div className={'searchbar__keyword'+(this.props.isKeywordFocused ? ' searchbar__keyword--focused' : '')} style={{marginLeft: this.props.keywordMarginLeft}}>
						<div><i className="pe-7f-search pe-va"></i></div>
						<div>
							<input type="text" ref="keyword" value={this.props.keyword} placeholder="검색어를 입력하세요"
								onChange={this.handleChange.bind(this, 'keyword')} onKeyDown={this.handleKeyDown.bind(this)}
								onFocus={this.handleFocus.bind(this, 'keyword')} onBlur={this.handleBlur.bind(this, 'keyword')}
							/>
						</div>
					</div>
				</div>
				<div className={(!fProps.date ? 'searchbar__2nd-part--no-period' : null)} style={prsRsp.style.secondPart}>
					{period}
					<button className="searchbar__button" style={prsRsp.style.button} onClick={this.handleClick.bind(this, 'search')}>검색</button>
				</div>
			</div>
		);
		if(this.props.mode == 'content'){
			let helperClassName = (this.props.isHelperVisible ? 'searchbar__helper searchbar__helper--visible' : 'searchbar__helper');
			let counterClassName = (!this.props.isHelperVisible ? 'counter counter--visible' : 'counter');
			return(
				<div className={className} style={prsRsp.style.wrap}>
					<div className="searchbar__header"><span style={prsRsp.style.header}>민변 디지털 도서관</span></div>
					{searchBar}
					<div className={counterClassName}>
						<div className="counter__head">{/*<span>총 자료 건수</span>*/}</div>
						<div className="counter__body">
							<div><img src={site_base_uri+'/themes/minbyun/images/db.png'} /></div>
							<div>{this.displayCount()}</div>
						</div>
					</div>
					<div className={helperClassName}>
						<div>
							<div className="searchbar__helper-title"><span>※ 검색 연산자 안내</span></div>
							<div className="table">
								<div className="table__row">
									<div className="table__col"><span>AND 검색</span></div>
									<div className="table__col"><span>이사회 & 감사</span></div>
								</div>
								<div className="table__row">
									<div className="table__col"><span>OR 검색</span></div>
									<div className="table__col"><span>이사회 + 감사</span></div>
								</div>
								<div className="table__row">
									<div className="table__col"><span>NOT 검색</span></div>
									<div className="table__col">
										<div><span>이사회 ! 감사</span></div>
										<div><span>(* 검색어는 '이사회', 제외어는 '감사'일 경우)</span></div>
									</div>
								</div>
								<div className="table__row">
									<div className="table__col">EQUAL 검색</div>
									<div className="table__col"><span>"이사와 감사의 선출"</span></div>
								</div>
							</div>
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
	doctypes: PropTypes.array.isRequired,
	keyword: PropTypes.string.isRequired,
	from: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	window: PropTypes.object.isRequired,
	fData: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	changeSearchBarState: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	router: PropTypes.shape({push: PropTypes.func.isRequired}).isRequired,
}

export default withRouter(SearchBar);

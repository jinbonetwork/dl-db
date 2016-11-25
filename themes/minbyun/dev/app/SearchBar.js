import React, {Component, PropTypes} from 'react';
import DoctypeSelect from './searchBar/DoctypeSelect';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import {Table, Row, Column} from './accessories/Table';
import {_fieldAttrs} from './schema/docSchema';

class SearchBar extends Component {
	constructor(){
		super();
		this.state = {
			doctypes: [],
			keyword: '',
			from: '',
			to: '',
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
	handleChange(which, arg){
		switch(which){
			case 'doctype': this.setState({doctypes: arg}); break;
			case 'keyword': this.setState({keyword: arg.target.value}); break;
			case 'from': case 'to':
				let now = new Date();
				let date = arg.target.value.split('.');
				if(date.length <= 2 && (!date[0] || (date[0] > 0 && date[0] <= now.getFullYear()))){
					if((date.length == 2 && (!date[1] || (date[1] > 0 && date[1] <= 12))) || date.length == 1){
						this.setState({[which]: arg.target.value});
					}
				}
				break;
			default:
		}
	}
	handleResize(which, size){
		if(which == 'doctype' && size){
			this.setState({style: update(this.state.style, {keyword: {$set: {marginLeft: size.width}}})});
		}
	}
	render(){
		let className = (this.props.mode == 'content' ? 'searchbar searchbar--content' : 'searchbar');
		let searchBar = (
			<div className="searchbar__bar">
				<div>
					<DoctypeSelect displayName={_fieldAttrs['doctype'].displayName}
						values={this.state.doctypes} options={this.doctypeOptions()}
						handleChange={this.handleChange.bind(this, 'doctype')} handleResize={this.handleResize.bind(this, 'doctype')}
					/>
					<div className="searchbar__keyword" style={this.state.style.keyword}>
						<div><i className="pe-7f-search pe-va"></i></div>
						<div><input type="text" value={this.state.keyword} placeholder="검색어를 입력하세요" onChange={this.handleChange.bind(this, 'keyword')} /></div>
					</div>
				</div>
				<div>
					<div className="searchbar__period">
						<input type="text" value={this.state.from} onChange={this.handleChange.bind(this, 'from')} placeholder="1988.5" />
						<div><i className="pe-7s-right-arrow pe-va"></i></div>
						<input type="text" value={this.state.to} onChange={this.handleChange.bind(this, 'to')} placeholder="2015.11" />
					</div>
					<button className="searchbar__button">검색</button>
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
	docData: PropTypes.object.isRequired
}

export default SearchBar;

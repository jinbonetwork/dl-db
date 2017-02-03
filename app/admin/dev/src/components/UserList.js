import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import CheckBox from '../accessories/CheckBox';
import Select from '../accessories/Select';
import Item from '../accessories/Item';
import Pagination from '../accessories/Pagination';
import {_mapO, _pushpull, _wrap} from '../accessories/functions';

class UserList extends Component {
	componentDidMount(){
		this.props.fetchUserList(this.props.params);
	}
	componentDidUpdate(prevProps, prevState){
		if(JSON.stringify(prevProps.params) != JSON.stringify(this.props.params) || this.props.userList.length == 0){
			this.props.fetchUserList(this.props.params);
		}
	}
	handleChange(which, arg1st, arg2nd){
		if(which == 'check'){
			let id = arg1st, isChecked = arg2nd;
			this.props.onChange('selected', _pushpull(this.props.selected, id));
		}
		else if(which == 'fieldSearching'){
			let value = arg1st;
			this.props.onChange('fieldSearching', value);
		}
		else if(which == 'keywordSearching'){
			let value = arg1st.target.value;
			this.props.onChange('keywordSearching', value);
		}
	}
	handleClick(which, arg1st){
		switch(which){
			case 'view':
				const id = arg1st;
				if(!this.props.openUsers[id]){
					let originalUser = this.props.originalUsers.find((usr) => (id == usr.id));
					this.props.addUserToOpenUsers(originalUser);
				}
				this.props.router.push('/admin/user/'+id); break;
			case 'delete user':
				if(!this.props.isDelBtnYesOrNo){
					this.props.onChange('isDelBtnYesOrNo', true); break;
				} else {
					break;
				}
			case 'cancel deleting user':
				this.props.onChange('isDelBtnYesOrNo', false); break;
			case 'search':
				if(this.props.fieldSearching == 'default' || !this.props.keywordSearching){
					if(this.props.keywordSearching) this.props.onChange('keywordSearching', '');
					this.props.router.push('/admin/userlist');
				} else {
					this.props.router.push('/admin/userlist/'+this.props.fieldSearching+'/'+this.props.keywordSearching);
				}
				break;
			default:
		}
	}
	handleKeyDown(which, arg1st, arg2nd){
		if(which == 'keywordSearching'){
			let key = arg1st.key;
			if(key == 'Enter') this.handleClick('search');
		}
	}
	render(){
		const fProps = this.props.userFieldData.fProps;
		const deletButton = (!this.props.isDelBtnYesOrNo ?
			<button className="userlist__delete-user" onClick={this.handleClick.bind(this, 'delete user')}>
				<i className="pe-7s-delete-user pe-va"></i><span>삭제</span>
			</button> :
			<div className="userlist__confirm-del">
				<button onClick={this.handleClick.bind(this, 'delete user')}>예</button>
				<button onClick={this.handleClick.bind(this, 'cancel deleting user')}>아니오</button>
			</div>
		);
		const listMenu = (
			<tr className="userlist__menu">
				<td className="userlist__table-margin"></td>
				<td colSpan="9">
					<div>
						<Select selected={this.props.fieldSearching} onChange={this.handleChange.bind(this, 'fieldSearching')}>
							<Item value="default">전체목록</Item>
							<Item value="name">이름</Item>
							<Item value="class">구분</Item>
							<Item value="email">이메일</Item>
							<Item value="phone">전화번호</Item>
						</Select>
						<input type="text" className="userlist__keyword" value={this.props.keywordSearching}
							onChange={this.handleChange.bind(this, 'keywordSearching')}
							onKeyDown={this.handleKeyDown.bind(this, 'keywordSearching')}
						/>
						<button className="userlist__search" onClick={this.handleClick.bind(this, 'search')}>검색</button>
					</div>
					<div>
						<Link className="userlist__add-user" to="/admin/user/new">
							<i className="pe-7s-add-user pe-va"></i><span>추가</span>
						</Link>
						{deletButton}
					</div>
				</td>
				<td className="userlist__table-margin"></td>
			</tr>
		);
		const listHead = (
			<tr className="userlist__head">
				<td className="userlist__table-margin"></td>
				<td className="userlist__table-padding"></td>
				{_mapO(this.props.userList[0], (pn, pv) => <td key={pn}>{fProps[pn].dispName}</td>)}
				<td></td>
				<td className="userlist__table-padding"></td>
				<td className="userlist__table-margin"></td>
			</tr>
		);
		const list = this.props.userList.map((item, index) => {
			let userInfo = _mapO(item, (pn, pv) => {
				if(pn == 'id'){
					return (
						<td key={pn}>
							<CheckBox check={this.props.selected.indexOf(pv) >= 0} onChange={this.handleChange.bind(this, 'check', pv)}/>
						</td>
					);
				}
				else if(pn == 'name'){
					return <td key={pn}><a onClick={this.handleClick.bind(this, 'view', item.id)}>{pv}</a></td>
				} else {
					return <td key={pn}>{pv}</td>
				}
			});
			return (
				<tr key={index}>
					<td className="userlist__table-margin"></td>
					<td className="userlist__table-padding"></td>
					{userInfo}
					<td className="userlist__edit">
						<Link to={'/admin/user/'+item.id+'/edit'}><i className="pe-7s-note pe-va"></i></Link>
					</td>
					<td className="userlist__table-padding"></td>
					<td className="userlist__table-margin"></td>
				</tr>
			);
		});
		const {urlOptions, page} = _wrap(() => {
			let {param1, param2, param3, param4} = this.props.params;
			if(param1 == 'page') return {urlOptions: 'page/', page: parseInt(param2)};
			if(param1 && param2){
				return {urlOptions: param1+'/'+param2+'/page/', page: (param3 == 'page' && param4 > 0 ? parseInt(param4) : 1)}
			}
			return {urlOptions: 'page/', page: 1};
		});
		return(
			<div className="userlist">
				<h1>회원목록</h1>
				<table className="userlist__list"><tbody>
					{listMenu}
					{listHead}
					{list}
				</tbody></table>
				<Pagination url={'/admin/userlist/'+urlOptions} page={page} lastPage={this.props.lastPage} />
			</div>
		);
	}
}
UserList.propTypes = {
	userFieldData: PropTypes.object.isRequired,
	openUsers: PropTypes.object.isRequired,
	originalUsers: PropTypes.array.isRequired,
	userList: PropTypes.array.isRequired,
	lastPage: PropTypes.number.isRequired,
	selected: PropTypes.array.isRequired,
	isDelBtnYesOrNo: PropTypes.bool,
	fieldSearching: PropTypes.string.isRequired,
	keywordSearching: PropTypes.string.isRequired,
	fetchUserList: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	addUserToOpenUsers: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(UserList);

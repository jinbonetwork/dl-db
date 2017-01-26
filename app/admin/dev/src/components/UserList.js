import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router';
import CheckBox from '../accessories/CheckBox';
import Pagination from '../accessories/Pagination';
import {refineUser} from '../fieldData/userFieldData';
import {_mapO, _pushpull} from '../accessories/functions';

class UserList extends Component {
	componentDidMount(){
		this.props.fetchUserList(this.props.params.page);
	}
	componentDidUpdate(prevProps, prevState){
		if(prevProps.params.page != this.props.params.page || this.props.userList.length == 0){
			this.props.fetchUserList(this.props.params.page);
		}
	}
	handleChange(which, arg1st, arg2nd){
		if(which == 'check'){
			let id = arg1st, isChecked = arg2nd;
			this.props.onChange('selected', _pushpull(this.props.selected, id));
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
			default:
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
						<input type="text" className="userlist__keyword" />
						<button className="userlist__search">검색</button>
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
				else if(pn == 'name'){1
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
		const page = (this.props.params.page ? parseInt(this.props.params.page) : 1);
		return(
			<div className="userlist">
				<h1>회원목록</h1>
				<table className="userlist__list"><tbody>
					{listMenu}
					{listHead}
					{list}
				</tbody></table>
				<Pagination url="/admin/userlist/page/" page={page} lastPage={this.props.lastPage} />
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
	fetchUserList: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	addUserToOpenUsers: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(UserList);

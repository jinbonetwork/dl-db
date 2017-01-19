import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import CheckBox from '../accessories/CheckBox';
import Pagination from '../accessories/Pagination';
import {_mapO, _pushpull} from '../accessories/functions';

class UserList extends Component {
	componentDidMount(){
		this.props.fetchUserList(this.props.params.page);
	}
	componentDidUpdate(prevProps, prevState){
		if(prevProps.params.page != this.props.params.page || this.props.list.length == 0){
			this.props.fetchUserList(this.props.params.page);
		}
	}
	handleChange(which, arg1st, arg2nd){
		if(which == 'check'){
			let id = arg1st, isChecked = arg2nd;
			this.props.onChange('selected', _pushpull(this.props.selected, id));
		}
	}
	render(){
		const fProps = this.props.userFieldData.fProps;
		const listMenu = (
			<tr className="userlist__menu">
				<td className="userlist__table-margin"></td>
				<td colSpan="9">
					<div>
						<input type="text" className="userlist__keyword" />
						<button className="userlist__search">검색</button>
					</div>
					<div>
						{/*<Link className="userlist__add-user" to="/admin/user/new">*/}
						<Link className="userlist__add-user">
							<i className="pe-7s-add-user pe-va"></i><span>추가</span>
						</Link>
						<button className="userlist__delete-user">
							<i className="pe-7s-delete-user pe-va"></i><span>삭제</span>
						</button>
					</div>
				</td>
				<td className="userlist__table-margin"></td>
			</tr>
		);
		const listHead = (
			<tr className="userlist__head">
				<td className="userlist__table-margin"></td>
				<td className="userlist__table-padding"></td>
				{_mapO(this.props.list[0], (pn, pv) => <td key={pn}>{fProps[pn].dispName}</td>)}
				<td></td>
				<td className="userlist__table-padding"></td>
				<td className="userlist__table-margin"></td>
			</tr>
		);
		const list = this.props.list.map((item, index) => {
			let userInfo = _mapO(item, (pn, pv) => {
				if(pn == 'id'){
					return (
						<td key={pn}>
							<CheckBox check={this.props.selected.indexOf(pv) >= 0} onChange={this.handleChange.bind(this, 'check', pv)}/>
						</td>
					);
				}
				else if(pn == 'name'){
					return <td key={pn}><Link to={'/admin/user/'+item.id}>{pv}</Link></td>
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
						{/*<Link to={'/admin/user/'+item.id+'/edit'}><i className="pe-7s-note pe-va"></i></Link>*/}
						<Link><i className="pe-7s-note pe-va"></i></Link>
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
	userFieldData: PropTypes.shape({
		fProps: PropTypes.object, fSlug: PropTypes.object, fID: PropTypes.object, empty: PropTypes.object, taxonomy: PropTypes.object, terms: PropTypes.object, roles: PropTypes.object
	}).isRequired,
	list: PropTypes.array.isRequired,
	lastPage: PropTypes.number.isRequired,
	selected: PropTypes.array.isRequired,
	fetchUserList: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
}

export default UserList;

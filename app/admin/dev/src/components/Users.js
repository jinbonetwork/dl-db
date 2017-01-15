import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import CheckBox from '../accessories/CheckBox';
import Pagination from '../accessories/Pagination';
import {_mapO, _pushpull} from '../accessories/functions';

class Users extends Component {
	componentDidMount(){
		this.props.fetchUserFieldData();
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
		const fProps = this.props.fieldData.fProps;
		const listMenu = (
			<tr className="users__menu">
				<td colSpan="9">
					<div>
						<input type="text" className="users__keyword" />
						<button className="users__search">검색</button>
					</div>
					<div>
						<Link className="users__add-user" to="/admin/users/new">
							<i className="pe-7s-add-user pe-va"></i><span>추가</span>
						</Link>
						<button className="users__delete-user">
							<i className="pe-7s-delete-user pe-va"></i><span>삭제</span>
						</button>
					</div>
				</td>
			</tr>
		);
		const listHead = (
			<tr className="users__head">
				<td></td>
				{_mapO(this.props.list[0], (pn, pv) => <td key={pn}>{fProps[pn].dispName}</td>)}
				<td></td>
				<td></td>
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
					return <td key={pn}><Link to={'/admin/users/'+item.id}>{pv}</Link></td>
				} else {
					return <td key={pn}>{pv}</td>
				}
			});
			return (
				<tr key={index}>
					<td></td>
					{userInfo}
					<td className="users__edit">
						<Link to={'/admin/users/'+item.id+'/edit'}><i className="pe-7s-note pe-va"></i></Link>
					</td>
					<td></td>
				</tr>
			);
		});
		const page = (this.props.params.page ? parseInt(this.props.params.page) : 1);
		return(
			<div className="users">
				<h1>회원목록</h1>
				<table className="users__list"><tbody>
					{listMenu}
					{listHead}
					{list}
				</tbody></table>
				<Pagination url="/admin/users/page/" page={page} lastPage={this.props.lastPage} />
			</div>
		);
	}
}
Users.propTypes = {
	fieldData: PropTypes.shape({
		fProps: PropTypes.object, fSlug: PropTypes.object, fID: PropTypes.object, empty: PropTypes.object, taxonomy: PropTypes.object, terms: PropTypes.object
	}).isRequired,
	originalList: PropTypes.array.isRequired,
	list: PropTypes.array.isRequired,
	lastPage: PropTypes.number.isRequired,
	selected: PropTypes.array.isRequired,
	fetchUserFieldData: PropTypes.func.isRequired,
	fetchUserList: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired
}

export default Users;

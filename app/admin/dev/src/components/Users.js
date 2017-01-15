import React, {Component, PropTypes} from 'react';
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
		const listHead = (
			<tr>{_mapO(this.props.list[0], (pn, pv) => <th key={pn}>{fProps[pn].dispName}</th>)}</tr>
		)
		const list = this.props.list.map((item, index) => {
			let userInfo = _mapO(item, (pn, pv) => {
				if(pn != 'id'){
					return <td key={pn}>{pv}</td>
				} else {
					return (
						<td key={pn}>
							<CheckBox check={this.props.selected.indexOf(pv) >= 0} onChange={this.handleChange.bind(this, 'check', pv)}/>
						</td>
					);
				}
			});
			return <tr key={index}>{userInfo}</tr>
		});
		const page = (this.props.params.page ? parseInt(this.props.params.page) : 1);
		return(
			<div className="users">
				<h1>회원목록</h1>
				<table><tbody>
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

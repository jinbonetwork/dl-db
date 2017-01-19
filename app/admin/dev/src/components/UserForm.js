import React, {Component, PropTypes} from 'react';
import {_mapO} from '../accessories/functions';

class UserForm extends Component {
	componentDidMount(){
		this.props.fetchUser(this.props.params.id, this.props.originalUserList);
	}
	renderValue(){
		
	}
	renderTable(userProps, isChild){
		const {fSlug, fProps} = this.props.userFieldData;
		const rows  = _mapO(userProps, (fn, value) => (
			(fProps[fn].type != 'meta' && (isChild ? true : !fProps[fn].parent)) && (
				<tr key={fn}>
					<td>{fProps[fn].dispName}</td>
					<td>{this.renderValue(value, fProps[fn])}</td>
				</tr>
			)
		));
		const className = (isChild ? 'user__table user__inner-table' : 'user__table');
		return (
			<table className={className}><tbody>
				{rows}
			</tbody></table>
		);
	}
	render(){
		return (
			<div>
				{this.renderTable(this.props.user)}
			</div>
		);
	}
}
UserForm.propTypes = {
	userFieldData: PropTypes.object.isRequired,
	originalUserList: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	fetchUser: PropTypes.func.isRequired
};

export default UserForm;

import React, {Component, PropTypes} from 'react';
import {_mapO} from '../accessories/functions';

class Users extends Component {
	componentDidMount(){
		this.props.fetchUserFieldData();
		this.props.fetchUserList();
	}
	componentDidUpdate(prevProps, prevState){
		if(prevProps.params.page != this.props.params.page){
			this.props.fetchUserList(this.props.params.page);
		}
	}
	render(){
		const fProps = this.props.fieldData.fProps;
		const listHead = (
			<tr>{_mapO(this.props.list[0], (pn, pv) => <th key={pn}>{fProps[pn].dispName}</th>)}</tr>
		)
		const list = this.props.list.map((item, index) => (
			<tr key={index}>{_mapO(item, (pn, pv) => <td key={pn}>{pv}</td>)}</tr>
		));
		return(
			<table><tbody>
				{listHead}
				{list}
			</tbody></table>
		);
	}
}
Users.propTypes = {
	fieldData: PropTypes.shape({
		fProps: PropTypes.object, fSlug: PropTypes.object, fID: PropTypes.object, empty: PropTypes.object, taxonomy: PropTypes.object, terms: PropTypes.object
	}).isRequired,
	originalList: PropTypes.array.isRequired,
	list: PropTypes.array.isRequired,
	fetchUserFieldData: PropTypes.func.isRequired,
	fetchUserList: PropTypes.func.isRequired
}

export default Users;

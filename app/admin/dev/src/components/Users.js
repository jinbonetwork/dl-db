import React, {Component, PropTypes} from 'react';
import Pagination from '../accessories/Pagination';
import {_mapO} from '../accessories/functions';

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
	render(){
		const fProps = this.props.fieldData.fProps;
		const listHead = (
			<tr>{_mapO(this.props.list[0], (pn, pv) => <th key={pn}>{fProps[pn].dispName}</th>)}</tr>
		)
		const list = this.props.list.map((item, index) => (
			<tr key={index}>{_mapO(item, (pn, pv) => <td key={pn}>{pv}</td>)}</tr>
		));
		const page = (this.props.params.page ? parseInt(this.props.params.page) : 1);
		return(
			<div className="users">
				<h1>회원목록</h1>
				<div className="users__list-wrap">	
					<div className="users__list">
						<table><tbody>
							{listHead}
							{list}
						</tbody></table>
					</div>
				</div>
				<Pagination url="/admin/users/page/" page={parseInt(this.props.params.page)} lastPage={this.props.lastPage} />
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
	fetchUserFieldData: PropTypes.func.isRequired,
	fetchUserList: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired
}

export default Users;

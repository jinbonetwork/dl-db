import React, {Component, PropTypes} from 'react';
import Pagination from '../accessories/Pagination';

class Stats extends Component {
	componentDidMount(){
		this.props.fetchStats({page: this.props.params.page});
	}
	componentDidUpdate(prevProps){
		if(prevProps.params.page != this.props.params.page){
			this.props.fetchStats({page: this.props.params.page});
		}
	}
	render(){
		return (
			<div className="statstics">
				<h1>이용자별 자료수</h1>
				<table className="numdoclist"><tbody>
					<tr>
						<td className="table-margin"></td>
						<td className="table-padding"></td>
						<td>이름</td>
						<td>자료수</td>
						<td className="table-padding"></td>
						<td className="table-margin"></td>
					</tr>
					{this.props.numDocList.map((data) => (
						<tr key={data.id}>
							<td className="table-margin"></td>
							<td className="table-padding"></td>
							<td className="numdoclist__name">{data.name}</td>
							<td className="numdoclist__count">{data.cnt}</td>
							<td className="table-padding"></td>
							<td className="table-margin"></td>
						</tr>
					))}
				</tbody></table>
				<Pagination url={'/admin/stats/page/'}
					page={(this.props.params.page ? parseInt(this.props.params.page) : 1)} lastPage={this.props.lastPage}
				/>
			</div>
		);
	}
}
Stats.propTypes = {
	numDocList: PropTypes.array.isRequired,
	lastPage: PropTypes.number.isRequired,
	fetchStats: PropTypes.func.isRequired
};

export default Stats;

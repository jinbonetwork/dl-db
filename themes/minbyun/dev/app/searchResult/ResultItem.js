import React, {Component, PropTypes} from 'react';
import LinkByRole from '../LinkByRole';

const _sideProps = {
	date: '작성일',
	number: '사건번호',
	commitee: '위원회',
	author: '작성자'
}

class ResultItem extends Component {
	render(){
		let side = [];
		for(let p in _sideProps){
			side.push( this.props.item[p] &&
				<li key={p}>
					<span>{_sideProps[p]}: </span>
					<span>{this.props.item[p]}</span>
				</li>
			);
		}
		return (
			<div className="result-item">
				<div className="result-item__header">
					<span>{'['+this.props.item.doctype+']'}</span>
					<LinkByRole className="result-item__title" to={'/document/'+this.props.item.id} userRole={this.props.userRole}
						role={[1, 7]} isVisible={true}>
						{this.props.item.title}
					</LinkByRole>
				</div>
				<div>
					<ul className="result-item__side">{side}</ul>
					<p className="result-item__content">{this.props.item.content}</p>
				</div>
			</div>
		);
	}
}
ResultItem.propTypes = {
	item: PropTypes.object.isRequired,
	userRole: PropTypes.array,
	apiUrl: PropTypes.string
}
export default ResultItem;

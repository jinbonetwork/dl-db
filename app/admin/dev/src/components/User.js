import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {_mapO, _mapAO} from '../accessories/functions';

class User extends Component {
	componentDidMount(){
		this.props.fetchUser(this.props.params.id, this.props.originalUserList);
	}
	renderValue(value, fProp){
		const fData = this.props.userFieldData;
		switch(fProp.type){
			case 'taxonomy':
				if(!fProp.multiple) value = [value];
				const taxo = [];
				value.forEach((v) => {
					let term = fData.terms[v];
					if(term) taxo.push(term.name);
				});
				if(taxo.length) return <span>{taxo.join(', ')}</span>;
				else return null;
			case 'char': case 'email': case 'phone': case 'date':
				if(!fProp.multiple) value = [value];
				if(fProp.form !== 'textarea'){
					return <span>{value.join(', ')}</span>;
				} else{
					let texts = [];
					value.map((text, i) => { if(text){
						text = text.split(/\n/).map((t, j) => <div key={j}><span>{t}</span></div>);
						texts.push(<div key={i}>{text}</div>);
					}});
					if(texts.length) return texts;
					else return null;
				}
			case 'tag':
				if(value){
					const tags = value.split(',').map((v) => '#'+v.trim());
					return <span>{tags.join(' ')}</span>;
				} else {
					return null;
				}
			case 'role':
				if(value.length > 0){
					let role = value.map((v) => fData.roles[v]);
					return <span>{role.join(', ')}</span>;
				} else return null;
			case 'group':
				return this.renderTable(_mapAO(fProp.children, (fn) => this.props.user[fn]), true);
			default:
				console.error(fProp.type + '은/는 적합한 type이 아닙니다');
				return null;
		}
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
			<div className="user">
				<h1>회원정보</h1>
				<table className="user__wrap"><tbody>
					<tr>
						<td className="user__table-margin"></td>
						<td className="user__menu" colSpan="3">
							{(!this.props.user.uid) &&
							<button className="user__register-user">
								<i className="pe-7s-id pe-va"></i><span>등록</span>
							</button>}
							{/*<Link className="user__edit-user" to={'/admin/user/'+this.props.params.id+'/edit'}>*/}
							<Link className="user__edit-user">
								<i className="pe-7s-note pe-va"></i><span>수정</span>
							</Link>
							<button className="user__delete-user">
								<i className="pe-7s-delete-user pe-va"></i><span>삭제</span>
							</button>
						</td>
						<td className="user__table-margin"></td>
					</tr>
					<tr className="user__table-padding"><td></td><td colSpan="3"></td><td></td></tr>
					<tr className="user__body">
						<td className="user__table-margin"></td>
						<td className="user__table-padding"></td>
						<td>{this.renderTable(this.props.user)}</td>
						<td className="user__table-padding"></td>
						<td className="user__table-margin"></td>
					</tr>
					<tr className="user__table-padding"><td></td><td colSpan="3"></td><td></td></tr>
				</tbody></table>
			</div>
		);
	}
}
User.propTypes = {
	userFieldData: PropTypes.object.isRequired,
	originalUserList: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	fetchUser: PropTypes.func.isRequired
};

export default User;

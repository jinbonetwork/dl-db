import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {Table, Row, Column} from './accessories/Table';
import Message from './accessories/Message';

class Login extends Component {
	constructor(){
		super();
		this.state = {
			id: '',
			password: ''
		}
	}
	componentWillMount(){
		if(this.props.userData.role) this.props.router.goBack();
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.userData.role) nextProps.router.goBack();
	}
	submit(){ if(this.props.userData.type){
		let data, loginUri;
		if(this.props.userData.type == 'xe'){
			data = {
				user_id: this.state.id,
				password: this.state.password,
				success_return_url: '/'
			}
			loginUri = '/xe/?act=procMemberLogin';
		}
		else{
			data = {
				mb_id: this.state.id,
				mb_password: this.state.password,
				url: '/'
			}
			loginUri = '/gnu5/bbs/login_check.php';
		}

		let formData = new FormData;
		for(let prop in data){
			formData.append(prop, data[prop]);
		}

		this.props.fetchData('post', loginUri, formData, (response) => {
			if(response){
				this.props.fetchContData(({role}) => { if(!role){
					this.props.setMessage('로그인 정보가 잘못되었습니다.', 'unset');
				}});
			}
		});
	}}
	handleChange(which, event){
		this.setState({[which]: event.target.value});
	}
	handleClick(which, event){
		if(which == 'submit'){
			this.submit()
		}
		else if(which == 'error'){
			this.setState({child: null});
		}
	}
	handleKeyDown(which, event){
		if((which == 'id' || which == 'password') && event.key === 'Enter'){
			this.submit();
		}
	}
	render(){
		if(!this.props.userData.user) return null;
		return(
			<div className="login">
				<div className="login__header">
					<img src={site_base_uri+'/themes/minbyun/images/logo.svg'} />
					<div className="login__title">
						<span>민주사회를 위한 변호사모임</span>
						<span>디지털 도서관</span>
					</div>
				</div>
				<Table className="login__body">
					<Row>
						<Column className="table__label">아이디</Column>
						<Column><input type="text" value={this.state.id} onChange={this.handleChange.bind(this, 'id')} onKeyDown={this.handleKeyDown.bind(this, 'id')} /></Column>
					</Row>
					<Row>
						<Column className="table__label">비밀번호</Column>
						<Column><input type="password" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} onKeyDown={this.handleKeyDown.bind(this, 'password')} /></Column>
					</Row>
					<Row>
						<Column className="table__label"></Column>
						<Column><button type="button" onClick={this.handleClick.bind(this, 'submit')}>로그인</button></Column>
					</Row>
					<Row>
						<Column className="table__label"></Column>
						<Column><span>※ 아이디 개설 문의: 민변 사무국</span></Column>
					</Row>
				</Table>
				<div className="login__agreement">
				</div>
				{this.state.child}
			</div>
		);
	}
}
Login.propTypes = {
	userData: PropTypes.object,
	fetchData:  PropTypes.func.isRequired,
	fetchContData: PropTypes.func.isRequired,
	setMessage:  PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Login);
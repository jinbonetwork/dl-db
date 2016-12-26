import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {Table, Row, Column} from './accessories/Table';
import Message from './accessories/Message';
import {_screen} from './schema/screenSchema';
import {_interpolate} from './accessories/functions';

class Login extends Component {
	constructor(){
		super();
		this.state = {
			id: '',
			password: ''
		}
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
				this.props.fetchContData((data) => {
					if(data.role){
						this.props.router.goBack();
					} else {
						this.props.setMessage('로그인 정보가 잘못되었습니다.', () => {
							this.refs.id.focus();
						});
					}
				});
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
	propsForResponsivity(){
		const window = this.props.window;
		return {
			style: {
				title0: {
					fontSize: _interpolate(window.width, 24, 28.8, 320, 500),
					textAlign: 'left'
				},
				title1: {
					fontSize: _interpolate(window.width, 28.8, 57.6, 320, 500),
					textAlign: 'left'
				}
			},
			placeholder: {
				id: (window.width <= _screen.small ? '아이디' : null),
				password: (window.width <= _screen.small ? '비밀번호' : null)
			}
		};
	}
	render(){
		const prsRsp = this.propsForResponsivity();
		return(
			<div className="login">
				<div className="login__header">
					<img src={site_base_uri+'/themes/minbyun/images/logo.svg'} />
					<div className="login__title">
						<span style={prsRsp.style.title0}>민주사회를 위한 변호사모임</span>
						<span style={prsRsp.style.title1}>디지털 도서관</span>
					</div>
				</div>
				<Table className="login__body">
					<Row>
						<Column>아이디</Column>
						<Column>
							<input type="text" ref="id" value={this.state.id} placeholder={prsRsp.placeholder.id} autoFocus={true}
								onChange={this.handleChange.bind(this, 'id')} onKeyDown={this.handleKeyDown.bind(this, 'id')}
							/>
						</Column>
					</Row>
					<Row>
						<Column>비밀번호</Column>
						<Column>
							<input type="password" value={this.state.password} placeholder={prsRsp.placeholder.password}
								onChange={this.handleChange.bind(this, 'password')} onKeyDown={this.handleKeyDown.bind(this, 'password')}
							/>
						</Column>
					</Row>
					<Row>
						<Column></Column>
						<Column><button type="button" onClick={this.handleClick.bind(this, 'submit')}>로그인</button></Column>
					</Row>
					<Row>
						<Column></Column>
						<Column><span>※ 아이디 개설 문의: 민변 사무처</span></Column>
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
	window: PropTypes.object.isRequired,
	fetchData:  PropTypes.func.isRequired,
	fetchContData: PropTypes.func.isRequired,
	setMessage:  PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Login);

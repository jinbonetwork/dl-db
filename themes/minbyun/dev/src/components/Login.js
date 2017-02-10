import React, {Component, PropTypes} from 'react';
import Item from '../accessories/Item';
import {SCREEN} from '../constants';
import {_interpolate} from '../accessories/functions';
import renderHTML from 'react-render-html';
import {Scrollbars} from 'react-custom-scrollbars';

const pathOfImage = site_base_uri+'/themes/minbyun/images';

class Login extends Component {
	componentDidMount(){
		this.refs.id.focus();
	}
	componentDidUpdate(prevProps, prevState){
		/*
		if(!prevState.showAgreement && this.props.showAgreement){
			this.props.fetchData('get', '/api/agreement', (data) => { if(data){
				this.setState({agreement: data.agreement});
			}});
		}
		*/
	}
	/*
	submit(){ if(this.props.userData.type){
		let data, loginUrl;
		if(this.props.userData.type == 'xe'){
			data = {
				user_id: this.props.id,
				password: this.props.password,
				success_return_url: '/'
			}
			loginUrl = '/xe/?act=procMemberLogin';
		}
		else{
			data = {
				mb_id: this.props.id,
				mb_password: this.props.password,
				url: '/'
			}
			loginUrl = '/gnu5/bbs/login_check.php';
		}

		let formData = new FormData;
		for(let prop in data){
			formData.append(prop, data[prop]);
		}
		if(this.props.userData.role){
			this.props.unsetUserData();
			this.props.fetchData('post', '/api/logout', null, (data) => {if(data){
				this.login(loginUrl, formData, this.props.router.push.bind(this, '/'));
			}});
		} else {
			this.login(loginUrl, formData, this.props.router.goBack);
		}
	}}
	login(loginUrl, formData, callBack){
		this.props.fetchData('post', loginUrl, formData, (response) => {
			if(response){
				this.props.fetchContData((data) => {
					if(data.role){
						if(data.agreement != 1){
							this.props.fetchData('get', '/api/agreement', (data) => { if(data){
								this.setState({agreement: data.agreement});
							}});
						} else {
							callBack();
						}
					} else {
						this.props.setMessage('로그인 정보가 잘못되었습니다.', () => {
							this.refs.id.focus();
						});
					}
				});
			}
		});
	}
	*/

	handleChange(which, arg1st){
		let value = arg1st.target.value;
		this.props.onChange(which, value);
	}
	handleClick(which, event){
		if(which == 'submit'){
			this.submit()
		}
		else if(which == 'agree'){
			this.props.fetchData('post', '/api/agreement?agreement=1', null, (data) => { if(data){
				this.props.setAgreement();
				this.props.router.goBack();
			}});
		}
	}
	handleKeyDown(which, event){
		if((which == 'id' || which == 'password') && event.key === 'Enter'){
			this.submit();
		}
	}
	submit(){
		let data, loginUrl;
		if(this.props.type == 'xe'){
			data = {
				user_id: this.props.id,
				password: this.props.password,
				success_return_url: '/'
			}
			loginUrl = '/xe/?act=procMemberLogin';
		}
		else{
			data = {
				mb_id: this.props.id,
				mb_password: this.props.password,
				url: '/'
			}
			loginUrl = '/gnu5/bbs/login_check.php';
		}

		let formData = new FormData;
		for(let prop in data){
			formData.append(prop, data[prop]);
		}
		this.props.onLogin(loginUrl, formData, () => {this.refs.id.focus()});
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
				id: (window.width <= SCREEN.small ? '아이디' : null),
				password: (window.width <= SCREEN.small ? '비밀번호' : null)
			}
		};
	}
	render(){
		const prsRsp = this.propsForResponsivity();
		const loginBody = (
			<div className="login__body table">
				<div className="table__row">
					<div className="table__col">아이디</div>
					<div className="table__col">
						<input type="email" ref="id" value={this.props.id} placeholder={prsRsp.placeholder.id}
							onChange={this.handleChange.bind(this, 'id')} onKeyDown={this.handleKeyDown.bind(this, 'id')}
						/>
					</div>
				</div>
				<div className="table__row">
					<div className="table__col">비밀번호</div>
					<div className="table__col">
						<input type="password" value={this.props.password} placeholder={prsRsp.placeholder.password}
							onChange={this.handleChange.bind(this, 'password')} onKeyDown={this.handleKeyDown.bind(this, 'password')}
						/>
					</div>
				</div>
				<div className="table__row">
					<div className="table__col"></div>
					<div className="table__col"><button type="button" onClick={this.handleClick.bind(this, 'submit')}>로그인</button></div>
				</div>
				<div className="table__row">
					<div className="table__col"></div>
					<div className="table__col"><span>※ 아이디 개설 문의: 민변 사무처</span></div>
				</div>
			</div>
		);
		const agreement = (
			<div className="login__agreement">
				<Scrollbars className="login__agreement-wrap">
					<div className="login__agreement-content">
						{/*renderHTML(this.props.agreement)*/}
					</div>
				</Scrollbars>
				<button onClick={this.handleClick.bind(this, 'agree')}>이용약관에 동의합니다</button>
			</div>
		);
		return(
			<div className="login">
				<div className="login__innerwrap">
					<div className="login__header">
						<img src={pathOfImage+'/logo.svg'} />
						<div className="login__title">
							<span style={prsRsp.style.title0}>민주사회를 위한 변호사모임</span>
							<span style={prsRsp.style.title1}>디지털 도서관</span>
						</div>
					</div>
					{(!this.props.agreement ? loginBody : agreement)}
				</div>
				<div className="login__links">
					<div className="login__links-content">
						<div>
							<div><span>Powered by </span><a href="http://jinbo.net" target="_blank">진보넷</a></div>
							<div>
								<span>디지털 아카이브 프로젝트 </span>
								<a href="http://github.com/jinbonetwork" target="_blank">
									<img src={pathOfImage+'/github.png'}/>
								</a>
							</div>
						</div>
						<div><img src={pathOfImage+'/archive.png'} /></div>
					</div>
				</div>
			</div>
		);
	}
}
Login.propTypes = {
	id: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	agreement: PropTypes.bool,
	window: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired
	/*
	userData: PropTypes.object,

	fetchData:  PropTypes.func.isRequired,
	fetchContData: PropTypes.func.isRequired,
	setMessage:  PropTypes.func.isRequired,
	unsetUserData: PropTypes.func.isRequired,
	setAgreement: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
	*/
};

export default Login;

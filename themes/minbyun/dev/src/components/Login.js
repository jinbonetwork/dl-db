import React, {Component, PropTypes} from 'react';
import {Link,withRouter} from 'react-router';
import Item from '../accessories/Item';
import {SCREEN} from '../constants';
import {_interpolate} from '../accessories/functions';
import renderHTML from 'react-render-html';
import {Scrollbars} from 'react-custom-scrollbars';

const pathOfImage = site_base_uri+'/themes/minbyun/images';

class Login extends Component {
	componentDidMount(){
		this.refs.id.focus();
		if(this.props.didLogIn) this.props.fetchAgreement();
	}
	componentDidUpdate(prevProps){
		if(!prevProps.didLogIn && this.props.didLogIn) this.props.fetchAgreement();
	}
	handleChange(which, arg1st){
		let value = arg1st.target.value;
		this.props.onChange(which, value);
	}
	handleClick(which, event){
		if(which == 'submit'){
			this.submit()
		}
		else if(which == 'agree'){
			this.props.onAgree(() => {this.props.router.push('/user/profile')});
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
					<div className="table__col"><Link to={'/user/regist'} className="button">회원가입</Link></div>
				</div>
				<div className="table__row">
					<div className="table__col"></div>
					<div className="table__col login__contact">
						<p>아이디 개설 문의: 민변 사무처</p>
						<p><i className="pe-7f-call pe-va"></i><span>02-522-7283</span></p>
						<p><i className="pe-7f-mail pe-va"></i><span>lib_admin@minbyun.or.kr</span></p>
					</div>
				</div>
			</div>
		);
		const agreement = (
			<div className="login__agreement">
				<Scrollbars className="login__agreement-wrap">
					<div className="login__agreement-content">
						{renderHTML(this.props.agreement)}
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
	doAgree: PropTypes.bool,
	agreement: PropTypes.string.isRequired,
	window: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired,
	fetchAgreement: PropTypes.func.isRequired,
	onAgree: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(Login);

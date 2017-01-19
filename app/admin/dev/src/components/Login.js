import React, {Component, PropTypes} from 'react';

class Login extends Component {
	handleChange(which, event){
		this.props.onChange(which, event.target.value);
	}
	handleKeyDown(event){
		if(event.key == 'Enter'){
			this.handleLogin();
		}
	}
	handleLogin(){
		let data, loginUrl;
		if(this.props.loginType == 'xe'){
			data = {
				user_id: this.props.id,
				password: this.props.password,
				success_return_url: '/'
			}
			loginUrl = '/xe/?act=procMemberLogin';
		} else{
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
		};
		this.props.onLogin(loginUrl, formData, () => {this.refs.id.focus()});
	}
	render(){
		return (
			<div className="login">
				<div>
					<input ref="id" type="email" value={this.props.id} placeholder="아이디" autoFocus={true}
						onChange={this.handleChange.bind(this, 'id')} onKeyDown={this.handleKeyDown.bind(this)}
					/>
				</div>
				<div>
					<input type="password" value={this.props.password} placeholder="비밀번호"
						onChange={this.handleChange.bind(this, 'password')} onKeyDown={this.handleKeyDown.bind(this)}
					/>
				</div>
				<div>
					<button onClick={this.handleLogin.bind(this)}>로그인</button>
				</div>
			</div>
		);
	}
}
Login.propTypes = {
	loginType: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired,
	fetchAdminInfo: PropTypes.func.isRequired
};

export default Login;

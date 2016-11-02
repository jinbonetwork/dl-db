import React, {Component} from 'react';

class ServerError extends Component {
	render(){
		return (
			<div className="server-error">
				<p>서버와 통신하는데 문제가 있습니다.</p>
			</div>
		);
	}
}

export default ServerError;

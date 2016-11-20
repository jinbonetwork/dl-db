import React, {Component} from 'react';
import Overlay from './Overlay';

class ServerError extends Component {
	render(){
		return(
			<div>
				<Overlay />
				<div className="servererror">
					서버와의 통신에서 문제가 발생했습니다.
				</div>
			</div>
		);
	}
}

export default ServerError;

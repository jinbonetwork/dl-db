import React, {Component, PropTypes} from 'react';

class Agreement extends Component {
	componentDidMount(){
		//this.props.fetchAgreement();
	}
	render(){
		return (
			<div>
				Agreement
				{this.props.agreement}
			</div>
		);
	}
}
Agreement.propTypes = {
	agreement: PropTypes.string.isRequired,
	fetchAgreement: PropTypes.func.isRequired
}

export default Agreement;

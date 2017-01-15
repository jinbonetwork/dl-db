import React, {Component, PropTypes} from 'react';

class CheckBox extends Component {
	handleClick(){
		this.props.onChange(!this.props.check);
	}
	handleKeyDown(event){
		if(event.key == 'Enter') this.props.onChange(!this.props.check);
	}
	render(){
		return(
			<span className="checkbox" tabIndex="0"
				onClick={this.handleClick.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}
			>
				{!this.props.check && <span className="checkbox__uncheck-icon">{this.props.uncheckIcon}</span>}
				{this.props.check && <span className="checkbox__check-icon">{this.props.checkIcon}</span>}
			</span>
		);
	}
}
CheckBox.propTypes = {
	check: PropTypes.bool,
	checkIcon: PropTypes.element,
	uncheckIcon: PropTypes.element,
	onChange: PropTypes.func.isRequired
};
CheckBox.defaultProps = {
	checkIcon: <i className="pe-7f-check pe-va"></i>,
	uncheckIcon: <i className="pe-7s-check pe-va"></i>
};

export default CheckBox;

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class LinkIf extends Component {
	render(){
		if(this.props.condition){
			if(!this.props.isAnchor){
				return <Link className={this.props.className} to={this.props.to}>{this.props.children}</Link>
			} else {
				return <a className={this.props.className} href={this.props.to} target="_blank">{this.props.children}</a>
			}
		} else {
			if(this.props.isVisible){
				return <span className={this.props.className}>{this.props.children}</span>
			} else {
				return null;
			}
		}
	}
}
LinkIf.propTypes = {
	className: PropTypes.string,
	to: PropTypes.string.isRequired,
	condition: PropTypes.bool.isRequired,
	isVisible: PropTypes.bool,
	isAnchor: PropTypes.bool
};

export default LinkIf;

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class LinkIf extends Component {
	render(){
		if(this.props.if){
			if(!this.props.tag){
				return <Link className={this.props.className} to={this.props.to} style={this.props.style}>{this.props.children}</Link>
			} else if(this.props.tag == 'a') {
				return <a className={this.props.className} href={this.props.to} target="_blank"  style={this.props.style}>{this.props.children}</a>
			}
		} else {
			if(this.props.notIf == 'visible'){
				return <span className={this.props.className}  style={this.props.style}>{this.props.children}</span>
			} else {
				return null;
			}
		}
	}
}
LinkIf.propTypes = {
	classNmae: PropTypes.string,
	to: PropTypes.string.isRequired,
	if: PropTypes.bool,
	notIf: PropTypes.string,
	tag: PropTypes.string,
	style: PropTypes.object
};

export default LinkIf;

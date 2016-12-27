import React, {Component, PropTypes} from 'react';
import jQ from 'jquery';

class Item extends Component {
	componentDidMount(){
		if(this.props.groupName){
			jQ(this.refs.li).attr('groupname', this.props.groupName).find('a').attr({
				tabIndex: -1,
				groupname: this.props.groupName
			});
		}
		if(this.props.focus) this.refs.li.focus();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) this.refs.li.focus();
	}
	handleClick(){
		if(this.props.onClick) this.props.onClick();
	}
	handleFocus(){
		if(this.props.onFocus) this.props.onFocus();
	}
	handleBlur(event){
		if(this.props.onBlur){
			if(this.props.groupName){
				let isRelatedTargetInSameGroup = true;
				if(!event.relatedTarget || this.props.groupName != event.relatedTarget.getAttribute('groupname')){
					isRelatedTargetInSameGroup = false;
				}
				this.props.onBlur(isRelatedTargetInSameGroup);
			} else {
				this.props.onBlur();
			}
		}
	}
	handleKeyDown(event){
		if(event.key === 'Enter'){
			jQ(this.refs.li).find('*').click();
		} else {
			if(this.props.onKeyDown) this.props.onKeyDown(event.key);
		}
	}
	render(){
		let className = (this.props.className ? 'item '+this.props.className : 'item');
		const tabIndex = (this.props.hasOwnProperty('tabIndex') ? this.props.tabIndex : 0);
		return (
			<li tabIndex={tabIndex} ref="li" className={className}
				onBlur={this.handleBlur.bind(this)} onClick={this.handleClick.bind(this)} onFocus={this.handleFocus.bind(this)}
				onKeyDown={this.handleKeyDown.bind(this)}
			>
				{this.props.children}
			</li>
		);
	}
}
Item.propTypes = {
	groupName: PropTypes.string,
	className: PropTypes.string,
	tabIndex: PropTypes.number,
	focus: PropTypes.bool,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	onClick: PropTypes.func,
	onKeyDown: PropTypes.func
};

export default Item;

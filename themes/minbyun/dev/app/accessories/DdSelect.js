import React, {Component, PropTypes, Children, cloneElement} from 'react';
import {Dropdown, DdHead, DdItem, DdArrow} from './Dropdown';

class DdOption extends Component {
	render(){ console.log(this.props.children);
		return (
			<DdItem>{this.props.children}</DdItem>
		);
	}
}
DdOption.propTypes = {
	value: PropTypes.string
};

class DdSelect extends Component {
	render(){
		let children = Children.map(this.props.children, (child) => {
			if(child.type == 'DdItem'){
				console.log(child.props.value);
				return <DdItem>{child.props.value}{' '}{child.props.children}</DdItem>
			} else {
				return child;
			}
		});
		return (
			<Dropdown>
				{children}
			</Dropdown>
		);
	}
}

export default DdSelect;

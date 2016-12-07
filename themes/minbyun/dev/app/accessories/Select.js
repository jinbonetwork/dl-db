import React, {Component, PropTypes, Children, cloneElement} from 'react';
import {Dropdown, DdHead, DdItem, DdArrow} from './Dropdown';
import {_isCommon, _pushpull} from './functions';

class Option extends Component {}
class Select extends Component {
	constructor(){
		super();
		this.state = {
			selected: ''
		};
	}
	componentWillMount(){
		if(this.props.selected){
			this.setState({selected: this.props.selected});
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.selected){
			this.setState({selected: nextProps.selected});
		}
	}
	handleClick(value){
		if(this.state.seleced != value){
			if(this.props.onChange){
				this.props.onChange(value);
			} else {
				this.setState({selected: value});
			}
		}
	}
	render(){
		let head;
		const children = Children.map(this.props.children, (child) => {
			if(child.type == Option){
				if(child.props.value == this.state.selected){
					head = child.props.children;
				} else {
					return <DdItem onClick={this.handleClick.bind(this, child.props.value)}>
						{child.props.children}
					</DdItem>
				}
			}
		});
		return (
			<Dropdown className="select" onResize={this.props.onResize}>
				<DdHead>
					{head}
					<DdArrow><i className="pe-7s-angle-down pe-va"></i></DdArrow>
				</DdHead>
				{children}
			</Dropdown>
		);
	}
}
Select.propTypes = {
	selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	onResize: PropTypes.func
};

export {Select, Option};

import React, {Component, PropTypes, Children, cloneElement} from 'react';

class RdItem extends Component {
	handleClick(){
		this.props.onClick(this.props.value);
	}
	render(){
		let className = (this.props.className ? 'rditem '+this.props.className : 'rditem');
		if(this.props.selected == this.props.value) className += ' rditem--checked';
		return (
			<li className={className} onClick={this.handleClick.bind(this)}>
				<span className="rditem__check">
					<i className="pe-7f-check pe-va"></i>
				</span>
				<span className="rditem__uncheck">
					<i className="pe-7s-less pe-va"></i>
				</span>
				{this.props.children}
			</li>
		);
	}
}
RdItem.propTypes = {
	className: PropTypes.string,
	value: PropTypes.string,
	selected: PropTypes.string,
	onClick: PropTypes.func
};

class Radio extends Component {
	constructor(){
		super();
		this.state = {
			selected: null
		};
	}
	componentWillMount(){
		if(this.props.selected) this.setState({selected: this.props.selected});
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.selected) this.setState({selected: nextProps.selected});
	}
	handleClick(value){
		if(this.state.selected != value){
			this.setState({selected: value});
			if(this.props.onChange) this.props.onChange(value);
		}
	}
	render(){
		let className = (this.props.className ? 'radio '+this.props.className : 'radio');
		let children = Children.map(this.props.children, (child) => { if(child && child.type == RdItem){
			return cloneElement(child, {selected: this.state.selected, onClick: this.handleClick.bind(this)})
		}});
		return (
			<div className={className}>
				<ul>{children}</ul>
			</div>
		);
	}
}
Radio.propTypes = {
	className: PropTypes.string,
	selected: PropTypes.string,
	onChange: PropTypes.func
}


export {Radio, RdItem};

import React, {Component, PropTypes, Children, cloneElement} from 'react';

class Toggle extends Component {
	constructor(){
		super();
		this.state = {
			isUnfolded: false,
			width: null,
			signOfClick: false,
		};
	}
	componentDidMount(){
		this.handleResize()
	}
	componentDidUpdate(prevProps, prevState){
		if(prevState.width != this.state.width){
			this.handleResize();
		}
		if(prevState.isUnfolded && this.state.isUnfolded && prevState.signOfClick == this.state.signOfClick){
			this.setState({isUnfolded: false});
		}
	}
	handleResize(){
		const rect = this.refs.invisible.getBoundingClientRect();
		const width = rect.width + 1;
		this.setState({width: width});
	}
	handleClick(arg){
		if(this.props.notIf && this.props.notIf(arg)){
			this.setState({signOfClick: !this.state.signOfClick});
		} else {
			this.setState({isUnfolded: !this.state.isUnfolded});
		}
	}
	render(){
		let className = (this.state.isUnfolded ? 'toggle toggle--unfolded' : 'toggle');
		let positionClassName = (this.props.position ? ' toggle__child--'+position : '');
		const children = Children.map(this.props.children, (child) => { if(child){
			return cloneElement(child, {onClick: this.handleClick.bind(this)});
		}});
		return (
			<div className={className}>
				<button type="button" onClick={this.handleClick.bind(this)}>
					<span className="toggle__icon">
						<span className="toggle__icon--off">{this.props.iconWhenOff}</span>
						<span className="toggle__icon--on">{this.props.iconWhenOn}</span>
					</span>
				</button>
				<div className={'toggle__child'+positionClassName}>
					<div style={{width: this.state.width}}>
						{children}
					</div>
				</div>
				<div className="toggle__invisible" ref="invisible">
					{children}
				</div>
			</div>
		);
	}
}
Toggle.propTypes = {
	iconWhenOff: PropTypes.element.isRequired,
	iconWhenOn: PropTypes.element.isRequired,
	position: PropTypes.string,
	notIf: PropTypes.func
};

export default Toggle;

import React, {Component, PropTypes} from 'react';

class Hamburger extends Component {
	constructor(){
		super();
		this.state = {
			isUnfolded: false,
			width: null
		};
	}
	componentDidMount(){
		this.handleResize()
	}
	componentDidUpdate(prevProps, prevState){
		if(prevState.width != this.state.width) this.handleResize();
	}
	handleResize(){
		const rect = this.refs.invisible.getBoundingClientRect();
		const width = rect.width + 1;
		this.setState({width: width});
	}
	handleClick(){
		this.setState({isUnfolded: !this.state.isUnfolded});
	}
	render(){
		let className = (this.state.isUnfolded ? 'hamburger hamburger--unfolded' : 'hamburger')
		return (
			<div className={className}>
				<button type="button" onClick={this.handleClick.bind(this)}>
					<span className="hamburger__icon">
						<i className="hamburger__icon--folded pe-7f-menu pe-va"></i>
					</span>
				</button>
				<div className="hamburger__child">
					<div style={{width: this.state.width}}>
						{this.props.children}
					</div>
				</div>
				<div className="hamburger__invisible" ref="invisible">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Hamburger;

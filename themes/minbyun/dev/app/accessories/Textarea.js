import React, {Component, PropTypes} from 'react';

class Textarea extends Component {
	componentDidMount(){
		if(this.props.focus) this.refs.textarea.focus();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) this.refs.textarea.focus();
	}
	handleChange(event){
		if(this.props.limit > 0 && event.target.value.length > this.props.limit) ;
		else this.props.onChange(event.target.value);
	}
	render(){
		const value = (this.props.value ? this.props.value : '');
		const message = (this.props.message ? <span>{this.props.message}</span> : null);
		const count = (this.props.displayCount ? <span className="textarea__num-of-words">{this.props.value.length}자</span> : null);
		const footer = (message || count) && (
			<div className="textarea__footer">
				{message}
				{count}
			</div>
		) ;
		return(
			<div className="textarea">
				<textarea ref="textarea" value={value} onChange={this.handleChange.bind(this)} />
				{footer}
			</div>
		);
	}
}
Textarea.propTypes = {
	value: PropTypes.string,
	focus: PropTypes.bool,
	message: PropTypes.string,
	limit: PropTypes.number,
	displayCount: PropTypes.bool,
	onChange: PropTypes.func.isRequired
};

export default Textarea;

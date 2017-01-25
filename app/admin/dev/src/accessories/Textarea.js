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
	handleBlur(event){
		if(this.props.onBlur) this.props.onBlur();
	}
	render(){
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
				<textarea ref="textarea" value={this.props.value} rows={this.props.rows} onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)} />
				{footer}
			</div>
		);
	}
}
Textarea.propTypes = {
	value: PropTypes.string,
	rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	focus: PropTypes.bool,
	message: PropTypes.string,
	limit: PropTypes.number,
	displayCount: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func
};
Textarea.defaultProps = {
	value: '',
	rows: 5
}

export default Textarea;

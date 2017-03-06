import React, {Component, PropTypes} from 'react';
import {TextArea} from 'react-text-input';
import jQ from 'jquery';
import browser from 'detect-browser';

class Textarea extends Component {
	componentDidMount(){
		if(this.props.focus) jQ(this.refs.textarea).find('textarea').focus();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) jQ(this.refs.textarea).find('textarea').focus();
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
		const count = (this.props.displayCount ?
			<span className="textarea__num-of-words"><span>{this.props.value.length}</span><span>자</span></span> :
			null
		);
		const footer = (message || count) && (
			<div className="textarea__footer">
				{message}
				{count}
			</div>
		);
		return (
			<div className="textarea" ref="textarea">
				<TextArea className="textarea__text-input" value={this.props.value}
					onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
				/>

				{/*(browser.name == 'ie' ?
					 :
					<textarea className="textarea__text-input" value={this.props.value}
						onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
					/>
				)*/}
				{footer}
			</div>
		);
	}
}
Textarea.propTypes = {
	value: PropTypes.string,
	focus: PropTypes.bool,
	message: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
	limit: PropTypes.number,
	displayCount: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func
};
Textarea.defaultProps = {
	value: ''
}

export default Textarea;

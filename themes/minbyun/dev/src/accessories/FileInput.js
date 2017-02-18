import React, {Component, PropTypes} from 'react';

class FileInput extends Component {
	componentDidMount(){
		if(this.props.focus) this.refs.upload.focus();
		this.refs.filename.value = this.props.value;
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) this.refs.upload.focus();
		if(prevProps.value != this.props.value) this.refs.filename.value = this.props.value;
	}
	handleKeyDown(event){
		if(event.key === 'Enter'){
			this.refs.file.click();
		}
	}
	handleChange(which, event){
		if(which == 'upload') this.props.onChange(event.target.files[0]);
		else if(which == 'filename') event.preventDefault();
	}
	handleBlur(event){
		if(this.props.onBlur) this.props.onBlur();
	}
	render(){
		return (
			<div className="fileinput">
				<div className="fileinput__filename-wrap">
					<input ref="filename" type="text" tabIndex="-1" disabled={this.props.disabled}
						onChange={this.handleChange.bind(this, 'filename')}
					/>
				</div>
				<label tabIndex="0" ref="upload"
					className={'fileinput__upload' + (this.props.disabled ? ' disabled' : '')}
					onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)}
				>
					{!this.props.disabled ?
						<span className="fileinput__label">찾기</span> :
						<span className="fileinput__progress-bar">
							<span className="fileinput__progress" style={{width: this.props.percent}}></span>
							<span className="fileinput__percentage">{this.props.percent}</span>
						</span>
					}
					<input type="file" ref="file" style={{display: 'none'}} value="" accept={this.props.accept}
						disabled={this.props.disabled} onChange={this.handleChange.bind(this, 'upload')}
					/>
				</label>
			</div>
		);
	}
}
FileInput.propTypes = {
	value: PropTypes.string,
	accept: PropTypes.string,
	focus: PropTypes.bool,
	disabled: PropTypes.bool,
	percent: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func
};
FileInput.defaultProps = {
	value: '',
	percent: '0%'
}

export default FileInput;

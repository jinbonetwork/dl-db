import React, {Component, PropTypes} from 'react';

class FileInput extends Component {
	componentDidMount(){
		if(this.props.focus) this.refs.upload.focus();
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.focus) this.refs.upload.focus();
	}
	handleKeyDown(event){
		if(event.key === 'Enter'){
			this.refs.file.click();
		}
	}
	handleChange(event){
		this.props.onChange(event.target.files[0]);
	}
	handleBlur(event){
		if(this.props.onBlur) this.props.onBlur();
	}
	render(){
		return (
			<div className="fileinput">
				<div className="fileinput__filename-wrap">
					<input type="text" tabIndex="-1" value={this.props.value} readOnly disabled={this.props.disabled} />
				</div>
				<label tabIndex="0" ref="upload"
					className={'fileinput__upload' + (this.props.disabled ? ' disabled' : '')}
					onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)}
				>
					<span className={this.props.disabled ? 'disabled' : null}>찾기</span>
					<input type="file" ref="file" style={{display: 'none'}} value="" accept={this.props.accept}
						disabled={this.props.disabled} onChange={this.handleChange.bind(this)}
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
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func
}

export default FileInput;

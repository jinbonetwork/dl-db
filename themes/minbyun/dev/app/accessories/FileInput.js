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
	render(){
		return (
			<div className="fileinput">
				<div className="fileinput__filename-wrap">
					<input type="text" tabIndex="-1" value={this.props.value} readOnly />
				</div>
				<label tabIndex="0" ref="upload" className="fileinput__upload" onKeyDown={this.handleKeyDown.bind(this)}>
					<span>찾기</span>
					<input type="file" ref="file" style={{display: 'none'}} value="" accept={this.props.accept}
						onChange={this.handleChange.bind(this)}
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
	onChange: PropTypes.func.isRequired
}

export default FileInput;

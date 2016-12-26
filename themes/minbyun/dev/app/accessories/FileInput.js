import React, {Component, PropTypes} from 'react';

class FileInput extends Component {
	handleKeyDown(event){
		if(event.key === 'Enter'){
			this.refs.file.click();
		}
	}
	render(){
		return (
			<div className="fileinput">
				<div className="fileinput__filename-wrap">
					<input type="text" tabIndex="-1" value={this.props.value} readOnly />
				</div>
				<label tabIndex="0" className="fileinput__upload" onKeyDown={this.handleKeyDown.bind(this)}>
					<span>찾기</span>
					<input type="file" ref="file" style={{display: 'none'}} value="" accept={this.props.accept}
						onChange={this.props.handleChange.bind(this)}
					/>
				</label>
			</div>
		);
	}
}
FileInput.propTypes = {
	value: PropTypes.string,
	accept: PropTypes.string,
	handleChange: PropTypes.func
}

export default FileInput;

import React, {Component, PropTypes} from 'react';

class FileInput extends Component {
	handleChange(event){
		this.setState({filename: event.target.files[0].name});
		this.props.handleChange(event);
	}
	render(){
		return (
			<div className="fileinput">
				<div className="fileinput__filename-wrap">
					<input type="text" value={this.props.value} />
				</div>
				<label className="fileinput--upload">
					<span>찾기</span>
					<input type="file" style={{display: 'none'}} value="" accept={this.props.accept}
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
	handleChange: PropTypes.func
}

export default FileInput;

import React, {Component, PropTypes} from 'react';
import Overlay from '../overlay/Overlay';

class FileTextEditor extends Component {
	componentWillMount(){
		this.setState({
			text: this.props.text
		});
	}
	handleChange(event){
		this.setState({text: event.target.value});
	}
	handleClick(which, event){
		if(which == 'submit'){
			this.props.submit(this.props.fid, this.state.text);
		}
		else if(which == 'cancel'){
			this.props.cancel();
		}
	}
	render(){
		return (
			<div>
				<Overlay />
				<div className="file-text-editor">
					<div className="file-text-editor__filename"><span>{this.props.filename}</span></div>
					<div className="file-text-editor__wrap">
						<textarea value={this.state.text} onChange={this.handleChange.bind(this)} />
						<div className="file-text-editor__buttons">
							<button type="button" onClick={this.handleClick.bind(this, 'submit')}>저장</button>
							<button type="button" onClick={this.handleClick.bind(this, 'cancel')}>취소</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
FileTextEditor.propType = {
	fid: PropTypes.string.isRequired,
	filename: PropTypes.string.isRequired,
	text: PropTypes.string,
	submit: PropTypes.func.isRequired,
	cancel: PropTypes.func.isRequired
};

export default FileTextEditor;

import React, {Component, PropTypes} from 'react';
import Overlay from '../accessories/Overlay';
import jQ from 'jquery';

class FileTextEditor extends Component {
	componentWillMount(){
		this.setState({
			text: this.props.text,
			textareaStyle: {},
			isFullScreen: false,
		});
	}
	componentDidMount(){
		this.handleResize();
		jQ(window).on('resize', this.handleResize.bind(this));
	}
	componentDidUpdate(nextProps, nextState){
		if(this.state.isFullScreen !== nextState.isFullScreen) this.handleResize();
	}
	componentWillUnmount(){
		jQ(window).off('resize');
	}
	handleResize(){
		let wrapH = jQ(this.refs.wrap).height();
		let headerH = jQ(this.refs.header).outerHeight(true);
		let buttonsH = jQ(this.refs.buttons).outerHeight(true);
		let height = wrapH - headerH - buttonsH - 5;
		if(this.state.textareaStyle.height != height){
			this.setState({textareaStyle: {height: height}});
		}
	}
	handleChange(event){
		this.setState({text: event.target.value});
	}
	handleClick(which, event){ switch(which){
		case 'submit':
			this.props.submit(this.props.fid, this.state.text); break;
		case 'cancel':
			this.props.cancel(); break;
		case 'alterScreen':
			this.setState({isFullScreen: !this.state.isFullScreen}); break;
	}}
	fileMeta(){ if(this.props.header){
		let meta = [];
		for(let prop in this.props.header){
			meta.push(<div key={prop}><span>{prop}: {this.props.header[prop]}</span></div>);
		}
		return <div className="file-text-editor__filemeta">{meta}</div>
	}}
	render(){
		let className = (this.state.isFullScreen ? 'file-text-editor file-text-editor__full-screen' : 'file-text-editor');
		return (
			<div>
				<Overlay />
				<div className={className} ref="wrap">
					<div className="file-text-editor__header" ref="header">
						<div className="file-text-editor__filename"><span>{this.props.filename}</span></div>
						{this.fileMeta()}
					</div>
					<textarea value={this.state.text} onChange={this.handleChange.bind(this)} style={this.state.textareaStyle} />
					<div className="file-text-editor__buttons" ref="buttons">
						<button type="button" className={(this.state.isFullScreen ? 'reverse-color': '')} onClick={this.handleClick.bind(this, 'alterScreen')}>
							{(this.state.isFullScreen ? '화면축소' : '화면확대')}
						</button>
						<button type="button" onClick={this.handleClick.bind(this, 'submit')}>저장</button>
						<button type="button" className="reverse-color" onClick={this.handleClick.bind(this, 'cancel')}>취소</button>
					</div>
				</div>
			</div>
		);
	}
}
FileTextEditor.propType = {
	fid: PropTypes.string.isRequired,
	filename: PropTypes.string.isRequired,
	header: PropTypes.object,
	text: PropTypes.string,
	submit: PropTypes.func.isRequired,
	cancel: PropTypes.func.isRequired
};

export default FileTextEditor;

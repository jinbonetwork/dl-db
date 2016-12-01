import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router'
import Overlay from './accessories/Overlay';
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import jQ from 'jquery';
import {_isEmpty} from './accessories/functions';

class FileTextEditor extends Component {
	constructor(){
		super();
		this.state = {
			text: '',
			textareaStyle: null,
			isFullScreen: false,
		};
	}
	componentWillMount(){
		if(!_isEmpty(this.props.fileText)){
			let text = this.props.fileText[this.props.params.fid].text;
			this.setState({text: text});
		}

	}
	componentWillReceiveProps(nextProps){
		if(!_isEmpty(nextProps.fileText)){
			let text = nextProps.fileText[nextProps.params.fid].text;
			this.setState({text: text});
		}
	}
	componentDidMount(){
		this.setSize();
	}
	componentDidUpdate(nextProps, nextState){
		 this.setSize();
	}
	setSize(){
		let wrapH = jQ(this.refs.wrap).height();
		let headerH = jQ(this.refs.header).outerHeight(true);
		let buttonsH = jQ(this.refs.buttons).outerHeight(true);
		let height = wrapH - headerH - buttonsH - 5;
		if(!this.state.textareaStyle || this.state.textareaStyle.height != height){
			this.setState({textareaStyle: {height: height}});
		}
	}
	handleChange(event){
		this.setState({text: event.target.value});
	}
	handleClick(which, event){ switch(which){
		case 'submit':
			this.props.submit(this.props.params.fid, this.state.text);
			this.props.router.push('/document/'+this.props.document.id);
			break;
		case 'alterScreen':
			this.setState({isFullScreen: !this.state.isFullScreen});
			break;
	}}
	fileMeta(header){
		let meta = [];
		for(let prop in header){
			meta.push(<div key={prop}><span>{prop}: {header[prop]}</span></div>);
		}
		return <div className="file-text-editor__filemeta">{meta}</div>
	}
	render(){
		let className = (this.state.isFullScreen ? 'file-text-editor file-text-editor__full-screen' : 'file-text-editor');
		const fid = this.props.params.fid;
		const filename = this.props.document && this.props.document.file.find((f) => f.fid == fid).filename;
		const fileMeta = (!_isEmpty(this.props.fileText) ? this.fileMeta(this.props.fileText[fid].header) : null);
		return (
			<div>
				<Overlay />
				<div className={className} ref="wrap">
					<div className="file-text-editor__header" ref="header">
						<div className="file-text-editor__filename"><span>{filename}</span></div>
						{fileMeta}
					</div>
					<textarea value={this.state.text} onChange={this.handleChange.bind(this)} style={this.state.textareaStyle} />
					<div className="file-text-editor__buttons" ref="buttons">
						<button type="button" className={(this.state.isFullScreen ? 'reverse-color': '')} onClick={this.handleClick.bind(this, 'alterScreen')}>
							{(this.state.isFullScreen ? '화면축소' : '화면확대')}
						</button>
						<button type="button" onClick={this.handleClick.bind(this, 'submit')}>저장</button>
						<Link className="reverse-color" to={'/document/'+this.props.document.id}>취소</Link>
					</div>
				</div>
			</div>
		);
	}
}
FileTextEditor.propType = {
	document: PropTypes.object,
	fileText: PropTypes.object,
	submit: PropTypes.func,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(FileTextEditor);

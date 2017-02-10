import React, {Component, PropTypes} from 'react';
import {Link, withRouter} from 'react-router'
import Overlay from './accessories/Overlay';
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import jQ from 'jquery';
import {_isEmpty, _mapO, _wrap} from './accessories/functions';

class FileTextEditor extends Component {
	constructor(){
		super();
		this.state = {
			text: '',
			header: {},
			textareaStyle: null,
			isFullScreen: false,
		};
	}
	componentDidMount(){
		if(this.props.authorized){
			this.fetchFileText();
		}
		this.setSize();
	}
	componentDidUpdate(prevProps, prevState){
		this.setSize();
	}
	fetchFileText(){
		const textApi = '/api/document/text?id='+this.props.docId+'&fid='+this.props.params.fid;
		this.props.fetchData('get', textApi, (data) => { if(data){
			this.setState({text: data.text, header: data.header});
		}});
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
			let api = '/api/document/text?mode=modify&id='+this.props.docId+'&fid='+this.props.params.fid;
			let formData = new FormData();
			formData.append('text', this.state.text);
			this.props.fetchData('post', api, formData, (data) => {
				this.props.router.goBack('/document/'+this.props.docId);
			});
			break;
		case 'cancel':
			this.props.router.goBack('/document/'+this.props.docId);
			break;
		case 'alterScreen':
			this.setState({isFullScreen: !this.state.isFullScreen});
			break;
		default:
	}}
	render(){
		let className = (this.state.isFullScreen ? 'file-text-editor file-text-editor__full-screen' : 'file-text-editor');
		const filename = _wrap(() => {
			if(this.props.file){
				let file = this.props.file.find((f) => f.fid == this.props.params.fid);
				if(file) return file.filename;
			}
		})
		const fileMeta = !_isEmpty(this.state.header) && (
			<div className="file-text-editor__filemeta">
				{_mapO(this.state.header, (pn, pv) => (
					<div key={pn}><span>{pn}: {pv}</span></div>
				))}
			</div>
		);
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
						<button type="button" className="reverse-color" onClick={this.handleClick.bind(this, 'cancel')}>취소</button>
					</div>
				</div>
			</div>
		);
	}
}
FileTextEditor.propType = {
	docId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	file: PropTypes.array,
	fetchData: PropTypes.func.isRequired,
	authorized: PropTypes.bool,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired,
		replace: PropTypes.func.isRequired
	}).isRequired
};

export default withRouter(FileTextEditor);

import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import Table from './table/Table';
import Row from './table/Row';
import Column from './table/Column';
import ImageWrap from './document/ImageWrap';
import func from './functions';

class Document extends Component {
	constructor(){
		super();
		this.state = null;
	}

	/*
	componentDidMount(){
		axios.get(this.props.apiUrl+'/document?id='+this.props.params.did)
		.then((response) => {
			if(response.statusText == 'OK'){
				if(response.data.error == 0){
					return response.data.document;
				} else {
					console.error(response.data.message);
				}
			} else {
				console.error('Server response was not OK');
			}
		})
		.then((document) => {
			this.setState({document: document});
		});
	}
	*/
	componentDidMount(){
		this.setState({
			id: '1',
			subject: '부산고등법원 2012.9.4. 선고 2011나9075 판결',
			content: '내용임',
			uid: '4',
			created: '1478910982',
			f1: '1',
			f3: '법원',
			f4: '사건번호',
			f5: '판사',
			f6: '검사',
			f7: '변호사',
			f8: ['7'],
			f10: {year: '2016', month: '1'},
			f11: '32',
			f13: '호득',
			f14: '1기',
			f15: 'example@email.net',
			f16: '010-1234-1234',
			f17: {fid: 7, filename: '베가본드_2_1_2.jpg', filepath: '/attach/2016/11/베가본드_2_1_2.jpg', mimetype: 'image/jpeg'},
			f18: [{fid: 8, filename: '테스트_문서_1_2_3_4.pdf', filepath: '/attach/2016/11/테스트_문서_1_2_3_4.pdf', mimetype: 'application/pdf'}]
		});
	}
	images(field){
		let paths = [];
		if(field.multiple == '1'){
			this.state['f'+field.fid].forEach((img) => {
				paths.push('/files'+img.filelpath);
			});
		} else {
			paths.push('/files'+this.state['f'+field.fid].filepath);
		}
		return <ImageWrap paths={paths} />
	}
	date(field){
		let date;
		if(field.multiple == '1'){
			date = this.state['f'+field.fid].map((d) => func.displayDate(d));
		} else {
			date = [func.displayDate(this.state['f'+field.fid])];
		}
		return (
			<Row>
				<Column className="table__label">{field.subject}</Column>
				<Column>{date.join(', ')}</Column>
			</Row>
		);
	}
	files(field){
		let files;
		if(field.multiple == '1'){
			files = this.state['f'+field.fid].map((file) => ({name: file.filename, path: file.filepath}));
		} else {
			files = [{name: this.state['f'+filed.fid].filename, path: this.state['f'+filed.fid].filepath}];
		}
		let fileList = files.map((file, i) => (
			<li key={i}>
				<span>{(i+1)+'.'}</span>
				<a href={'/files'+file.path} target="_blank">{file.name}</a>
			</li>
		));
		return (
			<Row>
				<Column className="table__lable">다운로드</Column>
				<Column><ul>{fileList}</ul></Column>
			</Row>
		);
	}
	inHeader(field){
		switch(field.type){
			case 'image':
				return this.images(field);
			case 'date':
				return this.date(field);
			case 'file':
				return this.files(field);
		}
	}
	inContent(field){

	}
	render(){
		if(this.state == null) return null;
		let title;
		let inHeader = {subject: null, image: null, file: null, date: null};
		let inContent = [];
		this.props.documentFormData.fields.forEach((field) => {
			let fid = (field.fid > 0 ? 'f'+field.fid : field.fid);
			if(fid == 'subject'){
				title = this.state.subject;
			}
			else if(field.type == 'image' || field.type == 'file' || field.type == 'date'){
				inHeader[field.type] = this.inHeader(field);
			}
			else if(field.type != 'group'){
				inContent[field.idx] = this.inContent(field);
			}
		});
		return (
			<div className="document">
				<div>이전 페이지로</div>
				<div className="document__wrap">
					<div className="document__header">
						{inHeader.image}
						<h1>{title}</h1>
						<div>
							<button type="button">북마크</button>
							<button type="button">수정하기</button>
						</div>
						<Table>
							{inHeader.date}
							{inHeader.file}
						</Table>
					</div>
					<Table>

					</Table>
				</div>
			</div>
		);
	}
}
Document.propTypes = {
	userData: PropTypes.object,
	documentFormData: PropTypes.object,
	documentFormOptions: PropTypes.object,
	apiUrl: PropTypes.string,
	openedDocuments: PropTypes.object
};

export default Document;

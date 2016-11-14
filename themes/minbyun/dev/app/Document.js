import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import update from 'react-addons-update';  // for update()
import 'babel-polyfill'; // for update(), find(), findIndex() ...
import FieldsInHeader from './document/FieldsInHeader';
import FieldsInContents from './document/FieldsInContents';
import Table from './table/Table';
import Row from './table/Row';
import Column from './table/Column';
import func from './functions';

class Document extends Component {
	constructor(){
		super();
		this.state = null;
	}

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
			console.log(document);
			this.setState({document: document});
		});
	}

	/*
	componentDidMount(){
		this.setState({
			id: '1',
			subject: '부산고등법원 2012.9.4. 선고 2011나9075 판결',
			content: '내부적으로는 박 대통령이 두 차례에 걸쳐 사과하고 특검까지 수용 의사를 밝혔고 청와대 개편에 이어 국회 추천 총리를 수용하겠다고 했음에도 퇴진 요구가 분출되고 있는 것에 대해 답답해하는 목소리도 들린다.',
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
	*/
	render(){
		if(this.state == null) return null;

		let hiddenFields = [];
		for(let fid in this.props.documentFormOptions.actionShowInfo){
			let info = this.props.documentFormOptions.actionShowInfo[fid];
			let value =this.state['f'+fid];
			if(value != info.term) hiddenFields.push(info.field);
		}

		let fieldsInHeader = {image: null, file: null, date: null};
		let fieldsInContents = [];
		this.props.documentFormData.fields.forEach((field) => {
			if(hiddenFields.indexOf(field.fid) < 0){
				if(field.type == 'image' || field.type == 'file' || field.type == 'date'){
					fieldsInHeader[field.type] = <FieldsInHeader field={field} document={this.state} />
				}
				else if(field.fid != 'subject' && field.parent == '0'){
					fieldsInContents[field.idx] = (
						<FieldsInContents key={field.fid} field={field}
							formData={this.props.documentFormData}
							document={this.state}
						/>
					);
				}
			}
		});
		return (
			<div className="document">
				<div>이전 페이지로</div>
				<div className="document__wrap">
					<div className="document__header">
						{fieldsInHeader.image}
						<div className={(fieldsInHeader.image ? 'document__column' : '')}>
							<h1>{this.state.subject}</h1>
							<div className="document__buttons">
								<button type="button"><i className="pe-7f-bookmarks pe-va"></i>{' '}북마크</button>
								<button type="button">수정하기</button>
							</div>
							<Table>
								{fieldsInHeader.date}
								{fieldsInHeader.file}
							</Table>
						</div>
					</div>
					<Table className="document__contents">
						{fieldsInContents}
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

import React, {Component, PropTypes, cloneElement} from 'react';
import {Link, withRouter} from 'react-router';
import Form from '../accessories/docManager/Form';
import {SCREEN} from '../constants';
import update from 'react-addons-update';
import api from '../api/dlDbApi';
import {extracFileData, makeDocFormData, makeFileFormData, checkIfParsing, doAfterReceiveParseState, getFilesAfterUpload
} from '../fieldData/docFieldData';
import {_forIn, _isEmpty, _mapOO, _isCommon} from '../accessories/functions';

class DocumentForm extends Component {
	constructor(){
		super();
		this.intvOfRqstParseState = undefined;
	}
	componentDidMount(){
		if(!_isCommon(this.props.role, ['administrator', 'write'])){
			this.props.showMessage('권한이 없습니다.', () => this.props.router.goBack()); return null;
		}
		this.initailize();
	}
	componentDidUpdate(prevProps){
		if(prevProps.params.id != this.props.params.id){
			this.initailize();
		}
		if(!this.intvOfRqstParseState){
			if(checkIfParsing(this.props.doc, this.props.fData)) this.rqstParseState();
		}
	}
	componentWillUnmount(){
		clearInterval(this.intvOfRqstParseState);
	}
	initailize(){
		const id = this.props.params.id;
		if(id){
			if(this.props.openDocs[id]){
				this.props.onChange({mode: 'merge', value: this.props.openDocs[id]});
			} else {
				this.props.fetchDoc(id, () => {
					this.props.onChange({mode: 'merge', value: this.props.openDocs[id]});
				});
			}
		} else {
			this.props.onChange({mode: 'merge', value: this.props.fData.empty});
		}
		if(!this.intvOfRqstParseState) clearInterval(this.intvOfRqstParseState);
		this.intvOfRqstParseState = undefined;
		this.props.initialize();
	}
	rqstParseState(){
		this.intvOfRqstParseState = setInterval(() => {
			this.props.fetchParseState({
				docId: this.props.doc.id,
				afterReceive: (state) => {
					let {isInProgress, filesWithNewStatus} = doAfterReceiveParseState(state, this.props.parseState, this.props.doc, this.props.fData);
					this.props.setParseState(state);
					if(filesWithNewStatus) this.props.renewFileStatus({docId: this.props.doc.id, filesWithNewStatus});
					if(!isInProgress){
						clearInterval(this.intvOfRqstParseState);
						this.intvOfRqstParseState = undefined;
						this.props.initParseState();
					}
				}
			});
		}, 3000);
	}
	customize(){ return {
		rowsBeforeSlug: (this.props.window.width > SCREEN.sMedium ?
			{
				title: <tr><td></td><td><h2>필수입력사항</h2></td></tr>,
				tag: <tr><td></td><td><h2>선택입력사항</h2></td></tr>
			} :
			{
				title: <tr><td><h2>필수입력사항</h2></td></tr>,
				tag: <tr><td><h2>선택입력사항</h2></td></tr>
			}
		),
		checkHiddenBySlug: {
			trial: (slug) => {
				let doctype = this.props.fData.terms[this.props.doc.doctype].slug;
				return ((doctype == 'sentencing' || doctype == 'writing') ? false : true)
			},
			sentence: (slug) => {
				let doctype = this.props.fData.terms[this.props.doc.doctype].slug;
				return (doctype == 'sentencing' ? false : true);
			}
		},
		renderFormBySlug: {
			content: (fs, index, value, formElem) => cloneElement(formElem, {displayCount: true, message: <span>&nbsp;</span>}),
			sentence: (fs, index, value, formElem) => cloneElement(formElem, {placeholder: '2015-12-07'}),
			tag: (fs, index, value, formElem) => cloneElement(formElem, {rows: 2}),
			name: (fs, index, value ,formElem) => cloneElement(formElem, {
				onSearch: (keyword, callback) => {
					this.props.onSearchMember({keyword, afterSearch: (members) => {
						callback(members.map((member) => (
							{name: member.name, class: member.class, email: member.email, phone: member.phone}
						)));}
					});
				},
				onChange: (value) => (typeof value === 'object' ?
					this.props.onChange({mode: 'merge', value}) :
					this.props.onChange({mode: 'set', fSlug: fs, value})
				)
			})
		},
		renderFormByType: {
			image: (fs, index, value, formElem) => cloneElement(formElem, {accept: '.jpg, .jpeg, .png'}),
			file: (fs, index, value, formElem) => cloneElement(formElem, {accept: '.pdf, .doc, .docx, .hwp'})
		},
		fieldFooterBySlug: {
			tag: <div className="docform__field-footer"><span>쉼표로 구분해주세요.</span></div>,
			image: <div className="docform__field-footer"><span>파일형식: jpg, png</span></div>,
			file: (
				<div className="docform__field-footer">
					<div><span>파일형식: pdf, doc, docx, hwp</span></div>
					<div><span>민변 디지털도서관은 첨부파일의 내용을 자동으로 추출하여 검색할 수 있습니다. 다만, 한글(hwp) 파일의 경우 자체 암호화로 내용 검색이 불가능하므로 가능한 'PDF' 파일로 변환하여 주시기를 권장합니다(방법: 파일 &rarr; PDF로 저장하기).</span></div>
				</div>
			)
		},
		afterSubmitBtn: ( this.props.doc.id > 0 ?
			<Link tabIndex="0" className="docform__view-doc" to={'/document/'+this.props.doc.id}>보기</Link> : null
		)
	}}
	handleSubmit(error){
		if(error){
			this.props.showMessage(error.message, () => this.props.focusIn(error.fSlug, error.index));
		} else {
			const [paramId, doc, fData] = [this.props.params.id, this.props.doc, this.props.fData];
			let oldDoc = (paramId ? this.props.openDocs[paramId] : fData.empty);
			let files = extracFileData(doc, fData);
			let oldFiles = extracFileData(oldDoc, fData);
			let docFormData = makeDocFormData(doc, fData);
			let fileFormData = makeFileFormData(doc, fData);
			this.props.onSubmit({
				doc,  oldDoc, files, oldFiles, docFormData, fileFormData,
				isAdmin: _isCommon(this.props.role, ['administrator']),
				afterUpload: (docId, files) => {
					this.props.onChange({mode: 'merge', value: getFilesAfterUpload(files, this.props.doc, this.props.fData)});
				}
			});
		}
	}
	render(){
		let className = (this.props.doc.id > 0 ? 'docform--edit' : 'docform--new');
		let title = (this.props.doc.id > 0 ? '자료 수정하기' : '자료 입력하기');
		let submitLabel = (this.props.doc.id > 0 ? '수정' : '등록');
		let fieldData = update(this.props.fData, {fProps: {
			name: {form: {$set: 'search'}}, sentence: {type: {$set: 'date'}}
		}});
		return (
			<div className={'docform '+className}>
				<h1>{title}</h1>
				<table className="docform__form-wrap"><tbody>
					<tr>
						<td className="table-margin"></td>
						<td>
							<Form
								doc={this.props.doc}
								fieldData={fieldData}
								focused={this.props.focused}
								isSaving={this.props.isSaving}
								submitLabel={submitLabel}
								widthToChangeOneCol={SCREEN.sMedium}
								window={this.props.window}
								parseState={this.props.parseState}
								onChange={this.props.onChange}
								onBlur={this.props.onBlur}
								onSubmit={this.handleSubmit.bind(this)}
								{...this.customize()}
							/>
						</td>
						<td className="table-margin"></td>
					</tr>
				</tbody></table>
			</div>
		);
	}
}
DocumentForm.propTypes = {
	role: PropTypes.arrayOf(PropTypes.string).isRequired,
	fData: PropTypes.object.isRequired,
	doc: PropTypes.object.isRequired,
	openDocs: PropTypes.object.isRequired,
	focused: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	parseState: PropTypes.object.isRequired,
	window: PropTypes.object.isRequired,
	initialize: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	focusIn: PropTypes.func.isRequired,
	fetchDoc: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	fetchParseState: PropTypes.func.isRequired,
	setParseState: PropTypes.func.isRequired,
	initParseState: PropTypes.func.isRequired,
	renewFileStatus: PropTypes.func.isRequired,
	onSearchMember: PropTypes.func.isRequired,
	router: PropTypes.shape({
		push: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired
	}).isRequired
};
export default withRouter(DocumentForm);

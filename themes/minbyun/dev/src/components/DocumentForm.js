import React, {Component, PropTypes, cloneElement} from 'react';
import Form from '../accessories/docManager/Form';
import {SCREEN} from '../constants';
import update from 'react-addons-update';
import api from '../api/dlDbApi';
import {extracFileData, makeDocFormData, makeFileFormData, extractFileStatusFromOrigin, makeInitParseState} from '../fieldData/docFieldData';
import {_forIn, _isEmpty, _mapOO} from '../accessories/functions';

class DocumentForm extends Component {
	componentDidMount(){
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
		this.props.focusIn('title');
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
					api.fetchData('get', '/api/members?q='+encodeURIComponent(keyword), ({members}) => {
						callback(members.map((member) => (
							{name: member.name, class: member.class, email: member.email, phone: member.phone}
						)));
					});
				},
				onChange: (value) => (typeof value === 'object' ?
					this.props.onChange({mode: 'merge', value}) :
					this.props.onChange({mode: 'set', fSlug: fs, value})
				)
			})
		},
		renderFormByType: {
			image: (fs, index, value, formElem) => cloneElement(formElem, {accept: '.jpg, .png'}),
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
		}
	}}
	handleSubmit(error){
		if(error){
			this.props.showMessage(error.message, () => this.props.focusIn(error.fSlug, error.index));
		} else {
			//저장하는 동안 갱신된 내용이 있을 수 있기 때문에, 메타 데이터를 제외한 저장 결과를 반영해서는 안된다.
			const [paramId, doc, fData] = [this.props.params.id, this.props.doc, this.props.fData];
			let oldDoc = (paramId ? this.props.openDocs[paramId] : fData.empty);
			let files = extracFileData(doc, fData);
			let oldFiles = extracFileData(oldDoc, fData);
			let docFormData = makeDocFormData(doc, fData);
			let fileFormData = makeFileFormData(doc, fData);
			this.props.onSubmit({doc,  oldDoc, files, oldFiles, docFormData, fileFormData,
				afterUpload: (docId) => this.props.onChange({mode: 'merge', value: this.props.openDocs[docId]})
			});
		}
	}
	render(){
		let title = (this.props.doc.id > 0 ? '자료 수정하기' : '자료 입력하기');
		let submitLabel = (this.props.doc.id > 0 ? '수정' : '등록');
		let fieldData = update(this.props.fData, {fProps: {name: {form: {$set: 'search'}}}});
		return (
			<div className="docform">
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
								fetchParseState={this.props.fetchParseState}
								setParseState={this.props.setParseState}
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
	fData: PropTypes.object.isRequired,
	doc: PropTypes.object.isRequired,
	openDocs: PropTypes.object.isRequired,
	focused: PropTypes.object.isRequired,
	isSaving: PropTypes.bool,
	window: PropTypes.object.isRequired,
	parseState: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	focusIn: PropTypes.func.isRequired,
	fetchDoc: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	fetchParseState: PropTypes.func.isRequired,
	setParseState: PropTypes.func.isRequired
};
export default DocumentForm;

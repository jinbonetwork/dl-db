import React, {Component, PropTypes, cloneElement} from 'react';
import FormElem from './FormElem';
import Item from '../Item';
import {_mapO, _mapAO, _mapOO, _forIn, _wrap, _isEmpty, _isEmailValid, _isPhoneValid, _isDateValid} from '../functions';

class Form extends Component {
	isHidden(fs){
		if(!fs) return false;
		return (this.props.checkHiddenBySlug[fs] ? this.props.checkHiddenBySlug[fs](fs) : false);
	}
	checkValidOnSubmit(){
		for(let fs in this.props.doc){
			const value = this.props.doc[fs];
			const fProp = this.props.fieldData.fProps[fs];
			if(fProp.type == 'meta' || fProp.type == 'group' || this.isHidden(fs) || this.isHidden(fProp.parent)) continue;
			if(fProp.required && _isEmpty(value)){
				return {
					fSlug: fs, index: (fProp.multiple ? 0 : undefined),
					message: fProp.dispName+'을(를) 입력하세요.'
				};
			}
			const arrVal = (fProp.multiple ? value : [value]);
			for(let idx in arrVal){
				if(arrVal[idx] && (
					(fProp.type == 'email' && !_isEmailValid(arrVal[idx])) ||
					(fProp.type == 'phone' && !_isPhoneValid(arrVal[idx])) ||
					(fProp.type == 'date' && !_isDateValid(arrVal[idx], fProp.form)) ||
					(this.props.checkValidOnSubmitBySlug[fs] && !this.props.checkValidOnSubmitBySlug[fs](fs, arrVal[idx])) ||
					(this.props.checkValidOnSubmitByType[fProp.type] && !this.props.checkValidOnSubmitByType[fProp.type](fs, arrVal[idx]))
				)){
					let message = (this.props.errorMessageBySlug[fs] ?
						this.props.errorMessageBySlug[fs] :
						fProp.dispName+'의 형식이 적합하지 않습니다.'
					);
					return {
						fSlug: fs, index: (fProp.multiple ? idx : undefined),
						message: message
					};
				}
			}
		}
	}
	handleClick(which, fSlug, index){
		const {empty, fProp} = this.props.fieldData;
		if(which == 'add'){
			this.props.onChange({mode: 'push', fSlug, value: empty[fSlug][0]});
		}
		else if(which == 'delete'){
			if(index === undefined){
				this.props.onChange({mode: 'set', fSlug, index, value: empty[fSlug]});
			} else {
				if(index === 0 && this.props.doc[fSlug].length == 1){
					this.props.onChange({mode: 'set', fSlug, index, value: empty[fSlug][0]});
				} else {
					this.props.onChange({mode: 'delete', fSlug, index});
				}
			}
		}
	}
	handleSubmit(){
		this.props.onSubmit(this.checkValidOnSubmit());
	}
	handleChange(fSlug, index, value){
		if(fSlug){
			const type = this.props.fieldData.fProps[fSlug].type;
			if(	(!this.props.checkValidBySlug[fSlug] || this.props.checkValidBySlug[fSlug](fSlug, value)) &&
				(!this.props.checkValidByType[type] || this.props.checkValidByType[type](fSlug, value))
			){
				this.props.onChange({mode: 'set', fSlug, index, value});
			}
		}
	}
	handKeyDown(which, arg1st){
		if(which == 'submit'){
			if(arg1st.key == 'Enter') this.handleSubmit();
		}
	}
	getParseState(fProp, value){
		if(	(fProp.type == 'file' && ['uploading', 'uploaded', 'parsing'].indexOf(value.status) >= 0) ||
			(fProp.type == 'image' && value.status == 'uploading')
		){
			let state = this.props.parseState[value.fid];
			if(state) return <span>{state.progress + '%'}</span>;
			else return <span>업로드중</span>;
		}
		else {
			return undefined;
		}
	}
	renderForm(fs, value, index, fProp){
		let parseState = this.getParseState(fProp, value);
		let options = (fProp.type == 'taxonomy' ?  this.props.fieldData.taxonomy[fs].map((tid) =>
			<Item key={tid} value={tid}><span>{this.props.fieldData.terms[tid].name}</span></Item>
		) : undefined);
		const formElem = (
			<FormElem
				value={value} type={fProp.type} form={fProp.form} index={index}
				focus={(this.props.focused.fSlug == fs && this.props.focused.index == index)}
				fProp={this.props.fieldData.fProps[fs]}
				options={options}
				disabled={(parseState ? true : false)}
				parseState={parseState}
				onChange={this.handleChange.bind(this, fs, index)}
				onBlur={this.props.onBlur}
			/>
		);
		if(this.props.renderFormBySlug[fs]){
			return this.props.renderFormBySlug[fs](fs, index, value, formElem);
		}
		else if(this.props.renderFormByType[fProp.type]){
			return this.props.renderFormByType[fProp.type](fs, index, value, formElem);
		} else {
			return formElem;
		}
	}
	renderField(fs, value, fProp){
		if(fProp.type != 'group'){
			const fieldBody = _wrap(() => {
				if(fProp.multiple){ return value.map((val, idx) => (
					<div key={idx} className="field-body">
						<div className="field-body__content">{this.renderForm(fs, val, idx, fProp)}</div>
						<div className="field-body__buttons">
							<button onClick={this.handleClick.bind(this, 'add', fs)}>{this.props.addButtonIcon}</button>
							<button style={(this.getParseState(fProp, val) ? {visibility: 'hidden'} : null)}
								onClick={this.handleClick.bind(this, 'delete', fs, idx)}
							>
								{this.props.deleteButtonIcon}
							</button>
						</div>
					</div>
				));}
				else if(fProp.form == 'file'){ return (
					<div className="field-body">
						<div className="field-body__content">{this.renderForm(fs, value, undefined, fProp)}</div>
						<div className="field-body__buttons">
							<button style={(this.getParseState(fProp, value) ? {visibility: 'hidden'} : null)}
								onClick={this.handleClick.bind(this, 'delete', fs)}
							>
								{this.props.deleteButtonIcon}
							</button>
						</div>
					</div>
				);} else {
					return this.renderForm(fs, value, undefined, fProp);
				}
			});
			return (
				<div className="field-content">
					{fieldBody}
					{(this.props.fieldFooterByType[fProp.type] ? this.props.fieldFooterByType[fProp.type] : null)}
					{(this.props.fieldFooterBySlug[fs] ? this.props.fieldFooterBySlug[fs] : null)}
				</div>
			);
		} else {
			return this.renderTable(_mapAO(fProp.children, (cfs) => this.props.doc[cfs]), true);
		}
	}
	renderTable(doc, isChild){
		const {fSlug, fProps} = this.props.fieldData;
		const isOneCol = (this.props.window.width <= this.props.widthToChangeOneCol);
		const rows = [];
		_forIn(doc, (fs, value) => {
			let isRendered = (
				fProps[fs].type != 'meta' && (isChild ? true : !fProps[fs].parent) &&
				!this.isHidden(fs) && !this.isHidden(fProps[fs].parent)
			);
			if(isRendered){
				if(this.props.rowsBeforeSlug[fs]) rows.push(cloneElement(this.props.rowsBeforeSlug[fs], {key: 'before '+fs}));
				let className = [
					'form__field form__slug-'+fs,
					'form__type-'+fProps[fs].type,
					'form__'+(fProps[fs].required ? 'required' : 'elective')
				].join(' ');
				let firstCol = <span>{fProps[fs].dispName}</span>;
				let secondCol = this.renderField(fs, value, fProps[fs]);
				rows.push(
					<tr key={fs} className={className}>{( !isChild && isOneCol ?
						<td><div className="form__col0">{firstCol}</div><div className="form__col1">{secondCol}</div></td> :
						[<td key="0" className="form__col0">{firstCol}</td>, <td key="1" className="form__col1">{secondCol}</td>]
					)}</tr>
				);
			}
		});
		const submitButton = (!isChild) && (
			<tr className="form__submit-wrap">
				<td colSpan={(!isOneCol ? 2 : null)}>
					{(this.props.beforeSubmitBtn ? this.props.beforeSubmitBtn : null)}
					{!this.props.isSaving && (
						<a tabIndex="0" className="form__submit" onClick={this.handleSubmit.bind(this)}
							onKeyDown={this.handKeyDown.bind(this, 'submit')}
						>
							{this.props.submitLabel}
						</a>
					)}
					{this.props.isSaving && (
						<span className="form__saving">
							<span className="form__saving-label">{this.props.submitSavingLabel}</span>
							<span className="form__saving-icon">{this.props.savingStateIcon}</span>
						</span>
					)}
					{(this.props.afterSubmitBtn ? this.props.afterSubmitBtn : null)}
				</td>
			</tr>
		);
		const className = (isChild ? 'form__inner-table' : 'form');
		return (
			<table className={className}><tbody>
				{!isChild && this.props.rowsBefore}
				{rows}
				{!isChild && this.props.rowsAfter}
				{submitButton}
			</tbody></table>
		);
	}
	render(){
		return this.renderTable(this.props.doc);
	}
}
Form.propTypes = {
	doc: PropTypes.object.isRequired,
	fieldData: PropTypes.object.isRequired,
	focused: PropTypes.shape({
		fSlug: PropTypes.string, index: PropTypes.number
	}).isRequired,
	submitLabel: PropTypes.string,
	submitSavingLabel: PropTypes.string,
	isSaving: PropTypes.bool,
	widthToChangeOneCol: PropTypes.number,
	window: PropTypes.object,
	parseState: PropTypes.object,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	// For customization ////
	rowsBefore: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	rowsAfter: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	rowsBeforeSlug: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])),
	addButtonIcon: PropTypes.element,
	deleteButtonIcon: PropTypes.element,
	savingStateIcon: PropTypes.element,
	fieldFooterBySlug: PropTypes.objectOf(PropTypes.element),
	fieldFooterByType: PropTypes.objectOf(PropTypes.element),
	checkValidBySlug: PropTypes.objectOf(PropTypes.func),
	checkValidByType: PropTypes.objectOf(PropTypes.func),
	checkValidOnSubmitBySlug: PropTypes.objectOf(PropTypes.func),
	checkValidOnSubmitByType: PropTypes.objectOf(PropTypes.func),
	checkHiddenBySlug: PropTypes.objectOf(PropTypes.func),
	renderFormBySlug: PropTypes.objectOf(PropTypes.func),
	renderFormByType: PropTypes.objectOf(PropTypes.func),
	errorMessageBySlug: PropTypes.objectOf(PropTypes.string),
	beforeSubmitBtn: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	afterSubmitBtn: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
};
Form.defaultProps = {
	widthToChangeOneCol: 500,
	window: {width: 600, height: 0},
	addButtonIcon: <i className="pe-7s-plus pe-va"></i>,
	deleteButtonIcon: <i className="pe-7s-close-circle pe-va"></i>,
	savingStateIcon: <i className="pe-7s-config pe-va pe-spin"></i>,
	submitLabel: '저장',
	submitSavingLabel: '저장',
	parseState: {},
	rowsBeforeSlug: {},
	checkValidBySlug: {},
	checkValidByType: {},
	checkValidOnSubmitBySlug: {},
	checkValidOnSubmitByType: {},
	checkHiddenBySlug: {},
	renderFormBySlug: {},
	renderFormByType: {},
	errorMessageBySlug: {},
	fieldFooterBySlug: {},
	fieldFooterByType: {}
};

export default Form;

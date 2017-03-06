import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import ViewElem from './ViewElem';
import {_mapO, _mapAO, _isEmpty} from '../functions';

class View extends Component {
	/*
	getParseState(fProp, value){
		if(	(fProp.type == 'file' && ['uploading', 'uploaded', 'parsing'].indexOf(value.status) >= 0) ||
			(fProp.type == 'image' && value.status == 'uploading')
		){
			let state = this.props.parseState[value.fid];
			if(state) return state.progress + '%';
			else return '업로드중';
		}
		else {
			return undefined;
		}
	}
	*/
	renderValue(value, fProp, fs){
		const fData = this.props.fieldData;
		if(this.props.renderValueBySlug[fs]){
			return this.props.renderValueBySlug[fs](fs, value);
		}
		else if(this.props.renderValueByType[fProp.type]){
			return this.props.renderValueByType[fProp.type](fs, value);
		} else {
			if(fProp.type != 'group'){
				return (
					<ViewElem value={(fProp.multiple ? value : [value])} type={fProp.type} form={fProp.form}
						owner={this.props.owner} role={this.props.role} terms={this.props.fieldData.terms} fileTextUri={this.props.fileTextUri}
						parseState={this.props.parseState}
					/>
				);
			} else {
				let childDoc = _mapAO(fProp.children, (cfs) => this.props.doc[cfs]);
				if(!_isEmpty(childDoc)){
					return this.renderTable(childDoc, true);
				} else {
					return null;
				}
			}
		}
	}
	renderTable(doc, isChild){
		const isOneCol = (this.props.window.width <= this.props.widthToChangeOneCol);
		const {fSlug, fProps} = this.props.fieldData;
		const rows = _mapO(doc, (fs, value) => {
			if((!_isEmpty(value) || fProps[fs].type == 'group') && fProps[fs].type != 'meta' && (isChild ? true : !fProps[fs].parent)){
				if(!this.props.checkHiddenBySlug[fs] || !this.props.checkHiddenBySlug[fs](fs, value)){
					let renderedValue = this.renderValue(value, fProps[fs], fs);
					return ( renderedValue &&
						<tr key={fs} className={'view__field view__slug-'+fs+' view__type-'+fProps[fs].type}>{(
							!isChild && isOneCol ?
							<td>
								<div className="view__col0">{fProps[fs].dispName}</div>
								<div className="view__col1">{renderedValue}</div>
							</td> :
							[
								<td key="0" className="view__col0">{fProps[fs].dispName}</td>,
								<td key="1" className="view__col1">{renderedValue}</td>
							]
						)}</tr>
					)
				}
			}
		});
		const className = (isChild ? 'view__inner-table' : 'view');
		return (
			<table className={className}><tbody>
				{!isChild && this.props.rowsBefore}
				{rows}
				{!isChild && this.props.rowsAfter}
			</tbody></table>
		);
	}
	render(){
		return this.renderTable(this.props.doc);
	}
}
View.propTypes = {
	doc: PropTypes.object.isRequired,
	fieldData: PropTypes.object.isRequired,
	role: PropTypes.arrayOf(PropTypes.string),
	fileTextUri: PropTypes.string,
	parseState: PropTypes.object,
	widthToChangeOneCol: PropTypes.number,
	window: PropTypes.object,
	//customization ////
	rowsBefore: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	rowsAfter: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	renderValueBySlug: PropTypes.object,
	renderValueByType: PropTypes.object,
	checkHiddenBySlug: PropTypes.object
};
View.defaultProps = {
	widthToChangeOneCol: 500,
	window: {width: 600, height: 0},
	renderValueBySlug: {},
	renderValueByType: {},
	checkHiddenBySlug: {},
	fileTextUri: '',
	parseState: {}
};

export default View;

import React, {Component, PropTypes} from 'react';
import {_mapO, _mapAO, _isEmpty} from '../functions';

class View extends Component {
	renderValue(value, fProp, fs){
		const fData = this.props.fieldData;
		if(this.props.renderValueBySlug[fs]){
			return this.props.renderValueBySlug[fs](fs, value);
		}
		else if(this.props.renderValueByType[fProp.type]){
			return this.props.renderValueByType[fProp.type](fs, value);
		} else {
			switch(fProp.type){
				case 'taxonomy':
					if(!fProp.multiple) value = [value];
					const taxo = [];
					value.forEach((v) => {
						let term = fData.terms[v];
						if(term) taxo.push(term.name);
					});
					if(taxo.length) return <span>{taxo.join(', ')}</span>;
					else return null;
				case 'char': case 'email': case 'phone': case 'date':
					if(!fProp.multiple) value = [value];
					if(fProp.form !== 'textarea'){
						return <span>{value.join(', ')}</span>;
					} else{
						let texts = [];
						value.map((text, i) => { if(text){
							text = text.split(/\n/).map((t, j) => <div key={j}><span>{t}</span></div>);
							texts.push(<div key={i}>{text}</div>);
						}});
						if(texts.length) return texts;
						else return null;
					}
				case 'tag':
					if(value){
						const tags = value.split(',').map((v) => '#'+v.trim());
						return <span>{tags.join(' ')}</span>;
					} else {
						return null;
					}
				case 'group':
					return this.renderTable(_mapAO(fProp.children, (fs) => this.props.doc[fs]), true);
				default:
					console.error(fProp.type + '은/는 적합한 type이 아닙니다');
					return null;
			}
		}
	}
	renderTable(doc, isChild){
		const {fSlug, fProps} = this.props.fieldData;
		const rows = _mapO(doc, (fs, value) => {
			if(!_isEmpty(value) && fProps[fs].type != 'meta' && (isChild ? true : !fProps[fs].parent)){
				if(!this.props.checkHiddenBySlug[fs] || !this.props.checkHiddenBySlug[fs](fs, value)){
					let renderedValue = this.renderValue(value, fProps[fs], fs);
					return ( renderedValue &&
						<tr key={fs} className={'view-table__field-'+fs}>
							<td>{fProps[fs].dispName}</td>
							<td>{renderedValue}</td>
						</tr>
					)
				}
			}
		});
		const className = (isChild ? 'view-table__inner-table' : 'view-table');
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
	rowsBefore: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	rowsAfter: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
	//customization ////
	renderValueBySlug: PropTypes.object,
	renderValueByType: PropTypes.object,
	checkHiddenBySlug: PropTypes.object
};
View.defaultProps = {
	renderValueBySlug: {},
	renderValueByType: {},
	checkHiddenBySlug: {}
};

export default View;

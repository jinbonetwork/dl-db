import React, {Component, PropTypes} from 'react';
import TextInput from '../TextInput';
import Textarea from '../Textarea';
import FileInput from '../FileInput';
import Select from '../Select';
import Check from '../Check';
import DateForm from '../DateForm';
import SearchInput from '../SearchInput';
import {_mapAO} from '../functions';

class FormElem extends Component {
	render(){
		switch(this.props.form){
			case 'text':
				return (
					<TextInput
						type={this.props.type} value={this.props.value} focus={this.props.focus} placeholder={this.props.placeholder}
						onChange={this.props.onChange} onBlur={this.props.onBlur}
					/>
				);
			case 'file':
				return (
					<FileInput
						value={this.props.value.name || this.props.value.filename} focus={this.props.focus} accept={this.props.accept}
						disabled={this.props.disabled} parseState={this.props.parseState} onChange={this.props.onChange}
						onBlur={this.props.onBlur}
					/>
				);
			case 'select':
				return (
					<Select selected={this.props.value} onChange={this.props.onChange}>
						{this.props.options}
					</Select>
				);
			case 'radio':
				return (
					<Check
						type="radio" selected={this.props.value} onChange={this.props.onChange}
						checkIcon={<i className="pe-7f-check pe-va"></i>} uncheckIcon={<i className="pe-7s-less pe-va"></i>}
					>
						{this.props.options}
					</Check>
				);
			case 'check':
				return (
					<Check
						type="check" selected={this.props.value} onChange={this.props.onChange}
						checkIcon={<i className="pe-7f-check pe-va"></i>} uncheckIcon={<i className="pe-7s-check pe-va"></i>}
					>
						{this.props.options}
					</Check>
				);
			case 'Ym':
				return (
					<DateForm
						value={this.props.value} focus={this.props.focus}
						onChange={this.props.onChange} onBlur={this.props.onBlur}
					/>
				)
			case 'textarea':
				return (
					<Textarea
						value={this.props.value} focus={this.props.focus} message={this.props.message}
						displayCount={this.props.displayCount} rows={this.props.rows}
						onChange={this.props.onChange} onBlur={this.props.onBlur}
					/>
				);
			case 'search':
				return (
					<SearchInput value={this.props.value} focus={this.props.focus} resultSlugs={this.props.resultSlugs}
						onChange={this.props.onChange} onBlur={this.props.onBlur} onSearch={this.props.onSearch}
					/>
				);
			default:
				console.error(this.props.form+': 적합한 form이 아닙니다.');
				return null;
		}
	}
}
FormElem.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
	type: PropTypes.string.isRequired,
	form: PropTypes.string.isRequired,
	index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	focus: PropTypes.bool,
	placeholder: PropTypes.string,
	accept: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.element),
	message: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
	displayCount: PropTypes.bool,
	rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	disabled: PropTypes.bool,
	parseState: PropTypes.element,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	onSearch: PropTypes.func
};

export default FormElem;

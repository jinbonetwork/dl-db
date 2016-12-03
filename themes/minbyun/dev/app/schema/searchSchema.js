import {_sFname, _fname} from './docSchema';
import {_isEmpty, _forIn} from '../accessories/functions';

const _period = (from, to) => {
	let period=[];
	if(!from || from == '.') period.push(''); else period.push(from);
	if(to && to != '.') period.push(to);
	period = period.map((date, index) => {
		date = date.split('.');
		date = {year: date[0], month: date[1]};
		if(date.year){if(date.year >= 1900); else date.year = '1900';}
		if(date.month){if(date.month > 0); else date.month = '';}
		if(date.month){
			if(date.month.length < 2) date.month = '0'+date.month;
		} else if(date.year) {
			if(index == 0) date.month = '01';
			else if(index == 1) date.month = '12';
		}
		return date;
	});
	if(period.length > 1){
		if((period[0].year > period[1].year) || (period[0].year == period[1].year && period[0].month > period[1].month)){
			let temp = period[0];
			period[0] = period[1];
			period[1] = temp;
		}
	}
	period = period.map((date) => (!_isEmpty(date) ? date.year+'.'+date.month : ''));
	return period;
};
const _query = (sQuery) => {
	let period = [];
	if(sQuery.from) period.push(sQuery.from); else period.push('');
	if(sQuery.to) period.push(sQuery.to);
	let query = {
		q: encodeURIComponent(sQuery.keyword),
		[_sFname['doctype']]: (sQuery.doctypes.length ? '{'+sQuery.doctypes.join(',')+'}' : ''),
		[_sFname['date']]: encodeURIComponent(period.join('-'))
	};
	return query;
};
const _searchQuery = (query, correct) => {
	let searchQuery = {keyword: '', doctypes: [], from: '', to: ''};
	let period = _searchQueryEach('period', query, correct);
	return _forIn(searchQuery, (prop, value) => {
		if(prop == 'from') return period[0];
		else if(prop == 'to') return period[1];
		else return _searchQueryEach(prop, query, correct);
	});
};
const _searchQueryEach = (prop, query, correct) => {
	let value;
	switch(prop){
		case 'keyword':
			value = query['q'];
			if(value) return decodeURIComponent(value);
			return '';
		case 'doctypes':
			value = query[_sFname['doctype']];
			let doctypes = [];
			if(value){
				value.replace('{', '').replace('}', '').split(',').forEach((dt) => {
					if(dt > 0) doctypes.push(dt);
				});
			}
			return doctypes;
		case 'period': case 'from': case 'to':
			value = query[_sFname['date']];
			let period = (value ? decodeURIComponent(value).split('-') : []);
			if(correct) period = _period(period[0], period[1]);
			if(prop == 'period'){
				if(period.length < 2) period.push('');
				return period;
			}
			else if(prop == 'from') return (period[0] ? period[0] : '');
			else if(prop == 'to') return (period[1] ? period[1] : '');
		default:
			return null;
	}
}

export {_query, _searchQuery, _searchQueryEach, _period};

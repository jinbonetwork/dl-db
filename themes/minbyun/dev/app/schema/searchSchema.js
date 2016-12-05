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
	let query = {};
	for(let prop in sQuery){ if(sQuery[prop]){
		switch(prop){
			case 'keyword': query.q = encodeURIComponent(sQuery[prop]); break;
			case 'doctypes': query[_sFname['doctype']] = (sQuery[prop].length ? '['+sQuery[prop].join(',')+']' : ''); break;
		}
	}}
	let period;
	if(sQuery.from && sQuery.to) period = sQuery.from+'-'+sQuery.to;
	else if(sQuery.from && !sQuery.to) period = sQuery.from;
	else if(!sQuery.from && sQuery.to) period = '-'+sQuery.to;
	if(period) query[_sFname['date']] = encodeURIComponent(period);

	return query;
}

const _queryOf = (propOfSQuery, query) => {
	switch(propOfSQuery){
		case 'keyword': return {q: query.q};
		case 'doctypes': return {[_sFname['doctype']]: query[_sFname['doctype']]};
		case 'period': return {[_sFname['date']]: query[_sFname['date']]};
	}
}
const _searchQuery = (query, correct) => {
	let sQuery = {};
	let value;
	for(let prop in query){ let value = query[prop]; if(value){
		if(prop == 'q'){
			if(value) sQuery.keyword = decodeURIComponent(value);
		}
		else if(_fname[prop] == 'doctype'){
			let doctypes = []
			value.replace('[', '').replace(']', '').split(',').forEach((dt) => {
				if(dt > 0) doctypes.push(dt);
			});
			if(doctypes.length) sQuery.doctypes = doctypes;
		}
		else if(_fname[prop] == 'date'){
			let period = decodeURIComponent(value).split('-');
			if(correct) period = _period(period[0], period[1]);
			sQuery.from = (period[0] ? period[0] : '');
			sQuery.to = (period[1] ? period[1] : '');
		}
	}}
	return sQuery;
};

export {_query, _queryOf, _searchQuery, _period};

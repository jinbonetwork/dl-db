import {_isEmpty} from './accessories/functions';

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
const _query = (sQuery, fID) => {
	let query = {};
	for(let prop in sQuery){ if(sQuery[prop]){
		switch(prop){
			case 'keyword': query.q = sQuery[prop]; break;
			case 'doctypes': query[fID.doctype] = (sQuery[prop].length ? '['+sQuery[prop].join(',')+']' : ''); break;
		}
	}}
	let period;
	if(sQuery.from && sQuery.to) period = sQuery.from+'-'+sQuery.to;
	else if(sQuery.from && !sQuery.to) period = sQuery.from;
	else if(!sQuery.from && sQuery.to) period = '-'+sQuery.to;
	if(period) query[fID['date']] = period;

	return query;
}

const _queryOf = (propOfSQuery, query, fID) => {
	switch(propOfSQuery){
		case 'keyword': return {q: query.q};
		case 'doctypes': return {[fID.doctype]: query[fID.doctype]};
		case 'period': return {[fID.date]: query[fID.date]};
	}
}
const _searchQuery = (query, fSlug, correct) => {
	let sQuery = {};
	let value;
	for(let prop in query){ let value = query[prop]; if(value){
		if(prop == 'q'){
			if(value) sQuery.keyword = value;
		}
		else if(fSlug[prop] == 'doctype'){
			let doctypes = []
			value.replace('[', '').replace(']', '').split(',').forEach((dt) => {
				if(dt > 0) doctypes.push(dt);
			});
			if(doctypes.length) sQuery.doctypes = doctypes;
		}
		else if(fSlug[prop] == 'date'){
			let period = value.split('-');
			if(correct) period = _period(period[0], period[1]);
			sQuery.from = (period[0] ? period[0] : '');
			sQuery.to = (period[1] ? period[1] : '');
		}
	}}
	return sQuery;
};

const _params = (params, fID, excepts) => {
	let array = [];
	for(let p in params){
		if(params[p] && (!excepts || !excepts.length || excepts.indexOf(p) < 0)){
			if(p == 'q' || p == fID['date']){
				array.push(p+'='+encodeURIComponent(params[p]));
			} else {
				array.push(p+'='+params[p]);
			}
		}
	}
	if(array.length) return '?'+array.join('&');
	return '';
}

export {_query, _queryOf, _searchQuery, _period, _params};

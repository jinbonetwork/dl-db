import {_mapO} from '../accessories/functions';

const _mainMenu = [
	{
		name: 'user',
		icon: 'pe-7f-user'
	},
	{
		name: 'boards',
		icon: 'pe-7s-note2'
	},
	{
		name: 'links',
		icon: 'pe-7s-star'
	},
];

const _userMenu = [
	{
		path: 'profile',
		name: '내정보',
		icon: 'pe-7s-user'
	},{
		path: 'bookmarks',
		name: '북마크',
		icon: 'pe-7s-bookmarks'
	},{
		path: 'history',
		name: '검색기록',
		icon: 'pe-7s-search'
	},{
		path: 'documents',
		name: '내가 올린 자료',
		icon: 'pe-7s-file'
	}
];

const _menuData = (data) => {
	return _mapO(data, (key, value) => {
		const items = value.sub.map((item) => { return {
			displayName: item.name,
			url: item.url
		}});
		return {
			displayName: value.name,
			items: items
		}
	});
};

export {_mainMenu, _userMenu, _menuData};

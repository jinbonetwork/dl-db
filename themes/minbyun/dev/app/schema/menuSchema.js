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
		path: '/user/profile',
		name: '내정보',
		icon: 'pe-7s-user'
	},{
		path: '/user/bookmarks',
		name: '북마크',
		icon: 'pe-7s-bookmarks'
	},{
		path: '/user/history',
		name: '검색기록',
		icon: 'pe-7s-search'
	},{
		path: '/user/documents',
		name: '내가 올린 자료',
		icon: 'pe-7s-file'
	},{
		path: '/admin',
		name: '관리',
		icon: 'pe-7s-config'
	},{
		path: '',
		name: '로그아웃',
		icon: 'pe-7s-unlock'
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

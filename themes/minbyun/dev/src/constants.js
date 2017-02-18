export const SCREEN = {
	smallest: 320,
	small: 400,
	sMedium: 600,
	medium: 800,
	mmLarge: 960,
	large: 1300
}
export const MAIN_MENU = [
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
export const USER_MENU = [
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
export const SHOW_MESSAGE = 'show message';
export const HIDE_MESSAGE = 'hide message';
export const SHOW_PROCESS = 'show process';
export const HIDE_PROCESS = 'hide process';
export const RECEIVE_USER_FIELD_DATA = 'receive user field data';
export const RECEIVE_DOC_FIELD_DATA = 'receive doc filed data';
export const SUCCEED_LOGIN = 'succeed login';
export const RECEIVE_ROOT_DATA = 'receive root data';
export const CHANGE_LOGIN = 'change login';
export const RESIZE = 'resize';
export const RECEIVE_AGREEMENT = 'receive agreement';
export const AGREE_WITH_AGREEMENT = 'agree with agreement';
export const LOGOUT = 'logout';
export const CHANGE_SEARCHBAR_STATE = 'change searchbar state';
export const CHANGE_DOCFORM = 'change docform';
export const FOCUSIN_DOCFORM = 'focusin docform';
export const FOCUSOUT_DOCFORM = 'focusout docform';
export const COMPLETE_DOCFORM = 'complete docform';
export const SUBMIT_DOCFORM = 'submit docform';
export const ADD_DOC_TO_OPEN_DOCS = 'add doc to open docs';
export const UPLOAD = 'upload';
export const RECEIVE_PARSE_STATE = 'receive parse state';
export const RENEW_FILE_STATUS = 'renew file status';
export const BOOKMARK = 'bookmark';
export const TOGGLE_DEL_DOC_BUTTON = 'toggle del doc button';
export const DELETE_DOC_IN_OPEN_DOCS = 'delete doc in open docs';
export const REQUEST_TOGGLING_PARSED_OF_FILE = 'request toggling parsed of file';
export const TOGGLE_PARSED_OF_FILE = 'toggle parsed of file';
export const RECEIVE_FILETEXT = 'receive filetext';
export const CHANGE_FILETEXT = 'change filetext';
export const ADD_FILE_TO_OPEN_FILETEXTS = 'add filename to open filetexts';
export const COMPLETE_FILETEXT = 'complete filetext';
export const SUBMIT_FILETEXT = 'submit filetext';
export const RECEIVE_USER_DOCS = 'receive user docs';
export const RECEIVE_SEARCH_RESULT = 'receive search result';
export const RECEIVE_BOOKMARKS = 'receive bookmarks';
export const RECEIVE_HISTORY = 'receive history';
export const RECEIVE_USER_PROFILE = 'receive user profile';
export const CHANGE_USER_PROFILE = 'change user profile';
export const FOCUSOUT_USER_PROFILE = 'focusout user profile';
export const FOCUSIN_USER_PROFILE = 'focusin usre profile';
export const COMPLETE_USER_PROFILE = 'complete user profile';
export const SUBMIT_USER_PROFILE = 'submit usr profile';
export const TOGGLE_PASSWORD_FORM = 'toggle password form';
export const INITIALIZE_DOC = 'initialize doc';
export const INITIALIZE_USER_PROFILE = 'initialize user profile';

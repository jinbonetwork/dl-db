import {createStore, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';
import reducers from '../reducers/index';

const adminStore = createStore(
	reducers,
	applyMiddleware(thunk)
);

export default adminStore;

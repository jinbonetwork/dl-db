import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/index';

const logger = (store) => (next) => (action) => {
	if(typeof action !== "function"){
		console.log('dispatching:', action);
	}
	return next(action);
}
const aircheapStore = createStore(
	reducers,
	applyMiddleware(logger, thunk)
);

export default aircheapStore;

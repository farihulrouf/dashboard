import {createStore, applyMiddleware} from "redux";
import notificationReducer from './notification/reducer';
import ReduxThunk from 'redux-thunk'; // no changes here 😀

const store = createStore(notificationReducer, applyMiddleware(ReduxThunk));

export default store;
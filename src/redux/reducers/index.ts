import { combineReducers } from 'redux';
import authReducer from '../feature/auth/authSlice';
import fileReducer from '../feature/spreadSheet/spreadSheetSlice';

const store =  combineReducers({
  authState: authReducer,
  spreadSheetState: fileReducer
})

export default store;

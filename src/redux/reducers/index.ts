import { combineReducers } from 'redux';
import authReducer from '../feature/auth/authSlice';
import fileReducer from '../feature/spreadSheet/spreadSheetSlice';
import schemaReducer from '../feature/schema/schemaSlice';

const store =  combineReducers({
  authState: authReducer,
  spreadSheetState: fileReducer,
  schemaState: schemaReducer
})

export default store;

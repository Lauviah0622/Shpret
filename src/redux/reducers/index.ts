import { combineReducers } from 'redux';
import authReducer from '../feature/auth/authSlice';
import fileReducer from '../feature/file/fileSlice';
import schemaReducer from '../feature/schema/schemaSlice';

const store =  combineReducers({
  authState: authReducer,
  fileState: fileReducer,
  schemaState: schemaReducer
})

export default store;

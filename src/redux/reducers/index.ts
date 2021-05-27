import { combineReducers } from 'redux';
import authReducer from '../feature/auth/authSlice';
import fileReducer from '../feature/file/fileSlice';

const store =  combineReducers({
  authState: authReducer,
  fileState: fileReducer
})

export default store;

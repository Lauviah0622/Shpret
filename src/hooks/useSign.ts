import { useSelector, useDispatch } from "react-redux";

import {createUserAction} from '../redux/feature/auth/authSlice';

import type { RootState } from '../redux/store';

import type { AuthState } from '../redux/feature/auth/authSlice';




async function gapiSignIn(): Promise<boolean> {
  try {
    const user = await gapi.auth2.getAuthInstance().signIn()
    return  user.isSignedIn()
  } catch (err) {
    console.log(err);
    return Promise.reject(false)
  }
}

async function gapiSignOut(): Promise<boolean> {
  try {
    const isSignOut = await gapi.auth2.getAuthInstance().signOut();
    console.log(isSignOut);
    return Promise.resolve(true)
  } catch (err) {
    console.log(err);
    return Promise.reject(false)
  }
}

// 這個是不是要拆成兩個 hook, 一個放在 app 的 useEffect 裡面



// 另一個給其他 Component 用
export default function useSignHook() {
  const dispatch = useDispatch();
  const signState = useSelector((store: RootState) => store.authState.isSignIn)
  
  
  const signIn = async () => {
    const isSignIn = await gapiSignIn();
    console.log('userId', isSignIn);
    dispatch(createUserAction(isSignIn))  
  }
  const signOut = async () => {
    const isSignOut = await gapiSignOut();
    dispatch(createUserAction(!isSignOut))  
  }
  
  
  return [signState, signIn, signOut] as const
};

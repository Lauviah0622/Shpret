import { CaseReducer, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";


type AuthState = {
  isSignIn: boolean
}


const initialState:AuthState = {
  isSignIn: false
}

// type 根 reducer 宣告在上面，然後再放下去
const setUser: CaseReducer<AuthState, PayloadAction<boolean>> = (state, { payload }) => {
  console.log('state', state);
  console.log('reducer', payload);
  // state 不能用 destructure???
  state.isSignIn = payload
  
}

const authSlice: Slice<AuthState> = createSlice({
  name: "authState",
  initialState,
  reducers: {
    setUser
  }
})

export const { setUser: createUserAction } = authSlice.actions;
// 給 conbine reducer 用的

export default authSlice.reducer;
export type {AuthState}



// actions creator
// 這裡應該要補宣告一下 type，之後在看看




import React, { ReactChild, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch } from "react-redux";

import usePrepareGapiHook from "./hooks/usePrepareGapi";
import store from "./redux/store";
import "./index.css";
import App from "./App/App";
import { createSigninState } from './redux/feature/auth/authSlice';


const PrepareGapi = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const updateSignStateByAuthInstance = (isSignIn:boolean) => {
    dispatch(createSigninState(isSignIn))
  }
  const gapiPrepareState = usePrepareGapiHook(updateSignStateByAuthInstance);
  return <>{gapiPrepareState ? children : null}</>;
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PrepareGapi>
        <App />
      </PrepareGapi>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

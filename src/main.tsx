import React, { ReactChild, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import usePrepareGapiHook from "./hooks/usePrepareGapi";
import store from "./redux/store";
import "./index.css";
import App from "./App/App";

const PrepareGapi = ({ children }: { children: ReactNode }) => {
  const gapiPrepareState = usePrepareGapiHook();
  return <>{gapiPrepareState ? children : null}</>;
};

ReactDOM.render(
  <React.StrictMode>
    <PrepareGapi>
      <Provider store={store}>
        <App />
      </Provider>
    </PrepareGapi>
  </React.StrictMode>,
  document.getElementById("root")
);

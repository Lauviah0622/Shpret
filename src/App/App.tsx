import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import styled from "styled-components";
import "antd/dist/antd.css";
import "antd-mobile/dist/antd-mobile.css";

import Entry from "../Pages/Entry";
import Append from "../Pages/Append";
import SelectFile from "../Pages/SelectFile";
import Signin from "../Pages/Signin";
import useSignHook from "../hooks/useSign";

const AppWrapper = styled.div`
  min-height: 100vh;
`;

const redirectByJudgeCreator = (judger: () => boolean, to: string) => {
  return function ({ children }: { children: React.ReactNode }): JSX.Element {
    const history = useHistory();
    const judge = judger();
    useEffect(() => {
      // ? 沒搞懂為什麼這個一定得放 useEffect 裡面，跳轉也算 SideEffect 嗎
      if (judge) {
        history.push(to);
      }
    });
    return <>{children}</>;
  };
};

// * 把 Redirect 的功能從 component 剝出來
const RedirectIfNoSignIn = redirectByJudgeCreator(() => {
  const [signState] = useSignHook();
  return !signState;
}, "/");

function App() {
  const [signState] = useSignHook();

  return (
    <Router>
      <AppWrapper>
        <Switch>
          <Route exact path="/">
            <Entry />
          </Route>
          <Route
            path="/:spreadSheetId"
            render={(routeProps) => {
              const render = signState ? (
                JSON.stringify(signState)
              ) : (
                <Signin {...routeProps} />
              );
              return render;
            }}
          ></Route>
        </Switch>
      </AppWrapper>
    </Router>
  );
}

export default App;

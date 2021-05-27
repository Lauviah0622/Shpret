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

import Entry from "../Pages/Entry";
import Append from "../Pages/Append";
import SelectFile from "../Pages/SelectFile";

import useSignHook from "../hooks/useSign";

const AppWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  min-height: 100vh;
`;

const redirectByJudgeCreator = (judger:() => boolean, to: string) => {
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
  return !signState
}, '/')

function App() {
  const [signState] = useSignHook();

  return (
    <Router>
      <AppWrapper>
        <Switch>
          <Route exact path="/">
            <Entry />
          </Route>

          <Route path="/append">
            <RedirectIfNoSignIn>
              <Append />
            </RedirectIfNoSignIn>
          </Route>
          <Route path="/selectFile">
            <RedirectIfNoSignIn>
              <SelectFile />
            </RedirectIfNoSignIn>
          </Route>
          <Redirect to={!signState ? "/" : "/append"} />
        </Switch>
      </AppWrapper>
    </Router>
  );
}

export default App;

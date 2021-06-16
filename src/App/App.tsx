import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import styled from "styled-components";
import { useSelector } from 'react-redux';
import "antd/dist/antd.css";
import "antd-mobile/dist/antd-mobile.css";

import Entry from "../Pages/Entry";
import Main from "../Pages/Main";
import Signin from "../Pages/Signin";
import useSignHook from "../hooks/useSign";
import {SpreadSheetState, spreadSheetStateSelector} from '../redux/feature/spreadSheet/spreadSheetSlice';

const AppWrapper = styled.div`
  margin: 0 auto;
  min-height: 100vh;
  max-width: 500px;
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
  const { sheetId, headerRange, id } = useSelector(spreadSheetStateSelector);

  return (
    <Router>
      <AppWrapper>
        <Switch>
          <Route exact path="/"
            render={routeProps => (<Entry {...routeProps} />)}>
            
          </Route>
          <Route
            path="/:spreadSheetId"
            render={routeProps => {
              switch (true) {
                case !signState:
                  return <Signin {...routeProps} />;
                case !sheetId || !headerRange:
                  return <Entry {...routeProps} />;
                default:
                  return <Main {...routeProps} />
                  
              }
              // return render;
            }}
          ></Route>
        </Switch>
      </AppWrapper>
    </Router>
  );
}

export default App;

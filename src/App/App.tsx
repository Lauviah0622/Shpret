import React, { useEffect, useContext } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import styled from "styled-components";
import "antd/dist/antd.css";
import "antd-mobile/dist/antd-mobile.css";
import { useSelector } from "react-redux";

import Auth from "../Pages/Auth";
import Initialize from "../Pages/Initialize";
import Main from "../Pages/Main";
import { RootState } from "../redux/store";

const AppWrapper = styled.div`
  margin: 0 auto;
  height: 100vh;
  max-width: 500px;
`;

const IfRedirectTo = ({
  judger,
  to,
  children,
}: {
  judger: boolean | { (): boolean };
  to: string;
  children: JSX.Element;
}) => {
  const history = useHistory();
  const judgment = typeof judger === "function" ? judger() : judger;
  useEffect(() => {
    console.log("useEffect");
    // ? 沒搞懂為什麼這個一定得放 useEffect 裡面，跳轉也算 SideEffect 嗎
    if (judgment) {
      console.log("redirect");
      history.push(to);
    }
  }, [history, judger]);
  return <>{judgment || children}</>;
};

function App() {
  const { authState, spreadSheetState } = useSelector(
    (state: RootState): RootState => state
  );
  const notSigninOrNoSpreadSheetId =
    !authState.isSignIn || !spreadSheetState.id;

  const noCurrentSheetIndex = spreadSheetState.current.sheetIndex === null;

  console.log("noCurrentSheetIndex", noCurrentSheetIndex);
  console.log("!authState.isSignIn", authState.isSignIn);
  console.log("spreadSheetState.id", spreadSheetState.id);
  console.log("notSigninOrNoSrpeadSheetId", notSigninOrNoSpreadSheetId);
  return (
    <Router>
      <AppWrapper>
        <Switch>
          <Route
            exact
            path="/"
            render={(routeProps) => <Auth {...routeProps} />}
          />
          <Route
            path="/init"
            render={(routeProps) => (
              <IfRedirectTo judger={notSigninOrNoSpreadSheetId} to="/">
                <Initialize />
              </IfRedirectTo>
            )}
          />
          <IfRedirectTo judger={notSigninOrNoSpreadSheetId} to="/">
            <Route
              path="/:spreadSheetId/:pageName"
              render={(routeProps) => <Main {...routeProps} />}
            />
          </IfRedirectTo>

          <Route
            path="/:spreadSheetUrl"
            render={(routeProps) => <Auth {...routeProps} />}
          ></Route>
        </Switch>
      </AppWrapper>
    </Router>
  );
}

export default App;

import React, { useEffect } from "react";
import { RouteComponentProps, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Button, WhiteSpace, WingBlank, InputItem } from "antd-mobile";
import {
  spreadSheetStateSelector,
  createSetIdAction,
  SpreadSheetState,
} from "../../redux/feature/spreadSheet/spreadSheetSlice";
import { useDispatch, useSelector } from "react-redux";

import useSignHook from "../../hooks/useSign";

const Layout = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: 10% auto 10%;
`;

const Title = styled.h3``;

const Content = styled.div`
  display: grid;
  align-items: center;
`;

function useTransUrl(location: any, history: any) {
  useEffect(() => {
    const sheetIDMatch = location.pathname.match(/\/([\w\-]{40,})$/);
    if (sheetIDMatch) {
      return;
    }
    const sheetUrlMatch = location.pathname.match(
      /docs\.google\.com\/spreadsheets\/d\/([\w\-]{40,})\//
    );
    if (sheetUrlMatch) {
      console.log("url");
      history.push(`/${sheetUrlMatch[1]}`);
      return;
    }
    history.push(`/`);
  }, [location, history]);
}

function useUpdateIdByUrl(location: any, dispatch: any) {
  useEffect(() => {
    const sheetIDMatch = location.pathname.match(/\/([\w\-]{40,})$/);
    if (sheetIDMatch) {
      console.log("only Id");
      dispatch(createSetIdAction(sheetIDMatch[1]));
      return;
    }
  });
}

export default function Signin({
  match,
}: RouteComponentProps<{ spreadSheetId: string }>) {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch<SpreadSheetState>();
  const spreadSheetState = useSelector(spreadSheetStateSelector);

  useTransUrl(location, history);
  useUpdateIdByUrl(location, dispatch);

  const [signState, signIn] = useSignHook();

  const submitBtnHandler = () => {
    signIn();
    console.log(spreadSheetState.id);
    console.log(location);
    console.log(match);
  };

  return (
    <Layout>
      <div></div>
      <Content>
        <div>
          <WingBlank>
            <Title>以下是您的 id</Title>
          </WingBlank>
          <WingBlank>
            <InputItem
              value={spreadSheetState.id}
              placeholder="Google sheet 網址"
              /* onChange={inputChangeHandler} */
            />
          </WingBlank>
          <WhiteSpace size="xl" />
        </div>
      </Content>
      <div>
        <WingBlank size="lg">
          <Button type="primary" onClick={submitBtnHandler}>
            Login
          </Button>
        </WingBlank>
      </div>
    </Layout>
  );
}

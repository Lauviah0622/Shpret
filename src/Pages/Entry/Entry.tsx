import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useHistory, useLocation, RouteComponentProps } from "react-router-dom";

import { Button, WhiteSpace, WingBlank, List, InputItem } from "antd-mobile";

import Layout from "../../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  createSetIdAction,
  spreadSheetStateSelector,
  SpreadSheetState,
} from "../../redux/feature/spreadSheet/spreadSheetSlice";
import useSignHook from "../../hooks/useSign";
import useUrlInputState from './useUrlInputState';
import useSetSheetFields from "../../hooks/useSetSheetFields";

const Title = styled.h3``;

const PageWrapper = styled.div`
  height: 100vh;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const ContentWrapper = styled.div`
  display: grid;
  gap: 2em;
`;

interface EntryProps extends RouteComponentProps<{}> {}

function useTransUrl(pathname: string, history: any) {
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
/* 
function useUpdateIdByUrl(pathname: string, dispatch: any) {
  useEffect(() => {
    const sheetIDMatch = location.pathname.match(/\/([\w\-]{40,})$/);
    if (sheetIDMatch) {
      console.log("only Id");
      dispatch(createSetIdAction(sheetIDMatch[1]));
      return;
    }
  });
}
 */

const extractSpreadIdFrom = (str: string): string | null => {
  const urlMatchIdResult = str.match(
    /docs\.google\.com\/spreadsheets\/d\/([\w\-]{40,})\//
  );
  return urlMatchIdResult ? urlMatchIdResult[1] : null;
};

interface EntryStates {
  isPending: boolean;
  isSpreadSheetUrlValid: boolean;
  isSignIn: boolean;
}

// TODO: 這裡的判斷可以做簡化，isSpreadSheetUrlValid 基本上就是控制 disable
const getButtonByStates = (states: EntryStates): string | JSX.Element => {
  const { isPending, isSpreadSheetUrlValid, isSignIn } = states;
  if (isPending)
    return (
      <Button type="primary" loading disabled>
        Loging...
      </Button>
    );

  switch (true) {
    case isSpreadSheetUrlValid && isSignIn:
      return <Button type="primary">已登入，下一步</Button>;

    case isSpreadSheetUrlValid && !isSignIn:
      return <Button type="primary">登入 google 帳戶</Button>;

    case !isSpreadSheetUrlValid && isSignIn:
      return (
        <Button type="primary" disabled>已登入，下一步</Button>
      );

    case !isSpreadSheetUrlValid && !isSignIn:
      return (
        <Button type="primary" disabled>登入</Button>
      );
    default:
      break;
  }
  // ? 基本上不會到這個，但這裡要怎麼做錯誤處理？
  return <Button type="warning" disabled>Error</Button>;
};

export default function Entry(props: EntryProps) {
  const [isPending, setIsPending] = useState<EntryStates["isPending"]>(false);
  const {
    isDirty,
    spreadSheetUrl,
    spreadSheetId,
    setSpreadSheetUrl
  } = useUrlInputState()
  
  const location = useLocation();

  //* 根據 url update Input 裡面的內容
  useEffect(() => {
    function updateIdByPathName(pathName: string) {
      const spreadSheetUrlMatchArray = pathName.match(/[^\/].*/g);
      if (spreadSheetUrlMatchArray) {
        setSpreadSheetUrl(spreadSheetUrlMatchArray[0]);
      }
    }
    updateIdByPathName(location.pathname);
  }, [location]);

  // 在 React 裡面要這樣用
  const inputChangeHandler = (value: string) => {
    setSpreadSheetUrl(value);
  };

  // SignIn
  const [isSignIn, signIn] = useSignHook();
  const loginHandler = () => {
    signIn();
  };

  const Button = getButtonByStates({
    isPending,
    isSignIn: true,
    isSpreadSheetUrlValid: !!spreadSheetId,
  });

  const errorMessage = isDirty && !spreadSheetId && 'Eroor';
  return (
    <PageWrapper>
      <Layout footer={Button}>
        <ContentWrapper>
          <WingBlank>
            <Title>Google SpreadSheet</Title>
          </WingBlank>
          <WingBlank>
            <InputItem
              value={spreadSheetUrl}
              placeholder="輸入您的 Google sheet 網址以獲得 id"
              onChange={inputChangeHandler}
              disabled={isPending}
            />
            <ErrorMessage>{errorMessage}</ErrorMessage>
            <p>isDirty: {isDirty + ""}</p>
            <p>isSpreadSheetUrlValid: {spreadSheetId + ""}</p>
          </WingBlank>
          <WhiteSpace size="xl" />
        </ContentWrapper>
      </Layout>
    </PageWrapper>
  );
}

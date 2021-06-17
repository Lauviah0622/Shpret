import React, { useState, useEffect, useMemo, Dispatch } from "react";
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
import useSignHook from "../../hooks/useSignState";
import useUrlInputState from "./useUrlInputState";
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


function useUpdateInputByUrlEffect (location:LocationType, setSpreadSheetUrl: Dispatch<string>) {
  useEffect(() => {
    function updateIdByPathName(pathName: string) {
      const spreadSheetUrlMatchArray = pathName.match(/[^\/].*/g);
      if (spreadSheetUrlMatchArray) {
        setSpreadSheetUrl(spreadSheetUrlMatchArray[0]);
      }
    }
    updateIdByPathName(location.pathname);
  }, [location]);
}



interface EntryStates {
  isPending: boolean;
  isSpreadSheetUrlValid: boolean;
  isSignIn: boolean;
}

type LocationType = {
  pathname: string
}

// TODO: 這裡的判斷可以做簡化，isSpreadSheetUrlValid 基本上就是控制 disable
const getButtonAttrByStates = (states: EntryStates) => {
  const { isPending, isSpreadSheetUrlValid, isSignIn } = states;

  let buttonText: string = "";

  if (isPending) buttonText = "Loging...";

  switch (true) {
    case isSignIn:
      buttonText = "已登入，下一步";
      break;
    case isSpreadSheetUrlValid && !isSignIn:
      buttonText = "登入 google 帳戶";
      break;
    case isPending:
      buttonText = "Loging...";
      break;
    default:
      break;
  }
  return {
    disabled: !isSpreadSheetUrlValid,
    loading: isPending,
    children: buttonText,
  } as const;
};

export default function Entry(props: EntryProps) {
  const [isPending, setIsPending] = useState<EntryStates["isPending"]>(false);
  const { isDirty, spreadSheetUrl, spreadSheetId, setSpreadSheetUrl } =
    useUrlInputState();

  const location = useLocation<LocationType>();

  //* 根據 url update Input 裡面的內容
  useUpdateInputByUrlEffect(location, setSpreadSheetUrl)

  // 在 React 裡面要這樣用
  const inputChangeHandler = (value: string) => {
    setSpreadSheetUrl(value);
  };

  // SignIn
  const [isSignIn, signIn] = useSignHook();
  const loginHandler = () => {
    signIn();
  };

  const buttonAttr = getButtonAttrByStates({
    isPending,
    isSignIn: isSignIn,
    isSpreadSheetUrlValid: !!spreadSheetId,
  });

  const errorMessage = isDirty && !spreadSheetId && "Eroor";
  return (
    <PageWrapper>
      <Layout footer={<Button type="primary" onClick={loginHandler} {...buttonAttr}/>}>
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
            <p>isSignIn: {isSignIn + ""}</p>
          </WingBlank>
          <WhiteSpace size="xl" />
        </ContentWrapper>
      </Layout>
    </PageWrapper>
  );
}

import React, { useState, useEffect, Dispatch } from "react";
import styled from "styled-components";
import { useLocation, RouteComponentProps } from "react-router-dom";

import { Button, WhiteSpace, WingBlank, InputItem } from "antd-mobile";

import Layout from "../../Components/Layout";
import useSignHook from "../../hooks/useSignState";
import useUrlInputState from "./useUrlInputState";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpreadSheet } from "../../redux/feature/spreadSheet/spreadSheetSlice";
import {RootState} from '../../redux/store';

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

  const buttonAttr = {
    disabled: !isSpreadSheetUrlValid,
    loading: isPending,
    children: "",
  }

  switch (true) {
    case isSignIn:
      buttonAttr.children = "已登入，下一步讀取表單";
      break;
    case isSpreadSheetUrlValid && !isSignIn:
      buttonAttr.children = "登入 google 帳戶";
      break;
    case isPending:
      buttonAttr.children = "Loging...";
      break;
    default:
      break;
  }
  return buttonAttr;
};



export default function Entry(props: EntryProps) {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState<EntryStates["isPending"]>(false);
  const spreadSheetId = useSelector<RootState>((state) => state.spreadSheetState.id)
  const { isDirty, spreadSheetUrl, idExtractFromUrl, setSpreadSheetUrl } =
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

  const getSpreadSheetHandler = async () => {
    if (!idExtractFromUrl) return
    const state = await dispatch(fetchSpreadSheet(idExtractFromUrl))
    console.log(state);

  }

  const buttonAttr = getButtonAttrByStates({
    isPending,
    isSignIn: isSignIn,
    isSpreadSheetUrlValid: !!idExtractFromUrl,
  });

  const errorMessage = isDirty && !idExtractFromUrl && "Eroor";
  return (
    <PageWrapper>
      <Layout footer={<Button type="primary" onClick={!!idExtractFromUrl ? getSpreadSheetHandler : loginHandler} {...buttonAttr}/>}>
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
            <p>isSpreadSheetUrlValid: {idExtractFromUrl + ""}</p>
            <p>isSignIn: {isSignIn + ""}</p>
            <p>spreadSheetId: {spreadSheetId + ""}</p>
          </WingBlank>
          <WhiteSpace size="xl" />
        </ContentWrapper>
      </Layout>
    </PageWrapper>
  );
}

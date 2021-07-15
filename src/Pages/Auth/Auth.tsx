import React, { useState, useEffect, Dispatch, MouseEventHandler } from "react";
import styled from "styled-components";
import { useLocation, RouteComponentProps, useHistory } from "react-router-dom";

import { Button, WhiteSpace, WingBlank, InputItem } from "antd-mobile";

import Layout from "../../Components/Layout";
import useSignHook from "../../hooks/useSignState";
import useUrlInputState, { SpreadSheetUrlInputState } from "./useUrlInputState";

const Title = styled.h3``;

const ErrorMessage = styled.p`
  color: red;
`;

const ContentWrapper = styled.div`
  display: grid;
  gap: 2em;
`;

function useUpdateInputByUrlEffect(
  location: LocationType,
  setSpreadSheetUrl: Dispatch<string>
) {
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
  urlState: SpreadSheetUrlInputState["urlState"];
  isSignIn: boolean;
  url: string;
  isDirty: boolean;
}

type LocationType = {
  pathname: string;
};

// TODO: 這裡的判斷可以做簡化，isSpreadSheetUrlValid 基本上就是控制 disable
const getUiAttrByState = ({
  isPending,
  urlState,
  isSignIn,
  url,
  isDirty,
}: EntryStates) => {
  const isUrlEmpty = url === "";

  const buttonAttr: {
    disabled: boolean;
    loading: boolean;
    children: string;
    handlerName: "signIn" | "nextPage" | "fetchSpreadSheet";
  } = {
    disabled: urlState === "noId" || urlState === "invalidId",
    loading: isPending,
    children: "",
    handlerName: "signIn",
  };

  const errorMessageAttr: {
    children: string;
  } = {
    children: "",
  };

  if (!isSignIn) {
    buttonAttr.handlerName = "signIn";
    if (urlState === "unverifiedId") {
      buttonAttr.children = "點擊登入後，讀取試算表";
    }
    if (urlState === "noId" && isDirty) {
      buttonAttr.children = "輸入正確試算表網址後，點擊登入";
      buttonAttr.disabled = true;
      errorMessageAttr.children = "試算表網址格式錯誤";
    }
    if (urlState === "noId" && !isDirty) {
      buttonAttr.disabled = true;
      buttonAttr.children = "輸入試算表網址後，點擊登入";
    }
  } else {
    buttonAttr.handlerName = "fetchSpreadSheet";
    switch (urlState) {
      case "noId":
        buttonAttr.children = `已登入，輸入${isDirty ? "正確" : ""}試算表網址`;
        if (isDirty) {
          errorMessageAttr.children = "試算表網址格式錯誤";
        }
        break;
      case "unverifiedId":
        buttonAttr.children = `已登入，點擊讀取表單`;
        break;
      case "validId":
        buttonAttr.children = `讀取完畢😉點擊進行設定`;
        buttonAttr.handlerName = "nextPage";
        break;
      case "invalidId":
        buttonAttr.disabled = true;
        if (!isDirty) {
          buttonAttr.children = `讀取失敗😔幫我重新輸入表單`;
          break;
        }
        buttonAttr.children = `重新輸入網址後，點擊讀取表單`;
        errorMessageAttr.children = "試算表網址無效，請重新輸入網址";
        break;
      default:
        throw Error("UI state Error");
    }
  }
  return [buttonAttr, errorMessageAttr] as const;
};

interface EntryProps extends RouteComponentProps<{}> {}

export default function Auth(props: EntryProps) {
  const history = useHistory();
  const [isPending, setIsPending] = useState<EntryStates["isPending"]>(false);
  const { isDirty, url, urlState, setUrl, verifyUrl } = useUrlInputState();

  const location = useLocation<LocationType>();

  //* 根據 url update Input 裡面的內容
  useUpdateInputByUrlEffect(location, setUrl);

  // 在 React 裡面要這樣用
  const inputChangeHandler = (value: string) => {
    setUrl(value);
  };

  // SignIn
  const [isSignIn, signIn] = useSignHook();
  const handlers: {
    [handlerName: string]: MouseEventHandler;
  } = {
    fetchSpreadSheet: async () => {
      setIsPending(true);
      await verifyUrl();
      setIsPending(false);
    },
    signIn: () => {
      signIn();
    },
    nextPage: () => {
      history.push("/init");
    },
  };
  const [{ handlerName, ...buttonElementAttr }, errorMessageAttr] =
    getUiAttrByState({
      isPending,
      isSignIn: isSignIn,
      urlState,
      url,
      isDirty,
    });
  const onButtonClick = handlers[handlerName];

  return (
      <Layout
        footer={
          <Button
            type="primary"
            onClick={onButtonClick}
            {...buttonElementAttr}
          />
        }
      >
        <ContentWrapper>
          <WingBlank>
            <Title>Google SpreadSheet</Title>
          </WingBlank>
          <WingBlank>
            <InputItem
              id="url-input"
              value={url}
              placeholder="輸入您的 Google sheet 網址以獲得 id"
              onChange={inputChangeHandler}
              disabled={isPending}
            />
            <ErrorMessage {...errorMessageAttr} />

            <p>isDirty: {isDirty + ""}</p>
            <p>isSignIn: {isSignIn + ""}</p>
            <p>isPending: {isPending + ""}</p>
            <p>urlState: {urlState + ""}</p>
            <p>isUrlEmpty123123: {(url === "") + ""}</p>
          </WingBlank>
          <WhiteSpace size="xl" />
        </ContentWrapper>
      </Layout>
  );
}

import React, { ChangeEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import { Button, WhiteSpace, WingBlank, List, InputItem } from "antd-mobile";

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

export default function Entry() {
  const [spreadSheetUrl, setSpreadSheetUrl] = useState<string>("");
  const history = useHistory();

  // 在 React 裡面要這樣用
  const inputChangeHandler = (value:string) => {
    setSpreadSheetUrl(value);
  };

  const submitBtnHandler = () => {
    history.push(`/${spreadSheetUrl}`)
  }
  return (
    <Layout>
      <div></div>
      <Content>
        <div>
          <WingBlank>
            <Title>輸入您的 Google Sheet 網址</Title>
          </WingBlank>
          <WingBlank>
            <InputItem
              value={spreadSheetUrl}
              placeholder="Google sheet 網址"
              onChange={inputChangeHandler}
            />
          </WingBlank>
          <WhiteSpace size="xl" />
        </div>
      </Content>
      <div>
        <WingBlank size="lg">
          <Button type="primary" onClick={submitBtnHandler}>完成</Button>
        </WingBlank>
      </div>
    </Layout>
  );
}

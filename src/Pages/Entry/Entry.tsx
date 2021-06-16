import React, { useState } from "react";
import styled from "styled-components";
import { useHistory, RouteComponentProps } from "react-router-dom";

import { Button, WhiteSpace, WingBlank, List, InputItem } from "antd-mobile";

import Layout from "../../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  createSetSpreadSheetState,
  spreadSheetStateSelector,
  SpreadSheetState,
} from "../../redux/feature/spreadSheet/spreadSheetSlice";

const Title = styled.h3``;

const PageWrapper = styled.div`
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: grid;
  gap: 2em;
`;

interface EntryProps extends RouteComponentProps<{}> {}

export default function Entry(props: EntryProps) {
  const [spreadSheetUrl, setSpreadSheetUrl] = useState<string>("");
  const { headerRange, sheetId }: SpreadSheetState = useSelector(
    spreadSheetStateSelector
  );

  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();

  // 在 React 裡面要這樣用
  const inputChangeHandler = (value: string) => {
    setSpreadSheetUrl(value);
  };

  const submitBtnHandler = () => {
    history.push(`/${spreadSheetUrl}`);
  };
  return (
    <PageWrapper>
      <Layout
        footer={
          <Button type="primary" onClick={submitBtnHandler}>
            完成
          </Button>
        }
      >
        <ContentWrapper>
            <WingBlank>
              <Title>Google SpreadSheet</Title>
            </WingBlank>
            <WingBlank>
              <InputItem
                value={spreadSheetUrl}
                placeholder="輸入您的 Google sheet 網址"
                onChange={inputChangeHandler}
              />
            </WingBlank>
            <WhiteSpace size="xl" />
        </ContentWrapper>
      </Layout>
    </PageWrapper>
  );
}

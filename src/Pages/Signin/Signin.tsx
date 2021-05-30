import React, { useEffect } from "react";
import {
  RouteComponentProps,
  RouterProps,
  useHistory,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import { Button, WhiteSpace, WingBlank, InputItem } from "antd-mobile";
import useSetSpreadSheetId from "../../hooks/useSetSpreadSheetId";
import { spreadSheetStateSelector } from '../../redux/feature/spreadSheet/spreadSheetSlice';
import { useSelector } from "react-redux";



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

export default function Signin({ match }: RouteComponentProps<{spreadSheetId: string}>) {
  const location = useLocation();
  const history = useHistory()
  const spreadSheetState = useSelector(spreadSheetStateSelector)
  
  useEffect(() => {
    const match = location.pathname.match(
      /docs\.google\.com\/spreadsheets\/d\/([\w\-]{40,})\//
    );
    if (match) {
      console.log(match[1]);
      history.push(`/${match[1]}`)
    }
    
  }, [location])
  useSetSpreadSheetId(match.params.spreadSheetId);

  const submitBtnHandler = () => {
    console.log("123123");
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
            完成
          </Button>
        </WingBlank>
      </div>
    </Layout>
  );
}

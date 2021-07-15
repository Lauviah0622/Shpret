import React, { useState } from "react";
import { TabBar } from "antd-mobile";
import { RouteComponentProps } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useSetSheetFields from "../../hooks/useSetSheetFields";
import { spreadSheetStateSelector, SpreadSheetState } from "../../redux/feature/spreadSheet/spreadSheetSlice";
import Append from "./AppendPannel";
import View from "./ViewPannel";
import Layout from "../../Components/Layout";
import useFetchSheetData from './useFetchSheetData';

const PageWrapper = styled.div`
  display: grid;
  grid-template-rows: auto min-content;
  min-height: 100vh;
`;

const TabbarContainer = styled.div`
  width: 100%;
  bottom: 0;
`;

const Title = styled.h1`
  text-align: center;
`;

type TabState = "append" | "view";

interface MainProps extends RouteComponentProps<{ spreadSheetId: string }> {}

export default function Main(props: MainProps) {
  const [tabState, setState] = useState<TabState>("append");
  const spreadSheetState:SpreadSheetState = useSelector(spreadSheetStateSelector);
  const headerFields = spreadSheetState.sheets[spreadSheetState.current.sheetIndex as number]?.headerFields

  const content = {
    append: <Append fields={headerFields} />,
    view: <View />,
  };

  return (
    <PageWrapper>
      {content[tabState]}
      <TabbarContainer>
        <TabBar>
          <TabBar.Item
            icon={{
              uri: "https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg",
            }}
            selectedIcon={{
              uri: "https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg",
            }}
            onPress={() => {
              setState("append");
            }}
            title="新增"
            key="append"
            selected={tabState === "append"}
          />
          <TabBar.Item
            icon={{
              uri: "https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg",
            }}
            selectedIcon={{
              uri: "https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg",
            }}
            onPress={() => {
              setState("view");
            }}
            title="檢視"
            key="view"
            selected={tabState === "view"}
          />
        </TabBar>
      </TabbarContainer>
    </PageWrapper>
  );
}

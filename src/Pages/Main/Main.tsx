import React, { useState } from "react";
import { TabBar } from "antd-mobile";
import { RouteComponentProps } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useSetSheetFields from "../../hooks/useSetSheetFields";
import { spreadSheetStateSelector } from "../../redux/feature/spreadSheet/spreadSheetSlice";
import Append from "./Append";
import Layout from "../../Components/Layout";

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

const View = () => {
  const header = <Title>View</Title>;
  return <Layout header={header}>viewviewview</Layout>;
};

export default function Main(
  props: RouteComponentProps<{ spreadSheetId: string }>
) {
  useSetSheetFields();

  const [tabState, setState] = useState<TabState>("append");
  const { fields } = useSelector(spreadSheetStateSelector);
  const content = {
    append: <Append fields={fields} />,
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

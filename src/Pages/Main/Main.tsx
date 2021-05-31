import React, { useState } from "react";
import { Button, WingBlank, TabBar } from "antd-mobile";
import { RouteComponentProps } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useSetSheetFields from "../../hooks/useSetSheetFields";
import { spreadSheetStateSelector } from "../../redux/feature/spreadSheet/spreadSheetSlice";

const PageWrapper = styled.div`
  display: grid;
  grid-template-rows: auto min-content;
  min-height: 100vh;
`;

const TabbarContainer = styled.div`
  width: 100%;
  bottom: 0;
`;

const Layout = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 10% auto 10%;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr min(65ch, calc(100% - 64px)) 1fr;

  & > * {
    grid-column: 2;
  }
  align-items: center;
`;

const createFormItem = (field: string): JSX.Element => (<div>
  {field}
</div>);

const createFormItemsFromFields = (fields: string[]) =>
  fields.map((field) => createFormItem(field));

type TabState = "append" | "view";

const Append = ({ fields }: { fields: string[] }) => {
  const formItems = createFormItemsFromFields(fields);
  return (
    <Layout>
      <div>
        <h3>Append</h3>
      </div>
      <Content>{formItems}</Content>
      <div>
        <WingBlank size="lg">
          <Button type="primary">新增項目</Button>
        </WingBlank>
      </div>
    </Layout>
  );
};

const View = () => {
  return (
    <Layout>
      <div></div>
      <Content>
        <h3>Viiw</h3>
      </Content>
      <div></div>
    </Layout>
  );
};

export default function Main({
  match,
}: RouteComponentProps<{ spreadSheetId: string }>) {
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

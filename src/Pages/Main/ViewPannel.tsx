import React from "react";
import { useSelector } from "react-redux";
import { Table as AntdTable } from "antd";
import styled from "styled-components";
import Layout from "../../Components/Layout";
import {
  currentSheetStateSelector,
  Sheet,
} from "../../redux/feature/spreadSheet/spreadSheetSlice";
import useFetchSheetData from "./useFetchSheetData";

interface TableDataSource {
  key: string;
  [header: string]: string;
}

const ContentWrapper = styled.div``;

const Table = ({ sheet }: { sheet: Sheet }) => {
  const { headerRange } = sheet;
  const headerRowStart = +(headerRange?.split(":")[0].split("")[1] as string);

  const columns = sheet.headerFields.map((headerField, i) => ({
    title: headerField,
    dataIndex: headerField,
    key: headerField,
    width: 100,
  }));

  const data = sheet.values
    .slice(headerRowStart) // remove header
    .reverse() // 倒序
    .map((row, i) => {
      const slicedRow = row.slice(0, sheet.headerFields.length);
      // 去除掉超出 column 的資料

      
      const convertedData: TableDataSource = {
        key: `${sheet.headerFields[i]}`,
      };

      for (let i = 0; i < sheet.headerFields.length; i++) {
        const column = sheet.headerFields[i];
        const cell = slicedRow[i];
        convertedData[column] = cell ? String(cell) : "empty";
      }
      return convertedData;
    });
  return (
    <AntdTable
      columns={columns}
      dataSource={data}
      scroll={{ y: "65vh", x: "50px" }}
      // 這裡的值是對應到 max-height
      pagination={{
        position: ["bottomCenter"],
        showSizeChanger: false,
        pageSize: 20,
      }}
    />
  );
};

const styledTable = styled(Table)`
  .ant-table-cell {
    min
  }
`;

export default function ViewPanel() {
  useFetchSheetData();
  const currentSheetState = useSelector(currentSheetStateSelector);
  console.log(currentSheetState);

  return (
    <Layout header="View" footer={false}>
      <ContentWrapper>
        {currentSheetState && <Table sheet={currentSheetState} />}
      </ContentWrapper>
    </Layout>
  );
}

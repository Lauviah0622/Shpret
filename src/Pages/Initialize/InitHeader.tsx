import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Button, WingBlank, InputItem } from "antd-mobile";
import { Form, Field } from "react-final-form";
import { Select, Table } from "antd";

import {
  spreadSheetStateSelector,
  SpreadSheetState,
  setCurrentIndex,
  setSheetData,
} from "../../redux/feature/spreadSheet/spreadSheetSlice";
import Layout from "../../Components/Layout";
import { getFields } from "../../gpai/spreadSheet";
import { useHistory } from "react-router-dom";
import useRedirect from "../../hooks/useRedirect";

const { Option } = Select;

const Title = styled.h3``;

const ErrorMessage = styled.p`
  color: red;
`;

const ContentWrapper = styled.div`
  display: grid;
  gap: 2em;
`;

const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-columns: min-content auto;
  > a {
    padding: 0 1.5ch;
  }
  gap: 0.5em;
`;

type InitFormValueType = {
  currentSheetIndex: SpreadSheetState["current"]["sheetIndex"];
  headerRange: string;
};

const validate = (values: InitFormValueType) => {
  const errors: {
    currentSheetIndex?: string;
    headerRange?: string;
  } = {};
  if (values.currentSheetIndex === null) {
    errors.currentSheetIndex = "Requeired";
  }
  if (!values.headerRange) {
    errors.headerRange = "Requeired";
  } else if (!values.headerRange.match(/[A-Z](\d*):[A-Z]\1$/gm)) {
    console.log("value error");
    errors.headerRange = "invalid range";
  }

  console.log(values);
  return errors;
};

type SheetHeader = {
  headerRange: string | null;
  headerFields: string[];
  index: number
};

const setCurrentSheetIndexAndSheet =
  (currentSheetIndex: number, sheet: SheetHeader) => async (dispatch) => {
    try {
      dispatch(setCurrentIndex(currentSheetIndex));
      dispatch(setSheetData(sheet));
      /**
       * ?這裡不知道會不會等全部都 update 完才 return promise
       * 因為 dispatch 本身是非同步
       * 但不知道說這邊的 dispatch 本身是不是 async 的狀態
       */
      return Promise.resolve()
    } catch (err) {
      return Promise.reject()
    }

  };

type HeaderFieldsTabledata = {
  key: string;
  index: number;
  fieldName: string;
};

const HeaderFieldsTable = ({ data }: { data: HeaderFieldsTabledata[] }) => {
  const columns = [
    {
      title: "",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "名稱",
      dataIndex: "fieldName",
      key: "fieldName",
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      showHeader={false}
      pagination={false}
    />
  );
};

export default function InitHeader() {
  const spreadSheetState = useSelector(spreadSheetStateSelector);
  const [headerFields, setHeaderFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const redirectTo = useRedirect();
  const dispatch = useDispatch();

  const sheetsOptions = Object.values(spreadSheetState.sheets).map(
    ({ title, index }) => (
      <Option value={index} key={index}>
        {title}
      </Option>
    )
  );

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmitButtonClick = () => {
    formRef.current?.requestSubmit();
  };

  const fetchHeaderFields = async (values: InitFormValueType) => {
    try {
      setIsLoading(true);
      const sheetHeader = await getFields(
        spreadSheetState.id as string,
        values.headerRange,
        spreadSheetState.sheets[values.currentSheetIndex as number].title
      );
      setHeaderFields(sheetHeader.result.values[0]);
      console.log(sheetHeader.result.values[0]);
    } catch (err) {
      //TODO 記得加上 error 處理
    } finally {
      setIsLoading(false);
      //TODO 記得加上 loading state 處理
    }
  };

  const setStateAndNextPage = ({
    currentSheetIndex,
    headerRange,
  }: InitFormValueType) => {
    dispatch(
      setCurrentSheetIndexAndSheet(currentSheetIndex as number, {
        index: currentSheetIndex as number,
        headerRange,
        headerFields,
      })
    ).then(() => { //! 這個要怎麼辦...
      redirectTo(`${spreadSheetState.id}/append`);
      

    })

  };

  const onSubmit =
    headerFields.length > 0 ? setStateAndNextPage : fetchHeaderFields;

  const fieldTabelData: HeaderFieldsTabledata[] = headerFields.map(
    (fieldName, index) => ({
      key: `${index}_${fieldName}`,
      index,
      fieldName,
    })
  );

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ values, handleSubmit, form }) => {
        const onReset = () => {
          form.restart();
          setHeaderFields([]);
        };

        const isError = !form.getState().valid;
        console.log(isError);

        return (
          <Layout
            footer={
              <ButtonsWrapper>
                {headerFields.length > 0 ? (
                  <Button
                    type="ghost"
                    onClick={onReset}
                    disabled={headerFields.length === 0}
                  >
                    重新輸入 ⬅
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  type="primary"
                  onClick={onSubmitButtonClick}
                  loading={isLoading}
                  disabled={isError}
                >
                  {headerFields.length > 0
                    ? "設定完畢，GOGO 💨"
                    : "輸入完成，檢視欄位內容 💨"}
                </Button>
              </ButtonsWrapper>
            }
          >
            <form onSubmit={handleSubmit} ref={formRef}>
              <ContentWrapper>
                {headerFields.length === 0 ? (
                  <>
                    <div>
                      <Field name="currentSheetIndex">
                        {({ input, meta }) => (
                          <div>
                            <Title>選擇表單</Title>
                            <Select
                              placeholder="Select a sheet"
                              style={{
                                width: "100%",
                                fontSize: "17px",
                              }}
                              {...input}
                            >
                              {sheetsOptions}
                            </Select>
                            {meta.error && (
                              <ErrorMessage>{meta.error}</ErrorMessage>
                            )}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div>
                      <Field name="headerRange">
                        {({ input, meta }) => (
                          <div>
                            <Title>表頭範圍</Title>
                            <InputItem {...input} placeholder="A1:C1" />
                            {/* 兩個套件的 props 對不上 */}
                            {meta.error && meta.touched && (
                              <ErrorMessage>{meta.error}</ErrorMessage>
                            )}
                          </div>
                        )}
                      </Field>
                    </div>
                  </>
                ) : (
                  <div>
                    <Title>選定的欄位</Title>
                    {headerFields.length > 0 ? (
                      <HeaderFieldsTable data={fieldTabelData} />
                    ) : (
                      "尚未選定欄位"
                    )}
                  </div>
                )}
              </ContentWrapper>
            </form>
            <WingBlank>
              <br />
              <br />
              <br />
              test
              {JSON.stringify(values)}
            </WingBlank>
          </Layout>
        );
      }}
    />
  );
}

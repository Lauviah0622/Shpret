import React, { EventHandler, SyntheticEvent } from "react";
import { Form, Input, Button } from "antd";
import { useSelector } from "react-redux";

import useSetSheetField from "../../hooks/useSetSheetFields";
import { fileStateSelector } from "../../redux/feature/spreadSheet/spreadSheetSlice";
import { schemaSelector } from "../../redux/feature/schema/schemaSlice";
import { appendItemByField } from "../../gpai/spreadSheet";

/* 
  1. get schema 
  2. list schema
  3. append rows by schema
*/

const FORM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const createFormItem = (label: string): JSX.Element => (
  <Form.Item label={label} key={label} name={label}>
    <Input placeholder={label} />
  </Form.Item>
);

const createFormItemsFromFields = (fields: string[]) =>
  fields.map((field) => createFormItem(field));

export default function Append() {
  const [form] = Form.useForm();

  const fieldState = useSelector(schemaSelector);
  const fileState = useSelector(fileStateSelector);
  useSetSheetField();

  const formFinishHandler: EventHandler<SyntheticEvent<HTMLButtonElement>> =
    () => {
      console.log(form.getFieldsValue(true));
      const appendItem:string[]  = Object.values(form.getFieldsValue(true));
      appendItemByField<typeof fieldState>(fileState.spreadSheetId, appendItem);
    };

  const formItems = createFormItemsFromFields(fieldState);
  return (
    <div>
      <Form
        {...FORM_LAYOUT}
        layout="horizontal"
        form={form}
        onFinish={formFinishHandler}
      >
        {formItems}
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>

      {JSON.stringify(fieldState)}
    </div>
  );
}

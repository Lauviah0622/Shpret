import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Button, WingBlank, TabBar, InputItem, Modal } from "antd-mobile";

import { spreadSheetStateSelector } from "../../redux/feature/spreadSheet/spreadSheetSlice";
import Layout from "../../Components/Layout";
import { appendItemByField } from "../../gpai/spreadSheet";
import { Form, Field, FormRenderProps } from "react-final-form";
import { SyntheticEvent } from "react";
import { ReactNode } from "react";

const Title = styled.h1`
  text-align: center;
`;

// 這個似乎是 iphone 專屬的 event，目前 el 找不到合適的描述
function closest(el: EventTarget, selector: string) {
  const matchesSelector =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

const createFormItem = (field: string): JSX.Element => (
  <Field
    name={field}
    key={field}
    render={({ meta, input }) => (
      <div>
        {/* 這行真的沒辦法...不太可能讓 final form 的 input props 跟 antd-mobile 完全對上 */}
        <InputItem {...input} type="text" placeholder="start from left" clear>
          {field}
        </InputItem>

        {meta.touched && meta.error && <span>{meta.error}</span>}
      </div>
    )}
  />
);

const createFormItemsFromFields = (fields: string[]) =>
  fields.map((field) => createFormItem(field));
  
  
  
  

  
interface RenderFormProps extends FormRenderProps {
  children: ReactNode;
  setShowModal: Function
}

const RenderForm = ({ handleSubmit, form, children, setShowModal }: RenderFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmitClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); // 坑！這是個坑！
    }
    console.log("123123");
    form.reset();
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
    }, 1000)
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <Layout
        header="Append"
        footer={
          <WingBlank size="lg">
            <Button onClick={onSubmitClick} type="primary">
              Submit
            </Button>
          </WingBlank>
        }
      >
        <div>{children}</div>
      </Layout>
    </form>
  );
};





interface Values {
  [prop: string]: string;
}

export default function Append({ fields }: { fields: string[] }) {
  /* Form */
  const { id } = useSelector(spreadSheetStateSelector);

  const formItems = createFormItemsFromFields(fields);
  const onSubmit = (value: Values) => {
    const valuesArray = Object.values(value);
    appendItemByField(id, valuesArray);
  };

  const validate = (value: Values) => {
    return {};
  };

  /* Modal */
  const [isShowModal, setShowModal] = useState<boolean>(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const onWrapTouchStart = (e: SyntheticEvent) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, ".am-modal-content");
    if (!pNode) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Modal
        visible={isShowModal}
        transparent
        maskClosable={false}
        onClose={closeModal}
        title="已送出"
        wrapProps={{ onTouchStart: onWrapTouchStart }}
      />

      <Form onSubmit={onSubmit} validate={validate}>
        {(props) => <RenderForm {...props} setShowModal={setShowModal}>{formItems}</RenderForm>}
      </Form>
    </>
  );
}

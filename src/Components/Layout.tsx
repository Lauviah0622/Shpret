import React from "react";
import styled from "styled-components";

const LayoutContainer = styled.div`
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 10% auto ${(props) =>
      props.footer === false ? null : "minmax(10%, max-content)"};
  grid-template-columns: 1fr min(65ch, calc(100% - 48px)) 1fr;
  padding: 1em 0;
  row-gap: 1em;
  & > * {
    grid-column: 2;
  }
  align-items: center;
`;

type LayoutProps = {
  header?: React.ReactElement | string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const Title = styled.h1`
  text-align: center;
`;

const ContentWrapper = styled.div`
  overflow: hidden;
`;

export default function Layout({ header, children, footer }: LayoutProps) {
  const headerComponent =
    typeof header === "string" ? <Title> {header} </Title> : header;

  return (
    <LayoutContainer footer={footer}>
      <div>{headerComponent}</div>
      <ContentWrapper>{children}</ContentWrapper>
      {footer === false || <div>{footer}</div>}
    </LayoutContainer>
  );
}

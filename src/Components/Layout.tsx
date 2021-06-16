import React from "react";
import styled from "styled-components";

const LayoutContainer = styled.div`
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 10% auto 10%;
  grid-template-columns: 1fr min(65ch, calc(100% - 48px)) 1fr;

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

export default function Layout({ header, children, footer }: LayoutProps) {
  const headerComponent =
    typeof header === "string" ? (
      <Title> {header} </Title>
    ) : (
      header
    );

  return (
    <LayoutContainer>
      <div>{headerComponent}</div>
      <div>{children}</div>
      <div>{footer}</div>
    </LayoutContainer>
  );
}

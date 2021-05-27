import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';

import {Button} from 'antd';

import useSignHook from '../../hooks/useSign';

const Wrapper = styled.div``;

export default function Entry() {
  const [signState, signIn, signOut] = useSignHook()
  const handleSignInClick = () => {
    signIn()
  }

  const handleSignOutClick = () => {
    signOut()
  }

  const history = useHistory()

  
  
  return (
    <Wrapper>
      <Button onClick={handleSignInClick}>Sign In</Button>
      <Button onClick={handleSignOutClick}>Sign out</Button>
      {JSON.stringify(signState)}
    </Wrapper> 
  );
}

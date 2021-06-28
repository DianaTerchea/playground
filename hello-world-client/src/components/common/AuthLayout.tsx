import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  border: 1px solid lightgray;
  padding:10px;
  margin-top: 50px;
  > * {
    margin-bottom: 15px;
  }
`;

// @ts-ignore
function AuthLayout({children}) {
    return (
        <PageContainer>
            <FormContainer>
                {children}
            </FormContainer>
        </PageContainer>
    );
}

export default AuthLayout;
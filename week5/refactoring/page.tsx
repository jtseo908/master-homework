"use client";

import React from "react";
import UserProfileForm from "./features/user/ui/UserProfileForm";
import styled, { createGlobalStyle } from "styled-components";

// Styled-components v6부터는 createGlobalStyle이 CSS-in-JS 경고를 발생시킬 수 있습니다.
// Next.js App Router 환경에서는 Root Layout에서 사용하는 것이 권장됩니다.
// 여기서는 과제의 단일 페이지 구성을 위해 이 파일에 작성합니다.
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f2f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
  }
`;

const PageContainer = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
`;

const App = () => {
  // 실제 애플리케이션에서는 이 데이터를 API나 전역 상태 관리 라이브러리에서 가져옵니다.
  const initialUserData = {
    username: "홍길동",
    email: "hong@example.com",
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <UserProfileForm initialData={initialUserData} />
      </PageContainer>
    </>
  );
};

export default App;

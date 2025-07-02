"use client";

import React from "react";
import UserProfileForm from "./features/user/ui/UserProfileForm";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
`;

export default function Week5Page() {
  // 실제 애플리케이션에서는 이 데이터를 API나 전역 상태 관리 라이브러리에서 가져옵니다.
  const initialUserData = {
    username: "홍길동",
    email: "hong@example.com",
  };

  return (
    <PageContainer>
      <UserProfileForm initialData={initialUserData} />
    </PageContainer>
  );
}

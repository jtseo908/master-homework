"use client";

import React from "react";
import UserProfileForm from "@/week6/refactoring/features/user/ui/UserProfileForm";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: 600;
`;

const Week6Page = () => {
  // 과제에서 사용할 초기 데이터
  const initialUserData = {
    username: "홍길동",
    email: "hong@example.com",
  };

  return (
    <PageContainer>
      <Title>Week 6: 사용자 프로필 관리</Title>
      <UserProfileForm initialData={initialUserData} />
    </PageContainer>
  );
};

export default Week6Page;

"use client";

import React from "react";
import UserProfileForm from "@/week6/refactoring/features/user/ui/UserProfileForm";

const App = () => {
  // 실제 애플리케이션에서는 이 데이터를 API나 전역 상태 관리 라이브러리에서 가져옵니다.
  const initialUserData = {
    username: "홍길동",
    email: "hong@example.com",
  };

  return (
    <div>
      <UserProfileForm initialData={initialUserData} />
    </div>
  );
};

export default App;

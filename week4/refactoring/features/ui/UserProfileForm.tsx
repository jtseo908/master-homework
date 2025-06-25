"use client";

import React, { useActionState } from "react";
import { updateUserInfo } from "../actions/user";

const initialState = { message: "" };

export default function UserProfileForm() {
  const [state, formAction, isPending] = useActionState(
    updateUserInfo,
    initialState
  );

  return (
    <form action={formAction}>
      <h2>사용자 프로필</h2>

      {state.message && <div>{state.message}</div>}

      <div>
        <label htmlFor="username">사용자 이름</label>
        <input
          type="text"
          id="username"
          name="username"
          defaultValue="홍길동"
          placeholder="사용자 이름을 입력하세요"
        />
      </div>

      <div>
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue="hong@example.com"
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div>
        <label htmlFor="password">새 비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="새 비밀번호를 입력하세요 (선택사항)"
        />
        <p>비밀번호를 변경하지 않으려면 비워두세요</p>
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "저장 중..." : "저장하기"}
      </button>
    </form>
  );
}

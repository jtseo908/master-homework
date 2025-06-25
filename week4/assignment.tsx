/**
 * 과제 파일
 */
import React, { useState } from "react";

interface UserInfo {
  username: string;
  email: string;
  password: string;
}

const UserProfileForm: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "홍길동",
    email: "hong@example.com",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!userInfo.username.trim()) {
      setMessage("사용자 이름을 입력해주세요.");
      return;
    }

    if (!userInfo.email.trim() || !userInfo.email.includes("@")) {
      setMessage("올바른 이메일을 입력해주세요.");
      return;
    }

    if (userInfo.password.length > 0 && userInfo.password.length < 6) {
      setMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    // 실제로는 여기서 API 호출을 하게 됩니다
    console.log("업데이트된 사용자 정보:", userInfo);
    setMessage("사용자 정보가 성공적으로 업데이트되었습니다!");
    setIsEditing(false);

    // 메시지 3초 후 자동 제거
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = () => {
    setUserInfo({
      username: "홍길동",
      email: "hong@example.com",
      password: "",
    });
    setIsEditing(false);
    setMessage("");
  };

  return (
    <div>
      <h2>사용자 프로필</h2>

      {message && <div>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">사용자 이름</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userInfo.username}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="사용자 이름을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="password">새 비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userInfo.password}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={isEditing ? "새 비밀번호를 입력하세요 (선택사항)" : ""}
          />
          {isEditing && <p>비밀번호를 변경하지 않으려면 비워두세요</p>}
        </div>

        <div>
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)}>
              수정하기
            </button>
          ) : (
            <>
              <button type="submit">저장하기</button>
              <button type="button" onClick={handleCancel}>
                취소
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;

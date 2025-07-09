import { UserProfileUpdateInput } from "../validators/userSchema";

/**
 * 사용자 정보를 업데이트하는 비즈니스 로직
 * @param data - 폼에서 입력받은 사용자 정보
 * @returns - 처리 결과 (성공 여부, 메시지)
 */
export const updateUserProfile = async (
  data: UserProfileUpdateInput
): Promise<{ success: boolean; message: string }> => {
  console.log("업데이트할 사용자 정보 (유효성 검사 완료):", data);

  // password가 비어있으면 전송 데이터에서 제외합니다.
  const payload: Partial<UserProfileUpdateInput> = { ...data };
  if (!payload.password) {
    delete payload.password;
  }

  console.log("서버로 전송될 최종 데이터:", payload);

  try {
    // 실제 API 호출 (Next.js API 라우트 경로)
    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("서버 응답:", result);

    return result;
  } catch (error) {
    console.error("사용자 정보 업데이트 실패:", error);
    return {
      success: false,
      message: "사용자 정보 업데이트에 실패했습니다.",
    };
  }
};

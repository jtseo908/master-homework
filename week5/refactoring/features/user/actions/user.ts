import { UserProfileUpdateInput } from "../validators/userSchema";

/**
 * 사용자 정보를 업데이트하는 비즈니스 로직 (API 호출을 모방)
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

  // --- 여기에서 실제 API 호출이 이루어집니다 ---
  // Ex) await api.put('/user/profile', payload);

  // 모의 비동기 처리를 위해 약간의 딜레이를 줍니다.
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("서버로 전송될 최종 데이터:", payload);

  return {
    success: true,
    message: "사용자 정보가 성공적으로 업데이트되었습니다!",
  };
};

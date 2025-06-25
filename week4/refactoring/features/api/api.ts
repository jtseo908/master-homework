// API 호출 추상화 (실제 호출하는 코드로 교체 가능)

import { UserInfo } from "../validators/userSchema";

export const userApi = {
  updateUser: async (data: UserInfo) => {
    console.log("업데이트 API 호출", data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // mock delay
  },
};

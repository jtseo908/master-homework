"use server";

import z from "zod";
import { userApi } from "../api/api";
import { userInfoSchema } from "../validators/userSchema";

export async function updateUserInfo(
  prevState: { message: string | null },
  formData: FormData
) {
  try {
    const data = {
      username: formData.get("username")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    };

    const parsed = userInfoSchema.parse(data);

    await userApi.updateUser(parsed);

    return { message: "사용자 정보가 성공적으로 업데이트되었습니다!" };
  } catch (err) {
    if (err instanceof Error) {
      return { message: err.message };
    }
    if (err instanceof z.ZodError) {
      return { message: err.errors[0]?.message };
    }
    return { message: "알 수 없는 오류가 발생했습니다." };
  }
}

// 유효성 검증 분리
import { z } from "zod";

export const userInfoSchema = z.object({
  username: z.string().min(1, "사용자 이름을 입력해주세요."),
  email: z.string().email("올바른 이메일을 입력해주세요."),
  password: z
    .string()
    .optional()
    .refine((pw) => !pw || pw.length >= 6, "비밀번호는 6자 이상이어야 합니다."),
});

export type UserInfo = z.infer<typeof userInfoSchema>;

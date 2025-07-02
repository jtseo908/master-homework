import { z } from "zod";

// DB에 저장될 User 모델을 모방한 기본 스키마
export const UserDBSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(2, "사용자 이름은 2자 이상이어야 합니다."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  passwordHash: z.string(), // 실제 DB에는 해시된 비밀번호가 저장됩니다.
});

// 프로필 업데이트 폼을 위한 DTO (Data Transfer Object) 스키마
export const UserProfileUpdateSchema = z
  .object({
    username: z.string().min(1, "사용자 이름을 입력해주세요."),
    email: z.string().email("올바른 이메일을 입력해주세요."),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // 비밀번호가 존재하고, 6자 미만일 경우 유효성 검사 실패
      if (
        data.password &&
        data.password.length > 0 &&
        data.password.length < 6
      ) {
        return false;
      }
      return true;
    },
    {
      // refine 실패 시 표시될 메시지
      message: "비밀번호는 최소 6자 이상이어야 합니다.",
      // 에러가 발생할 필드 지정
      path: ["password"],
    }
  );

// 폼에서 사용할 타입
export type UserProfileUpdateInput = z.infer<typeof UserProfileUpdateSchema>;

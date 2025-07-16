import { z } from "zod";

// 기본 User 스키마
export const BaseUserSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email("올바른 이메일 형식을 입력해주세요"),
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .max(50, "이름은 50자 이하로 입력해주세요"),
    image: z.string().url().optional(),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다"
      ),
    passwordConfirm: z.string(),
    emailVerified: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

// 로그인 스키마 - pick 사용
export const LoginSchema = BaseUserSchema.pick({
  email: true,
  password: true,
});

// 회원가입 스키마 - pick 사용
export const RegisterSchema = BaseUserSchema.pick({
  email: true,
  name: true,
  password: true,
  passwordConfirm: true,
});

// 프로필 업데이트 스키마 - omit 사용 (민감한 정보 제외)
export const ProfileUpdateSchema = BaseUserSchema.omit({
  id: true,
  password: true,
  passwordConfirm: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
});

// 비밀번호 변경 스키마 - pick 사용
export const ChangePasswordSchema = BaseUserSchema.pick({
  password: true,
  passwordConfirm: true,
}).extend({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
});

// 비밀번호 재설정 스키마 - pick 사용
export const ResetPasswordSchema = BaseUserSchema.pick({
  email: true,
});

// 이메일 인증 스키마
export const EmailVerificationSchema = z.object({
  token: z.string().min(1, "인증 토큰이 필요합니다"),
  email: z.string().email("올바른 이메일 형식을 입력해주세요"),
});

// 타입 추론
export type BaseUser = z.infer<typeof BaseUserSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type ProfileUpdateFormData = z.infer<typeof ProfileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
export type EmailVerificationData = z.infer<typeof EmailVerificationSchema>;

// 폼 필드별 스키마 (실시간 검증용)
export const fieldSchemas = {
  email: BaseUserSchema.shape.email,
  password: BaseUserSchema.shape.password,
  name: BaseUserSchema.shape.name,
} as const;

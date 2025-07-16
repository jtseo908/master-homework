import {
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  Path,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema, ZodType, z } from "zod";
import { useCallback } from "react";
import { fieldSchemas } from "../schemas/auth.schema";

// 제네릭 폼 훅 인터페이스
interface UseFormValidationProps<TFieldValues extends FieldValues>
  extends Omit<UseFormProps<TFieldValues>, "resolver"> {
  schema: ZodSchema<TFieldValues>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  enableRealTimeValidation?: boolean;
}

// 확장된 폼 리턴 타입
interface ExtendedFormReturn<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  validateField: (
    fieldName: Path<TFieldValues>,
    value: any
  ) => Promise<string | undefined>;
  getFieldError: (fieldName: Path<TFieldValues>) => string | undefined;
  hasErrors: boolean;
  register: UseFormReturn<TFieldValues>["register"];
  watch: UseFormReturn<TFieldValues>["watch"];
  setValue: UseFormReturn<TFieldValues>["setValue"];
  getValues: UseFormReturn<TFieldValues>["getValues"];
  reset: UseFormReturn<TFieldValues>["reset"];
  formState: UseFormReturn<TFieldValues>["formState"];
}

// 메인 폼 검증 훅 - 제네릭으로 확장성 제공
export function useFormValidation<
  TFieldValues extends FieldValues = FieldValues
>({
  schema,
  onSubmit,
  enableRealTimeValidation = true,
  ...formProps
}: UseFormValidationProps<TFieldValues>): ExtendedFormReturn<TFieldValues> {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema as any),
    mode: enableRealTimeValidation ? "onChange" : "onSubmit",
    reValidateMode: "onChange",
    ...formProps,
  });

  const {
    handleSubmit: rhfHandleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    register,
    watch,
    setValue,
    getValues,
    reset,
    formState,
  } = form;

  // 개별 필드 검증 함수
  const validateField = useCallback(
    async (
      fieldName: Path<TFieldValues>,
      value: any
    ): Promise<string | undefined> => {
      try {
        // 단순화된 필드 검증
        const result = await schema.safeParseAsync({
          [fieldName]: value,
        } as any);
        if (!result.success) {
          const fieldError = result.error.issues.find((issue) =>
            issue.path.includes(fieldName as string)
          );
          if (fieldError) {
            const errorMessage = fieldError.message;
            setError(fieldName, {
              type: "manual",
              message: errorMessage,
            });
            return errorMessage;
          }
        } else {
          clearErrors(fieldName);
          return undefined;
        }
      } catch (error: any) {
        const errorMessage = "유효하지 않은 값입니다";
        setError(fieldName, {
          type: "manual",
          message: errorMessage,
        });
        return errorMessage;
      }
    },
    [schema, setError, clearErrors]
  );

  // 필드 에러 메시지 가져오기
  const getFieldError = useCallback(
    (fieldName: Path<TFieldValues>): string | undefined => {
      return errors[fieldName]?.message as string | undefined;
    },
    [errors]
  );

  // 커스텀 submit 핸들러
  const handleSubmit = useCallback(
    async (e?: React.BaseSyntheticEvent) => {
      e?.preventDefault();

      return rhfHandleSubmit(async (data) => {
        try {
          await onSubmit(data);
        } catch (error) {
          console.error("Form submission error:", error);
        }
      })(e);
    },
    [rhfHandleSubmit, onSubmit]
  );

  return {
    form,
    handleSubmit,
    isSubmitting,
    validateField,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0,
    register,
    watch,
    setValue,
    getValues,
    reset,
    formState,
  };
}

// 특정 인증 폼들을 위한 특화된 훅들
export const useLoginForm = (onSubmit: (data: any) => void | Promise<void>) => {
  const { LoginSchema } = require("../schemas/auth.schema");
  return useFormValidation({
    schema: LoginSchema,
    onSubmit,
    defaultValues: {
      email: "",
      password: "",
    } as any,
  });
};

export const useRegisterForm = (
  onSubmit: (data: any) => void | Promise<void>
) => {
  const { RegisterSchema } = require("../schemas/auth.schema");
  return useFormValidation({
    schema: RegisterSchema,
    onSubmit,
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    } as any,
  });
};

export const useResetPasswordForm = (
  onSubmit: (data: any) => void | Promise<void>
) => {
  const { ResetPasswordSchema } = require("../schemas/auth.schema");
  return useFormValidation({
    schema: ResetPasswordSchema,
    onSubmit,
    defaultValues: {
      email: "",
    } as any,
  });
};

export const useChangePasswordForm = (
  onSubmit: (data: any) => void | Promise<void>
) => {
  const { ChangePasswordSchema } = require("../schemas/auth.schema");
  return useFormValidation({
    schema: ChangePasswordSchema,
    onSubmit,
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    } as any,
  });
};

// 실시간 필드 검증 훅 (개별 필드용)
export const useFieldValidation = <T extends keyof typeof fieldSchemas>(
  fieldName: T,
  value: string,
  enabled: boolean = true
) => {
  const schema = fieldSchemas[fieldName];

  const validateField = useCallback(async (): Promise<{
    isValid: boolean;
    error?: string;
  }> => {
    if (!enabled || !value) {
      return { isValid: true };
    }

    try {
      await schema.parseAsync(value);
      return { isValid: true };
    } catch (error: any) {
      return {
        isValid: false,
        error: error.errors?.[0]?.message || "유효하지 않은 값입니다",
      };
    }
  }, [schema, value, enabled]);

  return { validateField };
};

// 디바운스를 활용한 실시간 검증 훅
export const useDebouncedFieldValidation = <
  T extends keyof typeof fieldSchemas
>(
  fieldName: T,
  value: string,
  delay: number = 300
) => {
  const { validateField } = useFieldValidation(fieldName, value);

  // 실제 구현에서는 useDebounce 훅을 사용하거나 setTimeout을 활용
  // 여기서는 기본 구조만 제공
  return { validateField };
};

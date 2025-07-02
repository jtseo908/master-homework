import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserProfileUpdateSchema,
  UserProfileUpdateInput,
} from "../validators/userSchema";
import { updateUserProfile } from "../actions/user";

interface UseUserProfileFormProps {
  initialData: {
    username: string;
    email: string;
  };
}

export const useUserProfileForm = ({
  initialData,
}: UseUserProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const formMethods = useForm<UserProfileUpdateInput>({
    resolver: zodResolver(UserProfileUpdateSchema),
    defaultValues: {
      ...initialData,
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = formMethods;

  useEffect(() => {
    // isEditing 상태가 false로 변경되면 form의 값을 초기값으로 되돌립니다.
    if (!isEditing) {
      reset({
        ...initialData,
        password: "",
      });
      setServerMessage("");
    }
  }, [isEditing, initialData, reset]);

  const onSubmit: SubmitHandler<UserProfileUpdateInput> = async (data) => {
    const result = await updateUserProfile(data);
    setServerMessage(result.message);

    if (result.success) {
      setIsEditing(false);
      // 성공 시 폼의 defaultValues를 업데이트하여, '취소'를 눌렀을 때 변경된 값으로 돌아가지 않도록 합니다.
      reset(data);
    }

    // 3초 후 메시지 자동 제거
    const timer = setTimeout(() => setServerMessage(""), 3000);
    return () => clearTimeout(timer);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  return {
    formMethods,
    state: {
      isEditing,
      isSubmitting,
      serverMessage,
    },
    handlers: {
      onSubmit: handleSubmit(onSubmit),
      handleEdit,
      handleCancel,
    },
  };
};

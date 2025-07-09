import { useState, useEffect, useRef } from "react";
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
  const [currentData, setCurrentData] = useState(initialData);
  const isSuccessfulUpdate = useRef(false);

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
    // isEditing 상태가 false로 변경되면서 성공적인 업데이트가 아닌 경우에만 초기값으로 되돌립니다.
    if (!isEditing && !isSuccessfulUpdate.current) {
      reset({
        ...currentData,
        password: "",
      });
      setServerMessage("");
    }
    // 성공적인 업데이트 플래그 리셋
    isSuccessfulUpdate.current = false;
  }, [isEditing, currentData, reset]);

  const onSubmit: SubmitHandler<UserProfileUpdateInput> = async (data) => {
    const result = await updateUserProfile(data);
    setServerMessage(result.message);

    if (result.success) {
      // 성공 시 현재 데이터 업데이트
      const newData = { username: data.username, email: data.email };
      setCurrentData(newData);
      isSuccessfulUpdate.current = true;
      setIsEditing(false);
      // 성공 시 폼의 defaultValues를 업데이트
      reset({ ...newData, password: "" });
    }

    // 3초 후 메시지 자동 제거
    const timer = setTimeout(() => {
      setServerMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

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

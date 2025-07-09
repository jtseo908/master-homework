/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserProfileForm, { UserProfileFormProps } from "../UserProfileForm";

type UserData = UserProfileFormProps["initialData"];

// useUserProfileForm 훅을 모킹합니다.
// 실제 훅의 복잡한 로직(zod, react-hook-form, server action)을 테스트에서 분리합니다.
jest.mock("../../hooks/useUserProfileForm", () => ({
  useUserProfileForm: ({ initialData }: { initialData: UserData }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [values, setValues] = React.useState(initialData);

    const formMethods = {
      register: (name: keyof UserData) => ({
        name,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target;
          setValues((prev: UserData) => ({ ...prev, [name]: value }));
        },
        value: values[name],
        disabled: !isEditing,
      }),
      formState: {
        errors: {
          ...(values.username === "" && {
            username: { message: "사용자 이름은 필수입니다." },
          }),
        },
      },
      handleSubmit:
        (fn: (data: UserData) => void) => (e?: React.BaseSyntheticEvent) => {
          e?.preventDefault();
          fn(values);
        },
      reset: (data: UserData) => setValues(data),
    };

    const handlers = {
      onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (values.username === "") return;
        setIsSubmitting(true);
        // 실제 제출 로직은 여기서 테스트하지 않습니다.
        setTimeout(() => setIsSubmitting(false), 500);
      },
      handleEdit: () => setIsEditing(true),
      handleCancel: () => {
        setIsEditing(false);
        setValues(initialData);
      },
    };

    return {
      formMethods,
      state: { isEditing, isSubmitting, serverMessage: null },
      handlers,
    };
  },
}));

const initialData: UserData = {
  username: "testuser",
  email: "test@example.com",
};

describe("UserProfileForm", () => {
  it("초기 데이터를 올바르게 렌더링해야 합니다.", () => {
    render(<UserProfileForm initialData={initialData} />);
    expect(screen.getByLabelText(/사용자 이름/i)).toHaveValue(
      initialData.username
    );
    expect(screen.getByLabelText(/이메일/i)).toHaveValue(initialData.email);
    expect(
      screen.getByRole("button", { name: /수정하기/i })
    ).toBeInTheDocument();
  });

  it("수정 버튼을 누르면 입력 필드가 활성화됩니다.", async () => {
    const user = userEvent.setup();
    render(<UserProfileForm initialData={initialData} />);

    const editButton = screen.getByRole("button", { name: /수정하기/i });
    await user.click(editButton);

    expect(screen.getByLabelText(/사용자 이름/i)).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: /저장하기/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /취소/i })).toBeInTheDocument();
  });

  it("수정 모드에서 사용자 입력을 처리해야 합니다.", async () => {
    const user = userEvent.setup();
    render(<UserProfileForm initialData={initialData} />);

    await user.click(screen.getByRole("button", { name: /수정하기/i }));

    const usernameInput = screen.getByLabelText(/사용자 이름/i);
    await user.clear(usernameInput);
    await user.type(usernameInput, "new_username");
    expect(usernameInput).toHaveValue("new_username");
  });

  it("필수 필드가 비어 있으면 에러 메시지를 표시해야 합니다.", async () => {
    const user = userEvent.setup();
    render(<UserProfileForm initialData={initialData} />);

    await user.click(screen.getByRole("button", { name: /수정하기/i }));

    const usernameInput = screen.getByLabelText(/사용자 이름/i);
    await user.clear(usernameInput);

    expect(
      await screen.findByText("사용자 이름은 필수입니다.")
    ).toBeInTheDocument();
  });
});

"use client";

import React from "react";
import styled, { css } from "styled-components";
import { useUserProfileForm } from "../hooks/useUserProfileForm";

interface UserProfileFormProps {
  // 실제 앱에서는 API 등을 통해 초기 사용자 정보를 받아옵니다.
  initialData: {
    username: string;
    email: string;
  };
}

const UserProfileForm = ({ initialData }: UserProfileFormProps) => {
  const { formMethods, state, handlers } = useUserProfileForm({ initialData });
  const {
    register,
    formState: { errors },
  } = formMethods;
  const { isEditing, isSubmitting, serverMessage } = state;
  const { onSubmit, handleEdit, handleCancel } = handlers;

  return (
    <FormContainer onSubmit={onSubmit}>
      <Header>
        <Title>사용자 프로필</Title>
        {!isEditing && (
          <EditButton type="button" onClick={handleEdit}>
            수정하기
          </EditButton>
        )}
      </Header>

      {serverMessage && <ServerMessage>{serverMessage}</ServerMessage>}

      <Fieldset disabled={!isEditing || isSubmitting}>
        <Field>
          <Label htmlFor="username">사용자 이름</Label>
          <Input id="username" {...register("username")} />
          {errors.username && (
            <ErrorMessage>{errors.username.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </Field>

        <Field>
          <Label htmlFor="password">새 비밀번호</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="변경 시에만 입력"
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
          {isEditing && <Hint>비밀번호를 변경하지 않으려면 비워두세요.</Hint>}
        </Field>
      </Fieldset>

      {isEditing && (
        <ButtonContainer>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "저장하기"}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </SecondaryButton>
        </ButtonContainer>
      )}
    </FormContainer>
  );
};

// --- Styled Components ---

const FormContainer = styled.form`
  background-color: #f9f9f9;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ServerMessage = styled.p`
  background-color: #e6f7ff;
  color: #00529b;
  border: 1px solid #b3e0ff;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
`;

const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:disabled {
    opacity: 0.7;
    pointer-events: none;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const ErrorMessage = styled.p`
  color: #d93025;
  font-size: 13px;
  margin: 4px 0 0;
`;

const Hint = styled.p`
  color: #666;
  font-size: 13px;
  margin: 4px 0 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const ButtonBase = css`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const EditButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: #007bff;
  padding: 8px 12px;
  border: 1px solid #007bff;

  &:hover {
    background-color: rgba(0, 123, 255, 0.05);
  }
`;

const PrimaryButton = styled.button`
  ${ButtonBase}
  background-color: #007bff;
  color: white;
  flex-grow: 1;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const SecondaryButton = styled.button`
  ${ButtonBase}
  background-color: #e9ecef;
  color: #333;
  flex-grow: 1;

  &:hover:not(:disabled) {
    background-color: #d6d8db;
  }
`;

export default UserProfileForm;

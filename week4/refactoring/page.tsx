import React, { Suspense } from "react";
import UserProfileForm from "./features/ui/UserProfileForm";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>폼을 불러오는 중입니다...</div>}>
      <UserProfileForm />
    </Suspense>
  );
}

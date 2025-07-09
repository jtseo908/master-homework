import { test, expect } from "@playwright/test";

test.describe("UserProfileForm E2E 테스트", () => {
  test("사용자 프로필을 성공적으로 수정해야 합니다.", async ({ page }) => {
    // week6 페이지로 이동
    await page.goto("http://localhost:3000/week6");

    // 페이지가 로드될 때까지 대기
    await page.waitForLoadState("networkidle");

    // '수정하기' 버튼이 표시될 때까지 대기 후 클릭
    const editButton = page.locator('button:has-text("수정하기")');
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 수정 모드로 변경되었는지 확인 (저장하기 버튼이 나타날 때까지 대기)
    const saveButton = page.locator('button:has-text("저장하기")');
    await expect(saveButton).toBeVisible();

    // 입력 필드가 활성화되었는지 확인
    const usernameInput = page.locator('input[id="username"]');
    const emailInput = page.locator('input[id="email"]');

    await expect(usernameInput).toBeEnabled();
    await expect(emailInput).toBeEnabled();

    // 입력 필드에 값 입력
    await usernameInput.fill("테스트사용자");
    await emailInput.fill("test@example.com");

    // '저장하기' 버튼 클릭
    await saveButton.click();

    // 수정 모드가 종료되었는지 확인 (수정하기 버튼이 다시 나타남)
    await expect(editButton).toBeVisible();

    // 폼이 비수정 모드로 돌아갔는지 확인 (입력 필드 비활성화)
    await expect(usernameInput).toBeDisabled();
    await expect(emailInput).toBeDisabled();

    // 입력한 값이 저장되었는지 확인
    await expect(usernameInput).toHaveValue("테스트사용자");
    await expect(emailInput).toHaveValue("test@example.com");
  });
});

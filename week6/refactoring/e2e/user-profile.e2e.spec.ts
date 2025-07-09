import { createWorkerFixture, MockServiceWorker } from "playwright-msw";
import { test as base, expect } from "@playwright/test";
import { http, HttpResponse, HttpHandler } from "msw";

// API 핸들러 정의
const handlers: HttpHandler[] = [
  http.put("/user/profile", () => {
    return HttpResponse.json({
      success: true,
      message: "사용자 정보가 성공적으로 업데이트되었습니다!",
    });
  }),
];

// createWorkerFixture를 사용하여 MSW 워커 fixture를 생성하고,
// Playwright의 test 객체를 확장합니다.
const test = base.extend<{
  worker: MockServiceWorker;
  http: typeof http;
}>({
  worker: createWorkerFixture(handlers),
  http,
});

test.describe("UserProfileForm E2E 테스트", () => {
  test("사용자 프로필을 성공적으로 수정해야 합니다.", async ({ page }) => {
    // week6 페이지로 이동합니다.
    await page.goto("/week6");

    // '수정하기' 버튼을 클릭합니다.
    await page.getByRole("button", { name: "수정하기" }).click();

    // 사용자 이름과 이메일을 수정합니다.
    const usernameInput = page.getByLabel("사용자 이름");
    await usernameInput.fill("new_username");

    const emailInput = page.getByLabel("이메일");
    await emailInput.fill("new_email@example.com");

    // '저장하기' 버튼을 클릭합니다.
    await page.getByRole("button", { name: "저장하기" }).click();

    // 성공 메시지가 화면에 표시되는지 확인합니다.
    const successMessage = page.getByText(
      "사용자 정보가 성공적으로 업데이트되었습니다!"
    );
    await expect(successMessage).toBeVisible();

    // 수정 모드가 종료되고 '수정하기' 버튼이 다시 표시되는지 확인합니다.
    await expect(page.getByRole("button", { name: "수정하기" })).toBeVisible();

    // 입력 필드가 비활성화되었는지 확인합니다.
    await expect(usernameInput).toBeDisabled();
    await expect(emailInput).toBeDisabled();
  });
});

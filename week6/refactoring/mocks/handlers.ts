import { http, HttpResponse } from "msw";

export const handlers = [
  http.put("/user/profile", async () => {
    return HttpResponse.json({
      success: true,
      message: "사용자 정보가 성공적으로 업데이트되었습니다!",
    });
  }),
];

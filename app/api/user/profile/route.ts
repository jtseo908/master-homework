import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("사용자 프로필 업데이트 요청:", body);

    // 간단한 성공 응답 반환 (테스트용)
    return NextResponse.json({
      success: true,
      message: "사용자 정보가 성공적으로 업데이트되었습니다!",
    });
  } catch (error) {
    console.error("API 에러:", error);
    return NextResponse.json(
      {
        success: false,
        message: "사용자 정보 업데이트에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

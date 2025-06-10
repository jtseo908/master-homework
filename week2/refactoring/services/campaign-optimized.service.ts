import { AxiosError } from "axios";
import { api } from "../apis/api-client/api-client";
import { CampaignApiClient } from "../apis/campaign/campaign-optimized.api";

// ===== 🎯 리팩토링된 Campaign Service =====

interface UpdateCampaignStatusParams {
  id: string;
  activeStatus: "active" | "inactive";
  onFinally?: (success: boolean) => void;
}

// CampaignApiClient 인스턴스 생성
const campaignApiClient = new CampaignApiClient();

// Before (기존 방식)
/*
export const updateCampaignActiveStatus = async (campaignInfo: UpdateCampaignStatusParamType) => {
  const { id, activeStatus, onFinally } = campaignInfo;
  const reqDto = { autoCampaignId: id };
  const newStatus = activeStatus === 'active' ? 'inactive' : 'activate';
  const toastMessage = activeStatus === 'active' ? '캠페인을 비활성화했습니다.' : '캠페인을 활성화했습니다.';
  let success = false;

  try {
    await campaignApi.updateCampaignActiveStatus(newStatus, reqDto);
    success = true;
    await mutate('/auto-campaign/all');
    ToastCustom(toastMessage);
  } catch (err) {
    // 복잡한 에러 처리...
    alert(errMessage);
  } finally {
    onFinally?.(success);
  }
};
*/

// After (새로운 방식) - CampaignApiClient 활용!
export const updateCampaignActiveStatusOptimized = async (
  params: UpdateCampaignStatusParams
) => {
  const { id, activeStatus, onFinally } = params;

  const reqDto = { autoCampaignId: id };
  const newStatus = activeStatus === "active" ? "inactive" : "activate";

  try {
    // CampaignApiClient의 updateActiveStatus 메서드 사용
    const result = await campaignApiClient.updateActiveStatus(
      newStatus,
      reqDto
    );

    onFinally?.(result.success);
    return result;
  } catch (error) {
    // API 클라이언트에서 이미 에러 처리 완료
    onFinally?.(false);
    throw error;
  }
};

// ===== 🎁 더 고급 사용법: 빌더 패턴 =====

export const updateCampaignStatusAdvanced = async (
  params: UpdateCampaignStatusParams
) => {
  const { id, activeStatus, onFinally } = params;

  const reqDto = { autoCampaignId: id };
  const newStatus = activeStatus === "active" ? "inactive" : "activate";
  const successMessage =
    activeStatus === "active"
      ? "캠페인을 비활성화했습니다."
      : "캠페인을 활성화했습니다.";

  // 빌더 패턴으로 더 세밀한 제어가 필요한 경우
  const request = api
    .build()
    .endpoint(`/auto-campaign/${newStatus}`)
    .payload(reqDto)
    .invalidateCache(["/auto-campaign/all", `/auto-campaign/${id}`])
    .successMessage(successMessage)
    .retry(3)
    .errorMessage("캠페인 상태 변경에 실패했습니다. 다시 시도해주세요.");

  try {
    const result = await api.execute(request, "POST");
    onFinally?.(result.success);
    return result;
  } catch (error) {
    onFinally?.(false);
    throw error;
  }
};

// ===== 📊 비교: 코드 간소화 효과 =====

/*
기존 방식 (20+ 줄):
- 수동 에러 처리 (try-catch)
- 수동 mutate 호출
- 수동 토스트 메시지
- 수동 에러 메시지 추출
- 복잡한 finally 블록

새로운 방식 (5-10 줄):
- CampaignApiClient 활용
- 자동 에러 처리
- 자동 캐시 무효화
- 자동 성공/에러 메시지
- 재시도 로직 내장
- 타입 안전성
*/

// ===== 🚀 실제 사용 예시 =====

/*
// 기존 컴포넌트에서
const handleToggleStatus = async (campaign: Campaign) => {
  await updateCampaignActiveStatusOptimized({
    id: campaign.id,
    activeStatus: campaign.status,
    onFinally: (success) => {
      if (success) {
        // 추가 로직
      }
    }
  });
};
*/

// ===== 🎯 리팩토링된 Campaign API =====

import { api } from "../api-client/api-client";
import { CreateAutoCampaignTagSchema } from "./auto-campaign-schemas";
import {
  CreateAutoCampaignTagDto,
  InactiveAutoCampaignDto,
} from "./auto-campaign.dto";

export class CampaignApiClient {
  // 태그 생성
  async createTag(reqDto: CreateAutoCampaignTagDto) {
    CreateAutoCampaignTagSchema.parse(reqDto);

    return api.post("/auto-campaign/campaign-tag", reqDto, {
      invalidateCache: ["/auto-campaign/campaign-tag/all"],
      successMessage: "자동화 캠페인 태그를 생성했습니다.",
    });
  }

  // 캠페인 활성화/비활성화
  async updateActiveStatus(
    activeStatus: "activate" | "inactive",
    reqDto: InactiveAutoCampaignDto
  ) {
    const message =
      activeStatus === "activate"
        ? "캠페인을 활성화했습니다."
        : "캠페인을 비활성화했습니다.";

    return api.post(`/auto-campaign/${activeStatus}`, reqDto, {
      invalidateCache: ["/auto-campaign/all"],
      successMessage: message,
      retries: 2,
    });
  }
}

// ===== 📋 사용 예시 비교 =====

/*
// Before (기존 방식)
export const tagApi = {
  async create(type: PageKeyType, name: string, id?: string) {
    switch (type) {
      case 'auto-campaign': {
        const response = await campaignApi.createCampaignTag({ name });
        await mutate(['fetchTagList', type]);
        ToastCustom('자동화 캠페인 태그를 생성했습니다.');
        return response;
      }
    }
  }
};

// After (새로운 방식)
const result = await campaignApiOptimized.createTag({ name });
// 자동으로 캐시 무효화, 토스트, 에러 처리 모두 완료!
*/

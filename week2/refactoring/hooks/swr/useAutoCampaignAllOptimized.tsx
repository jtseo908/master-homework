import {
  useEnhancedSWR,
  SWRPresets,
  useCacheControl,
} from "../../apis/api-client/enhanced-swr";
import { AutoCampaignResDto } from "../../apis/campaign/auto-campaign.dto";

/**
 * 리팩토링된 AutoCampaign 훅
 * - Enhanced SWR 적용 (메멘토 패턴 포함)
 * - 최적화된 캐시 설정 (5분 캐시, 3회 재시도)
 * - 캐시 관리 기능 추가
 */
const useAutoCampaignAll = () => {
  // SWR 프리셋을 사용한 최적화된 설정
  const {
    data = [],
    isLoading,
    error,
    mutate,
  } = useEnhancedSWR<AutoCampaignResDto[]>(
    "/auto-campaign/all",
    SWRPresets.list()
  );

  // 캐시 관리 기능
  const { createSnapshot, restoreSnapshot, invalidate } = useCacheControl();

  return {
    // 기존 API 유지 (완전 호환)
    autoCampaignList: data || [],
    isAutoCampaignLoading: isLoading,
    mutateAutoCampaign: mutate,

    // 새로운 기능들
    error,
    isError: !!error,

    // 캐시 관리 기능
    cacheControl: {
      createSnapshot: () => createSnapshot(),
      restoreSnapshot: (index?: number) => restoreSnapshot(index),
      invalidateCache: () => invalidate("/auto-campaign/all"),
    },

    // 편의 메서드들
    refresh: () => mutate(),
    isEmpty: !isLoading && (!data || data.length === 0),
    hasData: !isLoading && data && data.length > 0,
  };
};

export default useAutoCampaignAll;

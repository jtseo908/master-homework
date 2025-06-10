'use client';

import { useDataClient } from './unified-client';

// ===== 🎯 통합된 클라이언트 사용 예시 =====

function CampaignManagerUnified() {
  const { useQuery, post, invalidateQueries, useMutation } = useDataClient();

  // ===== 1️⃣ 데이터 조회 (SWR 기반) =====
  const {
    data: campaigns,
    isLoading,
    mutate: refetchCampaigns,
  } = useQuery<Campaign[]>('/auto-campaign/all', {
    strategy: 'cache-first',
    ttl: 300000, // 5분 캐시
  });

  const { data: tags } = useQuery('/auto-campaign/campaign-tag/all', {
    strategy: 'cache-first',
    ttl: 600000, // 10분 캐시 (태그는 덜 자주 변경됨)
  });

  // ===== 2️⃣ 데이터 변경 (Mutation) =====

  // 방법 1: 직접 호출
  const handleCreateCampaign = async (campaignData: any) => {
    const result = await post('/auto-campaign', campaignData, {
      invalidateQueries: ['/auto-campaign/all'],
      successMessage: '캠페인이 생성되었습니다!',
      optimisticUpdate: [...(campaigns || []), { ...campaignData, id: 'temp' }],
    });

    if (result.success) {
      console.log('캠페인 생성 성공:', result.data);
    }
  };

  // 방법 2: useMutation 훅 사용
  const createTagMutation = useMutation(
    () =>
      post(
        '/auto-campaign/campaign-tag',
        { name: '새 태그' },
        {
          invalidateQueries: ['/auto-campaign/campaign-tag/all'],
          successMessage: '태그가 생성되었습니다!',
        },
      ),
    {
      onSuccess: (data) => {
        console.log('태그 생성 성공:', data);
      },
      onError: (error) => {
        console.error('태그 생성 실패:', error);
      },
    },
  );

  // ===== 3️⃣ 복합 상황: 캠페인 상태 토글 =====
  const handleToggleCampaignStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'inactive' : 'activate';

    const result = await post(
      `/auto-campaign/${newStatus}`,
      { autoCampaignId: campaign.id },
      {
        invalidateQueries: ['/auto-campaign/all', `/auto-campaign/${campaign.id}`],
        successMessage: `캠페인을 ${newStatus === 'activate' ? '활성화' : '비활성화'}했습니다.`,
        optimisticUpdate: campaigns?.map((c) =>
          c.id === campaign.id ? { ...c, status: newStatus === 'activate' ? 'active' : 'inactive' } : c,
        ),
        retries: 2,
      },
    );

    if (!result.success) {
      // 실패 시 원본 데이터로 롤백 (자동으로 처리됨)
      console.error('상태 변경 실패');
    }
  };

  return (
    <div>
      <h1>캠페인 관리</h1>

      {/* 로딩 상태 */}
      {isLoading && <div>로딩 중...</div>}

      {/* 캠페인 목록 */}
      <div>
        {campaigns?.map((campaign) => (
          <div key={campaign.id}>
            <span>{campaign.name}</span>
            <button onClick={() => handleToggleCampaignStatus(campaign)}>
              {campaign.status === 'active' ? '비활성화' : '활성화'}
            </button>
          </div>
        ))}
      </div>

      {/* 액션 버튼들 */}
      <button onClick={() => handleCreateCampaign({ name: '새 캠페인' })}>캠페인 생성</button>

      <button onClick={() => createTagMutation.mutate()} disabled={createTagMutation.isLoading}>
        {createTagMutation.isLoading ? '생성 중...' : '태그 생성'}
      </button>

      <button onClick={() => refetchCampaigns()}>수동 새로고침</button>
    </div>
  );
}

// ===== 🔥 실시간 데이터 예시 =====

function RealtimeDashboard() {
  const { useQuery } = useDataClient();

  // 실시간 통계 (5초마다 업데이트)
  const { data: stats } = useQuery<RealtimeStats>('/stats/realtime', {
    strategy: 'realtime',
    refreshInterval: 5000,
  });

  // 일반 설정 (변경이 드문 데이터)
  const { data: config } = useQuery<AppConfig>('/app/config', {
    strategy: 'cache-first',
    ttl: 1800000, // 30분
    revalidateOnFocus: false,
  });

  return (
    <div>
      <h2>실시간 대시보드</h2>
      <div>활성 사용자: {stats?.activeUsers}</div>
      <div>진행중 캠페인: {stats?.activeCampaigns}</div>
      <div>앱 버전: {config?.version}</div>
    </div>
  );
}

// ===== 📋 기존 코드와 비교 =====

/*
// Before (분리된 구조)
import { useEnhancedSWR } from './enhanced-swr';
import { api } from './api-client';

const { data } = useEnhancedSWR('/campaigns');
await api.post('/campaigns', data, { invalidateCache: ['/campaigns'] });

// After (통합된 구조)
import { useDataClient } from './unified-client';

const { useQuery, post } = useDataClient();
const { data } = useQuery('/campaigns');
await post('/campaigns', data, { invalidateQueries: ['/campaigns'] });
*/

// ===== 타입 정의 =====
interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

interface RealtimeStats {
  activeUsers: number;
  activeCampaigns: number;
}

interface AppConfig {
  version: string;
}

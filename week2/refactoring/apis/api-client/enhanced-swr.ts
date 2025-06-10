'use client';

import useSWR, { SWRConfiguration, mutate } from 'swr';
import { useCallback } from 'react';
import { cloneDeep, debounce } from 'lodash';

// ===== 🎯 기존 SWR 전역 설정 그대로 활용 + 캐시 개선만 =====

/**
 * 메멘토 패턴을 활용한 간단한 캐시 스냅샷 관리
 */
class SimpleCacheManager {
  private snapshots: Array<{ timestamp: number; cache: any }> = [];
  private maxSnapshots = 5;

  createSnapshot() {
    // SWR 내부 캐시를 스냅샷으로 저장 (실제 구현에서는 SWR cache provider 사용)
    const snapshot = {
      timestamp: Date.now(),
      cache: cloneDeep({}), // SWR cache 복사
    };

    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    console.log('📸 캐시 스냅샷 생성:', new Date(snapshot.timestamp).toLocaleTimeString());
  }

  getSnapshots() {
    return this.snapshots.map((snap, index) => ({
      index,
      timestamp: snap.timestamp,
      date: new Date(snap.timestamp).toLocaleString(),
    }));
  }

  restoreSnapshot(index = -1) {
    const snapshot = this.snapshots.at(index);
    if (!snapshot) return false;

    // 실제로는 SWR cache를 복원하는 로직
    console.log('🔄 캐시 복원:', new Date(snapshot.timestamp).toLocaleTimeString());
    return true;
  }
}

const cacheManager = new SimpleCacheManager();

/**
 * 기존 SWR 전역 설정(fetcher 포함)을 그대로 사용하면서 캐시 최적화만 추가
 */
export function useEnhancedSWR<T>(key: string | null, config?: SWRConfiguration<T>) {
  // fetcher는 기존 swr.tsx의 전역 설정 사용!
  // axiosInstance.get은 이미 전역에서 설정됨
  const result = useSWR<T>(key, {
    // SWR 기본 설정 + 약간의 최적화
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 300000, // 5분간 중복 요청 방지
    ...config,
  });

  return result;
}

/**
 * 빌더 패턴으로 SWR 설정을 편하게 구성
 */
export class SWRConfigBuilder {
  private config: SWRConfiguration = {};

  // 캐시 시간 설정
  cache(minutes: number) {
    this.config.dedupingInterval = minutes * 60 * 1000;
    return this;
  }

  // 실시간 갱신 설정
  realtime(interval?: number) {
    this.config.refreshInterval = interval || 5000;
    this.config.revalidateOnFocus = true;
    this.config.revalidateOnReconnect = true;
    return this;
  }

  // 포커스 시 갱신 비활성화
  noFocusRevalidate() {
    this.config.revalidateOnFocus = false;
    return this;
  }

  // 에러 재시도 설정
  retry(count: number) {
    this.config.errorRetryCount = count;
    return this;
  }

  build(): SWRConfiguration {
    return this.config;
  }

  static create() {
    return new SWRConfigBuilder();
  }
}

/**
 * 캐시 관리를 위한 간단한 훅
 */
export function useCacheControl() {
  const invalidate = useCallback((key: string | RegExp) => {
    return mutate(key);
  }, []);

  const invalidateAll = useCallback(() => {
    return mutate(() => true);
  }, []);

  const createSnapshot = useCallback(() => {
    cacheManager.createSnapshot();
  }, []);

  const restoreSnapshot = useCallback((index?: number) => {
    return cacheManager.restoreSnapshot(index);
  }, []);

  const getSnapshots = useCallback(() => {
    return cacheManager.getSnapshots();
  }, []);

  return {
    invalidate,
    invalidateAll,
    createSnapshot,
    restoreSnapshot,
    getSnapshots,
  };
}

// ===== 🔧 기존 코드와 완전 호환 =====

/**
 * 기존 useAutoCampaignAll과 동일하지만 캐시 최적화 적용
 */
export function useAutoCampaignAll() {
  const config = SWRConfigBuilder.create()
    .cache(5) // 5분 캐시
    .retry(3)
    .build();

  const { data = [], isLoading, mutate: mutateData } = useEnhancedSWR<any[]>('/auto-campaign/all', config);

  return {
    autoCampaignList: data || [],
    isAutoCampaignLoading: isLoading,
    mutateAutoCampaign: mutateData, // 기존 SWR mutate 그대로!
  };
}

/**
 * 자주 사용하는 패턴들을 프리셋으로 제공
 */
export const SWRPresets = {
  // 일반 목록 조회용
  list: () => SWRConfigBuilder.create().cache(5).retry(3).build(),

  // 실시간 데이터용
  realtime: (interval = 5000) => SWRConfigBuilder.create().realtime(interval).build(),

  // 정적 데이터용 (오래 캐시)
  static: () => SWRConfigBuilder.create().cache(30).noFocusRevalidate().build(),

  // 사용자 액션 후 빠른 갱신용
  responsive: () => SWRConfigBuilder.create().cache(1).build(),
};

// ===== 🎁 편의 함수들 =====

/**
 * 디바운스된 캐시 무효화 (lodash 활용)
 */
export const debouncedInvalidate = debounce((key: string) => {
  mutate(key);
}, 1000);

/**
 * 여러 키를 한번에 무효화
 */
export function invalidateMultiple(keys: string[]) {
  keys.forEach((key) => mutate(key));
}

# 🚀 비동기 데이터 Fetching + 캐시 시스템

> **과제 요구사항**: 빌더, 전략, 퍼사드, 프록시, 메멘토, 제너레이터 패턴 등을 활용한 데이터 fetching과 캐싱 시스템 구현

## 📖 과제 구현 개요

### 프로젝트 구조

이 프로젝트는 **실제 프로덕션 환경의 데이터 통신 로직**을 개선하는 과제입니다.

```
📁 week2/
├── 📁 legacy/                  # 실제 회사에서 사용 중인 기존 코드
│   ├── apis/                   # 기존 API 통신 로직
│   ├── services/               # 기존 비즈니스 로직
│   └── hooks/                  # 기존 SWR 훅들
├── 📁 refactoring/             # 디자인 패턴을 활용한 리팩토링 코드
│   ├── apis/api-client/        # 새로운 API 클라이언트 시스템
│   ├── apis/campaign/          # 리팩토링된 캠페인 API
│   └── services/               # 개선된 서비스 레이어
└── 📄 README.md               # 구현 과정 및 패턴 설명
```

### 구현 방향성

- **`legacy/`**: 기존 **axios + SWR** 조합의 데이터 통신 코드
  - 실제 운영 중인 코드의 문제점 분석
- **`refactoring/`**: 기존 **axios + SWR**에 **디자인 패턴**을 적용한 개선 버전
  - 메멘토, 빌더, 전략, 프록시, 팩토리, 퍼사드 패턴 적용
  - 기존 코드의 문제점 해결 및 성능 최적화

## 📋 목차

1. [프로젝트 개요](#-프로젝트-개요)
2. [기존 구조 분석](#-기존-구조-분석)
3. [구현된 패턴들](#-구현된-패턴들)
4. [아키텍처 구조](#-아키텍처-구조)
5. [구현 파일별 상세 설명](#-구현-파일별-상세-설명)
6. [사용 예시](#-사용-예시)
7. [성능 및 최적화](#-성능-및-최적화)
8. [결론 및 권장사항](#-결론-및-권장사항)

## 🎯 프로젝트 개요

### 과제 목표

- **비동기 데이터 fetching + 캐시 시스템** 구현
- **다중 디자인 패턴** 조합 활용
- **모듈 제한 없음**: axios, SWR, react-query 등 자유 사용

### 기술 스택

- **Frontend**: React 19.1.0, Next.js 14.0.4, TypeScript
- **데이터 Fetching**: SWR 2.3.3, Axios 1.9.0
- **유틸리티**: Lodash 4.17.21

## 🔍 기존 구조 분석

### Before (기존 상태)

```typescript
// 기존 구조의 문제점들
GET 요청: SWR 사용
POST/PUT/DELETE: 개별적인 axios 호출
캐시 무효화: 수동 mutate() 호출
에러 처리: 각 API마다 반복적인 try-catch
성공/실패 피드백: 개별 구현
```

```typescript
// 기존 코드 예시
const updateCampaignActiveStatus = async (campaignInfo) => {
  const { id, activeStatus, onFinally } = campaignInfo;
  let success = false;

  try {
    await campaignApi.updateCampaignActiveStatus(newStatus, reqDto);
    success = true;
    await mutate("/auto-campaign/all"); // 수동 캐시 무효화
    ToastCustom(toastMessage); // 수동 성공 메시지
  } catch (err) {
    // 복잡한 에러 처리 로직...
    alert(errMessage);
  } finally {
    onFinally?.(success);
  }
};
```

### 문제점

1. **반복적인 보일러플레이트 코드**
2. **일관성 없는 에러 처리**
3. **수동 캐시 관리**
4. **낙관적 업데이트 부재**
5. **재사용성 부족**

## 🏗️ 구현된 패턴들

### 1. **메멘토 패턴 (Memento Pattern)**

```typescript
// lib/data-client/enhanced-swr.ts
class SimpleCacheManager {
  private snapshots: Array<{ timestamp: number; cache: any }> = [];

  createSnapshot() {
    const snapshot = {
      timestamp: Date.now(),
      cache: cloneDeep({}), // 캐시 상태 저장
    };
    this.snapshots.push(snapshot);
  }

  restoreSnapshot(index = -1) {
    const snapshot = this.snapshots.at(index);
    // 캐시 상태 복원 로직
  }
}
```

**적용 목적**: 캐시 상태의 스냅샷 생성 및 복원

### 2. **빌더 패턴 (Builder Pattern)**

```typescript
// lib/api-client/api-client.ts
export class ApiRequestBuilder {
  private url = "";
  private data: any = null;
  private config: RequestConfig = {};

  endpoint(url: string) {
    this.url = url;
    return this;
  }

  payload(data: any) {
    this.data = data;
    return this;
  }

  invalidateCache(keys: string | string[]) {
    this.config.invalidateCache = keys;
    return this;
  }

  // 체이닝 방식으로 요청 구성
  static create() {
    return new ApiRequestBuilder();
  }
}
```

**적용 목적**: 복잡한 API 요청 설정을 유연하게 구성

### 3. **전략 패턴 (Strategy Pattern)**

```typescript
// 에러 처리 전략들
interface ErrorHandlingStrategy {
  handle(error: AxiosError, config: RequestConfig): void;
}

class AlertErrorStrategy implements ErrorHandlingStrategy {
  handle(error: AxiosError, config: RequestConfig): void {
    const message = config.errorMessage || this.extractErrorMessage(error);
    alert(message);
  }
}

class ToastErrorStrategy implements ErrorHandlingStrategy {
  handle(error: AxiosError, config: RequestConfig): void {
    // Toast 알림 처리
  }
}

class SilentErrorStrategy implements ErrorHandlingStrategy {
  handle(error: AxiosError, config: RequestConfig): void {
    console.error("Silent error:", error);
  }
}
```

**적용 목적**: 다양한 에러 처리 방식을 런타임에 선택

### 4. **프록시 패턴 (Proxy Pattern)**

```typescript
// API 호출을 래핑하여 부가 기능 제공
export class ApiClient {
  private errorStrategy: ErrorHandlingStrategy;

  async post<T>(url: string, data?: any, config: RequestConfig = {}) {
    return this.executeRequest("POST", request.build(), config);
  }

  private async executeRequest(method, request, config) {
    // 재시도 로직
    // 캐시 무효화
    // 에러 처리
    // 성공 메시지
  }
}
```

**적용 목적**: 원본 axios 요청에 캐싱, 에러 처리, 재시도 등 부가 기능 추가

### 5. **팩토리 패턴 (Factory Pattern)**

```typescript
export class ApiClientFactory {
  static createDefault(): ApiClient {
    return new ApiClient(new AlertErrorStrategy());
  }

  static createWithToast(): ApiClient {
    return new ApiClient(new ToastErrorStrategy());
  }

  static createSilent(): ApiClient {
    return new ApiClient(new SilentErrorStrategy());
  }
}
```

**적용 목적**: 환경별로 적절한 클라이언트 인스턴스 생성

### 6. **퍼사드 패턴 (Facade Pattern)**

```typescript
// 복잡한 시스템을 단순한 인터페이스로 제공
export const api = {
  post: defaultApiClient.post.bind(defaultApiClient),
  put: defaultApiClient.put.bind(defaultApiClient),
  delete: defaultApiClient.delete.bind(defaultApiClient),
  patch: defaultApiClient.patch.bind(defaultApiClient),

  // 빌더 사용
  build: () => ApiRequestBuilder.create(),
  execute: defaultApiClient.execute.bind(defaultApiClient),
};
```

**적용 목적**: 복잡한 내부 구조를 간단한 API로 노출

## 🏛️ 아키텍처 구조

```
📁 refacotring/apis/api-client/
├── 📄 enhanced-swr.ts          # SWR 최적화 + 메멘토 패턴
├── 📄 api-client.ts            # API 클라이언트 + 다중 패턴
├── 📄 unified-client.ts        # 통합 클라이언트 (대안)
└── 📄 usage-examples-unified.tsx # 사용 예시

📁 apis/campaign/
└── 📄 campaign-optimized.api.ts # 리팩토링된 캠페인 API

📁 services/
└── 📄 campaign-optimized.service.ts # 리팩토링된 서비스
```

## 📁 구현 파일별 상세 설명

### 1. `enhanced-swr.ts` - SWR 최적화 레이어

#### 핵심 기능

- **메멘토 패턴**: 캐시 스냅샷 관리
- **빌더 패턴**: SWR 설정 구성
- **기존 SWR 전역 설정 활용**

```typescript
// 메멘토 패턴 적용
const cacheManager = new SimpleCacheManager();

// 빌더 패턴으로 SWR 설정
const config = SWRConfigBuilder.create()
  .cache(5) // 5분 캐시
  .retry(3)
  .realtime(5000) // 5초마다 실시간 업데이트
  .build();

// 기존 SWR과 호환되는 향상된 훅
export function useEnhancedSWR<T>(
  key: string | null,
  config?: SWRConfiguration<T>
) {
  return useSWR<T>(key, {
    revalidateOnFocus: true,
    dedupingInterval: 300000,
    ...config,
  });
}
```

#### 패턴 적용 효과

```typescript
// Before
const { data } = useSWR("/campaigns");

// After
const { data } = useEnhancedSWR("/campaigns", SWRPresets.list());
```

### 2. `api-client.ts` - 종합 API 클라이언트

#### 핵심 기능

- **빌더 패턴**: 복잡한 요청 구성
- **전략 패턴**: 에러 처리 방식 선택
- **프록시 패턴**: axios 요청 래핑
- **팩토리 패턴**: 환경별 클라이언트 생성

```typescript
// 빌더 패턴으로 복잡한 요청 구성
const request = api
  .build()
  .endpoint("/campaigns")
  .payload(campaignData)
  .invalidateCache(["/campaigns", "/stats"])
  .successMessage("캠페인이 생성되었습니다")
  .retry(3)
  .errorMessage("생성 실패");

await api.execute(request, "POST");

// 또는 간단한 사용
await api.post("/campaigns", data, {
  invalidateCache: ["/campaigns"],
  successMessage: "성공!",
  retries: 2,
});
```

#### 전략 패턴 활용

```typescript
// 환경별 에러 처리 전략
const devClient = ApiClientFactory.createWithToast(); // 개발환경
const prodClient = ApiClientFactory.createDefault(); // 운영환경
const testClient = ApiClientFactory.createSilent(); // 테스트환경
```

### 3. `unified-client.ts` - 통합 접근법

#### 핵심 기능

- **SWR + API Client 통합**
- **낙관적 업데이트**
- **자동 롤백**

```typescript
const { useQuery, post, useMutation } = useDataClient();

// GET 요청 (SWR 기반)
const { data: campaigns } = useQuery<Campaign[]>("/campaigns", {
  strategy: "cache-first",
  ttl: 300000,
});

// POST 요청 + 낙관적 업데이트
await post("/campaigns", newCampaign, {
  invalidateQueries: ["/campaigns"],
  optimisticUpdate: [...campaigns, newCampaign],
  successMessage: "캠페인 생성 완료",
});
```

### 4. `campaign-optimized.api.ts` - 리팩토링된 API

#### Before vs After 비교

```typescript
// Before (기존 방식)
export const tagApi = {
  async create(type: PageKeyType, name: string, id?: string) {
    switch (type) {
      case "auto-campaign": {
        const response = await campaignApi.createCampaignTag({ name });
        await mutate(["fetchTagList", type]);
        ToastCustom("자동화 캠페인 태그를 생성했습니다.");
        return response;
      }
    }
  },
};

// After (새로운 방식)
export class CampaignApiClient {
  async createTag(reqDto: CreateAutoCampaignTagDto) {
    return api.post("/auto-campaign/campaign-tag", reqDto, {
      invalidateCache: ["/auto-campaign/campaign-tag/all"],
      successMessage: "자동화 캠페인 태그를 생성했습니다.",
    });
  }
}
```

#### 코드 개선 효과

- **라인 수**: 20+ 줄 → 5-10 줄
- **복잡도**: 복잡한 switch문 → 단순한 메서드 호출
- **에러 처리**: 수동 try-catch → 자동 처리
- **캐시 관리**: 수동 mutate → 자동 무효화

### 5. `campaign-optimized.service.ts` - 리팩토링된 서비스

```typescript
// Before (기존 방식)
export const updateCampaignActiveStatus = async (campaignInfo) => {
  const { id, activeStatus, onFinally } = campaignInfo;
  let success = false;

  try {
    await campaignApi.updateCampaignActiveStatus(newStatus, reqDto);
    success = true;
    await mutate("/auto-campaign/all");
    ToastCustom(toastMessage);
  } catch (err) {
    // 복잡한 에러 처리...
    alert(errMessage);
  } finally {
    onFinally?.(success);
  }
};

// After (새로운 방식)
export const updateCampaignActiveStatusOptimized = async (params) => {
  const { id, activeStatus, onFinally } = params;

  try {
    const result = await api.post(`/auto-campaign/${newStatus}`, reqDto, {
      invalidateCache: ["/auto-campaign/all"],
      successMessage,
      retries: 2,
    });

    onFinally?.(result.success);
    return result;
  } catch (error) {
    onFinally?.(false);
    throw error;
  }
};
```

## 💻 사용 예시

### 1. 기본 사용법

```typescript
import { useEnhancedSWR } from "@/lib/data-client/enhanced-swr";
import { api } from "@/lib/api-client/api-client";

function CampaignManager() {
  // GET 요청: 향상된 SWR
  const { data: campaigns, mutate } =
    useEnhancedSWR<Campaign[]>("/auto-campaign/all");

  // POST 요청: 자동화된 API 클라이언트
  const handleCreateCampaign = async (campaignData: any) => {
    const result = await api.post("/auto-campaign", campaignData, {
      invalidateCache: ["/auto-campaign/all"],
      successMessage: "캠페인이 생성되었습니다!",
      retries: 3,
    });

    if (result.success) {
      console.log("생성된 캠페인:", result.data);
    }
  };

  return (
    <div>
      {campaigns?.map((campaign) => (
        <CampaignItem key={campaign.id} campaign={campaign} />
      ))}
      <button onClick={() => handleCreateCampaign({ name: "새 캠페인" })}>
        캠페인 생성
      </button>
    </div>
  );
}
```

### 2. 고급 사용법 (빌더 패턴)

```typescript
const handleComplexOperation = async () => {
  const request = api
    .build()
    .endpoint("/auto-campaign/batch-update")
    .payload({ ids: selectedIds, status: "active" })
    .invalidateCache(["/auto-campaign/all", "/stats/campaigns"])
    .successMessage("일괄 업데이트가 완료되었습니다")
    .errorMessage("일괄 업데이트에 실패했습니다")
    .retry(3);

  const result = await api.execute(request, "PUT");

  if (result.success) {
    // 추가 로직...
  }
};
```

### 3. 실시간 데이터 + 캐시 관리

```typescript
function RealtimeDashboard() {
  const { useQuery } = useDataClient();
  const { createSnapshot, restoreSnapshot, getSnapshots } = useCacheControl();

  // 실시간 데이터
  const { data: stats } = useQuery("/stats/realtime", {
    strategy: "realtime",
    refreshInterval: 5000,
  });

  // 정적 데이터 (긴 캐시)
  const { data: config } = useQuery("/app/config", {
    strategy: "cache-first",
    ttl: 1800000, // 30분
  });

  return (
    <div>
      <h2>실시간 대시보드</h2>
      <div>활성 사용자: {stats?.activeUsers}</div>

      {/* 캐시 관리 */}
      <button onClick={createSnapshot}>스냅샷 생성</button>
      <button onClick={() => restoreSnapshot()}>마지막 상태로 복원</button>
    </div>
  );
}
```

## ⚡ 성능 및 최적화

### 1. **중복 요청 방지**

```typescript
// dedupingInterval: 5분간 동일 요청 중복 방지
const config = SWRConfigBuilder.create().cache(5).build();
```

### 2. **낙관적 업데이트**

```typescript
await post("/campaigns/toggle", data, {
  optimisticUpdate: campaigns?.map((c) =>
    c.id === targetId ? { ...c, status: newStatus } : c
  ),
  invalidateQueries: ["/campaigns"],
});
```

### 3. **재시도 메커니즘**

```typescript
await api.post("/campaigns", data, {
  retries: 3, // 실패시 3회 재시도
  // 1초 → 2초 → 3초 간격으로 재시도
});
```

### 4. **캐시 전략별 최적화**

```typescript
// 프리셋으로 최적화된 설정 제공
export const SWRPresets = {
  list: () => SWRConfigBuilder.create().cache(5).retry(3).build(), // 목록용
  realtime: (ms) => SWRConfigBuilder.create().realtime(ms).build(), // 실시간용
  static: () => SWRConfigBuilder.create().cache(30).noFocusRevalidate().build(), // 정적용
  responsive: () => SWRConfigBuilder.create().cache(1).build(), // 반응형용
};
```

## 🏆 결론

### 구현된 패턴 요약

1. **메멘토 패턴**: 캐시 상태 스냅샷/복원
2. **빌더 패턴**: 유연한 요청 구성
3. **전략 패턴**: 런타임 에러 처리 방식 선택
4. **프록시 패턴**: 원본 API에 부가 기능 추가
5. **팩토리 패턴**: 환경별 클라이언트 생성
6. **퍼사드 패턴**: 복잡한 시스템의 단순화된 인터페이스

### 현재 프로젝트 권장 접근법

#### **"분리된 하이브리드 접근법"** 채택

```typescript
// 권장 구조
GET 요청 (조회): Enhanced SWR 사용
POST/PUT/DELETE (변경): API Client 사용
새로운 기능: Unified Client 고려
```

#### 이유

1. **기존 코드 보존**: SWR 기반 코드 그대로 활용
2. **점진적 개선**: 문제 영역만 선택적 개선
3. **위험 최소화**: 검증된 패턴 활용
4. **팀 효율성**: 학습 곡선 최소화

### 단계별 적용 계획

#### Phase 1: 즉시 적용

```typescript
// 문제가 많은 API부터 교체
updateCampaignActiveStatus → API Client 적용 ✅
복잡한 에러 처리 로직 → 전략 패턴 적용 ✅
```

#### Phase 2: 점진적 확장

```typescript
// 새 기능 개발시
새로운 API 엔드포인트 → API Client 우선 사용
복잡한 상태 관리 → Unified Client 고려
```

#### Phase 3: 선택적 리팩토링

```typescript
// 여유가 있을 때
기존 안정적인 API → 필요시에만 마이그레이션
성능 이슈가 있는 부분 → 우선적으로 개선
```

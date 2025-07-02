> ## 🔍 피드백 받고 싶은 부분
>
> ### 1. react-hook-form 베스트 프랙티스 검토
>
> - `useForm` 옵션 설정 (`mode`, `defaultValues`, `resolver` 등)이 현업 기준으로 적절한가?
> - 폼 유효성 검증과 에러 핸들링 패턴이 효율적인가?
> - 커스텀 훅(`useUserProfileForm`) 구조와 상태 관리 방식이 확장성 있는가?
>
> ### 2. styled-components 사용 베스트 프랙티스 조언
>
> - styled-components 사용 시 주의해야 할 점이나 안티패턴은?
> - 컴포넌트 네이밍, 구조화, 재사용성 측면에서의 권장사항은?
>
> ### 3. 디자인 시스템 구축 시점과 범위
>
> **현재 상황**: FE 1명 + BE 1명 팀, shadcn/ui + Tailwind로 버튼/타이포/색상만 기본 구축 완료
>
> - 현재 규모(소규모 팀, 초기 제품)에서 언제부터 본격적인 디자인 시스템을 구축해야 하는가?
> - 어떤 기준(페이지 수, 컴포넌트 수, 팀 규모)으로 시스템화 시점을 판단해야 하는가?
> - 토큰 시스템, Storybook, 컴포넌트 라이브러리화의 우선순위는?
> - Figma ↔ 코드 동기화는 언제부터 도입하는 것이 현실적인가?

---

## 프로젝트 구조

```bash
week5/
  ├─ refactoring/
  │   └─ features/
  │       └─ user/
  │           ├─ actions/   # 서버 액션
  │           ├─ hooks/     # react-hook-form 래핑 훅
  │           ├─ ui/        # UserProfileForm 등 UI 컴포넌트
  │           └─ validators/# zod 기반 스키마
  └─ page.tsx               # refactoring 엔트리
app/
  ├─ layout.tsx             # App Router 레이아웃 (퍼블리싱 확인용)
  └─ page.tsx               # 임시 라우트
```

> **왜 `app/` 디렉토리를 추가했나요?**  
> 과제 산출물을 정적 배포(Storybook 대안) 형태로 빠르게 미리보기 하기 위해 App Router를 도입했습니다.  
> 기존 `pages/` 기반 과제 코드와 충돌하지 않도록 _임시 라우트_ 로만 활용하고 있습니다.

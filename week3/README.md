# 할 일 목록 관리 애플리케이션 (리팩토링 버전)

> ⚠️ **Suspense 구현 한계**
>
> 이 프로젝트는 **Todo의 상태 및 액션을 하나의 커스텀 훅에서 깔끔하게 관리**하는 것을 목표로 하였으나, 다음과 같은 이유로 **React Suspense를 올바르게 구현하지 못했습니다**:
>
> 1. **TodoList 내부에서의 비동기 패칭 문제**: Suspense가 작동하려면 컴포넌트 **내부**에서 Promise를 throw해야 하는데, 상위 컴포넌트에서 `useTodos` 훅을 통해 데이터를 전달받는 구조로는 Suspense fallback이 트리거되지 않습니다.
>
> 2. **Form과 List 간의 상태 동기화**: TodoForm에서의 업데이트와 TodoList에서의 데이터 표시가 같은 훅을 사용하면서도 Suspense 패턴과 호환되지 않는 구조가 되었습니다.
>
> **결론**: 현재는 전통적인 `loading` 상태를 사용한 구현으로 되돌아갔으며, 올바른 Suspense 구현을 위해서는 **데이터 fetching과 UI 컴포넌트의 관계를 재설계**가 필요합니다. 이부분 관련하여 피드백 주시면 감사드리겠습니다!.

## 📋 프로젝트 개요

원본의 엉망인 `index.jsx` 파일을 깔끔하고 유지보수 가능한 React/TypeScript 애플리케이션으로 리팩토링

## 🚀 주요 개선사항

### 1. **아키텍처 개선**

- **Presentational & Container** 패턴 적용
- **관심사의 분리**를 통한 단순화
- 필요한 props만 전달하는 깔끔한 구조

### 2. **타입 안정성**

- TypeScript 적용
- 명확한 타입 정의 및 인터페이스 구현

### 3. **에러 처리 개선**

- **ErrorBoundary** 적용
- 사용자 친화적인 에러 표시

### 4. **상태 관리 개선**

- 통합된 `useTodos` 훅으로 모든 상태와 액션 관리
- 로딩, 에러, 데이터 상태를 하나의 훅에서 처리

## 📁 현재 프로젝트 구조

```
week3/refactoring/
├── app.tsx                          # 메인 앱 컴포넌트
├── features/                        # 기능별 모듈
│   └── to-do/                       # Todo 기능
│       ├── index.ts                 # Feature 진입점
│       ├── types/
│       │   └── index.ts             # Todo 관련 타입 정의
│       ├── hooks/
│       │   ├── index.ts             # 훅 export 파일
│       │   └── useTodos.ts          # 통합 상태 관리 훅
│       ├── api/                     # API 관련 (미사용)
│       └── ui/
│           ├── index.ts             # UI 컴포넌트 export
│           ├── Todo.tsx             # 메인 Container 컴포넌트
│           ├── TodoForm.tsx         # Todo 추가 폼 (Presentational)
│           └── TodoList.tsx         # Todo 목록 (Presentational)
├── shared/                          # 공용 컴포넌트
│   └── ui/
│       └── ErrorBoundary/           # 에러 바운더리
│           ├── index.ts
│           ├── ErrorBoundary.tsx    # 에러 바운더리 컴포넌트
│           └── ErrorBoundaryFallback.tsx # 에러 fallback UI
└── widgets/                         # 위젯 컴포넌트
    ├── index.ts
    └── Footer.tsx                   # 푸터 컴포넌트
```

## 🔧 핵심 컴포넌트

### `Todo` - Container 컴포넌트

- `useTodos` 훅으로 모든 상태 관리 (todos, loading, error, actions)
- Form과 List에 필요한 props 전달
- ErrorBoundary 적용
- 조건부 로딩 UI 렌더링

### `TodoForm` - Presentational 컴포넌트

- `onAddTodo` props로 할 일 추가 처리
- 폼 상태는 자체적으로 관리

### `TodoList` - Presentational 컴포넌트

- `todos`, `onToggleTodo`, `onDeleteTodo` props로 동작
- 완료율 표시 등 UI 기능 포함

## 🔍 주요 특징

- ✅ **단순한 컴포넌트 구조**
- ✅ **ErrorBoundary 적용**
- ✅ **통합된 상태 관리**
- ✅ **Presentational & Container 패턴**
- ❌ **React Suspense 구현 실패** (위 콜아웃 참조)

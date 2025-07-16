# Authentication Demo - Supabase & NextAuth.js

Supabase와 NextAuth.js를 활용한 현대적인 인증 시스템 데모 프로젝트입니다.

## 🚀 기술 스택

- **Next.js 15** - App Router
- **TypeScript** - 타입 안정성
- **NextAuth.js** - 인증 시스템
- **Supabase** - 백엔드 및 데이터베이스
- **Emotion** - CSS-in-JS 스타일링
- **pnpm** - 패키지 매니저

## 📋 기능

- ✅ Google OAuth 로그인
- ✅ 안전한 세션 관리
- ✅ 반응형 UI/UX
- ✅ TypeScript 지원
- ✅ 현대적인 디자인

## 🛠️ 설정 방법

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth.js 설정
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. Database → SQL Editor에서 다음 SQL 실행:

```sql
-- NextAuth.js 테이블 생성
CREATE TABLE IF NOT EXISTS accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type varchar(255) NOT NULL,
  provider varchar(255) NOT NULL,
  provider_account_id varchar(255) NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type varchar(255),
  scope varchar(255),
  id_token text,
  session_state varchar(255),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token varchar(255) UNIQUE NOT NULL,
  user_id uuid NOT NULL,
  expires timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(255),
  email varchar(255) UNIQUE,
  email_verified timestamp with time zone,
  image text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier varchar(255) NOT NULL,
  token varchar(255) UNIQUE NOT NULL,
  expires timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 4. Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. APIs & Services → Credentials에서 OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI에 추가:
   - `http://localhost:3000/api/auth/callback/google`
   - (배포 시) `https://yourdomain.com/api/auth/callback/google`

### 5. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts           # NextAuth.js API 라우트
│   ├── layout.tsx             # 루트 레이아웃
│   └── page.tsx               # 메인 페이지
├── components/
│   ├── AuthButton.tsx         # 로그인/로그아웃 버튼
│   └── Providers.tsx          # SessionProvider 래퍼
├── lib/
│   ├── auth.ts                # NextAuth.js 설정
│   └── supabase.ts            # Supabase 클라이언트
└── types/
    └── next-auth.d.ts         # NextAuth 타입 확장
```

## 🎨 주요 컴포넌트

### AuthButton

- 로그인/로그아웃 상태에 따른 동적 UI
- Emotion을 활용한 반응형 스타일링
- Google OAuth 연동

### Providers

- NextAuth.js SessionProvider 래핑
- 전역 인증 상태 관리

## 🔒 보안 고려사항

- 환경 변수를 통한 민감 정보 관리
- JWT 세션 전략 사용
- CSRF 보호 내장
- Secure cookie 설정

## 📚 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Supabase Documentation](https://supabase.com/docs)
- [Emotion Documentation](https://emotion.sh/docs/introduction)

## 🤝 기여

이슈나 풀 리퀘스트를 통해 기여해주세요!

## 📄 라이선스

MIT License

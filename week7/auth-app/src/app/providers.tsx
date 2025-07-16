"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분 동안 데이터를 새로운 것으로 간주
            staleTime: 5 * 60 * 1000,
            // 5분 동안 캐시 유지
            gcTime: 5 * 60 * 1000,
            // 실패 시 재시도 설정
            retry: (failureCount, error: any) => {
              // 401, 403 에러는 재시도하지 않음
              if (error?.status === 401 || error?.status === 403) {
                return false;
              }
              // 3번까지 재시도
              return failureCount < 3;
            },
            // 창 포커스 시 자동 새로고침 비활성화
            refetchOnWindowFocus: false,
          },
          mutations: {
            // 뮤테이션 실패 시 재시도하지 않음
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        {/* 개발 환경에서만 DevTools 표시 */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </SessionProvider>
    </QueryClientProvider>
  );
}

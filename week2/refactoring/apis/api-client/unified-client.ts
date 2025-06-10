'use client';

import useSWR, { SWRConfiguration, mutate } from 'swr';
import { useCallback, useState } from 'react';
import axiosInstance from '@/apis-v2/_instance';
import { AxiosError } from 'axios';

// ===== 🎯 통합된 타입 정의 =====

interface QueryOptions extends SWRConfiguration {
  strategy?: 'cache-first' | 'network-only' | 'realtime';
  ttl?: number;
}

interface MutationOptions {
  invalidateQueries?: string | string[];
  successMessage?: string;
  errorMessage?: string;
  silent?: boolean;
  retries?: number;
  optimisticUpdate?: any;
}

interface MutationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===== 🚀 하나의 통합된 클라이언트 =====

export class UnifiedDataClient {
  // GET 요청 (SWR 기반)
  useQuery<T>(key: string | null, options?: QueryOptions) {
    const config: SWRConfiguration<T> = {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: options?.ttl || 300000,
      ...options,
    };

    // 전략에 따른 설정 조정
    if (options?.strategy === 'network-only') {
      config.revalidateIfStale = true;
      config.dedupingInterval = 0;
    } else if (options?.strategy === 'realtime') {
      config.refreshInterval = 5000;
      config.revalidateOnFocus = true;
    }

    return useSWR<T>(key, config);
  }

  // POST/PUT/DELETE 요청 (통합된 인터페이스)
  async mutate<T = any>(
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    options: MutationOptions = {},
  ): Promise<MutationResult<T>> {
    const maxRetries = options.retries || 0;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        // 낙관적 업데이트
        if (options.optimisticUpdate && options.invalidateQueries) {
          const queries = Array.isArray(options.invalidateQueries)
            ? options.invalidateQueries
            : [options.invalidateQueries];

          queries.forEach((query) => {
            mutate(query, options.optimisticUpdate, false);
          });
        }

        let response;
        switch (method) {
          case 'POST':
            response = await axiosInstance.post(url, data);
            break;
          case 'PUT':
            response = await axiosInstance.put(url, data);
            break;
          case 'DELETE':
            response = await axiosInstance.delete(url);
            break;
          case 'PATCH':
            response = await axiosInstance.patch(url, data);
            break;
        }

        // 성공 시 캐시 무효화
        if (options.invalidateQueries) {
          const queries = Array.isArray(options.invalidateQueries)
            ? options.invalidateQueries
            : [options.invalidateQueries];

          queries.forEach((query) => mutate(query));
        }

        // 성공 메시지
        if (options.successMessage && !options.silent) {
          console.log('Success:', options.successMessage);
        }

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        attempt++;

        if (attempt > maxRetries) {
          // 낙관적 업데이트 롤백
          if (options.optimisticUpdate && options.invalidateQueries) {
            const queries = Array.isArray(options.invalidateQueries)
              ? options.invalidateQueries
              : [options.invalidateQueries];

            queries.forEach((query) => mutate(query));
          }

          // 에러 처리
          if (!options.silent) {
            const message = options.errorMessage || this.extractErrorMessage(error as AxiosError);
            alert(message);
          }

          return {
            success: false,
            error: (error as AxiosError).message,
          };
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return { success: false };
  }

  private extractErrorMessage(error: AxiosError): string {
    const data = error.response?.data as any;
    return data?.message || '오류가 발생했습니다.';
  }

  // 편의 메서드들
  async post<T>(url: string, data?: any, options?: MutationOptions) {
    return this.mutate<T>('POST', url, data, options);
  }

  async put<T>(url: string, data?: any, options?: MutationOptions) {
    return this.mutate<T>('PUT', url, data, options);
  }

  async delete<T>(url: string, options?: MutationOptions) {
    return this.mutate<T>('DELETE', url, undefined, options);
  }

  async patch<T>(url: string, data?: any, options?: MutationOptions) {
    return this.mutate<T>('PATCH', url, data, options);
  }
}

// ===== 🪝 React Hook으로 통합 =====

export function useDataClient() {
  const client = new UnifiedDataClient();

  // Query (GET)
  const useQuery = client.useQuery.bind(client);

  // Mutations (POST/PUT/DELETE)
  const useMutation = <T = any>(
    mutationFn: () => Promise<MutationResult<T>>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
    },
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn();

        if (result.success && options?.onSuccess) {
          options.onSuccess(result.data!);
        } else if (!result.success && options?.onError) {
          options.onError(result.error);
        }

        return result;
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
        if (options?.onError) {
          options.onError(err);
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, [mutationFn, options]);

    return { mutate, isLoading, error };
  };

  // 캐시 관리
  const invalidateQueries = useCallback((keys: string | string[]) => {
    const queries = Array.isArray(keys) ? keys : [keys];
    queries.forEach((key) => mutate(key));
  }, []);

  return {
    useQuery,
    useMutation,
    post: client.post.bind(client),
    put: client.put.bind(client),
    delete: client.delete.bind(client),
    patch: client.patch.bind(client),
    invalidateQueries,
  };
}

// ===== 🎁 전역 인스턴스 (간편 사용) =====

const globalClient = new UnifiedDataClient();

export const dataClient = {
  useQuery: globalClient.useQuery.bind(globalClient),
  post: globalClient.post.bind(globalClient),
  put: globalClient.put.bind(globalClient),
  delete: globalClient.delete.bind(globalClient),
  patch: globalClient.patch.bind(globalClient),
};

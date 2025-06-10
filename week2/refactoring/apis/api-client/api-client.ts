"use client";

import { mutate } from "swr";
import { AxiosError, AxiosResponse } from "axios";
import { merge } from "lodash";
import axiosInstance from "../../../_instance";

// ===== 🎯 타입 정의 =====

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RequestConfig {
  invalidateCache?: string | string[];
  successMessage?: string;
  errorMessage?: string;
  silent?: boolean;
  retries?: number;
}

// ===== 🏗️ 빌더 패턴: API 요청 구성 =====

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

  successMessage(message: string) {
    this.config.successMessage = message;
    return this;
  }

  errorMessage(message: string) {
    this.config.errorMessage = message;
    return this;
  }

  silent() {
    this.config.silent = true;
    return this;
  }

  retry(count: number) {
    this.config.retries = count;
    return this;
  }

  build() {
    return {
      url: this.url,
      data: this.data,
      config: this.config,
    };
  }

  static create() {
    return new ApiRequestBuilder();
  }
}

// ===== 🎭 전략 패턴: 에러 처리 전략 =====

interface ErrorHandlingStrategy {
  handle(error: AxiosError, config: RequestConfig): void;
}

class AlertErrorStrategy implements ErrorHandlingStrategy {
  handle(error: AxiosError, config: RequestConfig): void {
    const message = config.errorMessage || this.extractErrorMessage(error);
    alert(message);
  }

  private extractErrorMessage(error: AxiosError): string {
    const data = error.response?.data as any;
    return data?.message || "오류가 발생했습니다.";
  }
}

class ToastErrorStrategy implements ErrorHandlingStrategy {
  handle(error: AxiosError, config: RequestConfig): void {
    const message = config.errorMessage || this.extractErrorMessage(error);
    // 실제 프로젝트에서는 toast 라이브러리 사용
    console.error("Toast:", message);
  }

  private extractErrorMessage(error: AxiosError): string {
    const data = error.response?.data as any;
    return data?.message || "오류가 발생했습니다.";
  }
}

class SilentErrorStrategy implements ErrorHandlingStrategy {
  handle(error: AxiosError, config: RequestConfig): void {
    console.error("Silent error:", error);
  }
}

// ===== 🔄 프록시 패턴: API 호출 래핑 =====

export class ApiClient {
  private errorStrategy: ErrorHandlingStrategy;

  constructor(errorStrategy: ErrorHandlingStrategy = new AlertErrorStrategy()) {
    this.errorStrategy = errorStrategy;
  }

  // POST 요청
  async post<T = any>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const request = ApiRequestBuilder.create().endpoint(url).payload(data);

    return this.executeRequest("POST", request.build(), config);
  }

  // PUT 요청
  async put<T = any>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const request = ApiRequestBuilder.create().endpoint(url).payload(data);

    return this.executeRequest("PUT", request.build(), config);
  }

  // DELETE 요청
  async delete<T = any>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const request = ApiRequestBuilder.create().endpoint(url);

    return this.executeRequest("DELETE", request.build(), config);
  }

  // PATCH 요청
  async patch<T = any>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const request = ApiRequestBuilder.create().endpoint(url).payload(data);

    return this.executeRequest("PATCH", request.build(), config);
  }

  // 빌더를 사용한 고급 요청
  async execute<T = any>(
    builder: ApiRequestBuilder,
    method: "POST" | "PUT" | "DELETE" | "PATCH"
  ): Promise<ApiResponse<T>> {
    const request = builder.build();
    return this.executeRequest(method, request, request.config);
  }

  // 실제 요청 실행
  private async executeRequest<T>(
    method: string,
    request: ReturnType<ApiRequestBuilder["build"]>,
    config: RequestConfig
  ): Promise<ApiResponse<T>> {
    const maxRetries = config.retries || 0;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        let response: AxiosResponse<T>;

        switch (method) {
          case "POST":
            response = await axiosInstance.post(request.url, request.data);
            break;
          case "PUT":
            response = await axiosInstance.put(request.url, request.data);
            break;
          case "DELETE":
            response = await axiosInstance.delete(request.url);
            break;
          case "PATCH":
            response = await axiosInstance.patch(request.url, request.data);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        // 성공 시 처리
        await this.handleSuccess(response.data, config);

        return {
          success: true,
          data: response.data,
        };
      } catch (error) {
        attempt++;

        if (attempt > maxRetries) {
          // 최종 실패 시 에러 처리
          this.handleError(error as AxiosError, config);

          return {
            success: false,
            error: (error as AxiosError).message,
          };
        }

        // 재시도 대기
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return { success: false };
  }

  // 성공 처리
  private async handleSuccess<T>(
    data: T,
    config: RequestConfig
  ): Promise<void> {
    // 캐시 무효화
    if (config.invalidateCache) {
      const keys = Array.isArray(config.invalidateCache)
        ? config.invalidateCache
        : [config.invalidateCache];

      keys.forEach((key) => mutate(key));
    }

    // 성공 메시지
    if (config.successMessage && !config.silent) {
      // 실제 프로젝트에서는 toast 라이브러리 사용
      console.log("Success:", config.successMessage);
    }
  }

  // 에러 처리
  private handleError(error: AxiosError, config: RequestConfig): void {
    if (!config.silent) {
      this.errorStrategy.handle(error, config);
    }
  }

  // 에러 전략 변경
  setErrorStrategy(strategy: ErrorHandlingStrategy): void {
    this.errorStrategy = strategy;
  }
}

// ===== 🏭 팩토리 패턴: 환경별 클라이언트 생성 =====

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

  static create(strategy?: ErrorHandlingStrategy): ApiClient {
    return new ApiClient(strategy);
  }
}

// ===== 🎁 편의 함수들 =====

// 전역 API 클라이언트 인스턴스
const defaultApiClient = ApiClientFactory.createDefault();

export const api = {
  post: defaultApiClient.post.bind(defaultApiClient),
  put: defaultApiClient.put.bind(defaultApiClient),
  delete: defaultApiClient.delete.bind(defaultApiClient),
  patch: defaultApiClient.patch.bind(defaultApiClient),

  // 빌더 사용
  build: () => ApiRequestBuilder.create(),
  execute: defaultApiClient.execute.bind(defaultApiClient),

  // 클라이언트 생성
  client: ApiClientFactory,
};

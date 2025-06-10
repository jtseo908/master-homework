// TODO: instance를 대체할 예정

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { debounce, includes, keys } from "lodash";
import config from "./config";

const loginRequestHandle = () => {
  // setCookie('accessToken', '', { maxAge: 0 });
  // clearSessionStorage();
  // clearLocalStorage();
  // toastError('로그인이 필요합니다.');
  window.location.href = "/sign-in";
};

const debouncedLoginRequestHandle = debounce(loginRequestHandle, 1000);

const ERRORS = {
  LOGIN_REQUIRED: "Login Required",
  EMPTY_TOKEN: "Empty Token",
  INVALID_TOKEN: "Invalid Token",
} as const;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000, // 30s
});

axiosInstance.interceptors.request.use((config) => {
  // const token = getCookie("accessToken");
  // config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Error handling
    if (error.response?.status === 401) {
      const data = error.response.data as { error: string; message: string };
      if (includes(keys(ERRORS), data.error)) {
        debouncedLoginRequestHandle();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

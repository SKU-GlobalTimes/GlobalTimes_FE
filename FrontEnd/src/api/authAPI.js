import axios from "axios";

// 인증 포함 axios 인스턴스
export const authAPI = axios.create();

// 요청 interceptor: 토큰 자동 주입
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

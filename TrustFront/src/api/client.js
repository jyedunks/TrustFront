// src/api/client.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || ""; // 없으면 상대경로(지양)
const PREFIX = import.meta.env.VITE_API_PREFIX || ""; // 예: "/api" 또는 ""

const client = axios.create({
  baseURL: BASE,         // 예: http://54.66.xxx.xxx:8080
  withCredentials: true, // 쿠키 인증 쓰면 true
});

// 요청 인터셉터: 토큰 자동 부착
client.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터: res.data만 꺼내기 + 에러 메시지 통일
client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "요청 처리 중 오류가 발생했습니다.";
    return Promise.reject({ ...err, message: msg });
  }
);

// 경로 유틸: prefix 자동붙이기
export const apiPath = (p) => `${PREFIX}${p}`; // p는 "/auth/me" 같이 시작

export default client;
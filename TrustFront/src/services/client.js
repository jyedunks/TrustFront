// src/services/client.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "";   // 
const PREFIX = import.meta.env.VITE_API_PREFIX || "";   // 예: /api  (없으면 빈값)

console.log("[API] BASE =", BASE, "PREFIX =", PREFIX); // ← 콘솔에서 반드시 확인!

const client = axios.create({
  baseURL: BASE,          // <- 이게 비지 않으면 5173으로 안 갑니다.
  withCredentials: true,  // 쿠키 인증 시 필요
});

// 토큰 자동 부착
client.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// data만 꺼내기 + 에러 메시지 통일
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

// 모든 경로 앞에 prefix 자동 부착
export const apiPath = (p) => `${PREFIX}${p}`;

export default client;
// src/lib/api.js
import axios from "axios";

/**
 * BASE_URL 규칙
 * - .env의 VITE_API_BASE_URL 우선 (예: '/api' 또는 'http://54.66.146.131:8080/api')
 * - 없으면 기본값 '/api' (Vite proxy 전제)
 * - 끝/앞 슬래시 정리해서 '중복 슬래시' 및 '/api/api' 방지
 */
function sanitizeBase(base) {
  const raw = (base || "/api").trim();
  // 절대/상대 모두 허용, 끝의 슬래시만 제거
  return raw.replace(/\/+$/, "");
}
const BASE = sanitizeBase(import.meta?.env?.VITE_API_BASE_URL);

/** 공통 axios 인스턴스 */
export const api = axios.create({
  baseURL: BASE,               // ex) '/api'
  withCredentials: true,       // 쿠키 인증 필요 시만 true
  timeout: 10000,
});

/** 요청/응답 인터셉터(선택: 토큰 첨부 및 에러 메시지 정리) */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 엔드포인트 문자열 앞 슬래시 제거(중복 방지)
  if (typeof config.url === "string") {
    config.url = config.url.replace(/^\/+/, ""); // <-- 중요!
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // 인증 만료 공통 처리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userUuid");
      if (!location.pathname.startsWith("/login")) {
        alert("로그인이 필요합니다. 다시 로그인해 주세요.");
        location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

/** 편의 메서드: url 앞의 슬래시 자동 정리 */
const _clean = (u) => String(u || "").replace(/^\/+/, "");
export const get  = (url, config)       => api.get(_clean(url), config);
export const del  = (url, config)       => api.delete(_clean(url), config);
export const post = (url, data, config) => api.post(_clean(url), data, config);
export const put  = (url, data, config) => api.put(_clean(url), data, config);

/**
 * 연결 테스트
 * - 엔드포인트에 절대 'api/' 붙이지 말 것.
 * - 최종 요청은 `${BASE}/chat/message`가 됨.
 */
export async function testConnection() {
  try {
    const res = await post("chat/message", {
      roomId: "Tester1:Tester2:TestItem",
      senderId: "Tester2",
      content: "테스트 메세지",
      timestamp: Date.now(),
      read: false,
    });
    console.log("✅ 백엔드 연결 성공:", res.data ?? res.status);
  } catch (err) {
    console.error("❌ 백엔드 연결 실패:", err);
  }
}

export default api;
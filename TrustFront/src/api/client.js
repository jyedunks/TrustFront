// src/api/client.js

/**
 * 통합 Fetch 클라이언트
 * - BASE_URL 우선순위: env(VITE_API_BASE_URL) → '/api' (Vite proxy)
 * - params: 객체를 자동으로 쿼리스트링으로 변환
 * - data: JSON 자동 직렬화 (GET/HEAD 제외)
 * - Timeout, JSON/TEXT 자동 파싱, 에러 메시지 개선
 * - JWT 자동 첨부(localStorage.accessToken), 401 자동 처리
 */

const ENV_BASE = (import.meta?.env?.VITE_API_BASE_URL || "").trim();
const BASE_URL = (ENV_BASE || "/api").replace(/\/+$/, ""); // 끝의 '/' 제거
const TIMEOUT = 10000;

/** 내부 유틸: URL 조립 + 쿼리스트링 */
function buildUrl(endpoint = "", params) {
  // endpoint 앞의 중복 '/' 제거
  const clean = String(endpoint || "").replace(/^\/+/, "");
  const url = new URL(`${BASE_URL}/${clean}`, window.location.origin);

  if (params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) {
        v.forEach((item) => url.searchParams.append(k, String(item)));
      } else {
        url.searchParams.set(k, String(v));
      }
    });
  }
  // 절대 → 상대 경로로 변환 (Vite proxy 사용 시 깔끔하게)
  return url.toString().replace(window.location.origin, "");
}

/** 401 처리 공통 함수 (프로젝트 규칙에 맞게 수정 가능) */
function handleUnauthorized() {
  // 토큰/캐시 제거
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userUuid");

  // 로그인 페이지로 이동 (이미 /login이면 이동하지 않음)
  if (!window.location.pathname.startsWith("/login")) {
    alert("로그인이 필요합니다. 다시 로그인해 주세요.");
    window.location.href = "/login";
  }
}

/** 공통 fetch */
export default async function client(endpoint, options = {}) {
  const {
    method = "GET",
    params,     // ?key=value 형태로 붙일 객체
    data,       // JSON body
    headers = {},
    timeout = TIMEOUT,
    // 나머지 fetch 옵션(cookie 등)은 그대로 전달
    ...rest
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const url = buildUrl(endpoint, params);
    const token = localStorage.getItem("accessToken");

    const reqInit = {
      method,
      credentials: "include",
      signal: controller.signal,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...rest,
    };

    if (data && method !== "GET" && method !== "HEAD") {
      reqInit.body = typeof data === "string" ? data : JSON.stringify(data);
    }

    const res = await fetch(url, reqInit);
    clearTimeout(timer);

    // 204 No Content
    if (res.status === 204) return null;

    const ct = res.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      // 401 처리
      if (res.status === 401) {
        handleUnauthorized();
      }
      const msg =
        typeof payload === "string"
          ? payload
          : JSON.stringify(payload, null, 2);
      throw new Error(`HTTP ${res.status} ${res.statusText} @ ${url}\n${msg}`);
    }

    return payload;
  } catch (e) {
    console.error("[client] fetch error:", e);
    // Abort 에러 메시지 가독성 보정
    if (e.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw e;
  }
}

/* 편의 메서드 */
export const get = (endpoint, options = {}) =>
  client(endpoint, { ...options, method: "GET" });

export const post = (endpoint, data, options = {}) =>
  client(endpoint, { ...options, method: "POST", data });

export const put = (endpoint, data, options = {}) =>
  client(endpoint, { ...options, method: "PUT", data });

export const del = (endpoint, options = {}) =>
  client(endpoint, { ...options, method: "DELETE" });
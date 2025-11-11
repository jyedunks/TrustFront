// src/services/user.js
import axios from "axios";

/** 로컬에 저장된 UUID 얻기 */
export function getCurrentUuid() {
  return (
    localStorage.getItem("USER_UUID") ||
    JSON.parse(localStorage.getItem("AUTH_USER") || "{}")?.uuid ||
    null
  );
}

/** 공통: API 베이스와 토큰 헤더 */
function makeAuthHeaders() {
  const token =
    localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
function apiBase() {
  return import.meta.env.VITE_API_BASE_URL; // 예: http://54.66.146.131:8080
}

/** 내 정보 조회 (GET /userinfo/{uuid}) */
export async function getUserInfo(uuid = getCurrentUuid()) {
  if (!uuid) throw new Error("UUID가 없습니다. 로그인 후 다시 시도하세요.");
  const url = `${apiBase()}/userinfo/${encodeURIComponent(uuid)}`;
  const { data } = await axios.get(url, { headers: makeAuthHeaders() });
  return data; // { uuid, userName|name, email, telephone|phone, profileImageUrl ... }
}

/** 내 정보 수정 (PUT /userinfo/{uuid}) */
export async function updateUserInfo(payload, uuid = getCurrentUuid()) {
  if (!uuid) throw new Error("UUID가 없습니다. 로그인 후 다시 시도하세요.");
  const url = `${apiBase()}/userinfo/${encodeURIComponent(uuid)}`;
  const { data } = await axios.put(url, payload, { headers: makeAuthHeaders() });
  return data;
}

/** 로그아웃 (로컬 상태 초기화) */
export function logoutLocal() {
  try {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    localStorage.removeItem("USER_UUID");
    localStorage.removeItem("AUTH_USER");
  } catch {}
}
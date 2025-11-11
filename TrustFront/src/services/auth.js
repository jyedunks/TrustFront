// src/services/auth.js
import client, { apiPath } from "./client";

/** 토큰·유저 저장 (uuid 키 표준화) */
export function saveAuth({ accessToken, refreshToken, user, uuid, userUuid }) {
  if (accessToken) localStorage.setItem("ACCESS_TOKEN", accessToken);
  if (refreshToken) localStorage.setItem("REFRESH_TOKEN", refreshToken);

  // 응답이 uuid(신규)든 userUuid(구버전)든 모두 수용
  const finalUuid = uuid || userUuid || user?.uuid;
  if (finalUuid) localStorage.setItem("USER_UUID", finalUuid);

  if (user) localStorage.setItem("AUTH_USER", JSON.stringify({ ...user, uuid: finalUuid }));
}

/** 저장된 유저 */
export function getSavedUser() {
  const raw = localStorage.getItem("AUTH_USER");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/** 로그아웃/초기화 */
export function clearAuth() {
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("REFRESH_TOKEN");
  localStorage.removeItem("AUTH_USER");
  localStorage.removeItem("USER_UUID");
}

/** 현재 사용자 복구: /api/auth/me가 { uuid, ... } 반환한다고 가정 */
export async function getMe() {
  const me = await client.get(apiPath("/auth/me")); // → http://EC2:8080/api/auth/me
  // me: { uuid, account, email, ... }
  saveAuth({ user: me, uuid: me?.uuid });
  return me;
}

/** 일반 로그인: /api/login이 { accessToken, refreshToken, uuid, user } 반환한다고 가정 */
export async function login({ account, password }) {
  const res = await client.post(apiPath("/login"), { account, password });
  // res: { accessToken, refreshToken, uuid, user:{ ... } }  ← 백이 uuid 추가 약속
  saveAuth({
    accessToken: res?.accessToken,
    refreshToken: res?.refreshToken,
    uuid: res?.uuid,
    user: res?.user,           // user 내부에도 uuid가 들어올 수 있음
    userUuid: res?.userUuid,   // 구버전 호환
  });
  return res;
}
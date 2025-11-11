// src/api/auth.js
import client from "./client";

/** 토큰·유저 저장 */
export function saveAuth({ accessToken, refreshToken, user, userUuid }) {
  // 백 응답 스펙에 따라 유저 식별자 우선순위로 저장
  if (accessToken) localStorage.setItem("ACCESS_TOKEN", accessToken);
  if (refreshToken) localStorage.setItem("REFRESH_TOKEN", refreshToken);

  // userUuid 를 별도로 주는 백엔드면 병행 저장
  if (userUuid) localStorage.setItem("USER_UUID", userUuid);

  // user 객체가 있다면 통째로 저장(예: {uuid, account, email, ...})
  if (user) {
    localStorage.setItem("AUTH_USER", JSON.stringify(user));
    if (user.uuid) localStorage.setItem("USER_UUID", user.uuid);
  }
}

/** 저장된 유저 반환 */
export function getSavedUser() {
  const raw = localStorage.getItem("AUTH_USER");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** 로컬 클리어 */
export function clearAuth() {
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("REFRESH_TOKEN");
  localStorage.removeItem("AUTH_USER");
  localStorage.removeItem("USER_UUID");
}

/** 내 정보 복구 (백엔드에 맞춰 경로 확인 필요) */
export async function getMe() {
  // 예시: /auth/me 가 토큰/쿠키 기반으로 현재 사용자 정보 반환
  const me = await client.get("/auth/me");
  if (me) {
    localStorage.setItem("AUTH_USER", JSON.stringify(me));
    if (me.uuid) localStorage.setItem("USER_UUID", me.uuid);
  }
  return me;
}

/** 아이디(계정) 중복 체크 */
export function verifyAccountDuplicate(account) {
  // 백 스펙: POST /user/account/verify-duplicate { account }
  return client.post("/user/account/verify-duplicate", { account });
}

/** 회원가입 */
export function signUp(payload) {
  // 예) payload: { account, email, password, userName, telephone, roughAddress }
  return client.post("/user/register", payload);
}

/** 로그인 (일반) */
export async function login({ account, password }) {
  // 백 스펙: POST /login { account, password }
  const res = await client.post("/login", { account, password });
  // 응답 예시 가정:
  // { accessToken, refreshToken, user: { uuid, account, email, ... } }
  saveAuth({
    accessToken: res?.accessToken,
    refreshToken: res?.refreshToken,
    user: res?.user,
    userUuid: res?.userUuid, // 백이 따로 주면 흡수
  });
  return res;
}

/** (옵션) 카카오 콜백에서 받은 응답 저장용 */
export function saveSocialLoginResult(res) {
  // 응답에 따라 통일된 저장 함수로 처리
  saveAuth({
    accessToken: res?.accessToken,
    refreshToken: res?.refreshToken,
    user: res?.user,
    userUuid: res?.userUuid,
  });
}
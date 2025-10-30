import client from "./client";

/** 아이디 중복 체크 */
export function verifyAccountDuplicate(account) {
  return client("user/account/verify-duplicate", {
    method: "POST",
    data: { account },
  });
}

/** 회원가입 */
export function signUp(payload) {
  // payload: { account, email, password, userName, telephone, roughAddress }
  return client("user/register", {
    method: "POST",
    data: payload,
  });
}

/** 로그인 (account + password) */
export async function login({ account, password }) {
  const res = await client("login", {
    method: "POST",
    data: { account, password },
  });
  // 필요 시 토큰/UUID 저장 로직
  if (res?.accessToken) localStorage.setItem("accessToken", res.accessToken);
  if (res?.userUuid) localStorage.setItem("userUuid", res.userUuid);
  return res;
}

/** 내 정보 */
export function fetchMe() {
  return client("auth/me", { method: "GET" });
}
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function parseQuery(qs) {
  const p = new URLSearchParams(qs);
  const o = {};
  for (const [k, v] of p.entries()) o[k] = v;
  return o;
}

function saveAuthLocal({ accessToken, refreshToken, uuid, email, nickname, profileImageUrl }) {
  if (accessToken)  localStorage.setItem("ACCESS_TOKEN", accessToken);
  if (refreshToken) localStorage.setItem("REFRESH_TOKEN", refreshToken);
  if (uuid)         localStorage.setItem("USER_UUID", uuid);

  const user = {
    uuid: uuid || null,
    email: email || null,
    nickname: nickname || null,
    profileImageUrl: profileImageUrl || null,
  };
  localStorage.setItem("AUTH_USER", JSON.stringify(user));
}

export default function JOauthKakao() {
  const nav = useNavigate();
  const { search } = useLocation();
  const [msg, setMsg] = useState("카카오 로그인 처리 중…");

  useEffect(() => {
    try {
      const q = parseQuery(search);

      // ✅ 백이 주는 키들: UUID(대문자), accessToken, refreshToken, email, nickname, profileImageUrl, registered
      const uuid     = q.UUID || q.uuid || q.userUuid || q.user_uuid || "";
      const at       = q.accessToken || q.access_token || "";
      const rt       = q.refreshToken || q.refresh_token || "";
      const email    = q.email || "";
      const nickname = q.nickname || "";
      const avatar   = q.profileImageUrl || q.profile_image_url || "";
      const regRaw   = q.registered;

      if (!uuid && !at) {
        setMsg("인가 코드 또는 토큰/uuid가 전달되지 않았습니다.");
        return;
      }

      // 저장
      saveAuthLocal({ accessToken: at, refreshToken: rt, uuid, email, nickname, profileImageUrl: avatar });

      // 이동
      const goSignup = String(regRaw) === "false" || regRaw === "0";
      setMsg("로그인 성공! 이동 중…");
      nav(goSignup ? "/signup" : "/chat", { replace: true });
    } catch (e) {
      console.error(e);
      setMsg("카카오 로그인 중 오류가 발생했습니다.");
    }
  }, [search, nav]);

  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", fontSize: "1.1rem" }}>
      <p>{msg}</p>
    </div>
  );
}
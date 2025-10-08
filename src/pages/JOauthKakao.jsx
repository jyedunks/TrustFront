import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function parseQuery(qs) {
  const p = new URLSearchParams(qs);
  const obj = {};
  for (const [k, v] of p.entries()) obj[k] = v;
  return obj;
}

export default function JOauthKakao() {
  const navigate = useNavigate();
  const { search, hash } = useLocation();
  const [msg, setMsg] = useState("카카오 로그인 처리 중…");

  useEffect(() => {
    // 쿼리 또는 해시에서 토큰을 읽음 (백엔드 구현에 따라)
    const fromQuery = parseQuery(search);
    const fromHash = hash.startsWith("#") ? parseQuery(hash.slice(1)) : {};
    const payload = { ...fromQuery, ...fromHash };

    const accessToken = payload.accessToken;
    const refreshToken = payload.refreshToken;

    if (!accessToken) {
      setMsg("토큰이 전달되지 않았습니다. 다시 시도해주세요.");
      return;
    }

    // 저장 및 라우팅
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

    // 유저 정보가 오면 함께 저장(옵션)
    if (payload.email) localStorage.setItem("user_email", payload.email);
    if (payload.nickname) localStorage.setItem("user_nickname", payload.nickname);
    if (payload.profileImageUrl) localStorage.setItem("user_avatar", payload.profileImageUrl);

    // 회원 여부에 따라 분기 (옵션)
    const registered = String(payload.registered || "").toLowerCase() === "true";
    navigate(registered ? "/home" : "/signup", { replace: true });
  }, [search, hash, navigate]);

  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <p>{msg}</p>
    </div>
  );
}
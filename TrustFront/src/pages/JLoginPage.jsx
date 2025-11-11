// src/pages/JLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/auth";

export default function JLoginPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ account: "", password: "" });
  const [loading, setL] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // 백 응답을 폭넓게 처리(여러 스펙 호환)
  const extractAuthPayload = (res) => {
    const src =
      res?.data ?? res ?? {}; // axios면 res.data, fetch-wrapper면 res 자체일 수도
    return {
      accessToken:
        src.accessToken ||
        src.token ||
        src.jwt ||
        src?.tokens?.accessToken ||
        null,
      refreshToken:
        src.refreshToken || src?.tokens?.refreshToken || null,
      uuid:
        src.uuid ||
        src.userUuid ||
        src.user_id ||
        src.userId ||
        src?.user?.uuid ||
        null,
      user:
        src.user ||
        {
          account: src.account || src.username || src.userName || null,
          email: src.email || null,
          uuid:
            src.uuid ||
            src.userUuid ||
            src?.user?.uuid ||
            null,
        },
    };
  };

  const persistAuth = ({ accessToken, refreshToken, uuid, user }) => {
    if (accessToken) localStorage.setItem("ACCESS_TOKEN", accessToken);
    if (refreshToken) localStorage.setItem("REFRESH_TOKEN", refreshToken);

    // ✅ 채팅/주문 전역 식별자로 사용할 UUID
    if (uuid) {
      localStorage.setItem("USER_UUID", uuid);
      // 과거 코드 호환
      localStorage.setItem("userUuid", uuid);
      // (채팅 코드가 buyerId 참조하던 경우를 위해) 임시 호환
      localStorage.setItem("buyerId", uuid);
    }

    if (user) {
      localStorage.setItem("AUTH_USER", JSON.stringify(user));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.account || !form.password) {
      setErr("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      setL(true);
      // { account, password }
      const res = await login(form);

      // ✅ 응답에서 토큰/UUID 뽑아서 저장
      const payload = extractAuthPayload(res);
      persistAuth(payload);

      if (!payload.uuid) {
        console.warn("⚠️ 서버 응답에 uuid가 없습니다. 백엔드 확인 필요.");
      }

      alert("로그인에 성공했습니다!");
      // 채팅/홈 중 원하는 곳으로 이동
      // nav("/home");
      nav("/chat");
    } catch (ex) {
      console.error(ex);
      setErr(ex?.response?.data?.message || ex?.message || "로그인 실패");
    } finally {
      setL(false);
    }
  };

  // ✅ 카카오 로그인 버튼 클릭
  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    const scope = encodeURIComponent("profile_nickname account_email");

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code&scope=${scope}`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>로그인</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          name="account"
          placeholder="아이디"
          value={form.account}
          onChange={onChange}
          autoComplete="username"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
        />
        {err && <div style={{ color: "tomato" }}>{err}</div>}
        <button disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <p>아직 계정이 없으신가요?</p>
        <button onClick={() => nav("/signup")}>회원가입</button>
      </div>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <p>또는</p>
        <button
          onClick={handleKakaoLogin}
          style={{
            background: "#FEE500",
            border: "none",
            borderRadius: 6,
            padding: "10px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🟡 카카오로 로그인
        </button>
      </div>
    </div>
  );
}
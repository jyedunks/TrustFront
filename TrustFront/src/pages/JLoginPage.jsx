import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function JLoginPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ account: "", password: "" });
  const [loading, setL] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.account || !form.password) {
      setErr("아이디와 비밀번호를 입력하세요."); return;
    }
    try {
      setL(true);
      await login(form);      // { account, password }
      nav("/chat");
    } catch (ex) {
      setErr(ex.message || "로그인 실패");
    } finally {
      setL(false);
    }
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
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
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange}
        />
        {err && <div style={{ color: "tomato" }}>{err}</div>}
        <button disabled={loading}>{loading ? "로그인 중..." : "로그인"}</button>
      </form>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <p>아직 계정이 없으신가요?</p>
        <button onClick={() => nav("/signup")}>회원가입</button>
      </div>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <p>또는</p>
        <button
          onClick={handleKakaoLogin}
          style={{ background: "#FEE500", border: "none", borderRadius: 6, padding: "10px 16px", fontWeight: "bold", cursor: "pointer" }}
        >
          🟡 카카오로 로그인
        </button>
      </div>
    </div>
  );
}
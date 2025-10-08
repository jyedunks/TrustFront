import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";



export default function JLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", pw: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  

  // ✅ 일반 로그인 (예시)
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // TODO: 실제 로그인 API 연결
      // 예시: const res = await axios.post("/api/login", form);
      localStorage.setItem("access_token", "example_token");
      navigate("/home");
    } catch (e) {
      setErr("로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 카카오 로그인 버튼 클릭 시 링크 이동 (백에서 처리)
  const onKakao = () => {
    const KAKAO_CLIENT_ID = "2825961cc8fb6c3773683f50fc3b6b7a";
    const REDIRECT_URI_BACK = "http://localhost:8080/auth/kakao/login";
    const url =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${KAKAO_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI_BACK)}` +
      `&response_type=code`;
    window.location.href = url;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div style={S.wrap}>
      <form onSubmit={onSubmit} style={S.form}>
        <h1 style={{ margin: 0 }}>로그인</h1>

        <label style={S.label}>
          아이디
          <input
            name="id"
            value={form.id}
            onChange={onChange}
            style={S.input}
            autoComplete="username"
            required
          />
        </label>

        <label style={S.label}>
          비밀번호
          <input
            name="pw"
            type="password"
            value={form.pw}
            onChange={onChange}
            style={S.input}
            autoComplete="current-password"
            required
          />
        </label>

        {err && <p style={S.error}>{err}</p>}

        <button type="submit" disabled={loading} style={S.primaryBtn}>
          {loading ? "처리 중…" : "로그인"}
        </button>

        {/* 회원가입 버튼 */}
        <Link to="/signup" style={S.ghostBtn}>
          회원가입
        </Link>

        {/* 구분선 */}
        <div style={S.divider}>
          <span>또는</span>
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.setItem('access_token', 'dev_mock_token');
            window.location.replace('/home'); // 히스토리 깔끔
          }}
          style={{ height: 44, borderRadius: 10, border: "1px dashed #bbb" }}
        >
          임시 로그인(개발용)
        </button>

        {/* ✅ 카카오 소셜 로그인 버튼 */}
        <button type="button" onClick={onKakao} style={S.kakaoBtn}>
          카카오로 시작하기
        </button>
      </form>
    </div>
  );
}

const S = {
  wrap: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f7f8",
    padding: 16,
  },
  form: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
    display: "grid",
    gap: 12,
  },
  label: { display: "grid", gap: 6, fontSize: 14, fontWeight: 600 },
  input: {
    height: 40,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none",
  },
  primaryBtn: {
    height: 44,
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    background: "#111",
    color: "#fff",
  },
  ghostBtn: {
    display: "inline-block",
    textAlign: "center",
    height: 44,
    lineHeight: "44px",
    borderRadius: 10,
    border: "1px solid #ddd",
    textDecoration: "none",
    color: "#111",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#888",
    fontSize: 12,
    margin: "2px 0 6px",
  },
  error: { color: "#d00", fontSize: 13, marginTop: 4 },
  kakaoBtn: {
    height: 44,
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    background: "#FEE500",
    color: "#111",
  },

  
};
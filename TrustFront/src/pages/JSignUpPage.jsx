import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, login, verifyAccountDuplicate } from "../api/auth";

export default function JSignUpPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    account: "",
    email: "",
    password: "",
    userName: "",
    telephone: "",
    roughAddress: "",
  });
  const [dupOk, setDupOk] = useState(null); // null | true | false
  const [loading, setL] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "account") setDupOk(null); // 아이디 수정 시 중복체크 초기화
  };

  const onCheckDuplicate = async () => {
    if (!form.account) return alert("아이디를 입력하세요.");
    try {
      const res = await verifyAccountDuplicate(form.account);
      // 백엔드 응답 메시지가 “사용 가능한 아이디 입니다.” 스타일이라면 truthy로 처리
      setDupOk(true);
      alert("사용 가능한 아이디입니다.");
    } catch (e) {
      setDupOk(false);
      alert(e.message || "아이디가 이미 사용 중일 수 있습니다.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.account || !form.email || !form.password || !form.userName) {
      setErr("필수 항목(아이디, 이메일, 비밀번호, 이름)을 입력하세요.");
      return;
    }
    // 선택: 중복체크 강제
    if (dupOk === false) { setErr("이미 사용 중인 아이디입니다."); return; }

    try {
      setL(true);
      await signUp(form);
      await login({ account: form.account, password: form.password });
      nav("/chat");
    } catch (ex) {
      setErr(ex.message || "회원가입 실패");
    } finally {
      setL(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: "0 12px" }}>
      <h2>회원가입</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input
            name="account"
            placeholder="아이디"
            value={form.account}
            onChange={onChange}
          />
          <button type="button" onClick={onCheckDuplicate}>
            중복 확인
          </button>
        </div>

        <input
          name="email"
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange}
          autoComplete="new-password"
        />
        <input
          name="userName"
          placeholder="이름"
          value={form.userName}
          onChange={onChange}
        />
        <input
          name="telephone"
          placeholder="전화번호 (선택)"
          value={form.telephone}
          onChange={onChange}
        />
        <input
          name="roughAddress"
          placeholder="주소 (선택)"
          value={form.roughAddress}
          onChange={onChange}
        />

        {err && <div style={{ color: "tomato" }}>{err}</div>}
        <button disabled={loading}>{loading ? "처리 중..." : "가입하기"}</button>
      </form>
    </div>
  );
}
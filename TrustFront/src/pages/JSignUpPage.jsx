// src/pages/JSignUpPage.jsx
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

  // 중복확인 상태: null(미확인) | true(사용가능) | false(사용불가)
  const [dupOk, setDupOk] = useState(null);
  const [dupMsg, setDupMsg] = useState("");
  const [loading, setL] = useState(false);
  const [checking, setChecking] = useState(false); // 중복확인 버튼 로딩
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "account") {
      setDupOk(null);
      setDupMsg("");
    }
  };

  /** ✅ 아이디 중복확인: 문자열만 전달해야 함 */
  const onCheckDuplicate = async () => {
    const acc = form.account.trim();
    if (!acc) {
      setDupOk(null);
      setDupMsg("아이디를 입력해주세요.");
      return;
    }
    setChecking(true);
    try {
      // ★ 여기! 객체가 아니라 '문자열'로 전달
      const res = await verifyAccountDuplicate(acc);

      // 서버 응답 해석(케이스별 호환)
      const duplicated =
        typeof res?.duplicated === "boolean"
          ? res.duplicated
          : res?.available === true
          ? false
          : res?.success === true
          ? false
          : false; // 기본값: 중복 아님으로 가정

      const ok = !duplicated;
      setDupOk(ok);
      setDupMsg(
        res?.message || (ok ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.")
      );
    } catch (e) {
      // 일부 서버는 중복 시 400/409로 에러를 던질 수 있음 → 메시지로 추론
      const msg = String(e?.message || "");
      const maybeDup = /중복|exist|already/i.test(msg);
      setDupOk(maybeDup ? false : null);
      setDupMsg(maybeDup ? "이미 사용 중인 아이디입니다." : "중복 확인 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const payload = {
      account: form.account.trim(),
      email: form.email.trim(),
      password: form.password, // 비밀번호는 trim 하지 않음
      userName: form.userName.trim(),
      telephone: form.telephone.trim(),
      roughAddress: form.roughAddress.trim(),
    };

    if (!payload.account || !payload.email || !payload.password || !payload.userName) {
      setErr("필수 항목(아이디, 이메일, 비밀번호, 이름)을 입력하세요.");
      return;
    }
    if (dupOk === false) {
      setErr("이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.");
      return;
    }

    try {
      setL(true);
      await signUp(payload); // 회원가입
      alert("회원가입 성공")// 선택: 자동 로그인
      await login({ account: payload.account, password: payload.password });
      alert("자동 로그인에 성공했습니다!")
      nav("/home");
    } catch (ex) {
      setErr(ex?.message || "회원가입 중 오류가 발생했습니다.");
      console.error(ex);
    } finally {
      setL(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: "0 12px" }}>
      <h2>회원가입</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        {/* 아이디 + 중복확인 버튼 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input
            name="account"
            placeholder="아이디"
            value={form.account}
            onChange={onChange}
            autoComplete="username"
          />
          <button type="button" onClick={onCheckDuplicate} disabled={checking}>
            {checking ? "확인 중..." : "중복 확인"}
          </button>
        </div>

        {/* 중복확인 결과 메시지 */}
        {dupOk !== null && (
          <div
            style={{
              fontSize: 13,
              color: dupOk ? "seagreen" : "tomato",
              marginTop: -4,
              marginBottom: 4,
            }}
          >
            {dupMsg || (dupOk ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.")}
          </div>
        )}

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
          autoComplete="name"
        />

        <input
          name="telephone"
          placeholder="전화번호 (선택)"
          value={form.telephone}
          onChange={onChange}
          autoComplete="tel"
        />

        <input
          name="roughAddress"
          placeholder="주소 (선택)"
          value={form.roughAddress}
          onChange={onChange}
        />

        {err && <div style={{ color: "tomato", marginTop: 4 }}>{err}</div>}

        <button disabled={loading}>{loading ? "처리 중..." : "가입하기"}</button>
      </form>
    </div>
  );
}
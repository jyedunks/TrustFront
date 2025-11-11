// src/pages/JProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  updateUserInfo,
  getCurrentUuid,
  logoutLocal,
} from "@/services/user";

export default function JProfilePage() {
  const nav = useNavigate();

  const [loading, setL] = useState(true);
  const [err, setErr] = useState("");
  const [uuid, setUuid] = useState(getCurrentUuid());

  // 보기용 데이터
  const [me, setMe] = useState({
    userName: "",
    email: "",
    telephone: "",
    profileImageUrl: "",
  });

  // 수정 모드 & 폼
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    telephone: "",
  });

  // 초기 로딩
  useEffect(() => {
    (async () => {
      try {
        setL(true);
        setErr("");
        const u = getCurrentUuid();
        setUuid(u);
        if (!u) {
          setErr("로그인이 필요합니다.");
          return;
        }
        const data = await getUserInfo(u);
        const next = {
          userName: data.userName || data.name || "",
          email: data.email || "",
          telephone: data.telephone || data.phone || "",
          profileImageUrl: data.profileImageUrl || data.avatar || "",
        };
        setMe(next);
        setForm({ userName: next.userName, telephone: next.telephone });
      } catch (e) {
        console.error(e);
        setErr(e?.response?.data?.message || e?.message || "불러오기 실패");
      } finally {
        setL(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setL(true);
      setErr("");

      // 백엔드 필드명 기준: userName / telephone
      const payload = {
        userName: form.userName,
        telephone: form.telephone,
      };
      const saved = await updateUserInfo(payload, uuid);

      // 응답 기준으로 화면 갱신 (없으면 폼 값으로 반영)
      setMe((m) => ({
        ...m,
        userName: saved?.userName ?? payload.userName,
        telephone: saved?.telephone ?? payload.telephone,
      }));
      setEdit(false);
      alert("수정 완료");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || e?.message || "수정 실패");
    } finally {
      setL(false);
    }
  };

  const onLogout = () => {
    logoutLocal();
    // 로그인 페이지로
    nav("/login", { replace: true });
  };

  if (loading) return <div style={{ padding: 16 }}>불러오는 중…</div>;

  if (err) {
    return (
      <div style={{ padding: 16 }}>
        <h2>내 정보</h2>
        <p style={{ color: "#e74c3c" }}>{err}</p>
        <button onClick={() => nav("/login")}>로그인하기</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: "0 12px" }}>
      <h2>내 정보</h2>

      <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        UUID: <code>{uuid}</code>
      </div>

      {!edit ? (
        <>
          <div style={{ display: "grid", gap: 8, maxWidth: 480 }}>
            <div>이름: {me.userName || "(없음)"}</div>
            <div>이메일: {me.email || "(없음)"}</div>
            <div>전화번호: {me.telephone || "(없음)"}</div>
            {me.profileImageUrl ? (
              <div>
                프로필:{" "}
                <img
                  src={me.profileImageUrl}
                  alt="프로필"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    verticalAlign: "middle",
                    marginLeft: 8,
                  }}
                />
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button onClick={() => setEdit(true)}>수정하기</button>
            <button onClick={onLogout}>로그아웃</button>
            <button onClick={() => nav("/my")}>뒤로가기</button>
          </div>
        </>
      ) : (
        <form
          onSubmit={onSubmit}
          style={{ display: "grid", gap: 12, maxWidth: 420 }}
        >
          <label>
            이름
            <input
              name="userName"
              value={form.userName}
              onChange={onChange}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              placeholder="이름을 입력하세요"
            />
          </label>

          <label>
            전화번호
            <input
              name="telephone"
              value={form.telephone}
              onChange={onChange}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              placeholder="010-1234-5678"
            />
          </label>

          {/* 이메일은 서버 정책상 보통 수정 금지 */}
          <div style={{ color: "#888", fontSize: 14 }}>
            이메일: {me.email || "(없음)"} (수정 불가)
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit">저장</button>
            <button type="button" onClick={() => setEdit(false)}>
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
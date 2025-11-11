// src/pages/JMyPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUuid, getUserInfo } from "@/services/user";

export default function JMyPage() {
  const nav = useNavigate();
  const [uuid, setUuid] = useState(getCurrentUuid());
  const [summary, setSummary] = useState(null);
  const [loading, setL] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setL(true);
        const u = getCurrentUuid();
        setUuid(u);
        if (!u) {
          setSummary(null);
          return;
        }
        const me = await getUserInfo(u);
        setSummary({
          name: me.userName || me.name || "",
          email: me.email || "",
        });
      } catch {
        setSummary(null);
      } finally {
        setL(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>불러오는 중…</div>;

  if (!uuid) {
    return (
      <div style={{ padding: 16 }}>
        <h2>My Page</h2>
        <p style={{ color: "#e74c3c" }}>로그인이 필요합니다.</p>
        <button onClick={() => nav("/login")}>로그인</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: "0 12px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>My Page</h2>

      {summary && (
        <div style={{ textAlign: "center", marginBottom: 12, color: "#666" }}>
          {summary.name} · {summary.email}
          <div style={{ fontSize: 12, marginTop: 4 }}>
            UUID: <code>{uuid}</code>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 10, maxWidth: 320, margin: "0 auto" }}>
        <button onClick={() => nav("/my/profile")}>내 정보 확인</button>
        <button onClick={() => nav("/my/sell-list")}>나의 판매 목록</button>
        <button onClick={() => nav("/my/buy-list")}>나의 구매 목록</button>
        <button onClick={() => nav("/my/auction-list")}>나의 경매 목록</button>
        <button onClick={() => nav("/my/verify")}>사업자 인증</button>
        <button onClick={() => nav("/withdrawal")}>회원탈퇴</button>
      </div>
    </div>
  );
}
// src/pages/JChatRoomPage.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessages, sendMessage } from "@/api/chat";

const SELLER_LOCK_UUID = "ffd9c396-b70e-4d59-8d04-fad7b1fa1df2"; // 백엔드가 허용한 sellerId

export default function JChatRoomPage() {
  const { roomId } = useParams();
  const nav = useNavigate();

  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  // 전송엔 UUID 필요(백엔드 스펙), 화면엔 절대 노출 X
  const senderUuid =
    localStorage.getItem("USER_UUID") ||
    localStorage.getItem("userUuid") ||
    "GUEST-UNKNOWN";

  // 화면용 내 닉네임(표시는 안 쓰지만 남겨둠)
  const authUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("AUTH_USER") || "{}"); }
    catch { return {}; }
  }, []);
  const myDisplayName =
    authUser?.nickname || authUser?.userName || authUser?.account || "나";

  // 상대 닉네임 추정 (seller:buyer:productId 형태 대비)
  const otherDisplayName = useMemo(() => {
    try {
      const parts = decodeURIComponent(roomId).split(":");
      const looksUuid = (s) => typeof s === "string" && (s.match(/-/g) || []).length >= 3;
      const cand = parts.find((p) => !p.includes(senderUuid)) || "";
      if (!cand || looksUuid(cand) || cand.includes("GUEST")) return "상대방";
      return cand;
    } catch { return "상대방"; }
  }, [roomId, senderUuid]);

  // roomId에서 productId 뽑기: 가장 마지막에 등장하는 숫자 시퀀스
  const productId = useMemo(() => {
    try {
      // 1) 콜론 구분 마지막 토큰이 숫자면 그것 사용
      const last = decodeURIComponent(roomId).split(":").pop() || "";
      const n1 = Number(last);
      if (Number.isFinite(n1) && String(n1) === last.replace(/^0+/, "") && n1 >= 0) return n1;

      // 2) 문자열 전체에서 마지막 숫자 시퀀스 추출
      const m = decodeURIComponent(roomId).match(/(\d+)(?!.*\d)/);
      if (m) return Number(m[1]);
    } catch {}
    return null;
  }, [roomId]);

  const sendingRef = useRef(false);
  const listRef = useRef(null);

  // 최초 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getMessages(roomId);
        if (!alive) return;
        setMsgs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { alive = false; };
  }, [roomId]);

  // 스크롤 아래로
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || sendingRef.current) return;
    sendingRef.current = true;

    try {
      await sendMessage({
        roomId,
        senderId: senderUuid,   // 서버에는 UUID로만 전송
        content,
        timestamp: Date.now(),
        read: false,
      });
      setText("");

      const data = await getMessages(roomId);
      setMsgs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("메시지 전송 실패");
    } finally {
      sendingRef.current = false;
    }
  };

  // 내 메시지에는 '나' 라벨 표시 안 함
  const nameOf = (m) =>
    m.senderId === senderUuid ? "" : (otherDisplayName || "");

  // ✅ 결제 이동
  const goPay = () => {
    if (!productId || !senderUuid) {
      alert("상품 또는 사용자 정보가 없습니다.");
      return;
    }
    const params = new URLSearchParams({
      productId: String(productId),
      buyerId: senderUuid,           // 현재 로그인 사용자
      sellerId: SELLER_LOCK_UUID,    // 백엔드 허용 sellerId로 고정
    });
    nav(`/payment?${params.toString()}`);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontWeight: 700 }}>Room: {roomId}</h3>
        <div style={{ flex: 1 }} />
        {/* 💸 이 상품 결제하기 버튼 */}
        <button
          onClick={goPay}
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: "none",
            background: "#2ecc71",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          💸 이 상품 결제하기
        </button>
      </div>

      <div
        ref={listRef}
        style={{
          border: "1px solid #ddd",
          height: 360,
          overflowY: "auto",
          padding: 8,
          borderRadius: 8,
          marginBottom: 12,
          background: "#fff",
        }}
      >
        {msgs.map((m, i) => {
          const mine = m.senderId === senderUuid;
          const label = nameOf(m); // 내 말풍선이면 빈 문자열
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: mine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: label ? 6 : 0,       // 라벨 없으면 간격 0
                  padding: "6px 10px",
                  borderRadius: 12,
                  background: mine ? "#111" : "#f1f1f1",
                  color: mine ? "#fff" : "#111",
                  margin: "6px 0",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {/* 상대 말풍선만 라벨 노출 */}
                {label ? (
                  <b
                    style={{
                      opacity: 0.85,
                      background: mine ? "transparent" : "#e9e9e9",
                      borderRadius: 999,
                      padding: "2px 8px",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {label}
                  </b>
                ) : null}
                <span>{m.content}</span>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
        <button
          type="submit"
          disabled={sendingRef.current}
          style={{
            width: 72,
            border: "none",
            borderRadius: 8,
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </form>
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import { createChatRoom, sendChatMessage, listMessages } from "../services/chat";

/**
 * URL 예: /chat?sellerId=Tester1&buyerId=Tester2&itemId=TestItem&me=Tester2
 * - me: 현재 사용자 id (임시)
 */
export default function ChatPage() {
  const params = new URLSearchParams(location.search);
  const sellerId = params.get("sellerId") || "Tester1";
  const buyerId  = params.get("buyerId")  || "Tester2";
  const itemId   = params.get("itemId")   || "TestItem";
  const me       = params.get("me")       || "Tester2";

  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  // 방 생성
  useEffect(() => {
    (async () => {
      try {
        const rid = await createChatRoom({ sellerId, buyerId, itemId });
        setRoomId(rid);
        // 백엔드 스펙 확정되면 과거 메시지 불러오기
        const initial = await listMessages(rid);
        setMessages(initial);
      } catch (e) {
        console.error("방 생성 실패:", e);
        alert("채팅방 생성에 실패했습니다.");
      }
    })();
  }, [sellerId, buyerId, itemId]);

  // 스크롤 맨 아래로
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0 && roomId && !loading, [input, roomId, loading]);

  const onSend = async () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    // 낙관적 업데이트
    const optimistic = {
      id: `local-${Date.now()}`,
      roomId, senderId: me, content: text,
      timestamp: Date.now(), read: false, _optimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const savedId = await sendChatMessage({
        roomId, senderId: me, content: text, timestamp: optimistic.timestamp, read: false
      });
      // 로컬 메시지 id 치환
      setMessages((prev) =>
        prev.map(m => m.id === optimistic.id ? { ...m, id: savedId, _optimistic: false } : m)
      );
    } catch (e) {
      console.error("메시지 전송 실패:", e);
      // 실패 표시 & 롤백(원하면 주석 해제)
      setMessages((prev) => prev.filter(m => m.id !== optimistic.id));
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", height: "100vh" }}>
      <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <b>채팅</b> {roomId ? `· Room: ${roomId}` : "방 생성 중..."}
      </header>

      <main ref={listRef} style={{ overflowY: "auto", padding: 16, background: "#fafafa" }}>
        {messages.length === 0 && <div style={{ color: "#888" }}>메시지가 없습니다. 첫 메시지를 보내보세요.</div>}
        {messages.map((m) => (
          <div key={m.id} style={{ margin: "8px 0", display: "flex", justifyContent: m.senderId === me ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: 480, whiteSpace: "pre-wrap", padding: "8px 12px", borderRadius: 12,
              background: m.senderId === me ? "#DCF8C6" : "#fff",
              border: "1px solid #eee", opacity: m._optimistic ? 0.6 : 1
            }}>
              <div style={{ fontSize: 12, color: "#777", marginBottom: 2 }}>{m.senderId}</div>
              <div>{m.content}</div>
            </div>
          </div>
        ))}
      </main>

      <footer style={{ padding: 12, borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, resize: "none", height: 48, padding: 8 }}
        />
        <button onClick={onSend} disabled={!canSend} style={{ width: 96 }}>
          {loading ? "전송 중..." : "전송"}
        </button>
      </footer>
    </div>
  );
}
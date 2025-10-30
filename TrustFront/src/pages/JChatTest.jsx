import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://54.66.146.131:8080";

// 후보 엔드포인트
const ROOM_PATHS = ["/api/chat/room", "/chat/room"];
const MSG_PATHS  = ["/api/chat/message", "/chat/message"];

// 첫 성공 경로 캐시
let resolvedRoomPath = null;
let resolvedMsgPath = null;

async function tryPaths(paths, method, body) {
  let lastErr;
  for (const p of paths) {
    try {
      const url = `${BASE_URL}${p}`;
      const res = await axios({
        url, method,
        data: body,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return { path: p, data: res.data };
    } catch (e) {
      lastErr = e;
      // 404/405/415 등은 다음 후보 시도
      continue;
    }
  }
  throw lastErr;
}

export default function JChatTest() {
  const params = new URLSearchParams(location.search);
  const sellerId = params.get("sellerId") || "Tester1";
  const buyerId  = params.get("buyerId")  || "Tester2";
  const itemId   = params.get("itemId")   || "TestItem";
  const me       = params.get("me")       || "Tester1";

  const roomId = `${sellerId}:${buyerId}:${itemId}`;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [hint, setHint] = useState(""); // 어떤 경로가 쓰였는지 표시용
  const scrollRef = useRef(null);

  // 방 생성 (경로 자동탐색)
  useEffect(() => {
    (async () => {
      setCreating(true);
      try {
        if (!resolvedRoomPath) {
          const { path, data } = await tryPaths(ROOM_PATHS, "post", {
            sellerId, buyerId, itemId,
          });
          resolvedRoomPath = path;
          setHint((h) => `${h} • room:${path}`);
          console.log("room OK via", path, "=>", data);
        } else {
          const { data } = await axios.post(`${BASE_URL}${resolvedRoomPath}`, { sellerId, buyerId, itemId });
          console.log("room OK via cached", resolvedRoomPath, "=>", data);
        }
      } catch (e) {
        console.warn("room create failed:", e?.response?.status, e?.message);
        alert("채팅방 생성 경로를 찾지 못했습니다. (백엔드 경로 확인 필요)");
      } finally {
        setCreating(false);
      }
    })();
  }, [sellerId, buyerId, itemId]);

  // 자동 스크롤
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const optimistic = {
      id: `local-${Date.now()}`,
      senderId: me,
      content: text,
      timestamp: Date.now(),
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setSending(true);

    try {
      let data;
      if (!resolvedMsgPath) {
        const res = await tryPaths(MSG_PATHS, "post", {
          roomId, senderId: me, content: text, timestamp: optimistic.timestamp, read: false,
        });
        resolvedMsgPath = res.path;
        data = res.data;
        setHint((h) => `${h} • msg:${res.path}`);
        console.log("message OK via", res.path, "=>", data);
      } else {
        const res = await axios.post(`${BASE_URL}${resolvedMsgPath}`, {
          roomId, senderId: me, content: text, timestamp: optimistic.timestamp, read: false,
        }, { headers: { "Content-Type": "application/json" }, withCredentials: true });
        data = res.data;
        console.log("message OK via cached", resolvedMsgPath, "=>", data);
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, id: String(data), _optimistic: false } : m))
      );
    } catch (e) {
      console.error("send failed:", e?.response?.status, e?.message);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      alert("메시지 전송 실패 (엔드포인트 경로 확인 필요)");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h2>💬 Chat Test (REST only)</h2>
      <p>
        Room: <b>{roomId}</b> | Me: <b>{me}</b> {creating && "• 방 생성 중…"}
      </p>
      <p style={{ color: "#888", fontSize: 12 }}>BASE_URL: {BASE_URL} {hint && `(${hint})`}</p>

      <div
        ref={scrollRef}
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          height: 320,
          padding: 10,
          overflowY: "auto",
          marginBottom: 12,
          background: "#fafafa",
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: "#888" }}>메시지를 입력해 전송해 보세요.</div>
        )}
        {messages.map((m) => (
          <div
            key={m.id || m.timestamp || i}
            style={{
              display: "flex",
              justifyContent: m.senderId === me ? "flex-end" : "flex-start",
              margin: "6px 0",
            }}
          >
            <div
              style={{
                maxWidth: 480,
                whiteSpace: "pre-wrap",
                background: m.senderId === me ? "#ffe066" : "#fff",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: "8px 12px",
                opacity: m._optimistic ? 0.6 : 1,
              }}
            >
              <div style={{ fontSize: 12, color: "#777" }}>{m.senderId}</div>
              <div>{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="메시지 입력"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={send} disabled={sending || !input.trim()}>
          {sending ? "전송 중…" : "전송"}
        </button>
      </div>
    </div>
  );
}
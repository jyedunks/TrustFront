// src/pages/ChatRoomPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([
    { id: 1, who: "other", text: "안녕하세요~ 관심 있어요!", time: "오후 2:10" },
    { id: 2, who: "me", text: "안녕하세요! 네 가능합니다 :)", time: "오후 2:11" },
  ]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    setMessages(m => [...m, { id: Date.now(), who: "me", text, time: nowTime() }]);
    setText("");
  };

  return (
    <div style={wrap}>
      {/* 상단 고정 헤더 */}
      <div style={header}>
        <button onClick={() => history.back()} style={backBtn}>‹</button>
        <div style={{ fontWeight: 700 }}>채팅방 #{roomId}</div>
        <div style={{ width: 24 }} />
      </div>

      {/* 메시지 영역 */}
      <div ref={listRef} style={listArea}>
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.who === "me" ? "flex-end" : "flex-start", margin: "6px 0" }}>
            <div style={{
              maxWidth: "75%",
              padding: "10px 12px",
              borderRadius: 14,
              background: m.who === "me" ? "#FEE500" : "#fff",
              border: m.who === "me" ? "none" : "1px solid #eee",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              whiteSpace: "pre-wrap",
              lineHeight: 1.35
            }}>
              <div>{m.text}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 4, textAlign: m.who === "me" ? "right" : "left" }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 입력 바 */}
      <div style={inputBar}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={input}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} style={sendBtn}>전송</button>
      </div>
    </div>
  );
}

const wrap = { position: "fixed", inset: 0, background: "#f5f6f7", display: "grid", gridTemplateRows: "56px 1fr 64px" };
const header = { height: 56, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 1 };
const backBtn = { width: 24, height: 24, border: "none", background: "transparent", fontSize: 22, lineHeight: "24px", cursor: "pointer" };
const listArea = { overflowY: "auto", padding: "12px" };
const inputBar = { height: 64, display: "flex", gap: 8, alignItems: "center", padding: 12, background: "#fff", borderTop: "1px solid #eee" };
const input = { flex: 1, height: 40, padding: "0 12px", borderRadius: 999, border: "1px solid #ddd", outline: "none", background: "#f7f7f8" };
const sendBtn = { height: 40, padding: "0 16px", borderRadius: 999, border: "none", background: "#111", color: "#fff", fontWeight: 700, cursor: "pointer" };

function nowTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h < 12 ? "오전" : "오후";
  const hh = h % 12 || 12;
  return `${ampm} ${hh}:${m}`;
}
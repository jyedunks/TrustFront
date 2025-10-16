// src/pages/ChatTest.jsx
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function ChatTest() {
  const [logs, setLogs] = useState([]);
  const clientRef = useRef(null);

  const log = (msg) => setLogs((p) => [...p, msg]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws"); // 백이 열리면 이 경로로 연결
    const client = Stomp.over(socket);
    client.debug = null;

    client.connect(
      { Authorization: "Bearer " + localStorage.getItem("access_token") },
      () => {
        log("✅ Connected to WebSocket!");

        // 구독 테스트
        client.subscribe("/topic/chat.room.1", (msg) => {
          log("📨 Received: " + msg.body);
        });

        // 메시지 전송 테스트
        client.send(
          "/app/chat.send",
          {},
          JSON.stringify({ roomId: "1", text: "Hello from Front!" })
        );
      },
      (err) => log("❌ Connection error: " + err)
    );

    clientRef.current = client;
    return () => client.disconnect(() => log("🔌 Disconnected"));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>💬 채팅 연결 테스트</h2>
      <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 8 }}>
        {logs.join("\n")}
      </pre>
    </div>
  );
}